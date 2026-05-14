# Cấu trúc Dự án GearDrive (Conveyor Design App)

Dự án được chia thành 2 phần chính:

1. **Mobile App (React Native / Expo)**: Ứng dụng Offline-first.
2. **Python Backend** *(planned)*: Xử lý nghiệp vụ phức tạp và API sync.

---

## Mobile App (`app/src/`)

Cấu trúc tuân theo **Clean Architecture** với 4 tầng rõ ràng:

### 📱 Screens — Phân nhóm theo Domain

```
screens/
├── auth/           ← Luồng xác thực (FR-USR)
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   └── RegisterScreen.tsx
├── main/           ← Màn hình chính (Tab Bar)
│   ├── HomeScreen.tsx
│   └── ProfileScreen.tsx
└── calculator/     ← Luồng tính toán (FR-INP, FR-CAL, FR-STO)
    ├── InputScreen.tsx
    ├── ResultScreen.tsx
    ├── HistoryScreen.tsx
    ├── DeviceSuggestionScreen.tsx
    └── DeviceDetailScreen.tsx
```

### 🧩 Components — UI tái sử dụng

```
components/
├── index.ts        ← Barrel export
├── CustomInput.tsx
├── DataTable.tsx
├── ErrorText.tsx
├── GlassCard.tsx
├── GradientButton.tsx
├── PrimaryButton.tsx
└── ResultCard.tsx
```

### 🔧 Business Logic Layer

```
business/
├── calculations/
│   ├── ChainDesign.ts   ← Thiết kế bộ truyền xích (FR-CAL-006)
│   ├── GearRatio.ts     ← Phân phối tỷ số truyền (FR-CAL-004)
│   └── MotorCalc.ts     ← Tính chọn động cơ (FR-CAL-001)
├── suggestion/          ← Gợi ý linh kiện (Strategy Pattern)
│   ├── ExpertSystem.ts       ← Rule-based suggestion engine
│   └── SuggestionStrategy.ts ← CostOptimization, Durability strategies
└── facade/
    └── DesignFacade.ts  ← Facade Pattern: điều phối toàn bộ quy trình
```

### 🗄️ Data Layer

```
data/
├── localDb.ts         ← SQLite/AsyncStorage adapter (Offline-first)
├── historyRepository.ts  ← Repository Pattern: CRUD lịch sử
├── ComponentFactory.ts   ← Factory Method Pattern
├── Components.ts
└── sampleComponents.ts
```

### 🔌 Services (External)

```
services/
├── calculationService.ts  ← Service tính toán nhanh (utility)
└── validationService.ts   ← Validation logic
```

### 🗃️ Types

```
types/
├── index.ts        ← Barrel export: import { CalculationResult } from '../types'
├── input.ts        ← InputParams, INPUT_LIMITS
├── result.ts       ← CalculationResult, ShaftTable, ChainParams...
└── component.ts
```

### 🛠️ Utils & Config

```
utils/
├── theme.ts        ← Design System: Colors, Typography, Spacing, BorderRadius, Shadows
├── constants.ts    ← Engineering data: MOTOR_TABLE, CHAIN_TABLE, EFFICIENCY...
├── format.ts       ← Formatting helpers
└── helpers.ts      ← Generic helpers

navigation/
└── AppNavigator.tsx  ← Root navigator (Auth Stack → Main Tabs → Calculate Stack)
```

---

## Python Backend (`python_backend/`) *(Planned)*

- `core/algorithms/`: Code Python xử lý tính toán động lực học.
- `core/expert_system/`: Logic hệ chuyên gia (Rule-based).
- `database/`: Mô hình PostgreSQL.

---

## Nguyên tắc Kiến trúc

| Tầng | Vai trò | Phụ thuộc |
|------|---------|-----------|
| `screens/` | Hiển thị UI, handle user events | `components`, `business`, `data`, `utils` |
| `business/` | Thuật toán, tính toán kỹ thuật | `types`, `utils/constants` |
| `expert_system/` | Gợi ý linh kiện theo chiến lược | `types` |
| `data/` | Lưu trữ và truy xuất dữ liệu | `types` |
| `services/` | External/utility services | `data`, `utils` |
| `types/` | Interfaces & Type definitions | *(không phụ thuộc ai)* |
| `utils/` | Constants, theme, helpers | *(không phụ thuộc ai)* |
