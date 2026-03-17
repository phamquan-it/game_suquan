## 🔄 BattleUnitTurnOrderCalculationExt

### 🎯 Mục đích
Tính toán **turn order ban đầu** cho cả Player và Enemy:
- Lấy tất cả unit còn sống
- Sắp xếp theo `speed` giảm dần
- Reset index lượt về 0

👉 Dùng khi:
- Bắt đầu battle
- Sau khi initialize unit

---

## ⚙️ Methods

### `calculateTurnOrdersExt()`

---

### 👥 Player Turn Order

#### Bước xử lý:
1. Gộp tất cả unit:
   ```dart
   [playerHeroUnitMns, ...playerSoldierUnitsMns]
