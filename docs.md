Bạn là Senior Creative Developer + Frontend Engineer + WebGL Engineer + Event Technology Engineer.

Hãy xây dựng HOÀN CHỈNH một project chạy được ngay cho chương trình:

# GAB INTERACTIVE CARD ACTIVATION EXPERIENCE

Đây là hệ thống trình chiếu LED tương tác dành cho khoảng 8–15 Chuyên gia/Kỷ lục gia cùng thực hiện nghi thức kích hoạt thẻ GAB trên sân khấu.

Project KHÔNG phải website marketing thông thường.

Project phải hoạt động như một “interactive event engine” chạy fullscreen trên màn LED sân khấu, có:

* cảm ứng / sensor input;
* nhận diện đủ số người tham gia;
* countdown;
* animation realtime;
* WebGL / Canvas effects;
* particle;
* sao băng;
* light trail;
* logo reveal;
* counter tăng tới 400+;
* explosion;
* âm thanh;
* operator control panel;
* fullscreen LED output;
* chế độ giả lập khi chưa có sensor thật;
* khả năng record/export thành MP4 khi cần.

Mục tiêu cuối cùng:

1. Có thể chạy trực tiếp bằng Chrome/Edge fullscreen để trình chiếu sự kiện.
2. Có Operator Control Panel riêng để kỹ thuật viên điều khiển.
3. Có thể thay đổi số lượng Kỷ lục gia từ 8–15 mà không sửa source code.
4. Có thể kết nối cảm biến thật sau này.
5. Khi chưa có cảm biến thật vẫn test hoàn chỉnh bằng keyboard/mouse.
6. Có thể chạy toàn bộ visual bằng code, không phụ thuộc video dựng sẵn.
7. Nếu có video/asset ngoài sau này thì có thể nhúng vào làm background/layer.
8. Có chế độ tự chạy cinematic để record/export MP4.

---

# 1. BỐI CẢNH SÂN KHẤU

Màn LED vật lý:

* chiều ngang: 8.5m;
* chiều cao: 3m;
* mép dưới màn LED cách mặt sàn khoảng 50cm;
* tỷ lệ màn hình vật lý khoảng 2.833:1.

Người tham gia:

* từ 8 đến 15 Kỷ lục gia;
* chiều cao trung bình khoảng 1m65–1m70;
* đứng thành hàng phía trước màn hình;
* người thật có thể che phần dưới của LED.

Vì vậy:

* KHÔNG đặt nội dung quan trọng ở 30–40% khu vực dưới màn hình;
* logo chính, số 400+, countdown và final message phải nằm ở vùng trung tâm/trung tâm phía trên;
* các node cảm ứng có thể đặt phía dưới vì chúng có thể bị che một phần;
* visual phải được thiết kế cho màn hình panoramic rất rộng.

Logical design resolution:

* mặc định 3840 × 1355 hoặc resolution khác nhưng GIỮ ĐÚNG tỷ lệ 8.5/3;
* toàn bộ animation phải responsive;
* không hard-code pixel theo một màn duy nhất;
* dùng normalized coordinates hoặc responsive layout.

Có config:

```ts
LED_WIDTH_METERS = 8.5
LED_HEIGHT_METERS = 3
LED_BOTTOM_FROM_STAGE = 0.5
DESIGN_ASPECT_RATIO = 8.5 / 3
```

---

# 2. CÔNG NGHỆ

Ưu tiên stack:

* Vite
* React
* TypeScript
* Three.js
* @react-three/fiber nếu phù hợp
* GSAP
* Web Audio API hoặc Howler.js
* CSS
* Canvas/WebGL shaders
* WebSocket abstraction cho sensor

Có thể sử dụng:

* postprocessing bloom
* custom shader
* particle system
* instanced mesh
* SVG sampling
* canvas texture

Không được tạo project phụ thuộc server phức tạp nếu không cần.

Project phải chạy local bằng:

```bash
npm install
npm run dev
```

và build được:

```bash
npm run build
npm run preview
```

Nếu cần Node server cho WebSocket sensor thì tạo riêng:

```bash
npm run sensor-server
```

Nhưng frontend phải chạy được hoàn chỉnh ngay cả khi không có server sensor.

---

# 3. KIẾN TRÚC PROJECT

Tổ chức code rõ ràng, KHÔNG nhồi toàn bộ vào App.tsx.

Ví dụ:

```txt
src/
  app/
    App.tsx
    routes.ts

  config/
    eventConfig.ts
    visualConfig.ts

  core/
    EventController.ts
    EventStateMachine.ts
    TimelineController.ts

  sensors/
    SensorManager.ts
    SensorAdapter.ts
    MockSensorAdapter.ts
    KeyboardSensorAdapter.ts
    WebSocketSensorAdapter.ts

  audio/
    AudioManager.ts

  visual/
    LedStage.tsx
    BackgroundScene.tsx
    ParticleField.tsx
    EnergyCore.tsx
    MeteorSystem.tsx
    EnergyTrailSystem.tsx
    Shockwave.tsx
    ExplosionSystem.tsx
    LogoReveal.tsx
    Counter400.tsx
    Countdown.tsx
    FinalCelebration.tsx
    ParticipantNodes.tsx

  operator/
    OperatorPanel.tsx
    ParticipantControl.tsx
    EventControls.tsx
    Diagnostics.tsx

  hooks/
  stores/
  types/
  utils/

public/
  assets/
    logos/
    cards/
    audio/
    videos/
    textures/
```

Nếu dùng Zustand để quản lý state thì được.

---

# 4. EVENT CONFIG

Tạo một cấu hình trung tâm.

Ví dụ:

```ts
export const EVENT_CONFIG = {
  eventName: "GAB Interactive Card Activation",

  participants: {
    required: 12,
    min: 8,
    max: 15,
    holdTimeMs: 1200
  },

  countdown: {
    seconds: 5
  },

  counter: {
    finalValue: 400,
    suffix: "+"
  },

  activation: {
    mode: "confirm-once"
  },

  sensor: {
    mode: "mock"
  },

  visual: {
    showVietKings: true,
    showGabCard: true,
    enableBloom: true,
    enableParticles: true,
    enableMeteors: true,
    enableExplosion: true
  },

  finalMessage: {
    line1: "CHÚC MỪNG CÁC KỶ LỤC GIA",
    line2: "ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG"
  }
}
```

Operator phải thay đổi được:

* required participant count;
* countdown seconds;
* target counter;
* sensor mode;
* volume;
* effect intensity.

Không yêu cầu reload page.

---

# 5. EVENT STATE MACHINE

Bắt buộc dùng state machine rõ ràng.

Các trạng thái:

```txt
BOOT
IDLE
WAITING_FOR_PARTICIPANTS
PARTICIPANT_CONFIRMING
ALL_PARTICIPANTS_READY
COUNTDOWN
GAB_REVEAL
ENERGY_CONVERGENCE
COUNTER_SEQUENCE
FINAL_CHARGE
EXPLOSION
SUCCESS
RESETTING
```

Không viết animation bằng hàng loạt setTimeout rời rạc khó quản lý.

Dùng TimelineController/GSAP Timeline hoặc state machine.

EventController phải có các API:

```ts
startWaiting()
confirmParticipant(id)
unconfirmParticipant(id)
startCountdown()
cancelCountdown()
skipToNextPhase()
activateAll()
resetEvent()
replayEvent()
showFinalScreen()
```

---

# 6. LOGIC CẢM ỨNG

Đây là yêu cầu QUAN TRỌNG NHẤT.

Hôm diễn ra sự kiện, BTC có thể có:

* 8 người;
* 9 người;
* 10 người;
* ...
* tối đa 15 người.

Operator chọn số người thực tế.

Ví dụ:

```txt
Required Participants = 12
```

Khi cảm biến nhận từng người:

```txt
KLG 01 → confirmed
KLG 02 → confirmed
KLG 03 → waiting
...
```

Hiển thị tiến độ nội bộ:

```txt
8 / 12
11 / 12
12 / 12
```

CHỈ khi:

```ts
confirmedParticipants === requiredParticipants
```

thì mới được chuyển sang:

```txt
ALL_PARTICIPANTS_READY
```

sau đó tự chạy countdown 5 giây.

Không đủ người → tuyệt đối không tự chạy cinematic.

---

# 7. CÁCH XÁC NHẬN BÀN TAY

Thiết kế SensorAdapter abstraction.

Interface:

```ts
interface SensorAdapter {
  connect(): Promise<void>
  disconnect(): void
  onHandEnter(callback): void
  onHandLeave(callback): void
  onConfirmed(callback): void
}
```

Có 3 adapter ngay trong project:

### A. MockSensorAdapter

Cho phép test bằng UI.

Click từng station.

### B. KeyboardSensorAdapter

Map:

```txt
1 → participant 1
2 → participant 2
...
9 → participant 9
Q → participant 10
W → participant 11
E → participant 12
R → participant 13
T → participant 14
Y → participant 15
```

Space:

```txt
manual start / next
```

A:

```txt
activate all
```

R hoặc một phím khác không conflict:

```txt
reset
```

### C. WebSocketSensorAdapter

Chuẩn bị sẵn để kết nối ESP32/Arduino/camera server.

Message format:

```json
{
  "type": "HAND_ENTER",
  "stationId": 7,
  "timestamp": 123456789
}
```

```json
{
  "type": "HAND_LEAVE",
  "stationId": 7
}
```

---

# 8. HOLD-TO-CONFIRM

Không phải tay đi ngang là kích hoạt ngay.

Mặc định phải giữ tay:

```txt
1200ms
```

Visual node của người đó:

```txt
WAITING
↓
HAND DETECTED
↓
circular progress 0–100%
↓
CONFIRMED
```

Nếu tay rời trước 1200ms:

```txt
cancel progress
return WAITING
```

Khi đạt 100%:

```txt
CONFIRMED
```

Và dùng chế độ:

```txt
confirm-once
```

Tức là sau khi confirmed, bỏ tay ra vẫn giữ trạng thái confirmed.

Đây là mode mặc định cho event thật để tránh lỗi sensor.

Có thêm optional mode:

```txt
continuous-hold
```

nhưng không bật mặc định.

---

# 9. PARTICIPANT NODES

Phía dưới LED tạo các activation node tương ứng số lượng người.

Nếu 8 người → 8 node.

Nếu 15 người → 15 node.

Position phải tự động phân bố đều.

Không hard-code 12 vị trí.

Node design:

WAITING:

* vòng mờ;
* pulse nhẹ;
* opacity thấp.

HAND DETECTED:

* ring chạy progress;
* glow tăng dần;
* particle nhỏ hút vào node.

CONFIRMED:

* flash;
* energy pulse;
* vòng sáng xanh/cyan;
* trail bắt đầu kết nối vào energy network.

Không cần hiện tên Kỷ lục gia trên LED.

Operator panel có thể hiện:

```txt
KLG 01
KLG 02
...
```

---

# 10. VISUAL STYLE

Phong cách:

* premium;
* futuristic;
* global;
* technological;
* cinematic;
* elegant;
* không giống gaming rẻ tiền;
* không giống casino;
* không lạm dụng rainbow.

Color direction:

* deep navy;
* dark blue;
* cyan;
* electric blue;
* white;
* có thể điểm chút holographic highlight.

Background:

* procedural digital space;
* particle field;
* subtle grid;
* network lines;
* slow-moving volumetric-like glow;
* light fog;
* stars;
* subtle parallax.

Không để background quá sáng vì sẽ giảm độ nổi của logo.

---

# 11. IDLE SCREEN

Khi chưa kích hoạt:

* background digital network chuyển động chậm;
* floating particles;
* các node participant phía dưới chờ;
* logo GAB ở dạng rất mờ hoặc energy core;
* màn hình không được “đứng hình”.

Có text nhỏ tùy chọn:

```txt
GAB GLOBAL ACTIVATION
```

nhưng có config hide/show.

---

# 12. KHI TỪNG NGƯỜI ĐẶT TAY

Mỗi station activated sẽ tạo:

1. pulse tại vị trí station;
2. circular glow;
3. một tia năng lượng chạy lên network;
4. particle bay lên;
5. sound nhẹ;
6. đường kết nối station → center;
7. node chuyển từ mờ → sáng.

Mỗi participant nên cảm giác giống như đang “cấp năng lượng cho hệ thống”.

---

# 13. KHI ĐỦ N/N

Ví dụ:

```txt
12 / 12
```

Visual:

* tất cả node pulse đồng bộ;
* một energy wave chạy từ trái sang phải;
* network sáng mạnh hơn;
* central core bắt đầu charge;
* xuất hiện text trong khoảng 800–1200ms:

```txt
ACTIVATION READY
```

hoặc có config tiếng Việt:

```txt
SẴN SÀNG KÍCH HOẠT
```

Sau đó tự động bắt đầu countdown.

---

# 14. COUNTDOWN 5 GIÂY

Countdown:

```txt
5
4
3
2
1
```

Mỗi số:

* nằm chính giữa;
* cực lớn;
* typography mạnh;
* không bị người đứng phía dưới che;
* mỗi số có impact;
* shockwave ring;
* particle pulse;
* light flash rất ngắn;
* bass hit hoặc click cinematic.

Transition số:

* scale 1.25 → 1;
* opacity;
* slight blur;
* glow;
* particle burst.

Trong countdown:

* central energy core tăng dần;
* network toàn màn hình ngày càng sáng;
* participant trails liên tục đổ vào trung tâm.

Sau số 1:

* blackout khoảng 100–200ms;
* flash trắng/cyan;
* bắt đầu GAB reveal.

---

# 15. GAB LOGO REVEAL

Logo GAB phải là hero visual.

Load logo từ:

```txt
/public/assets/logos/gab.svg
```

Nếu chưa có file thì tạo placeholder rõ ràng để user thay file thật sau.

Không vẽ lại logo tùy tiện.

Animation mong muốn:

```txt
particles xuất hiện
↓
particles hội tụ
↓
outline logo được vẽ
↓
logo hình thành
↓
glow
↓
energy ring
↓
shockwave
```

Nếu có thể:

* sample SVG path;
* tạo particles tụ về các điểm logo;
* sau đó render logo thật lên trên để đảm bảo sắc nét.

Logo nằm khoảng:

```txt
x = 50%
y = 38–45%
```

tránh quá thấp.

---

# 16. ENERGY STREAM / LUỒNG SÁNG

Sau GAB reveal:

Nhiều luồng năng lượng xuất hiện từ:

* trái;
* phải;
* participant nodes phía dưới;
* ngoài biên màn hình.

Các trail chạy vào logo GAB.

Trail phải:

* smooth;
* curved;
* additive blending;
* có glow;
* có particle tail;
* tốc độ khác nhau;
* không quá đều.

Sử dụng:

* Bezier curve;
* CatmullRom;
* custom trail geometry;
* shader nếu cần.

---

# 17. VIETKINGS + GAB CARD TRONG LUỒNG SÁNG

Chuẩn bị assets:

```txt
/public/assets/logos/vietkings.png
/public/assets/cards/gab-card.png
```

Trong một số energy streams:

* VietKings logo;
* hình GAB Card;

xuất hiện nhỏ như các “data objects” di chuyển theo luồng sáng.

Không để logo bị méo.

Có thể:

* fade-in;
* travel along curve;
* scale nhẹ;
* glow halo;
* rồi absorb vào logo GAB.

Khi chạm GAB:

* mini impact;
* particle burst;
* shockwave nhỏ.

Nếu asset chưa tồn tại:

* app vẫn phải chạy;
* dùng placeholder;
* console warning rõ ràng;
* không crash.

---

# 18. COUNTER 1+ → 400+

Sau khi các energy object bắt đầu hội tụ:

Hiện counter lớn.

Không cần hiển thị lần lượt đủ 400 số theo tốc độ cố định.

Animation cinematic.

Ví dụ milestone:

```txt
1+
2+
5+
10+
20+
50+
100+
150+
200+
250+
300+
350+
400+
```

Hoặc tween từ:

```txt
0 → 400
```

nhưng có speed ramp.

Yêu cầu:

* ban đầu chậm;
* sau tăng tốc;
* cuối chậm lại;
* 400+ phải “hit” mạnh.

Counter nằm trung tâm.

Có thể để logo GAB trên counter.

Ví dụ:

```txt
       [GAB]

        400+

GLOBAL ACTIVATION
```

Mỗi milestone lớn tạo:

* pulse;
* flash;
* energy wave;
* thêm particle vào central core.

---

# 19. FINAL CHARGE

Khi tới:

```txt
400+
```

Không explode ngay.

Giữ 400+ khoảng 0.8–1.5 giây.

Trong thời gian này:

* central core charge cực mạnh;
* particle từ toàn màn hình hút vào tâm;
* trails chạy nhanh hơn;
* screen vignette nhẹ;
* glow tăng;
* sound riser;
* visual compression như chuẩn bị nổ.

Sau đó:

```txt
ENERGY BURST
```

---

# 20. EXPLOSION EFFECT

Explosion phải dựng bằng code.

Không bắt buộc video.

Bao gồm:

* radial particle explosion;
* shockwave;
* radial streak;
* flash;
* expanding energy ring;
* spark;
* debris light particles;
* subtle camera shake;
* chromatic effect rất nhẹ nếu đẹp;
* bloom burst.

Particle count phải adaptive theo GPU.

Có quality config:

```txt
LOW
MEDIUM
HIGH
ULTRA
```

HIGH mặc định.

Không để lag trên laptop event.

Có FPS monitor trong operator diagnostics.

Nếu FPS tụt dưới threshold:

* giảm particle;
* giảm bloom;
* giảm trail complexity.

---

# 21. SUCCESS SCREEN

Sau explosion:

Reveal:

```txt
CHÚC MỪNG CÁC KỶ LỤC GIA

ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG
```

Viết đúng tiếng Việt.

Typography:

* line 1 lớn;
* line 2 vừa;
* logo GAB;
* có thể có VietKings nhỏ phía dưới.

Background:

* particles;
* slow energy;
* celebratory light rays;
* không quá nhiều chuyển động.

Final frame phải đẹp để:

* chụp ảnh;
* quay phim;
* giữ trên màn hình khoảng 8–20 giây hoặc indefinitely.

Có config:

```ts
holdFinalIndefinitely: true
```

Nếu true:

không tự reset.

Chỉ operator mới reset.

---

# 22. OPERATOR PANEL

Tạo route:

```txt
/operator
```

LED route:

```txt
/led
```

Operator UI không được xuất hiện trên LED.

Operator panel cần có:

### EVENT

* participant count;
* countdown duration;
* target counter;
* reset;
* replay;
* start;
* pause;
* skip phase;
* show final;
* blackout.

### PARTICIPANTS

Danh sách:

```txt
01 WAITING
02 CONFIRMING 63%
03 CONFIRMED
...
```

Mỗi participant có:

```txt
[ACTIVATE]
[RESET]
```

Có button:

```txt
ACTIVATE ALL
RESET ALL
```

### SENSOR STATUS

```txt
Sensor Mode: MOCK / KEYBOARD / WEBSOCKET
Connection: CONNECTED / DISCONNECTED
Last Event:
Station:
Latency:
```

### VISUAL

* particle intensity;
* bloom;
* meteor amount;
* explosion intensity;
* quality;
* fullscreen.

### AUDIO

* master volume;
* mute;
* SFX;
* music.

---

# 23. OPERATOR → LED COMMUNICATION

Operator và LED có thể:

### Cách đơn giản

Nếu cùng browser:

* BroadcastChannel API.

Ví dụ:

```ts
new BroadcastChannel("gab-event")
```

### Backup:

* localStorage event.

### Advanced optional:

* WebSocket.

Ưu tiên BroadcastChannel để chạy local không cần server.

Có thể mở:

Window 1:

```txt
http://localhost:5173/operator
```

Window 2:

```txt
http://localhost:5173/led
```

Operator thay đổi → LED update realtime.

---

# 24. FULLSCREEN

LED page phải có:

```txt
ENTER FULLSCREEN
```

và keyboard:

```txt
F
```

Ẩn:

* cursor;
* scrollbar;
* browser UI khi fullscreen.

Không để accidental text selection.

---

# 25. AUDIO DESIGN

Chuẩn bị AudioManager.

Các sound cue:

```txt
ambient
participant-confirm
countdown-tick
countdown-final
gab-reveal
energy-whoosh
counter-hit
riser
explosion
success
```

Nếu chưa có audio asset:

app không crash.

Tạo silent/fallback mode.

Folder:

```txt
/public/assets/audio/
```

Operator có thể mute.

Animation không phụ thuộc audio duration.

---

# 26. VIDEO LAYER

Video KHÔNG phải master.

Video chỉ là optional visual layer.

Tạo VideoLayer component.

Có thể load:

```txt
/public/assets/videos/background-idle.mp4
/public/assets/videos/background-energy.mp4
/public/assets/videos/background-final.mp4
```

Nếu video không tồn tại:

* procedural background vẫn chạy bình thường.

Có config:

```ts
useVideoBackground: false
```

Nếu true:

video render dưới WebGL/DOM overlay.

Có thể blend:

```txt
VIDEO
+
WEBGL
+
HTML UI
```

Không để video điều khiển logic event.

---

# 27. METEOR / SAO BĂNG

Tạo MeteorSystem.

Sao băng:

* sinh random từ ngoài màn hình;
* hướng về center hoặc đi chéo;
* có head glow;
* long trail;
* random speed;
* random size;
* random lifetime.

Trong ENERGY_CONVERGENCE:

số meteor tăng.

Trong idle:

rất ít.

Trong final:

giảm xuống.

Không dùng hình PNG sao băng đơn giản.

---

# 28. PARTICLE ENGINE

Particle engine reusable.

Có các mode:

```txt
FLOAT
ATTRACT_TO_CENTER
EXPLODE
FORM_LOGO
STREAM
CELEBRATE
```

Có pooling để tránh GC spikes.

Nếu Three.js:

ưu tiên:

```txt
BufferGeometry
Points
InstancedMesh
```

hạn chế tạo hàng nghìn React components.

---

# 29. PERFORMANCE

Target:

```txt
60 FPS
```

Laptop event có thể không quá mạnh.

Phải:

* avoid memory leak;
* dispose texture;
* dispose geometry;
* requestAnimationFrame đúng cách;
* không re-render React mỗi frame;
* use refs;
* particle pooling;
* adaptive pixel ratio.

Clamp:

```ts
Math.min(window.devicePixelRatio, 1.5)
```

hoặc config.

Có FPS indicator chỉ trong operator.

---

# 30. ERROR HANDLING

Nếu:

* WebSocket mất;
* asset thiếu;
* video fail;
* audio fail;
* sensor fail;

event vẫn phải có manual override.

Không được để màn LED crash.

Error hiển thị operator panel.

LED chỉ giữ visual an toàn.

---

# 31. MANUAL EVENT SAFETY

BẮT BUỘC có các backup control:

```txt
ACTIVATE PARTICIPANT
ACTIVATE ALL
START COUNTDOWN
SKIP
SHOW FINAL
RESET
BLACKOUT
```

Trong event thật, sensor có thể lỗi.

Operator luôn phải cứu được chương trình.

---

# 32. BLACKOUT MODE

Có shortcut/button:

```txt
B
```

LED chuyển đen ngay.

Không xóa state.

Bấm lại:

restore visual.

Dùng khi kỹ thuật sân khấu cần emergency blackout.

---

# 33. RESET

Reset phải:

* clear confirmed participants;
* stop GSAP timelines;
* stop audio;
* reset particles;
* reset counter;
* return idle;
* không reload browser.

---

# 34. REPLAY

Replay cinematic không cần participant touch lại.

Button:

```txt
REPLAY ACTIVATION
```

chạy từ countdown hoặc từ GAB reveal tùy config.

---

# 35. DEMO MODE

Có mode:

```txt
DEMO AUTO
```

Khi chạy:

```txt
participant 1 activate
participant 2 activate
...
all ready
countdown
full cinematic
success
```

Khoảng delay:

300–500ms mỗi participant.

Dùng để:

* demo khách;
* record video;
* xuất MP4.

---

# 36. RECORD / EXPORT MP4

Project cần chuẩn bị hai phương pháp.

## METHOD A – RECORD WEBSITE

Có `Record Demo` mode.

Dùng:

```txt
MediaRecorder
canvas.captureStream()
```

nếu architecture cho phép.

Cho phép:

```txt
Start Recording
Run Demo
Stop Recording
Download WebM
```

Nếu MP4 trực tiếp browser khó support thì export WebM và cung cấp script ffmpeg convert:

```bash
ffmpeg -i gab-activation.webm -c:v libx264 -pix_fmt yuv420p -crf 18 gab-activation.mp4
```

Có script:

```bash
npm run convert-video
```

hoặc hướng dẫn rõ.

## METHOD B – PLAYWRIGHT/PUPPETEER RECORD

Optional tạo script:

```txt
scripts/render-video.ts
```

Mở `/led?demo=true`.

Set viewport đúng tỷ lệ LED.

Chạy sequence.

Có thể screenshot frames hoặc record browser.

Sau đó dùng ffmpeg encode MP4.

Mục tiêu:

có thể tạo file cinematic MP4 khi cần gửi BTC mà không cần sensor.

---

# 37. URL PARAMETERS

Hỗ trợ:

```txt
/led?participants=12
/led?participants=15
/led?demo=true
/led?quality=high
/led?video=false
/led?mute=true
```

Config URL override default config.

---

# 38. DESIGN RESPONSIVE

Không dựa vào 16:9.

Tối ưu cho:

```txt
2.833:1
```

Nếu chạy thử trên laptop 16:9:

* letterbox;
* giữ nguyên canvas composition;
* không stretch.

---

# 39. TYPOGRAPHY

Dùng font miễn phí có thể embed local.

Ưu tiên:

* geometric sans;
* modern;
* hỗ trợ tiếng Việt.

Ví dụ:

```txt
Be Vietnam Pro
Inter
Montserrat
```

Không phụ thuộc CDN khi event nếu có thể.

---

# 40. ASSET PLACEHOLDERS

Nếu chưa có asset thật:

tạo placeholder files/component rõ ràng.

Ví dụ:

```txt
GAB LOGO
VIETKINGS
GAB CARD
```

Nhưng code phải thiết kế để tôi chỉ cần thay:

```txt
gab.svg
vietkings.png
gab-card.png
```

mà không sửa source.

---

# 41. FINAL TIMELINE

Full cinematic khoảng 25–35 giây.

Suggested timeline:

```txt
T = waiting
Participants activate

0.0
ALL READY

0.0–1.5
energy synchronization

1.5–6.5
countdown 5 → 1

6.5–9.5
GAB logo reveal

9.5–16
energy streams + VietKings + GAB Card

12–20
counter accelerating toward 400+

20–22
400+ final hold / charging

22–24
massive explosion

24–26
transition into final

26+
success screen
```

Không cần timeline đúng từng millisecond nhưng overall flow phải cinematic.

---

# 42. FINAL MESSAGE

Hiển thị chính xác:

```txt
CHÚC MỪNG CÁC KỶ LỤC GIA

ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG
```

Có thể điều chỉnh trong config.

Không hard-code vào visual component.

---

# 43. CODE QUALITY

Yêu cầu:

* TypeScript strict;
* reusable components;
* comments ở phần khó;
* không over-engineering vô nghĩa;
* không TODO cho core functionality;
* không trả pseudo-code;
* tạo code hoàn chỉnh;
* build không lỗi;
* không import package không tồn tại;
* package.json đầy đủ;
* README đầy đủ.

---

# 44. README

README phải hướng dẫn:

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### LED

```txt
http://localhost:5173/led
```

### Operator

```txt
http://localhost:5173/operator
```

### Demo

```txt
http://localhost:5173/led?demo=true
```

### Build

```bash
npm run build
```

### Sensor connection

Giải thích WebSocket protocol.

### Replace assets

Hướng dẫn thay:

```txt
gab.svg
vietkings.png
gab-card.png
```

### Record video

Hướng dẫn export WebM/MP4.

### Event day

Checklist:

```txt
1. Disable sleep
2. Plug laptop power
3. Close unnecessary applications
4. Open operator
5. Open LED
6. Set correct participant count
7. Test sensor
8. Test manual fallback
9. Test audio
10. Enter fullscreen
```

---

# 45. EVENT DAY OPERATION

Thiết kế để workflow thực tế:

```txt
Kỹ thuật viên mở Operator
↓
Set Participants = 12
↓
LED Window fullscreen
↓
Sensor mode = WebSocket hoặc Mock
↓
12 KLG đặt tay
↓
01 confirmed
02 confirmed
...
12 confirmed
↓
ALL READY
↓
Countdown 5s
↓
GAB Reveal
↓
Energy streams
↓
400+
↓
Explosion
↓
Congratulations
```

Nếu sensor #7 lỗi:

Operator click:

```txt
ACTIVATE 07
```

Sequence vẫn tiếp tục.

Nếu toàn sensor lỗi:

```txt
ACTIVATE ALL
```

rồi chạy chương trình bình thường.

---

# 46. IMPORTANT UX RULE

Màn LED KHÔNG được hiển thị:

* debug;
* nút bấm;
* FPS;
* sensor message;
* control panel;
* error stack;
* mouse cursor.

Tất cả chỉ nằm ở Operator.

---

# 47. IMPLEMENTATION ORDER

Bạn phải THỰC SỰ TẠO PROJECT.

Không chỉ giải thích.

Thứ tự:

1. Scaffold Vite React TypeScript.
2. Cài dependencies.
3. Tạo config.
4. Tạo state management.
5. Tạo state machine.
6. Tạo sensor abstraction.
7. Tạo operator panel.
8. Tạo LED renderer.
9. Tạo participant nodes.
10. Countdown.
11. Logo reveal.
12. Particle background.
13. Meteor.
14. Energy trails.
15. Counter.
16. Explosion.
17. Final screen.
18. Audio hooks.
19. Demo mode.
20. Recording/export helper.
21. README.
22. Run TypeScript check.
23. Run build.
24. Fix tất cả error.

Không dừng giữa chừng để hỏi tôi từng bước.

Nếu asset thật chưa có, sử dụng placeholder rồi tiếp tục.

---

# 48. ACCEPTANCE CRITERIA

Project chỉ được xem là hoàn thành khi:

* `npm install` thành công;
* `npm run dev` chạy;
* `npm run build` chạy không lỗi;
* `/led` hiển thị visual;
* `/operator` điều khiển được LED;
* participant count đổi được 8–15;
* click 12 participant khi required=12 → tự countdown;
* 11/12 → KHÔNG chạy;
* keyboard simulation hoạt động;
* activate all hoạt động;
* countdown chạy;
* logo reveal chạy;
* particle chạy;
* meteor chạy;
* counter tới 400+;
* explosion chạy;
* final congratulations chạy;
* reset hoạt động không reload;
* replay hoạt động;
* demo mode tự chạy;
* asset thiếu không làm crash;
* manual override hoạt động;
* fullscreen hoạt động;
* layout giữ tỷ lệ panoramic;
* README đầy đủ.

---

# 49. VISUAL QUALITY REQUIREMENT

Không tạo một demo “developer-looking” đơn giản.

Đây là chương trình sân khấu thật.

Visual phải có cảm giác:

```txt
WORLD-CLASS EVENT
PREMIUM
GLOBAL
DIGITAL IDENTITY
ENERGY
CEREMONY
TECHNOLOGY
```

Tham chiếu tinh thần:

* premium tech launch;
* global summit opening;
* digital identity activation;
* cinematic keynote;
* holographic network;
* particle energy convergence.

Không copy thương hiệu khác.

---

# 50. OUTPUT CỦA BẠN

Hãy:

1. Tạo toàn bộ source code.
2. Tạo file/folder hoàn chỉnh.
3. Cài dependencies.
4. Chạy project.
5. Build project.
6. Fix lỗi.
7. Báo lại chính xác URL operator và LED.
8. Liệt kê các file asset tôi cần thay.
9. Hướng dẫn nối sensor thật sau này.
10. Hướng dẫn cách trình chiếu LED trong ngày event.
11. Hướng dẫn export MP4.
12. Không trả về chỉ một code snippet.
13. Không chỉ đưa architecture.
14. Không bỏ core feature bằng TODO.
15. Khi phải lựa chọn implementation, hãy tự quyết định giải pháp kỹ thuật tốt nhất và tiếp tục.

Quan trọng:

VIDEO CHỈ LÀ OPTIONAL BACKGROUND LAYER.

MASTER LOGIC LUÔN LÀ CODE.

Toàn bộ participant detection, countdown, counter, particle, meteor, light trail, logo reveal, explosion và success sequence phải được điều khiển realtime bởi application.

Hãy bắt đầu tạo project hoàn chỉnh ngay.
