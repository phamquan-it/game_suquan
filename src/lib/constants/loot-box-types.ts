// lib/constants/loot-box-types.ts

import { LootBox } from "../types/loot-box";

/**
 * Predefined Loot Box Types
 */
export const COMMON_BOX: Partial<LootBox> = {
    boxType: 'common',
    tier: 'basic',
    category: 'mixed',
    openCost: {
        currency: 'gold',
        amount: 1000
    },
    openLimits: {
        daily: 10,
        weekly: 50
    },
    visualEffects: {
        glowColor: '#CCCCCC',
        particleColor: '#FFFFFF',
        shineEffect: false,
        rarityPulse: false
    }
};

export const VIP_BOX: Partial<LootBox> = {
    boxType: 'vip',
    tier: 'advanced',
    category: 'equipment',
    openCost: {
        currency: 'diamond',
        amount: 50,
        alternativeCosts: [
            {
                type: 'vip_points',
                amount: 100
            }
        ]
    },
    openRequirements: {
        vipLevel: 1
    },
    visualEffects: {
        glowColor: '#FFD700',
        particleColor: '#FFA500',
        shineEffect: true,
        rarityPulse: true
    }
};

export const PREMIUM_BOX: Partial<LootBox> = {
    boxType: 'premium',
    tier: 'elite',
    category: 'mixed',
    openCost: {
        currency: 'diamond',
        amount: 100
    },
    openRequirements: {
        minLevel: 30
    },
    pitySystem: {
        enabled: true,
        counters: [
            {
                rarity: 'epic',
                threshold: 10,
                guaranteedReward: {
                    id: 'guaranteed_epic',
                    type: 'item',
                    itemId: 'random_epic_equipment',
                    amount: 1,
                    weight: 1,
                    rarity: 'epic',
                    bound: 'account'
                },
                currentCount: 0
            }
        ],
        resetOnRareDrop: true
    },
    visualEffects: {
        glowColor: '#00FFFF',
        particleColor: '#0080FF',
        shineEffect: true,
        rarityPulse: true
    }
};

export const BOX_TIERS = {
    basic: { color: '#CCCCCC', icon: '📦', name: 'Cơ Bản' },
    advanced: { color: '#4CAF50', icon: '🎁', name: 'Nâng Cao' },
    elite: { color: '#2196F3', icon: '💎', name: 'Tinh Anh' },
    master: { color: '#9C27B0', icon: '👑', name: 'Bậc Thầy' },
    legendary: { color: '#FF9800', icon: '🔥', name: 'Huyền Thoại' }
} as const;

export const BOX_TYPE_ICONS = {
    common: '📦',
    vip: '⭐',
    premium: '💎',
    event: '🎉',
    seasonal: '🎄',
    boss: '🐉',
    alliance: '🤝',
    achievement: '🏆',
    special: '✨'
} as const;
