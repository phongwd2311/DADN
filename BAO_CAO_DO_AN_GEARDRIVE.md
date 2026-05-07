# Báo cáo đồ án: GearDrive - Hệ thống hỗ trợ thiết kế dẫn động băng tải

## 1. TỔNG QUAN VÀ PHẠM VI DỰ ÁN

### 1.1 Đặt vấn đề

Trong thiết kế hệ dẫn động băng tải, kỹ sư cần một công cụ hỗ trợ tính toán nhanh các thông số kỹ thuật: công suất động cơ, tỷ số truyền, thiết kế bộ truyền xích, hệ số an toàn và lựa chọn linh kiện phù hợp. GearDrive được phát triển nhằm giảm thiểu sai số tính toán thủ công và trợ giúp quy trình thiết kế cơ khí.

### 1.2 Nhiệm vụ đồ án

#### 1.2.1 Mục đích

- Xây dựng ứng dụng di động giúp người dùng kỹ thuật nhanh chóng nhập thông số và nhận kết quả thiết kế.
- Cung cấp hệ thống lưu trữ lịch sử tính toán và đồng bộ với backend.
- Thiết kế phần mềm theo kiến trúc rõ ràng, dễ bảo trì và mở rộng.

#### 1.2.2 Yêu cầu

##### 1.2.2.1 Yêu cầu chức năng (khái quát)

- Nhập dữ liệu cơ bản của hệ dẫn động băng tải: lực vòng, vận tốc, đường kính tang, tuổi thọ, tải trọng.
- Tính toán công suất làm việc, công suất tương đương, hiệu suất hệ, công suất cần thiết.
- Chọn động cơ tiêu chuẩn phù hợp từ danh sách động cơ.
- Phân phối tỷ số truyền qua các trục và thiết kế bộ truyền xích.
- Hiển thị kết quả chi tiết cho người dùng.
- Lưu lịch sử tính toán và đồng bộ dữ liệu lên server.
- Quản lý người dùng: đăng ký, đăng nhập và xác thực.

##### 1.2.2.2 Yêu cầu phi chức năng

- Hiệu năng phản hồi nhanh trên thiết bị di động.
- Giao diện trực quan, dễ sử dụng cho kỹ sư.
- Bảo mật thông tin người dùng và phiên tính toán.
- Mã nguồn dễ đọc, dễ mở rộng và tái sử dụng.
- Tính tương thích với thiết bị Android/iOS thông qua Expo.

### 1.3 Môi trường và kiến trúc phát triển

#### 1.3.1 Kiến trúc hệ thống

Dự án được tách thành hai phần chính:

- Frontend: ứng dụng React Native/Expo trên thiết bị di động.
- Backend: API Node.js + Express + Prisma kết nối PostgreSQL.

Kiến trúc ứng dụng mobile tuân thủ tách tầng:

- `screens/`: điều khiển giao diện và điều hướng.
- `components/`: các thành phần UI tái sử dụng.
- `business/`: xử lý thuật toán và tính toán kỹ thuật.
- `data/`: lưu trữ cục bộ và repository.
- `services/`: các dịch vụ tiện ích.
- `types/`: định nghĩa kiểu TypeScript.

#### 1.3.2 Môi trường phát triển

- Hệ điều hành phát triển: Windows.
- Biên dịch: TypeScript.
- Chạy ứng dụng mobile: Expo CLI.
- Backend: Node.js, npm.
- Cơ sở dữ liệu: PostgreSQL qua Prisma.

### 1.4 Giới thiệu công nghệ sử dụng

#### 1.4.1 React Native / Expo và TypeScript

- Tạo giao diện di động thân thiện với người dùng.
- Sử dụng `React Navigation` để điều hướng giữa các màn hình `Login`, `Home`, `Input`, `Result`, `History`.
- Sử dụng `expo-linear-gradient` và `@expo/vector-icons` cho thiết kế hiện đại.

#### 1.4.2 Node.js, Express, TypeScript và PostgreSQL

- Triển khai API backend với `Express` và `TypeScript`.
- Sử dụng `Prisma` để tương tác với PostgreSQL.
- Dùng `zod` để validate dữ liệu đầu vào.
- Áp dụng JWT cho xác thực API.

## 2. PHÂN TÍCH YÊU CẦU

### 2.1 Tác nhân và vai trò

#### 2.1.1 Người dùng (User)
- Nhập dữ liệu đầu vào cho mô phỏng hệ dẫn động băng tải.
- Nhận kết quả thiết kế chi tiết tại màn hình kết quả.
- Lưu giữ và truy xuất lịch sử các phiên tính toán.
- Chọn chiến lược tối ưu: chi phí hoặc độ bền.
- Xem đề xuất động cơ và linh kiện phù hợp.

#### 2.1.2 Người quản trị (Admin)
- Quản lý danh sách động cơ chuẩn trong cơ sở dữ liệu.
- Giám sát hoạt động đồng bộ dữ liệu từ người dùng.
- Cập nhật thông số kỹ thuật cho các linh kiện hỗ trợ.

#### 2.1.3 Hệ thống backend
- Cung cấp API xác thực người dùng.
- Lưu trữ phiên tính toán và kết quả đến cơ sở dữ liệu.
- Trả về danh sách động cơ, gợi ý và lịch sử phiên.
- Đảm bảo dữ liệu đúng định dạng và an toàn.

### 2.2 Yêu cầu chức năng (chi tiết)

#### 2.2.1 Quản lý người dùng
- Cho phép người dùng đăng ký tài khoản mới bằng email và mật khẩu.
- Cho phép người dùng đăng nhập và lưu token JWT trên thiết bị.
- Hạn chế truy cập các API bảo mật cho người dùng chưa xác thực.
- Lấy về thông tin hồ sơ người dùng khi cần thiết.

#### 2.2.2 Nhập liệu và xác thực dữ liệu đầu vào
- Nhập các tham số chính: lực vòng (F), vận tốc băng tải (v), đường kính tang (D).
- Cho phép người dùng nhập thêm tham số phụ: tuổi thọ, tải trọng, phân bổ mô men.
- Kiểm tra tính hợp lệ của dữ liệu: phải là số, trong giới hạn hợp lý và không bỏ trống.
- Hiển thị thông báo lỗi cụ thể khi dữ liệu không hợp lệ.

#### 2.2.3 Tính toán kỹ thuật
- Tính công suất làm việc `Plv = F * v / 1000`.
- Tính công suất tương đương `Ptd` theo hệ số tải và tần suất.
- Tính hiệu suất hệ thống `eta` từ các hiệu suất thành phần như xích, bánh răng, ổ lăn, khớp nối.
- Tính công suất cần thiết `Pct = Ptd / eta`.
- Tính số vòng quay trục công tác `nlv` theo đường kính tang.
- Tính số vòng quay sơ bộ `nsb` từ tỷ số truyền sơ bộ.

#### 2.2.4 Lựa chọn linh kiện và thiết kế chi tiết
- Chọn động cơ tiêu chuẩn từ bảng dữ liệu `MOTOR_TABLE` dựa trên `Pct` và `nsb`.
- Phân phối tỷ số truyền qua các trục trong module `GearRatio`.
- Thiết kế bộ truyền xích gồm số răng z1, z2, bước xích `p`, khoảng cách trục `a`, đường kính chia d1, d2.
- Kiểm tra lực căng, lực vòng, hệ số an toàn và ứng suất bề mặt.
- Đưa ra cảnh báo nếu thiết kế vượt quá giới hạn an toàn.

#### 2.2.5 Hiển thị kết quả
- Hiển thị kết quả tổng quan: công suất cần thiết, động cơ được chọn, tỷ số truyền và hệ số an toàn.
- Hiển thị chi tiết theo tab: Động cơ, Bộ truyền xích, Bánh răng nhanh, Bánh răng chậm, Trục, Ổ lăn, Vỏ hộp.
- Cho phép người dùng chuyển tiếp sang màn hình đề xuất động cơ phù hợp.

#### 2.2.6 Lưu trữ và đồng bộ
- Lưu phiên tính toán cục bộ vào `LocalDb` để xem lại khi offline.
- Đồng bộ phiên tính toán lên backend khi có mạng.
- Ghi nhận thông tin đồng bộ và trạng thái phiên.
- Hiển thị danh sách lịch sử tính toán đã lưu trong `HistoryScreen`.

#### 2.2.7 Báo cáo và đề xuất
- Cung cấp đề xuất động cơ theo chiến lược `cost` hoặc `durability`.
- Thiết kế phần `ExpertSystem` để mở rộng gợi ý linh kiện.
- Hiển thị lý do gợi ý và điểm phù hợp nếu có.

### 2.3 Yêu cầu phi chức năng (chi tiết)

#### 2.3.1 Hiệu năng
- Ứng dụng cần phản hồi nhanh khi nhập liệu và chuyển màn hình.
- Tính toán phải được thực hiện trong thời gian ngắn, không gây treo UI.
- Backend trả về dữ liệu API trong thời gian hợp lý.

#### 2.3.2 Bảo mật
- Token JWT phải được bảo mật và chỉ gửi trên các request được xác thực.
- Không lưu trữ mật khẩu dạng plaintext.
- Bảo vệ API nhạy cảm như `sessions`, `motors` khỏi truy cập trái phép.

#### 2.3.3 Độ tin cậy và khả năng sẵn sàng
- Ứng dụng phải hoạt động được ngay cả khi không có mạng bằng dữ liệu cục bộ.
- Lịch sử tính toán phải vẫn có thể đọc được khi offline.
- Có cơ chế bắt lỗi và thông báo khi API backend không phản hồi.

#### 2.3.4 Khả năng mở rộng và bảo trì
- Mã nguồn được tổ chức theo module rõ ràng.
- Có thể mở rộng thêm các module thiết kế hộp số, ổ lăn, bánh răng.
- Backend có thể thêm bảng dữ liệu mới mà không ảnh hưởng lớn đến kiến trúc hiện tại.

#### 2.3.5 Tính tương thích và UX
- Ứng dụng tương thích cả Android và iOS qua Expo.
- Giao diện phải hiển thị tốt trên nhiều kích thước màn hình.
- Thông báo lỗi và hướng dẫn phải rõ ràng, dễ hiểu cho người dùng kỹ thuật.

## 3. ĐẶC TẢ PHẦN MỀM (YÊU CẦU CHỨC NĂNG)

### 3.1 Module Quản lý người dùng (User Management)

- Đăng ký tài khoản mới.
- Đăng nhập và lưu token xác thực.
- Lấy thông tin người dùng hiện tại.
- Bảo vệ API `sessions` và `motors` bằng JWT.

### 3.2 Module Quản lý thông số và đề xuất động cơ (Calculator / Designer)

- Nhập thông số: lực vòng, vận tốc, đường kính tang, tuổi thọ, tỉ lệ tải.
- Tính toán `Plv`, `Ptd`, `eta`, `Pct`, `nlv`, `nsb`.
- Chọn động cơ tiêu chuẩn dựa trên `MOTOR_TABLE`.
- Phân phối tỷ số truyền qua các trục.
- Thiết kế bộ truyền xích và đánh giá hệ số an toàn.
- Hiển thị kết quả chi tiết trong `ResultScreen`.

### 3.3 Module Khám phá linh kiện (Device Suggestion)

- Hiển thị đề xuất động cơ phù hợp.
- Hiển thị thông số động cơ như công suất, tốc độ, loại.
- Hỗ trợ chiến lược tối ưu chi phí hoặc độ bền.

### 3.4 Module Lịch sử và đồng bộ (History / Sync)

- Lưu kết quả cục bộ với `LocalDb`.
- Đồng bộ phiên tính toán lên backend qua `sessionApi.create(...)`.
- Hiển thị danh sách lịch sử trong `HistoryScreen`.

### 3.5 Module Quản trị hệ thống (Admin / Motor Library)

- Backend quản lý `MotorLibrary`.
- API trả về danh sách động cơ chuẩn.
- Admin có thể mở rộng thư viện linh kiện trong cơ sở dữ liệu.

### 3.6 Module Đồng bộ dữ liệu (Data Sync)

- API `POST /api/sessions` lưu phiên tính toán.
- API `GET /api/sessions` lấy lịch sử phiên của user.
- Cơ chế try-catch ở frontend để không làm sập app khi mất mạng.

### 3.7 Các module đang phát triển

- `ExpertSystem`: logic gợi ý chuyên gia chưa hoàn thiện.
- Các tab `Bánh răng nhanh`, `Bánh răng chậm`, `Ổ lăn`, `Vỏ hộp` trong `ResultScreen` đang là placeholder.
- Có thể mở rộng module thiết kế hộp giảm tốc và bánh răng.

## 4. ĐẶC TẢ USE CASE

### Use Case chính

1. `UC01 - Đăng nhập`
   - Actor: Người dùng
   - Mô tả: Người dùng nhập email/password, hệ thống xác thực và truy cập ứng dụng.

2. `UC02 - Nhập thông số tính toán`
   - Actor: Người dùng
   - Mô tả: Nhập lực, vận tốc, đường kính, tuổi thọ, chọn chiến lược tối ưu.

3. `UC03 - Tính toán và hiển thị kết quả`
   - Actor: Người dùng
   - Mô tả: Hệ thống tính toán và hiển thị kết quả gồm công suất, tỷ số truyền, xích, động cơ chọn.

4. `UC04 - Lưu lịch sử`
   - Actor: Người dùng
   - Mô tả: Sau khi tính toán, người dùng lưu kết quả vào lịch sử và đồng bộ với server.

5. `UC05 - Xem lịch sử`
   - Actor: Người dùng
   - Mô tả: Người dùng xem lại các phiên tính toán trước đó.

6. `UC06 - Đề xuất động cơ`
   - Actor: Người dùng
   - Mô tả: Hiển thị đề xuất động cơ phù hợp và thông tin chi tiết linh kiện.

### Sơ đồ Use Case (mô tả)

- Người dùng: Đăng nhập, Nhập tham số, Tính toán, Xem kết quả, Lưu lịch sử, Xem lịch sử.
- Hệ thống backend: Xác thực, Lưu phiên, Truy xuất lịch sử, Cung cấp dữ liệu động cơ.

## 5. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 5.1 Bảng chính

- `users`: quản lý người dùng.
- `calculation_sessions`: lưu phiên tính toán.
- `design_inputs`: lưu thông số đầu vào.
- `design_results`: lưu kết quả tổng hợp.
- `shafts`, `bearings`, `gear_drives`, `housings`: bảng con của kết quả.
- `motor_library`: thư viện động cơ chuẩn.
- `ai_suggestions`: lưu gợi ý chuyên gia.

### 5.2 Quan hệ giữa các bảng

- `User` 1 - N `CalculationSession`
- `CalculationSession` 1 - N `DesignInput`
- `CalculationSession` 1 - N `DesignResult`
- `DesignResult` 1 - N `Shaft`
- `DesignResult` 1 - N `Bearing`
- `DesignResult` 1 - N `GearDrive`
- `DesignResult` 1 - N `Housing`
- `CalculationSession` 1 - N `AiSuggestion`
- `AiSuggestion` N - 1 `MotorLibrary`

### 5.3 Mô tả dữ liệu chính

- `DesignInput`: lưu `force_f`, `velocity_v`, `diameter_d`, `lifespan_l`, thông số tải.
- `DesignResult`: lưu `equivalent_power`, `total_efficiency`, `required_power_pct`, `total_ratio_ut`, `u1_ratio`, `u2_ratio`.
- `Shaft`: lưu công suất, tốc độ, mômen từng trục.
- `MotorLibrary`: lưu mô hình động cơ, công suất, tốc độ, hiệu suất.

## 6. HIỆN THỰC CHƯƠNG TRÌNH

### 6.1 Frontend

- `App.tsx`: entry point, khởi tạo `AuthProvider` và `AppNavigator`.
- `AppNavigator.tsx`: điều hướng chính gồm stack auth và bottom tab chính.
- `InputScreen.tsx`: nhận dữ liệu người dùng, gọi `DesignFacade`, đưa kết quả sang `ResultScreen`.
- `ResultScreen.tsx`: hiển thị chi tiết kết quả tính toán và giao diện chuyển tiếp.
- `HistoryScreen.tsx`: hiển thị lịch sử lưu trữ.
- `DesignFacade.ts`: điều phối tính toán thông qua `MotorCalculation`, `GearRatioDistributor`, `ChainDriveDesign`.

### 6.2 Business logic

- `MotorCalc.ts`: tính công suất và chọn động cơ theo `MOTOR_TABLE`.
- `GearRatio.ts`: phân phối tỷ số truyền giữa các trục.
- `ChainDesign.ts`: thiết kế bộ truyền xích, xác định số răng, bước xích, khoảng cách trục, lực căng, hệ số an toàn.
- `ExpertSystem.ts`: khởi tạo module gợi ý nhưng hiện chưa tham gia sâu vào luồng tính toán.

### 6.3 Data layer

- `historyRepository.ts`: lưu lịch sử cục bộ và đồng bộ lên backend.
- `localDb.ts`: adapter lưu trữ cục bộ.
- `sessionApi.ts`: gọi API backend.

### 6.4 Backend

- `src/index.ts`: cấu hình Express, middleware, định tuyến, health check.
- `routes/auth.ts`: đăng ký, đăng nhập, bảo mật JWT.
- `routes/sessions.ts`: CRUD phiên tính toán với nested create kết quả.
- `routes/motors.ts`: trả về danh sách động cơ.
- `prisma/schema.prisma`: thiết kế database gồm người dùng, phiên, input, result và các bảng con.

### 6.5 Một số ghi chú thực hiện

- Kết quả tính toán được chuyển từ `InputScreen` sang `ResultScreen` bằng `navigation.navigate`.
- `ResultScreen` hiện hỗ trợ hiển thị tab cho `Động cơ` và `Bộ truyền xích`; các tab khác đang chờ hoàn thiện.
- Backend `POST /api/sessions` dùng nested create để lưu các dữ liệu liên quan trong một lần gọi.

## 7. TỔNG KẾT

GearDrive đã xây dựng được hệ thống hỗ trợ tính toán thiết kế dẫn động băng tải với kiến trúc rõ ràng và mô-đun. Ứng dụng mobile có giao diện kỹ thuật, backend đã triển khai API cơ bản cho xác thực và lưu lịch sử.

Ưu điểm chính:

- Tách biệt rõ ràng giữa UI và logic kỹ thuật.
- Hỗ trợ tính toán công suất, tỷ số truyền và đề xuất động cơ.
- Lưu được lịch sử và đồng bộ được dữ liệu xuống server.

Hạn chế cần khắc phục:

- `ExpertSystem` chưa hoàn chỉnh.
- Một số tab kết quả kỹ thuật vẫn chưa có dữ liệu.
- Cần kiểm tra và bổ sung validation đầu vào chi tiết hơn.

Đề xuất:

- Hoàn thiện gợi ý động cơ theo chiến lược thực tế.
- Mở rộng phần báo cáo chi tiết `Bánh răng`, `Ổ lăn`, `Vỏ hộp`.
- Bổ sung test tự động cho các module tính toán.
- Hoàn thiện quản trị thư viện động cơ backend.

---

*Báo cáo được trình bày theo dàn ý dự án và dựa trên phân tích mã nguồn hiện có.*
