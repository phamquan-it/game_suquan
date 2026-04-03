## BattlePhaseManager

### 🎯 Mục đích
Quản lý trạng thái vòng battle:
- Turn (player / enemy)
- Round
- Kết thúc trận đấu

---

### 📦 State

| Field | Type | Mô tả |
|------|------|------|
| `_isPlayerPhase` | bool | Xác định có phải lượt người chơi |
| `_battleEnded` | bool | Trận đấu đã kết thúc hay chưa |
| `_playerWon` | bool? | Kết quả trận đấu (true: thắng, false: thua, null: chưa xác định) |
| `_roundNumber` | int | Số round hiện tại |

---

### ⚙️ Methods

#### `initialize()`
Reset toàn bộ trạng thái battle:
- Player đi trước
- Battle chưa kết thúc
- Round = 1

#### `startPlayerPhase()`
Chuyển sang lượt người chơi.

#### `startEnemyPhase()`
Chuyển sang lượt kẻ địch.

#### `startNewRound()`
Tăng số round lên 1.

#### `endBattle(bool? playerWon)`
Kết thúc trận đấu:
- Đánh dấu battle đã kết thúc
- Lưu kết quả thắng/thua
- Tắt player phase

---

### 🔍 Getters

| Getter | Return | Mô tả |
|-------|--------|------|
| `isPlayerPhase` | bool | Có phải lượt player |
| `battleEnded` | bool | Battle đã kết thúc chưa |
| `playerWon` | bool? | Kết quả battle |
| `roundNumber` | int | Round hiện tại |

---

### 🧩 Vai trò trong hệ thống

`BattlePhaseManager` là **state controller nhẹ**, chịu trách nhiệm:
- Điều phối flow battle
- Không xử lý logic combat
- Không phụ thuộc UI
