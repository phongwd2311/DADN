# ConveyorCalc - Hệ Dẫn Động Băng Tải

Ứng dụng hỗ trợ tính toán thiết kế hệ dẫn động băng tải trên nền tảng React Native (Expo).

## 🚀 Cài đặt & Chạy app

### Yêu cầu
- **Node.js** >= 16
- **npm** >= 8

### Cài đặt
```bash
cd mobile-app
npm install --legacy-peer-deps
```

### Chạy app
```bash
# Chạy trên web browser
npx expo start --web

# Chạy trên điện thoại (scan QR bằng Expo Go)
npx expo start
```

> ⚠️ **Lưu ý:** Không chạy `npm audit fix --force` — sẽ phá hỏng các dependency version.

---

## 📱 Hướng dẫn sử dụng

### 1. Đăng nhập (Login Screen)
- Nhập **Email** và **Password**
- Nhấn **Sign In** để vào Dashboard
- Có link **Register** nếu chưa có tài khoản

### 2. Dashboard (Home Screen)
- **New Calculation**: Bắt đầu tính toán mới
- **History**: Xem lịch sử tính toán
- **Components**: Cơ sở dữ liệu linh kiện (Motor, Chain)
- **Expert System**: Gợi ý AI
- **Quick Stats**: Thống kê nhanh số lần tính toán

### 3. Nhập thông số (Input Screen)
Nhập 3 thông số chính của băng tải:

| Thông số | Ký hiệu | Đơn vị | Ví dụ |
|----------|----------|--------|-------|
| Lực vòng | F | N | 2500 |
| Vận tốc | v | m/s | 1.2 |
| Đường kính tang | D | mm | 320 |

Chọn **chiến lược tối ưu**:
- **Cost** — Tối ưu chi phí
- **Durability** — Tối ưu độ bền

Nhấn **Calculate** để tính toán.

### 4. Kết quả (Result Screen)
Hiển thị kết quả tính toán:
- **Motor Power** (kW) — Công suất động cơ
- **Transmission Ratio** — Tỷ số truyền chung
- **Chain Z1, Z2** — Số răng đĩa xích
- **Pitch** (mm) — Bước xích
- **Recommended Component** — Động cơ gợi ý phù hợp nhất

Nhấn **Save Result** để lưu | **New Calc** để tính lại.

### 5. Lịch sử (History Screen)
- Xem danh sách các phép tính đã thực hiện
- **Filter**: All / This Week / This Month
- Nhấn vào card để xem chi tiết kết quả

---

## 🧭 Cấu trúc Navigation

```
Login Screen
  └── Main (Bottom Tabs)
        ├── Home (Dashboard)
        ├── Calculate
        │     ├── Input Screen
        │     └── Result Screen
        ├── History
        └── Profile
```

---

## 🎨 Design System

| Token | Giá trị |
|-------|---------|
| Background | `#0A1628` |
| Surface | `#0F1E36` |
| Primary (Cyan) | `#00D4FF` |
| Accent (Purple) | `#7B61FF` |
| Success (Green) | `#00E091` |
| Warning (Orange) | `#FFB547` |
| Error (Red) | `#FF5A5A` |

---

## 📁 Cấu trúc thư mục

```
mobile-app/
├── App.tsx                    # Entry point
├── src/
│   ├── components/            # UI Components tái sử dụng
│   │   ├── CustomInput.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ErrorText.tsx
│   │   ├── GlassCard.tsx
│   │   └── GradientButton.tsx
│   ├── screens/               # Các màn hình
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── InputScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── navigation/            # React Navigation
│   │   └── AppNavigator.tsx
│   ├── business/              # Business logic
│   │   ├── calculations/
│   │   └── facade/
│   ├── data/                  # Data layer
│   │   ├── localDb.ts
│   │   └── sampleComponents.ts
│   ├── expert_system/         # Rule-based expert system
│   ├── services/              # Services
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # Helpers & Theme
│       └── theme.ts
└── package.json
```
