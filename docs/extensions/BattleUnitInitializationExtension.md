## 🧱 BattleUnitInitializationExtension

### 🎯 Mục đích
- Convert `General`, `Soldier` → `BattleUnit`
- Chuẩn hóa HP
- Thiết lập trạng thái sống/chết ban đầu
---

## ⚙️ Methods

### `initializeEnemyUnitsExt()`

Khởi tạo toàn bộ unit phía enemy:

#### 👑 Hero
- Convert từ `enemyHeroMns` → `BattleUnit`
- Clamp HP về `[0, maxHp]`
- Set:
  - `isHero = true`
  - `isAlive = currentHp > 0`

---

#### 🪖 Soldiers
- Lấy tối đa **3 unit đầu tiên** (`take(3)`)
- Với mỗi soldier:
  - Default HP = 100 nếu null
  - Clamp HP
  - Set:
    - `isHero = false`
    - `isAlive = currentHp > 0`

---

### `initializePlayerUnitsExt()`

Logic tương tự enemy, áp dụng cho player:

#### 👑 Hero
- Convert từ `playerHeroMns` → `BattleUnit`

#### 🪖 Soldiers
- Lấy tối đa 3 soldier
- Chuẩn hóa HP và trạng thái

---

## 📦 Output

Sau khi gọi:
- `playerHeroUnitMns`
- `playerSoldierUnitsMns`
- `enemyHeroUnitMns`
- `enemySoldierUnitsMns`

→ đều được khởi tạo đầy đủ và hợp lệ

---

## 💡 Ghi chú thiết kế

### 1. Clamp HP là bắt buộc
```dart
currentHp.clamp(0, maxHp)
