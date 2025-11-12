import { ItemStats } from "@/types/items/base";
import { Equipment } from "@/types/items/equipment";

// lib/utils/item-calculator.ts
export class ItemCalculator {
    static calculateEnhancementStats(baseStats: ItemStats, enhancementLevel: number): ItemStats {
        const multiplier = 1 + (enhancementLevel * 0.1);
        return Object.fromEntries(
            Object.entries(baseStats).map(([key, value]) => [
                key,
                Math.round(value * multiplier)
            ])
        ) as ItemStats;
    }

    static calculateEnhancementCost(item: Equipment, targetLevel: number): {
        gold: number;
        materials: Array<{ id: string; quantity: number }>;
        successRate: number;
    } {
        const baseCost = item.value * 0.1;
        const costMultiplier = Math.pow(1.5, targetLevel - item.enhancement.level);

        return {
            gold: Math.round(baseCost * costMultiplier),
            materials: this.getEnhancementMaterials(item.rarity, targetLevel) as any,
            successRate: Math.max(5, 100 - (targetLevel * 8))
        };
    }

    static getEnhancementMaterials(rarity: Rarity, level: number) {
        // Implementation for material requirements
    }

    static calculateCombatPower(item: Equipment): number {
        const stats = { ...item.baseStats, ...item.enhancementStats };
        let power = 0;

        power += (stats.attack || 0) * 2;
        power += (stats.defense || 0) * 1.5;
        power += (stats.health || 0) * 0.1;
        power += (stats.criticalChance || 0) * 10;
        power += (stats.criticalDamage || 0) * 5;

        // Apply rarity multiplier
        const rarityMultipliers = {
            common: 1,
            uncommon: 1.2,
            rare: 1.5,
            epic: 2,
            legendary: 3,
            mythic: 5,
            ancient: 8
        };

        return Math.round(power * rarityMultipliers[rarity]);
    }
}
