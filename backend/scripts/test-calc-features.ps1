param(
  [string]$BaseUrl = "http://127.0.0.1:3000"
)

$ErrorActionPreference = "Stop"

function Invoke-JsonPost {
  param(
    [string]$Url,
    [object]$Body
  )

  return Invoke-RestMethod -Method Post -Uri $Url -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 30)
}

function Invoke-RawPost {
  param(
    [string]$Url,
    [object]$Body
  )

  $params = @{
    Method = "Post"
    Uri = $Url
    ContentType = "application/json"
    Body = ($Body | ConvertTo-Json -Depth 30)
  }

  $iwr = Get-Command Invoke-WebRequest
  if ($iwr.Parameters.ContainsKey("UseBasicParsing")) {
    $params.UseBasicParsing = $true
  }

  return Invoke-WebRequest @params
}

$pass = 0
$fail = 0

function Assert-True {
  param([bool]$Condition, [string]$Name)
  if ($Condition) {
    Write-Host "[PASS] $Name" -ForegroundColor Green
    $script:pass++
  } else {
    Write-Host "[FAIL] $Name" -ForegroundColor Red
    $script:fail++
  }
}

Write-Host "Running backend feature checks on $BaseUrl" -ForegroundColor Cyan

$standards = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/standards"
$keys = @($standards.tables | ForEach-Object { $_.key })
Assert-True ($keys -contains "P1.2" -and $keys -contains "3.1" -and $keys -contains "5.4" -and $keys -contains "5.5" -and $keys -contains "5.8") "SR-11 standards tables are exposed"

$calcValidBody = @{
  F = 5000
  v = 0.8
  D = 300
  t1 = 60
  T1_ratio = 1
  t2 = 40
  T2_ratio = 0.65
  uh = 10
  gearbox_type = "KHAI_TRIEN"
  external_drive_type = "CHAIN"
  chain_layout = "HORIZONTAL_OR_LT40"
  tmm_t1_ratio = 1.4
}

$calcValid = Invoke-JsonPost -Url "$BaseUrl/api/calculate" -Body $calcValidBody
Assert-True ($calcValid.result.external_ratio_name -eq "ux") "SR-07.2 external ratio mapping for CHAIN"
Assert-True ($calcValid.result.chainStrength.optimization.max_iterations -eq 5) "SR-08.8 optimization loop metadata exists"
Assert-True ([bool]$calcValid.result.chainStrength.passed) "SR-08.8 valid case reaches pass state"
Assert-True ([double]$calcValid.result.chainStrength.impact_freq -gt 0) "SR-08.6 impact frequency is calculated"

$reportValid = Invoke-JsonPost -Url "$BaseUrl/api/report/preview" -Body @{
  input = $calcValid.input
  result = $calcValid.result
  motor = $calcValid.motor
}
Assert-True ([bool]$reportValid.exportable) "SR-10 report preview is exportable when design is valid"

$reportPdf = Invoke-RawPost -Url "$BaseUrl/api/report/pdf" -Body @{
  input = $calcValid.input
  result = $calcValid.result
  motor = $calcValid.motor
}
$pdfType = "$($reportPdf.Headers['Content-Type'])"
Assert-True ($reportPdf.StatusCode -eq 200 -and $pdfType -like "application/pdf*" -and $reportPdf.RawContentLength -gt 200) "SR-10 PDF export endpoint returns a PDF file"

$reportPrint = Invoke-RawPost -Url "$BaseUrl/api/report/print" -Body @{
  input = $calcValid.input
  result = $calcValid.result
  motor = $calcValid.motor
}
$printType = "$($reportPrint.Headers['Content-Type'])"
Assert-True ($reportPrint.StatusCode -eq 200 -and $printType -like "text/html*") "SR-10 print endpoint returns print-ready HTML"

$calcInvalidBody = @{
  F = 5000
  v = 1.2
  D = 300
  t1 = 60
  T1_ratio = 1
  t2 = 40
  T2_ratio = 0.65
  uh = 10
  gearbox_type = "KHAI_TRIEN"
  external_drive_type = "CHAIN"
  chain_layout = "HORIZONTAL_OR_LT40"
  tmm_t1_ratio = 1.4
}

$calcInvalid = Invoke-JsonPost -Url "$BaseUrl/api/calculate" -Body $calcInvalidBody
Assert-True (-not [bool]$calcInvalid.result.chainStrength.passed) "SR-08.8 invalid case is detected"

$reportBlocked = $false
try {
  Invoke-JsonPost -Url "$BaseUrl/api/report/preview" -Body @{
    input = $calcInvalid.input
    result = $calcInvalid.result
    motor = $calcInvalid.motor
  } | Out-Null
}
catch {
  $reportBlocked = $true
}
Assert-True $reportBlocked "SR-10.1 report preview is blocked when design has errors"

$overloadBlocked = $false
try {
  Invoke-JsonPost -Url "$BaseUrl/api/calculate" -Body @{
    F = 5000
    v = 0.8
    D = 300
    t1 = 60
    T1_ratio = 1
    t2 = 40
    T2_ratio = 0.65
    uh = 10
    gearbox_type = "KHAI_TRIEN"
    external_drive_type = "CHAIN"
    chain_layout = "HORIZONTAL_OR_LT40"
    tmm_t1_ratio = 100
  } | Out-Null
}
catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 422) {
    $overloadBlocked = $true
  }
}
Assert-True $overloadBlocked "SR-06.4 fails hard with 422 when no motor passes overload condition"

Write-Host "`nSummary: PASS=$pass FAIL=$fail" -ForegroundColor Yellow
if ($fail -gt 0) {
  exit 1
}
