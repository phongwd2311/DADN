# GearDrive (DADN)

Hệ thống tính toán thiết kế truyền động băng tải, gồm:
- `backend/`: REST API (Node.js + Express + Prisma + PostgreSQL/Supabase)
- `app/`: ứng dụng Expo React Native (web/mobile)

## 1. Tính năng chính

- Xác thực người dùng: đăng ký, đăng nhập, đăng xuất, quên/đặt lại mật khẩu
- Tính toán thiết kế truyền động (`/api/calculate`)
- Quản lý phiên tính toán (`sessions`) với trạng thái `DRAFT | IN_PROGRESS | COMPLETED | FAILED`
- Dashboard tổng hợp dữ liệu gần đây
- Auto-save draft + phục hồi phiên gần nhất
- Template thư viện đầu vào
- Tra cứu bảng tiêu chuẩn
- Xuất báo cáo preview/PDF/print

## 2. Cấu trúc thư mục

```text
.
├─ backend/                 # API server
│  ├─ src/
│  │  ├─ routes/            # auth, calculate, sessions, dashboard, ...
│  │  ├─ validators/        # Zod schema
│  │  ├─ constants/         # bảng/hằng số tính toán
│  │  └─ middleware/
│  ├─ prisma/               # schema + migrations
│  └─ scripts/              # script test nhanh
├─ app/                     # Expo app (React Native)
│  └─ src/
│     ├─ screens/
│     ├─ api/
│     ├─ context/
│     └─ components/
└─ mobile-app/              # thư mục phụ (không dùng làm app chính)
```

## 3. Yêu cầu môi trường

- Node.js 18+ (khuyến nghị 20+)
- npm
- Database PostgreSQL (project đang dùng Supabase)

## 4. Cài đặt

### 4.1 Backend

```bash
cd backend
npm install
```

Tạo file `backend/.env` (tham khảo `backend/.env.example`):

```env
DATABASE_URL="postgresql://...:6543/postgres"
DIRECT_URL="postgresql://...:5432/postgres"
JWT_SECRET="your-secret"
PORT=3000
```

Chạy migration/schema (tuỳ quy trình team):

```bash
# Option A
npx prisma db push

# Option B (nếu cần migration)
npx prisma migrate deploy
```

Chạy backend dev:

```bash
npm run dev
```

Hoặc build + start:

```bash
npm run build
npm run start
```

### 4.2 App (Expo)

```bash
cd app
npm install
npm run web
```

Mặc định app gọi API:
- Web/iOS: `http://localhost:3000/api`
- Android emulator: `http://10.0.2.2:3000/api`

File cấu hình: `app/src/api/client.ts`

## 5. API chính

Base URL: `http://localhost:3000/api`

- Auth: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/me`
- Calculate: `/calculate`
- Sessions: `/sessions`, `/sessions/:id`
- Dashboard: `/dashboard`
- Drafts: `/drafts`, `/drafts/latest`, `/drafts/autosave`
- Templates: `/templates`
- Standards: `/standards`, `/standards/:tableKey`
- Report: `/report/preview`, `/report/pdf`, `/report/print`
- Health: `/health`

## 6. Test nhanh

### Auth E2E smoke test

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File scripts/test-auth.ps1 -BaseUrl "http://127.0.0.1:3010/api"
```

### Calculate/Report/Standards smoke test

```powershell
cd backend
$p = Start-Process -FilePath cmd.exe -ArgumentList '/c','set PORT=3100&& node dist/index.js' -WorkingDirectory (Get-Location) -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 3
powershell -ExecutionPolicy Bypass -File scripts/test-calc-features.ps1 -BaseUrl "http://127.0.0.1:3100"
if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force }
```

## 7. Lỗi thường gặp

- `400` khi Save session name: backend validate tên khá chặt, tránh ký tự cấm `< > " ' ; #`.
- `EACCES`/không truy cập DB: kiểm tra lại `DATABASE_URL`, whitelist mạng, quyền DB role.
- PowerShell chặn `npm`: dùng `npm.cmd ...` hoặc mở quyền script phù hợp.
- App không gọi đúng backend: kiểm tra `app/src/api/client.ts` và đúng port backend đang chạy.

## 8. Ghi chú cho contributor

- Không commit file tạm/log (`.tmp_*`, `*.log`) hoặc cache build trong `node_modules`.
- Nếu có thay đổi schema Prisma, commit kèm migration liên quan.
- Khi sửa luồng tính toán, nên cập nhật testcase trong `backend/scripts/test-calc-features.ps1`.
