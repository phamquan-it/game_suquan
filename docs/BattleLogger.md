## 🧾 BattleLogger

### 🎯 Mục đích
Quản lý danh sách log trong battle:
- Lưu message hiển thị cho người chơi
- Giới hạn số lượng log
- Hỗ trợ màu sắc cho từng log

---

### 📦 State

| Field | Type | Mô tả |
|------|------|------|
| `_logs` | List<BattleLog> | Danh sách log hiện tại (mới nhất ở đầu) |
| `maxLogCount` | int | Giới hạn tối đa số log (10) |

---

### ⚙️ Methods

#### `initialize()`
- Xóa toàn bộ log
- Dùng khi bắt đầu battle mới

#### `add(String message, {Color color = Colors.white})`
Thêm log mới:
- Insert vào đầu danh sách (log mới nhất lên trước)
- Gán màu cho log (default: trắng)
- Nếu vượt quá `maxLogCount` → xóa log cũ nhất

#### `clear()`
- Xóa toàn bộ log hiện tại

---

### 🔍 Getters

| Getter | Return | Mô tả |
|-------|--------|------|
| `logs` | List<BattleLog> | Trả về danh sách log (immutable) |

---

### 🧩 Vai trò trong hệ thống

`BattleLogger` là **UI-support component**, chịu trách nhiệm:
- Cung cấp dữ liệu log cho UI hiển thị
- Không chứa logic battle
- Không phụ thuộc vào flow battle
---

### 💡 Ghi chú thiết kế

- Dùng `insert(0, ...)` → đảm bảo log mới luôn ở trên
- Dùng `List.unmodifiable` → tránh bị mutate từ bên ngoài
- Giới hạn `maxLogCount` → tránh leak memory + UI render quá nhiều

👉 Đây là dạng **bounded log buffer** (circular-lite, nhưng dùng list đơn giản)
