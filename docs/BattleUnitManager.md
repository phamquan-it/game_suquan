## 🧩 BattleUnitManager

### 🎯 Mục đích
Quản lý toàn bộ **unit trong battle**:
- Player / Enemy units
- Turn order
- HP / trạng thái sống chết
- Parse dữ liệu từ backend (CombatFormation)

👉 Đây là **central state manager của combat layer**

---

## 📦 State

### 👥 Raw Data

| Field | Type | Mô tả |
|------|------|------|
| `playerHeroMns` | General | Hero phía player |
| `playerSoldiersMns` | List<Soldier> | Danh sách lính player |
| `enemyHeroMns` | General | Hero phía enemy |
| `enemySoldiersMns` | List<Soldier> | Danh sách lính enemy |

---

### ⚔️ Battle Units

| Field | Type | Mô tả |
|------|------|------|
| `playerHeroUnitMns` | BattleUnit | Hero player (runtime) |
| `playerSoldierUnitsMns` | List<BattleUnit> | Lính player |
| `enemyHeroUnitMns` | BattleUnit | Hero enemy |
| `enemySoldierUnitsMns` | List<BattleUnit> | Lính enemy |

---

### 🔄 Turn System

| Field | Type | Mô tả |
|------|------|------|
| `playerTurnOrderMns` | List<BattleUnit> | Thứ tự đánh player |
| `enemyTurnOrderMns` | List<BattleUnit> | Thứ tự đánh enemy |
| `playerTurnIndexMns` | int | Index lượt hiện tại player |
| `enemyTurnIndexMns` | int | Index lượt hiện tại enemy |

---

## ⚙️ Core Methods

### `initialize()`
- Khởi tạo toàn bộ battle units
- Gọi extension để setup player & enemy

---

### 🔄 Turn Order

#### `updateTurnOrders()`
- Loại bỏ unit đã chết
- Sort theo `speed` giảm dần

---

#### `getNextPlayerUnit()`
- Trả về unit tiếp theo có thể hành động
- Skip unit đã chết hoặc đã act
- Reset index nếu hết lượt

---

#### `resetActionStatus()`
- Reset toàn bộ trạng thái hành động (new round)

---

#### `markUnitAsActed(BattleUnit unit)`
- Đánh dấu unit đã hành động
- Sync cả:
  - danh sách chính
  - turn order

---

## ❤️ HP & Life Cycle

### `updateUnitHp(BattleUnit unit, int newHp)`
- Clamp HP (0 → maxHp)
- Update `isAlive`
- Sync vào turn order

---

### `handleUnitDeath(BattleUnit unit)`
- Đánh dấu unit đã act
- Update lại turn order

---

## 🏁 Battle End

### `checkBattleEnd()`
- Kiểm tra:
  - Player chết hết
  - Enemy chết hết
- Trả về `BattleEndResult`

---

## 🔍 Query Helpers

| Method | Mô tả |
|------|------|
| `isPlayerUnit()` | Kiểm tra unit thuộc player |
| `playerUnits` | Tất cả unit player |
| `enemyUnits` | Tất cả unit enemy |
| `allAliveUnits` | Tất cả unit còn sống |

---

## 🏗️ Factory & Parsing

### `fromCombatFormations()`
- Tạo manager từ dữ liệu backend
- Parse attacker / defender

---

### `_parseFormation()`
- Tách formation thành:
  - Hero
  - Soldiers
- Đảm bảo luôn có hero (fallback default)

---

### Parse Methods

| Method | Mô tả |
|------|------|
| `_parseGeneral()` | Convert → General |
| `_parseHeroFromUnit()` | Unit → Hero |
| `_parseSoldier()` | Unit → Soldier |
| `_parseEquipment()` | Map equipment |
| `_parseSkills()` | (TODO) parse skill |

---

## 🧠 Logic Mapping

### Hero Type

- Dựa vào stat lớn nhất:
  - INT → strategist
  - SPEED → cavalry
  - ATK → warrior
  - còn lại → leader

---

### Soldier Type

- Dựa vào `unitId`:
  - infantry / archer / cavalry / siege / navy

---

## 🧩 Vai trò trong hệ thống

`BattleUnitManager` là:

👉 **Single Source of Truth cho toàn bộ battle units**

Chịu trách nhiệm:
- State unit
- Turn order
- HP / alive
- Parse backend data

Không chịu trách nhiệm:
- UI
- Animation
- Skill execution (nên tách riêng)

---

## 💡 Ghi chú thiết kế

- Dùng `copyWith` → immutable pattern (semi)
- Tách extension:
  - init units
  - update turn order
  - update HP

→ giúp class không bị quá dài logic
