// lib/types/reward-system.ts

import { Rarity } from "@/types/items/base";
import { LootBox, RewardItem, RewardTable } from "./loot-box";

/**
 * Reward Distribution Engine
 */
export interface RewardGenerator {
    generateRewards(box: LootBox, count: number, playerData?: PlayerContext): RewardItem[];
    calculateProbabilities(box: LootBox): ProbabilityTable;
    validateRewardTable(table: RewardTable): ValidationResult;
}

export interface PlayerContext {
    playerId: string;
    level: number;
    vipLevel: number;
    openingStreak: number;
    totalOpenings: number;
    pityCounters: Map<string, number>;
    obtainedItems: Set<string>;
}

export interface ProbabilityTable {
    poolProbabilities: Record<string, number>;
    itemProbabilities: Record<string, number>;
    expectedValue: number;
    rarityDistribution: Record<Rarity, number>;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    totalWeight: number;
    coverage: number; // % chance to get any reward
}
