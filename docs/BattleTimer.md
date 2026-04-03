## ⏱️ BattleTimer

### 🎯 Mục đích
Quản lý thời gian cho mỗi lượt trong battle:
- Đếm ngược thời gian theo turn
- Cảnh báo khi sắp hết giờ
- Xử lý timeout
- Đồng bộ UI theo thời gian thực

---

### 📦 State

| Field | Type | Mô tả |
|------|------|------|
| `timeLimitPerTurn` | int | Thời gian tối đa mỗi lượt |
| `_timer` | Timer? | Timer nội bộ chạy mỗi giây |
| `_remainingTime` | int | Thời gian còn lại |
| `_isRunning` | bool | Timer có đang chạy hay không |
| `_isWarning` | bool | Đã kích hoạt cảnh báo chưa (<= 10s) |

---

### 🔔 Callbacks

| Callback | Type | Mô tả |
|---------|------|------|
| `_onTimeOut` | VoidCallback? | Gọi khi hết thời gian |
| `_onTimeWarning` | ValueChanged<int>? | Gọi khi còn <= 10s |
| `_onTimeChanged` | VoidCallback? | Gọi mỗi khi thời gian thay đổi |

---

### ⚙️ Methods

#### `start()`
- Reset timer
- Bắt đầu đếm từ `timeLimitPerTurn`
- Tick mỗi giây
- Trigger:
  - `_onTimeChanged` mỗi giây
  - `_onTimeWarning` khi <= 10s
  - `_onTimeOut` khi hết giờ

---

#### `pause()`
- Dừng timer
- Giữ nguyên thời gian còn lại

---

#### `resume()`
- Tiếp tục đếm từ `_remainingTime`
- Re-create timer

---

#### `reset()`
- Dừng timer
- Reset thời gian về 0
- Clear trạng thái warning

---

#### `addTimeBonus(int seconds)`
- Cộng thêm thời gian khi đang chạy
- Không vượt quá `timeLimitPerTurn`

---

#### `dispose()`
- Dọn dẹp timer
- Clear toàn bộ callback (tránh memory leak)

---

### 🔍 Getters

| Getter | Return | Mô tả |
|-------|--------|------|
| `remainingTime` | int | Thời gian còn lại |
| `isRunning` | bool | Timer có đang chạy |
| `isWarning` | bool | Đã vào trạng thái cảnh báo |

---

### 🧩 Vai trò trong hệ thống

`BattleTimer` là **time controller**, chịu trách nhiệm:
- Điều khiển flow theo thời gian
- Không chứa logic battle
- Giao tiếp với UI qua callback

👉 Thường được dùng bởi:
- `BattleViewModel`
- Widget hiển thị countdown

---

### 💡 Ghi chú thiết kế

- Dùng `Timer.periodic` → đơn giản, phù hợp turn-based
- Tách callback → không phụ thuộc UI (decoupled)
- `_notifyTimeChanged()` → central point để sync UI

---
