import { GemQuality } from "./gem";

// lib/types/item.ts
export interface BaseItem {
    base_value?: any;
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: Rarity;
    level: number;
    requiredLevel: number;
    icon: string;
    image: string;
    stackable: boolean;
    maxStack: number;
    value: number; // Gold value
    bound: 'none' | 'account' | 'character';
    tradable: boolean;
    destroyable: boolean;
    sellable: boolean;
    tags: string[];
    metadata: Record<string, any>;
    createdBy: string; // Admin ID
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive' | 'hidden';
    quality?: GemQuality;
}

export interface ItemStats {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
    stamina?: number;
    criticalChance?: number;
    criticalDamage?: number;
    dodge?: number;
    accuracy?: number;
    attackSpeed?: number;
    movementSpeed?: number;
    // Elemental stats
    fireResistance?: number;
    waterResistance?: number;
    earthResistance?: number;
    windResistance?: number;
    lightResistance?: number;
    darkResistance?: number;
}

export type ItemType =
    | 'weapon'
    | 'armor'
    | 'accessory'
    | 'consumable'
    | 'material'
    | 'quest'
    | 'recipe'
    | 'gem'
    | 'scroll'
    | 'currency';

export type Rarity =
    | 'common'
    | 'uncommon'
    | 'rare'
    | 'epic'
    | 'legendary'
    | 'mythic'
    | 'ancient';
