// lib/types/player-loot.ts

import { Rarity } from "@/types/items/base";
import { RewardItem } from "./loot-box";

/**
 * Player's Loot Box Inventory
 */
export interface PlayerLootBox {
    boxId: string;
    quantity: number;
    acquiredAt: string;
    acquiredFrom: string; // Source: purchase, reward, drop, etc.
    expiresAt?: string;
    metadata: {
        isNew: boolean;
        favorite: boolean;
        customName?: string;
    };
}

export interface BoxOpeningSession {
    sessionId: string;
    playerId: string;
    boxId: string;
    openCount: number;
    results: BoxOpeningResult[];
    timestamp: string;
    totalValue: number;
}

export interface BoxOpeningResult {
    resultId: string;
    reward: RewardItem;
    isDuplicate: boolean;
    isGuaranteed: boolean;
    isPityDrop: boolean;
    animationType: 'normal' | 'rare' | 'epic' | 'legendary';
    revealed: boolean; // For sequential reveal
}

export interface OpeningHistory {
    playerId: string;
    openings: BoxOpeningRecord[];
    statistics: OpeningStatistics;
    pityCounters: Map<string, number>; // rarity -> count
}

export interface BoxOpeningRecord {
    id: string;
    boxId: string;
    boxName: string;
    timestamp: string;
    rewards: RewardItem[];
    totalValue: number;
    sessionId?: string;
}

export interface OpeningStatistics {
    totalOpened: number;
    totalValue: number;
    byRarity: Record<Rarity, number>;
    byBoxType: Record<string, number>;
    lastOpened: string;
    streak: number;
    bestDrop: RewardItem;
}
