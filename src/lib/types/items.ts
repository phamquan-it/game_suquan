export type ItemRarity =
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary"
    | "mythic";
export type ItemType =
    | "weapon"
    | "armor"
    | "consumable"
    | "material"
    | "quest"
    | "special"
    | "currency";
export type ItemQuality =
    | "broken"
    | "damaged"
    | "normal"
    | "good"
    | "excellent"
    | "perfect";
export type EquipmentSlot =
    | "weapon"
    | "head"
    | "chest"
    | "hands"
    | "legs"
    | "feet"
    | "accessory";

export interface BaseItem {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    quality: ItemQuality;
    levelRequirement: number;
    stackable: boolean;
    maxStack: number;
    baseValue: number;
    icon: string;
    isTradable: boolean;
    isSellable: boolean;
    isDestroyable: boolean;
    isQuestItem: boolean;
    createdAt: string;
    updatedAt: string;
    status: "active" | "inactive" | "testing";
}

export interface EquipmentItem extends BaseItem {
    type: "weapon" | "armor";
    slot: EquipmentSlot;
    durability: {
        current: number;
        max: number;
    };
    attributes: {
        attack?: number;
        defense?: number;
        health?: number;
        mana?: number;
        strength?: number;
        agility?: number;
        intelligence?: number;
        criticalChance?: number;
        criticalDamage?: number;
    };
    enhancement: {
        level: number;
        maxLevel: number;
        successRate: number;
        breakRate: number;
    };
    sockets: {
        total: number;
        used: number;
        gems: string[];
    };
    setBonus?: string;
}

export interface ConsumableItem extends BaseItem {
    type: "consumable";
    effects: {
        type: "heal" | "buff" | "debuff" | "teleport" | "transform";
        duration?: number;
        value: number;
        target: "self" | "enemy" | "ally" | "area";
        attributes: string[];
    }[];
    cooldown: number;
}

export interface MaterialItem extends BaseItem {
    type: "material";
    usedInRecipes: string[];
    source: {
        type: "gathering" | "crafting" | "monster" | "quest" | "purchase";
        location?: string;
        dropRate?: number;
    };
}

export interface ItemCategory {
    id: string;
    name: string;
    description: string;
    parentId?: string;
    itemTypes: ItemType[];
    sortOrder: number;
    icon: string;
    isActive: boolean;
    itemCount: number;
}

export interface CraftingRecipe {
    id: string;
    name: string;
    description: string;
    resultItem: string;
    resultQuantity: number;
    ingredients: {
        itemId: string;
        quantity: number;
    }[];
    requiredLevel: number;
    craftingTime: number; // in seconds
    successRate: number;
    category: string;
    isActive: boolean;
    requiredStation?: string;
    experienceGained: number;
}

export interface ItemPriceHistory {
    itemId: string;
    timestamp: string;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    volume: number;
}

export interface ItemDropRate {
    itemId: string;
    source: string;
    sourceType: "monster" | "chest" | "quest" | "gathering";
    dropRate: number;
    minQuantity: number;
    maxQuantity: number;
    condition?: string;
}
