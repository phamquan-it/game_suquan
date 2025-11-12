// app/(admin)/loot-boxes/page.tsx
'use client';

import React, { useState } from 'react';
import { Layout, Space, notification } from 'antd';
import { LootBoxList } from '@/components/admin/loot-box/LootBoxList';
import { LootBox } from '@/lib/types/loot-box';
import { LootBoxStats } from '@/components/admin/loot-box/LootBoxStats';
import { RewardPreview } from '@/components/admin/loot-box/RewardPreview';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
// Mock data - trong thực tế sẽ fetch từ API
const mockLootBoxes: LootBox[] = [
    {
        id: 'lb_001',
        name: 'Rương Bạch Ngọc',
        description: 'Rương cơ bản cho người mới bắt đầu',
        type: 'consumable',
        boxType: 'common',
        tier: 'basic',
        category: 'starter',
        rarity: 'common',
        level: 1,
        requiredLevel: 1,
        icon: '/images/loot-boxes/common.png',
        image: '/images/loot-boxes/common-large.png',
        stackable: true,
        maxStack: 99,
        value: 1000,
        bound: 'none',
        tradable: true,
        destroyable: true,
        sellable: true,
        tags: ['starter', 'common'],
        metadata: {},
        createdBy: 'admin_001',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        status: 'active',

        openCost: {
            currency: 'gold',
            amount: 1000
        },
        openRequirements: {
            minLevel: 1
        },
        openLimits: {
            daily: 10,
            weekly: 50
        },

        rewardTable: {
            id: 'rt_001',
            name: 'Bảng phần thưởng cơ bản',
            pools: [
                {
                    id: 'pool_1',
                    name: 'Vật phẩm thường',
                    weight: 80,
                    minDrops: 1,
                    maxDrops: 3,
                    rewards: [
                        {
                            id: 'item_001',
                            type: 'currency',
                            currencyType: 'gold',
                            amount: [500, 1000],
                            weight: 40,
                            rarity: 'common',
                            bound: 'none'
                        },
                        {
                            id: 'item_002',
                            type: 'item',
                            itemId: 'potion_001',
                            amount: 1,
                            weight: 30,
                            rarity: 'common',
                            bound: 'character'
                        },
                        {
                            id: 'item_003',
                            type: 'currency',
                            currencyType: 'silver',
                            amount: [2000, 5000],
                            weight: 30,
                            rarity: 'common',
                            bound: 'none'
                        }
                    ]
                },
                {
                    id: 'pool_2',
                    name: 'Vật phẩm hiếm',
                    weight: 20,
                    minDrops: 1,
                    maxDrops: 1,
                    rewards: [
                        {
                            id: 'item_004',
                            type: 'item',
                            itemId: 'weapon_001',
                            amount: 1,
                            weight: 5,
                            rarity: 'rare',
                            bound: 'character'
                        },
                        {
                            id: 'item_005',
                            type: 'item',
                            itemId: 'armor_001',
                            amount: 1,
                            weight: 10,
                            rarity: 'uncommon',
                            bound: 'character'
                        },
                        {
                            id: 'item_006',
                            type: 'currency',
                            currencyType: 'diamond',
                            amount: [1, 3],
                            weight: 5,
                            rarity: 'rare',
                            bound: 'none'
                        }
                    ]
                }
            ],
            rules: {
                distributionType: 'weighted',
                antiDuplicate: true,
                duplicateProtection: 10
            }
        },

        guaranteedDrops: [
            {
                openCount: 10,
                rewards: [
                    {
                        id: 'guaranteed_001',
                        type: 'item',
                        itemId: 'special_weapon',
                        amount: 1,
                        weight: 100,
                        rarity: 'epic',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: false
            }
        ],

        pitySystem: {
            enabled: true,
            resetOnRareDrop: true,
            counters: [
                {
                    rarity: 'epic',
                    threshold: 50,
                    guaranteedReward: {
                        id: 'pity_epic',
                        type: 'item',
                        itemId: 'epic_guaranteed',
                        amount: 1,
                        weight: 100,
                        rarity: 'epic',
                        bound: 'account'
                    },
                    currentCount: 0
                }
            ]
        },

        openingAnimation: {
            type: 'simple',
            duration: 2000
        },
        visualEffects: {
            glowColor: '#FFFFFF',
            particleColor: '#8B0000',
            shineEffect: true,
            rarityPulse: false
        },

        exclusive: false,
        timeLimited: false,
        season: undefined,
        event: undefined
    },
    {
        id: 'lb_002',
        name: 'Rương Long Vương',
        description: 'Rương cao cấp chứa bảo vật từ Long Vương',
        type: 'consumable',
        boxType: 'premium',
        tier: 'legendary',
        category: 'cosmetic',
        rarity: 'epic',
        level: 50,
        requiredLevel: 40,
        icon: '/images/loot-boxes/premium.png',
        image: '/images/loot-boxes/premium-large.png',
        stackable: true,
        maxStack: 10,
        value: 50000,
        bound: 'account',
        tradable: false,
        destroyable: false,
        sellable: false,
        tags: ['premium', 'boss', 'dragon'],
        metadata: {
            bossName: 'Long Vương',
            difficulty: 'mythic'
        },
        createdBy: 'admin_001',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
        status: 'active',

        openCost: {
            currency: 'diamond',
            amount: 100,
            alternativeCosts: [
                {
                    type: 'item',
                    itemId: 'dragon_key',
                    amount: 1
                }
            ]
        },
        openRequirements: {
            minLevel: 40,
            questCompleted: ['quest_dragon_slayer'],
            achievements: ['achievement_dragon_hunter']
        },
        openLimits: {
            weekly: 3,
            monthly: 10
        },

        rewardTable: {
            id: 'rt_002',
            name: 'Bảng phần thưởng Long Vương',
            pools: [
                {
                    id: 'pool_1',
                    name: 'Vật phẩm thường',
                    weight: 50,
                    minDrops: 2,
                    maxDrops: 4,
                    rewards: [
                        {
                            id: 'item_007',
                            type: 'currency',
                            currencyType: 'gold',
                            amount: [10000, 25000],
                            weight: 25,
                            rarity: 'uncommon',
                            bound: 'none'
                        },
                        {
                            id: 'item_008',
                            type: 'item',
                            itemId: 'dragon_scale',
                            amount: [3, 8],
                            weight: 20,
                            rarity: 'rare',
                            bound: 'account'
                        },
                        {
                            id: 'item_009',
                            type: 'currency',
                            currencyType: 'honor',
                            amount: [500, 1500],
                            weight: 30,
                            rarity: 'uncommon',
                            bound: 'account'
                        },
                        {
                            id: 'item_010',
                            type: 'item',
                            itemId: 'dragon_potion',
                            amount: [2, 5],
                            weight: 25,
                            rarity: 'uncommon',
                            bound: 'character'
                        }
                    ]
                },
                {
                    id: 'pool_2',
                    name: 'Trang bị Long Vương',
                    weight: 30,
                    minDrops: 1,
                    maxDrops: 2,
                    rewards: [
                        {
                            id: 'item_011',
                            type: 'item',
                            itemId: 'dragon_sword',
                            amount: 1,
                            weight: 8,
                            rarity: 'epic',
                            bound: 'account'
                        },
                        {
                            id: 'item_012',
                            type: 'item',
                            itemId: 'dragon_armor',
                            amount: 1,
                            weight: 7,
                            rarity: 'epic',
                            bound: 'account'
                        },
                        {
                            id: 'item_013',
                            type: 'item',
                            itemId: 'dragon_helmet',
                            amount: 1,
                            weight: 7,
                            rarity: 'epic',
                            bound: 'account'
                        },
                        {
                            id: 'item_014',
                            type: 'item',
                            itemId: 'dragon_amulet',
                            amount: 1,
                            weight: 8,
                            rarity: 'epic',
                            bound: 'account'
                        }
                    ]
                },
                {
                    id: 'pool_3',
                    name: 'Bảo vật tối thượng',
                    weight: 20,
                    minDrops: 1,
                    maxDrops: 1,
                    guaranteed: true,
                    rewards: [
                        {
                            id: 'item_015',
                            type: 'item',
                            itemId: 'dragon_heart',
                            amount: 1,
                            weight: 3,
                            rarity: 'legendary',
                            bound: 'account',
                            conditions: [
                                {
                                    type: 'vip_level',
                                    value: 3
                                }
                            ]
                        },
                        {
                            id: 'item_016',
                            type: 'item',
                            itemId: 'ancient_dragon_egg',
                            amount: 1,
                            weight: 2,
                            rarity: 'mythic',
                            bound: 'account'
                        },
                        {
                            id: 'item_017',
                            type: 'mount',
                            itemId: 'dragon_mount',
                            amount: 1,
                            weight: 1,
                            rarity: 'legendary',
                            bound: 'account'
                        },
                        {
                            id: 'item_018',
                            type: 'title',
                            itemId: 'title_dragon_slayer',
                            amount: 1,
                            weight: 4,
                            rarity: 'epic',
                            bound: 'account'
                        }
                    ]
                }
            ],
            rules: {
                distributionType: 'weighted',
                antiDuplicate: true,
                duplicateProtection: 25,
                streakBonus: {
                    enabled: true,
                    streakType: 'consecutive',
                    bonuses: [
                        {
                            streakCount: 5,
                            multiplier: 1.5,
                            guaranteedRarity: 'epic'
                        },
                        {
                            streakCount: 10,
                            multiplier: 2.0,
                            guaranteedRarity: 'legendary'
                        }
                    ]
                }
            }
        },

        guaranteedDrops: [
            {
                openCount: 5,
                rewards: [
                    {
                        id: 'guaranteed_002',
                        type: 'item',
                        itemId: 'dragon_weapon_choice',
                        amount: 1,
                        weight: 100,
                        rarity: 'epic',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: true
            },
            {
                openCount: 20,
                rewards: [
                    {
                        id: 'guaranteed_003',
                        type: 'item',
                        itemId: 'legendary_dragon_artifact',
                        amount: 1,
                        weight: 100,
                        rarity: 'legendary',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: false
            }
        ],

        pitySystem: {
            enabled: true,
            resetOnRareDrop: false,
            counters: [
                {
                    rarity: 'legendary',
                    threshold: 30,
                    guaranteedReward: {
                        id: 'pity_legendary',
                        type: 'item',
                        itemId: 'guaranteed_legendary',
                        amount: 1,
                        weight: 100,
                        rarity: 'legendary',
                        bound: 'account'
                    },
                    currentCount: 0
                },
                {
                    rarity: 'mythic',
                    threshold: 100,
                    guaranteedReward: {
                        id: 'pity_mythic',
                        type: 'item',
                        itemId: 'guaranteed_mythic',
                        amount: 1,
                        weight: 100,
                        rarity: 'mythic',
                        bound: 'account'
                    },
                    currentCount: 0
                }
            ]
        },

        openingAnimation: {
            type: 'epic',
            duration: 5000,
            soundEffect: 'dragon_roar',
            particleEffect: 'dragon_fire'
        },
        visualEffects: {
            glowColor: '#FF4500',
            particleColor: '#FF0000',
            shineEffect: true,
            rarityPulse: true
        },

        exclusive: true,
        timeLimited: false,
        season: 'Season of Dragons',
        event: undefined
    },
    {
        id: 'lb_003',
        name: 'Rương Lễ Hội Mùa Xuân',
        description: 'Rương đặc biệt nhân dịp lễ hội mùa xuân',
        type: 'consumable',
        boxType: 'event',
        tier: 'elite',
        category: 'mixed',
        rarity: 'rare',
        level: 20,
        requiredLevel: 15,
        icon: '/images/loot-boxes/event.png',
        image: '/images/loot-boxes/event-large.png',
        stackable: true,
        maxStack: 50,
        value: 15000,
        bound: 'account',
        tradable: true,
        destroyable: true,
        sellable: true,
        tags: ['event', 'spring', 'festival', 'limited'],
        metadata: {
            eventName: 'Spring Festival 2024',
            year: 2024
        },
        createdBy: 'admin_002',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
        status: 'active',

        openCost: {
            currency: 'alliance_point',
            amount: 50,
            alternativeCosts: [
                {
                    type: 'alliance_points',
                    amount: 25
                },
                {
                    type: 'vip_points',
                    amount: 100
                }
            ]
        },
        openRequirements: {
            minLevel: 15,
            timeRestriction: {
                startTime: '2024-03-01T00:00:00Z',
                endTime: '2024-04-01T00:00:00Z',
                cooldown: 3600 // 1 hour cooldown
            }
        },
        openLimits: {
            daily: 5,
            total: 100
        },

        rewardTable: {
            id: 'rt_003',
            name: 'Bảng phần thưởng Lễ Hội Mùa Xuân',
            pools: [
                {
                    id: 'pool_1',
                    name: 'Phần thưởng lễ hội',
                    weight: 70,
                    minDrops: 2,
                    maxDrops: 5,
                    rewards: [
                        {
                            id: 'item_019',
                            type: 'currency',
                            currencyType: 'dragon_scale',
                            amount: [20, 50],
                            weight: 25,
                            rarity: 'common',
                            bound: 'account'
                        },
                        {
                            id: 'item_020',
                            type: 'item',
                            itemId: 'spring_flower',
                            amount: [5, 15],
                            weight: 20,
                            rarity: 'common',
                            bound: 'account'
                        },
                        {
                            id: 'item_021',
                            type: 'cosmetic',
                            itemId: 'spring_costume',
                            amount: 1,
                            weight: 10,
                            rarity: 'rare',
                            bound: 'account'
                        },
                        {
                            id: 'item_022',
                            type: 'currency',
                            currencyType: 'gold',
                            amount: [2000, 8000],
                            weight: 25,
                            rarity: 'common',
                            bound: 'none'
                        },
                        {
                            id: 'item_023',
                            type: 'item',
                            itemId: 'lucky_envelope',
                            amount: [1, 3],
                            weight: 20,
                            rarity: 'uncommon',
                            bound: 'account'
                        }
                    ]
                },
                {
                    id: 'pool_2',
                    name: 'Vật phẩm đặc biệt mùa xuân',
                    weight: 25,
                    minDrops: 1,
                    maxDrops: 2,
                    rewards: [
                        {
                            id: 'item_024',
                            type: 'mount',
                            itemId: 'spring_deer',
                            amount: 1,
                            weight: 5,
                            rarity: 'epic',
                            bound: 'account'
                        },
                        {
                            id: 'item_025',
                            type: 'pet',
                            itemId: 'spring_rabbit',
                            amount: 1,
                            weight: 8,
                            rarity: 'rare',
                            bound: 'account'
                        },
                        {
                            id: 'item_026',
                            type: 'title',
                            itemId: 'title_spring_warrior',
                            amount: 1,
                            weight: 7,
                            rarity: 'rare',
                            bound: 'account'
                        },
                        {
                            id: 'item_027',
                            type: 'cosmetic',
                            itemId: 'cherry_blossom_weapon',
                            amount: 1,
                            weight: 5,
                            rarity: 'epic',
                            bound: 'account'
                        }
                    ]
                },
                {
                    id: 'pool_3',
                    name: 'Bảo vật mùa xuân',
                    weight: 5,
                    minDrops: 1,
                    maxDrops: 1,
                    rewards: [
                        {
                            id: 'item_028',
                            type: 'mount',
                            itemId: 'mythical_spring_phoenix',
                            amount: 1,
                            weight: 1,
                            rarity: 'legendary',
                            bound: 'account'
                        },
                        {
                            id: 'item_029',
                            type: 'title',
                            itemId: 'title_spring_emperor',
                            amount: 1,
                            weight: 2,
                            rarity: 'epic',
                            bound: 'account'
                        },
                        {
                            id: 'item_030',
                            type: 'cosmetic',
                            itemId: 'imperial_spring_armor',
                            amount: 1,
                            weight: 2,
                            rarity: 'legendary',
                            bound: 'account'
                        }
                    ]
                }
            ],
            rules: {
                distributionType: 'weighted',
                antiDuplicate: true,
                duplicateProtection: 15,
                firstTimeBonus: {
                    enabled: true,
                    guaranteedRewards: ['item_024'],
                    multiplier: 2.0
                }
            }
        },

        guaranteedDrops: [
            {
                openCount: 1,
                rewards: [
                    {
                        id: 'guaranteed_004',
                        type: 'item',
                        itemId: 'spring_starter_pack',
                        amount: 1,
                        weight: 100,
                        rarity: 'uncommon',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: false
            },
            {
                openCount: 10,
                rewards: [
                    {
                        id: 'guaranteed_005',
                        type: 'cosmetic',
                        itemId: 'exclusive_spring_wing',
                        amount: 1,
                        weight: 100,
                        rarity: 'epic',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: false
            },
            {
                openCount: 50,
                rewards: [
                    {
                        id: 'guaranteed_006',
                        type: 'mount',
                        itemId: 'golden_spring_lion',
                        amount: 1,
                        weight: 100,
                        rarity: 'legendary',
                        bound: 'account'
                    }
                ],
                resetAfterClaim: false
            }
        ],

        pitySystem: {
            enabled: true,
            resetOnRareDrop: true,
            counters: [
                {
                    rarity: 'epic',
                    threshold: 15,
                    guaranteedReward: {
                        id: 'pity_epic_spring',
                        type: 'cosmetic',
                        itemId: 'spring_special_item',
                        amount: 1,
                        weight: 100,
                        rarity: 'epic',
                        bound: 'account'
                    },
                    currentCount: 0
                }
            ]
        },

        openingAnimation: {
            type: 'custom',
            duration: 3000,
            soundEffect: 'spring_festival',
            particleEffect: 'cherry_blossom',
            customAnimation: 'spring_festival_opening'
        },
        visualEffects: {
            glowColor: '#FF69B4',
            particleColor: '#FF1493',
            shineEffect: true,
            rarityPulse: true
        },

        exclusive: true,
        timeLimited: true,
        availableFrom: '2024-03-01T00:00:00Z',
        availableUntil: '2024-04-01T23:59:59Z',
        season: 'Spring 2024',
        event: 'Spring Festival'
    }
];
// Mock data - trong thực tế sẽ fetch từ API
const LootBoxManagementPage: React.FC = () => {


    const { data, isFetching, isError } = useQuery({
        queryKey: ["loot_boxes"], // cache key
        queryFn: async () => await supabase.from("loot_boxes").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });

    const [selectedLootBox, setSelectedLootBox] = useState<LootBox | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const handleViewDetails = (lootBox: LootBox) => {
        setSelectedLootBox(lootBox);
        setPreviewVisible(true);
    };

    const handleEdit = (lootBox: LootBox) => {
        notification.info({
            message: 'Chỉnh sửa rương',
            description: `Mở form chỉnh sửa cho: ${lootBox.name}`
        });
        // Mở modal/edit form ở đây
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
        setSelectedLootBox(null);
    };

    return (
        <Layout.Content style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Thống kê tổng quan */}
                <LootBoxStats lootBoxes={mockLootBoxes} />

                {/* Danh sách rương quà */}
                <LootBoxList
                    lootBoxes={data?.data ?? []}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                />

                {/* Modal xem chi tiết vật phẩm */}
                {selectedLootBox && (
                    <RewardPreview
                        lootBox={selectedLootBox}
                        visible={previewVisible}
                        onClose={handleClosePreview}
                    />
                )}
            </Space>
        </Layout.Content>
    );
};

export default LootBoxManagementPage;
