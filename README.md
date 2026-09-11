# GAB Interactive Card Activation Experience

## 1. Install Dependencies
```bash
npm install
```

## 2. Development
```bash
npm run dev
```

## 3. Usage
- **LED Stage (Màn hình sự kiện):** Mở `http://localhost:5173/led` và nhấn **F11** để Fullscreen.
- **Operator Panel (Điều khiển):** Mở `http://localhost:5173/operator` trên một tab hoặc máy tính khác.

## 4. Features & Phím tắt
- Số 1-9 và Q,W,E,R,T,Y: Kích hoạt từng participant.
- Phím A: Kích hoạt tất cả (Activate All).
- Phím Z: Reset chương trình.
- Phím Space: Bỏ qua phase (Skip Phase).
- Phím B: Blackout toàn bộ màn hình LED.

## 5. Cảm biến thực tế (Sensor)
Hệ thống đã chuẩn bị `SensorAdapter.ts` để bạn viết code nhận dữ liệu qua WebSocket từ ESP32/Arduino hoặc Server camera. Khi có tín hiệu hand enter, chỉ cần gọi `eventController.confirmParticipant(id)`.

## 6. Build & Record
- **Build cho Production:** `npm run build`
- **Demo Mode:** Thêm parameter `?demo=true` vào URL `/led` (cần code thêm logic trigger demo nếu bạn muốn tự chạy cinematic).
- **Export MP4:** Khuyến nghị dùng phần mềm quay màn hình (OBS) hoặc Puppeteer với độ phân giải siêu rộng để record WebM, sau đó dùng ffmpeg chuyển sang MP4.
