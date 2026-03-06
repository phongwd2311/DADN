# Cấu trúc Dự án Hệ dẫn động Băng tải (Conveyor Design App)

Dựa trên tài liệu đặc tả, dự án được chia thành 2 phần chính:

1. **Mobile App (React Native)**: Ứng dụng Offline-first.
2. **Python Core**: Xử lý nghiệp vụ phức tạp và API (nếu cần sync).

## 1. Mobile App Structure (`mobile-app/src`)

Cấu trúc tuân theo các tầng Kiến trúc đã mô tả:

### Tầng Giao diện (Presentation Layer)

- `presentation/screens/`: Chứa các màn hình chính.
  - `auth/`: Đăng ký, Đăng nhập (FR-USR).
  - `input/`: Nhập thông số kỹ thuật (FR-INP).
  - `dashboard/`: Hiển thị dashboard trực quan.
  - `results/`: Hiển thị bảng kết quả tính toán.
  - `history/`: Xem lịch sử tính toán (FR-STO).
- `presentation/components/`: Các UI Component tái sử dụng.

### Tầng Nghiệp vụ (Business Logic Layer)

- `business/calculations/`: Các module tính toán cơ khí (Tính động cơ, Tỷ số truyền, Xích...).
- `business/facade/`: **Facade Pattern**. Class `CalculationFacade` sẽ điều phối toàn bộ quy trình từ nhập liệu -> tính toán -> gọi chuyên gia.

### Tầng Hệ chuyên gia (Expert System Layer)

- `expert_system/rules/`: Định nghĩa các luật logic (JSON hoặc Constants).
- `expert_system/strategies/`: **Strategy Pattern**. Chứa các chiến lược gợi ý linh kiện (ví dụ: `CostOptimizationStrategy`, `DurabilityStrategy`).

### Tầng Dữ liệu (Data Layer)

- `data/local_db/`: Cấu hình SQLite/Realm cho Offline-first.
- `data/factories/`: **Factory Method Pattern**. Dùng để khởi tạo đối tượng linh kiện.
- `data/repositories/`: Xử lý truy xuất dữ liệu (quyết định lấy từ Local hay API).
- `data/models/`: Định nghĩa TypeScript interfaces (User, Motor, Chain...).

---

## 2. Python Backend Structure (`python_backend/`)

Dùng để triển khai các thuật toán gốc và quản lý PostgreSQL như yêu cầu 1.3.2.

- `core/algorithms/`: Code Python xử lý tính toán động lực học.
- `core/expert_system/`: Logic hệ chuyên gia (Rule-based).
- `database/`: Mô hình PostgreSQL.
