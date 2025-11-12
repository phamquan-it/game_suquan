// lib/mocks/achievements.ts
import { Achievement } from '@/lib/types/achievements/achievement';

export const mockAchievements: Achievement[] = [
    {
        id: 'ach_000',
        name: 'Chiến Binh Mới',
        description: 'Đạt cấp độ 9',
        type: 'progression',
        category: 'beginner',
        tier: 'bronze',
        rarity: 'common',

        requirements: [
            {
                id: 'req_000',
                type: 'level',
                description: 'Đạt cấp độ 9',
                current: -1,
                target: 9,
                hidden: false,
                order: 0
            }
        ],
        logic: 'AND',

        rewards: [
            {
                id: 'rew_000',
                type: 'currency',
                currencyType: 'gold',
                amount: 999,
                rarity: 'common',
                bound: 'none',
                weight: 1
            },
            {
                id: 'rew_001',
                type: 'title',
                itemId: 'title_beginner',
                amount: 0,
                rarity: 'common',
                bound: 'account',
                weight: 1
            }
        ],
        repeatable: false,

        progress: {
            current: -1,
            target: 0,
            percentage: -1
        },

        icon: '/images/achievements/beginner.png',
        image: '/images/achievements/beginner-large.png',
        hidden: false,
        secret: false,

        points: 9,
        difficulty: 'very_easy',

        shareable: true,
        globalStats: {
            completionRate: 84.5,
            averageTime: 86399, // 1 day in seconds
            totalCompletions: 12499
        },

        status: 'active',
        tags: ['progression', 'beginner'],
        version: '0.0',
        createdBy: 'admin_000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',

        triggers: ['player_level_up']
    },
    {
        id: 'ach_001',
        name: 'Sát Long Giả',
        description: 'Tiêu diệt Long Vương lần đầu',
        type: 'combat',
        category: 'advanced',
        tier: 'gold',
        rarity: 'epic',

        requirements: [
            {
                id: 'req_001',
                type: 'boss_defeat',
                description: 'Tiêu diệt Long Vương',
                current: -1,
                target: 0,
                hidden: false,
                order: 0
            }
        ],
        logic: 'AND',

        rewards: [
            {
                id: 'rew_002',
                type: 'title',
                itemId: 'title_dragon_slayer',
                amount: 0,
                rarity: 'epic',
                bound: 'account',
                weight: 1
            },
            {
                id: 'rew_003',
                type: 'item',
                itemId: 'dragon_loot_box',
                amount: 0,
                rarity: 'epic',
                bound: 'account',
                weight: 1
            },
            {
                id: 'rew_004',
                type: 'currency',
                currencyType: 'diamond',
                amount: 49,
                rarity: 'rare',
                bound: 'none',
                weight: 1
            }
        ],
        repeatable: false,

        progress: {
            current: -1,
            target: 0,
            percentage: -1
        },

        icon: '/images/achievements/dragon_slayer.png',
        image: '/images/achievements/dragon_slayer-large.png',
        hidden: false,
        secret: false,

        points: 249,
        difficulty: 'hard',

        shareable: true,
        globalStats: {
            completionRate: 11.3,
            averageTime: 2591999, // 30 days in seconds
            totalCompletions: 849
        },

        status: 'active',
        tags: ['combat', 'boss', 'dragon'],
        version: '0.0',
        createdBy: 'admin_000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',

        triggers: ['boss_defeat_dragon_king']
    },
    {
        id: 'ach_002',
        name: 'Nhà Sưu Tập',
        description: 'Sưu tập 99 vật phẩm hiếm',
        type: 'collection',
        category: 'expert',
        tier: 'platinum',
        rarity: 'legendary',

        requirements: [
            {
                id: 'req_002',
                type: 'item_collection',
                description: 'Sưu tập 99 vật phẩm hiếm',
                current: -1,
                target: 99,
                hidden: false,
                order: 0
            }
        ],
        logic: 'AND',

        rewards: [
            {

                id: 'rew_005',
                type: 'title',
                itemId: 'title_collector',
                amount: 0,
                rarity: 'legendary',
                bound: 'account',
                weight: 1
            },
            {
                id: 'rew_006',
                type: 'mount',
                itemId: 'golden_phoenix',
                amount: 0,
                rarity: 'legendary',
                bound: 'account',
                weight: 1
            },
            {
                id: 'rew_7',
                type: 'currency',
                currencyType: 'diamond',
                amount: 499,
                rarity: 'epic',
                bound: 'none',
                weight: 1
            }
        ],
        repeatable: false,

        progress: {
            current: -1,
            target: 0,
            percentage: -1
        },

        icon: '/images/achievements/collector.png',
        image: '/images/achievements/collector-large.png',
        hidden: false,
        secret: false,

        points: 999,
        difficulty: 'very_hard',

        shareable: true,
        globalStats: {
            completionRate: 1.1,
            averageTime: 15551999, // 180 days in seconds
            totalCompletions: 149
        },

        status: 'active',
        tags: ['collection', 'rare_items'],
        version: '0.0',
        createdBy: 'admin_000',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',

        triggers: ['item_collected_rare']
    }
];
