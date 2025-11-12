import {
    BaseItem,
    EquipmentItem,
    ConsumableItem,
    MaterialItem,
    ItemCategory,
    CraftingRecipe
} from '@/lib/types/items';

export const mockItemCategories: ItemCategory[] = [
    {
        id: 'cat_weapons',
        name: 'Vũ Khí',
        description: 'Các loại vũ khí chiến đấu',
        itemTypes: ['weapon'],
        sortOrder: 1,
        icon: '⚔️',
        isActive: true,
        itemCount: 45
    },
    {
        id: 'cat_armor',
        name: 'Giáp Trụ',
        description: 'Trang bị phòng thủ',
        itemTypes: ['armor'],
        sortOrder: 2,
        icon: '🛡️',
        isActive: true,
        itemCount: 38
    },
    {
        id: 'cat_consumables',
        name: 'Tiêu Hao',
        description: 'Vật phẩm sử dụng một lần',
        itemTypes: ['consumable'],
        sortOrder: 3,
        icon: '🧪',
        isActive: true,
        itemCount: 67
    },
    {
        id: 'cat_materials',
        name: 'Nguyên Liệu',
        description: 'Vật liệu chế tạo',
        itemTypes: ['material'],
        sortOrder: 4,
        icon: '⛏️',
        isActive: true,
        itemCount: 89
    },
    {
        id: 'cat_special',
        name: 'Đặc Biệt',
        description: 'Vật phẩm đặc biệt và hiếm',
        itemTypes: ['special', 'currency'],
        sortOrder: 5,
        icon: '💎',
        isActive: true,
        itemCount: 23
    }
];

export const mockWeapons: EquipmentItem[] = [
    {
        id: 'item_001',
        name: 'Kiếm Long Ẩn',
        description: 'Thanh kiếm huyền thoại từ thời Hùng Vương',
        type: 'weapon',
        rarity: 'legendary',
        quality: 'perfect',
        levelRequirement: 60,
        stackable: false,
        maxStack: 1,
        baseValue: 50000,
        icon: '⚔️',
        isTradable: true,
        isSellable: true,
        isDestroyable: false,
        isQuestItem: false,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        status: 'active',
        slot: 'weapon',
        durability: {
            current: 1000,
            max: 1000
        },
        attributes: {
            attack: 450,
            strength: 30,
            agility: 20,
            criticalChance: 0.15,
            criticalDamage: 2.5
        },
        enhancement: {
            level: 0,
            maxLevel: 15,
            successRate: 0.95,
            breakRate: 0.05
        },
        sockets: {
            total: 3,
            used: 0,
            gems: []
        },
        setBonus: 'Tăng 15% sát thương cho kỹ năng võ thuật'
    },
    {
        id: 'item_002',
        name: 'Đao Bạch Long',
        description: 'Đao pháp của Bạch Long sứ quân',
        type: 'weapon',
        rarity: 'epic',
        quality: 'excellent',
        levelRequirement: 45,
        stackable: false,
        maxStack: 1,
        baseValue: 25000,
        icon: '🔪',
        isTradable: true,
        isSellable: true,
        isDestroyable: true,
        isQuestItem: false,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
        status: 'active',
        slot: 'weapon',
        durability: {
            current: 800,
            max: 800
        },
        attributes: {
            attack: 320,
            strength: 25,
            criticalChance: 0.10,
            criticalDamage: 2.0
        },
        enhancement: {
            level: 0,
            maxLevel: 12,
            successRate: 0.90,
            breakRate: 0.08
        },
        sockets: {
            total: 2,
            used: 0,
            gems: []
        }
    }
];

export const mockArmors: EquipmentItem[] = [
    {
        id: 'item_101',
        name: 'Giáp Thiên Long',
        description: 'Giáp trụ của thiên long tướng quân',
        type: 'armor',
        rarity: 'epic',
        quality: 'excellent',
        levelRequirement: 55,
        stackable: false,
        maxStack: 1,
        baseValue: 35000,
        icon: '🛡️',
        isTradable: true,
        isSellable: true,
        isDestroyable: false,
        isQuestItem: false,
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z',
        status: 'active',
        slot: 'chest',
        durability: {
            current: 1200,
            max: 1200
        },
        attributes: {
            defense: 280,
            health: 500,
            strength: 15,
            agility: 10
        },
        enhancement: {
            level: 0,
            maxLevel: 12,
            successRate: 0.92,
            breakRate: 0.06
        },
        sockets: {
            total: 2,
            used: 0,
            gems: []
        }
    }
];

export const mockConsumables: ConsumableItem[] = [
    {
        id: 'item_201',
        name: 'Huyết Đan',
        description: 'Đan dược hồi phục sinh lực',
        type: 'consumable',
        rarity: 'common',
        quality: 'normal',
        levelRequirement: 1,
        stackable: true,
        maxStack: 99,
        baseValue: 100,
        icon: '❤️',
        isTradable: true,
        isSellable: true,
        isDestroyable: true,
        isQuestItem: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        status: 'active',
        effects: [
            {
                type: 'heal',
                value: 500,
                target: 'self',
                attributes: ['health']
            }
        ],
        cooldown: 5
    },
    {
        id: 'item_202',
        name: 'Lực Đan',
        description: 'Tăng sức mạnh tạm thời',
        type: 'consumable',
        rarity: 'uncommon',
        quality: 'good',
        levelRequirement: 20,
        stackable: true,
        maxStack: 50,
        baseValue: 250,
        icon: '💪',
        isTradable: true,
        isSellable: true,
        isDestroyable: true,
        isQuestItem: false,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        status: 'active',
        effects: [
            {
                type: 'buff',
                duration: 300,
                value: 20,
                target: 'self',
                attributes: ['strength', 'attack']
            }
        ],
        cooldown: 60
    }
];

export const mockMaterials: MaterialItem[] = [
    {
        id: 'item_301',
        name: 'Thiết Thạch',
        description: 'Quặng sắt chất lượng cao',
        type: 'material',
        rarity: 'common',
        quality: 'normal',
        levelRequirement: 1,
        stackable: true,
        maxStack: 999,
        baseValue: 50,
        icon: '⛏️',
        isTradable: true,
        isSellable: true,
        isDestroyable: true,
        isQuestItem: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        status: 'active',
        usedInRecipes: ['recipe_001', 'recipe_002'],
        source: {
            type: 'gathering',
            location: 'Núi Thiết Sơn',
            dropRate: 0.8
        }
    },
    {
        id: 'item_302',
        name: 'Long Huyết Thảo',
        description: 'Thảo dược quý hiếm nhuốm máu rồng',
        type: 'material',
        rarity: 'rare',
        quality: 'good',
        levelRequirement: 40,
        stackable: true,
        maxStack: 50,
        baseValue: 1000,
        icon: '🌿',
        isTradable: true,
        isSellable: true,
        isDestroyable: true,
        isQuestItem: false,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
        status: 'active',
        usedInRecipes: ['recipe_101', 'recipe_102'],
        source: {
            type: 'gathering',
            location: 'Long Uyên',
            dropRate: 0.2
        }
    }
];

export const mockRecipes: CraftingRecipe[] = [
    {
        id: 'recipe_001',
        name: 'Rèn Kiếm Thiết',
        description: 'Công thức rèn kiếm sắt cơ bản',
        resultItem: 'item_001',
        resultQuantity: 1,
        ingredients: [
            { itemId: 'item_301', quantity: 10 },
            { itemId: 'item_302', quantity: 2 }
        ],
        requiredLevel: 10,
        craftingTime: 60,
        successRate: 0.85,
        category: 'weapon_crafting',
        isActive: true,
        requiredStation: 'Rèn Sắt',
        experienceGained: 100
    }
];

export const getAllItems = (): BaseItem[] => {
    return [
        ...mockWeapons,
        ...mockArmors,
        ...mockConsumables,
        ...mockMaterials
    ];
};
