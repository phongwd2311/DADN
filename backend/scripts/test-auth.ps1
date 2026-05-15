param(
  [string]$BaseUrl = "http://localhost:3010/api",
  [switch]$BuildBeforeTest
)

$ErrorActionPreference = "Stop"

function Invoke-WebCompat {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Params
  )

  $cmd = Get-Command Invoke-WebRequest
  if ($cmd.Parameters.ContainsKey("UseBasicParsing")) {
    $Params["UseBasicParsing"] = $true
  }

  return Invoke-WebRequest @Params
}

function Invoke-Json {
  param(
    [Parameter(Mandatory = $true)][string]$Method,
    [Parameter(Mandatory = $true)][string]$Url,
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $params = @{
    Uri       = $Url
    Method    = $Method
    Headers   = $Headers
    TimeoutSec = 20
  }

  if ($null -ne $Body) {
    $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    $params["ContentType"] = "application/json; charset=utf-8"
  }

  try {
    $resp = Invoke-WebCompat -Params $params
    $status = [int]$resp.StatusCode
    $content = $resp.Content
  } catch {
    if ($_.Exception.Response) {
      $r = $_.Exception.Response
      $status = [int]$r.StatusCode
      $sr = New-Object System.IO.StreamReader($r.GetResponseStream())
      $content = $sr.ReadToEnd()
      $sr.Close()
    } else {
      throw
    }
  }

  $json = $null
  if ($content -and $content.Trim().StartsWith("{")) {
    try { $json = $content | ConvertFrom-Json } catch { $json = $null }
  }

  return [PSCustomObject]@{
    status = $status
    raw = $content
    json = $json
  }
}

function Test-Health {
  param([string]$Url)
  try {
    $r = Invoke-WebCompat -Params @{
      Uri = $Url
      Method = "GET"
      TimeoutSec = 2
    }
    return ($r.StatusCode -eq 200)
  } catch {
    return $false
  }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Resolve-Path (Join-Path $scriptDir "..")
$healthUrl = "$BaseUrl/health"
$startedProc = $null

if ($BuildBeforeTest) {
  Push-Location $backendRoot
  try {
    cmd /c npm run build | Out-Host
  } finally {
    Pop-Location
  }
}

$healthOk = Test-Health -Url $healthUrl
if (-not $healthOk) {
  $uri = [System.Uri]$BaseUrl
  $port = $uri.Port
  $startCmd = "set PORT=$port&& node dist/index.js"
  $startedProc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $startCmd -WorkingDirectory $backendRoot -PassThru -WindowStyle Hidden

  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 700
    if (Test-Health -Url $healthUrl) {
      $healthOk = $true
      break
    }
  }
}

if (-not $healthOk) {
  if ($startedProc -and -not $startedProc.HasExited) {
    Stop-Process -Id $startedProc.Id -Force
  }
  throw "Cannot reach API health endpoint: $healthUrl"
}

$results = @()
function Add-Result {
  param([string]$Name, [bool]$Passed, [string]$Detail)
  $script:results += [PSCustomObject]@{
    Test = $Name
    Passed = $Passed
    Detail = $Detail
  }
}

$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$username = "authtest_$stamp"
$email = "authtest_$stamp@example.com"
$oldPassword = "Abc12345"
$newPassword = "Newpass123"

try {
  $r1 = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ username = "${username}_short"; email = "short_$email"; password = "abc123" }
  Add-Result "Register short password rejected" ($r1.status -eq 400) "status=$($r1.status)"

  $r2 = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ username = "${username}_letters"; email = "letters_$email"; password = "abcdefgh" }
  Add-Result "Register letters-only password rejected" ($r2.status -eq 400) "status=$($r2.status)"

  $r3 = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ username = "${username}_digits"; email = "digits_$email"; password = "12345678" }
  Add-Result "Register digits-only password rejected" ($r3.status -eq 400) "status=$($r3.status)"

  $r4 = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ username = $username; email = $email; password = $oldPassword }
  $tokenRegister = if ($r4.json) { [string]$r4.json.token } else { "" }
  Add-Result "Register valid password accepted" ($r4.status -eq 201 -and -not [string]::IsNullOrWhiteSpace($tokenRegister)) "status=$($r4.status)"

  $r5 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{}
  Add-Result "Login missing email/password rejected" ($r5.status -eq 400) "status=$($r5.status)"

  $r6 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $email; password = "Wrong1234" }
  Add-Result "Login wrong password returns 401" ($r6.status -eq 401) "status=$($r6.status)"

  $r7 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $email; password = $oldPassword }
  $tokenA = if ($r7.json) { [string]$r7.json.token } else { "" }
  Add-Result "Login valid credentials succeeds" ($r7.status -eq 200 -and -not [string]::IsNullOrWhiteSpace($tokenA)) "status=$($r7.status)"

  $r8 = Invoke-Json -Method GET -Url "$BaseUrl/auth/me" -Headers @{ Authorization = "Bearer $tokenA" }
  Add-Result "Token A can access /auth/me before logout" ($r8.status -eq 200) "status=$($r8.status)"

  $r9 = Invoke-Json -Method POST -Url "$BaseUrl/auth/logout" -Headers @{ Authorization = "Bearer $tokenA" }
  Add-Result "Logout succeeds" ($r9.status -eq 200) "status=$($r9.status)"

  $r10 = Invoke-Json -Method GET -Url "$BaseUrl/auth/me" -Headers @{ Authorization = "Bearer $tokenA" }
  Add-Result "Token A rejected after logout" ($r10.status -eq 401) "status=$($r10.status)"

  $r11 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $email; password = $oldPassword }
  $tokenB = if ($r11.json) { [string]$r11.json.token } else { "" }
  Add-Result "New login gets token B" ($r11.status -eq 200 -and -not [string]::IsNullOrWhiteSpace($tokenB)) "status=$($r11.status)"

  $r12 = Invoke-Json -Method GET -Url "$BaseUrl/auth/me" -Headers @{ Authorization = "Bearer $tokenB" }
  Add-Result "Token B works after token A revoked" ($r12.status -eq 200) "status=$($r12.status)"

  $r13 = Invoke-Json -Method POST -Url "$BaseUrl/auth/forgot-password" -Body @{ email = $email }
  $msg13 = if ($r13.json) { [string]$r13.json.message } else { "" }
  $resetToken = if ($r13.json) { [string]$r13.json.reset_token } else { "" }
  Add-Result "Forgot password (existing email) returns generic message" ($r13.status -eq 200 -and $msg13 -ne "") "status=$($r13.status)"

  $r14 = Invoke-Json -Method POST -Url "$BaseUrl/auth/forgot-password" -Body @{ email = "notfound_$email" }
  $msg14 = if ($r14.json) { [string]$r14.json.message } else { "" }
  Add-Result "Forgot password (non-existing email) same generic response class" ($r14.status -eq 200 -and $msg14 -eq $msg13) "status=$($r14.status)"

  $hasResetToken = -not [string]::IsNullOrWhiteSpace($resetToken)
  Add-Result "Forgot password returned reset token in non-production" $hasResetToken "token_present=$hasResetToken"

  if ($hasResetToken) {
    $r15 = Invoke-Json -Method POST -Url "$BaseUrl/auth/reset-password" -Body @{ token = $resetToken; newPassword = $newPassword }
    Add-Result "Reset password with valid token succeeds" ($r15.status -eq 200) "status=$($r15.status)"

    $r16 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $email; password = $oldPassword }
    Add-Result "Old password fails after reset" ($r16.status -eq 401) "status=$($r16.status)"

    $r17 = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $email; password = $newPassword }
    Add-Result "New password works after reset" ($r17.status -eq 200) "status=$($r17.status)"

    $r18 = Invoke-Json -Method POST -Url "$BaseUrl/auth/reset-password" -Body @{ token = $resetToken; newPassword = "Again1234" }
    Add-Result "Used reset token cannot be reused" ($r18.status -eq 400) "status=$($r18.status)"
  }
}
finally {
  if ($startedProc -and -not $startedProc.HasExited) {
    Stop-Process -Id $startedProc.Id -Force
  }
}

$passCount = ($results | Where-Object { $_.Passed }).Count
$totalCount = $results.Count
$failCount = $totalCount - $passCount

Write-Host "AUTH_TEST_SUMMARY pass=$passCount fail=$failCount total=$totalCount"
foreach ($row in $results) {
  $mark = if ($row.Passed) { "PASS" } else { "FAIL" }
  Write-Host "[$mark] $($row.Test) :: $($row.Detail)"
}

if ($failCount -gt 0) {
  exit 2
}

exit 0
