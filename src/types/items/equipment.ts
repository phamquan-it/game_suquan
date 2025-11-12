import { BaseItem, ItemStats } from "./base";

// lib/types/equipment.ts
export interface Equipment extends BaseItem {
    type: 'weapon' | 'armor' | 'accessory';
    slot: EquipmentSlot;
    durability: {
        current: number;
        max: number;
        repairable: boolean;
    };
    enhancement: {
        level: number;
        maxLevel: number;
        failCount: number;
        breakable: boolean;
    };
    stats: ItemStats;
    baseStats: ItemStats;
    enhancementStats: ItemStats;
    setBonus?: SetBonus;
    sockets: Socket[];
    requirements: EquipmentRequirements;
    skills: EquipmentSkill[];
}

export type EquipmentSlot =
    | 'weapon_main'
    | 'weapon_off'
    | 'helmet'
    | 'chest'
    | 'gloves'
    | 'pants'
    | 'boots'
    | 'shoulders'
    | 'belt'
    | 'necklace'
    | 'ring_1'
    | 'ring_2'
    | 'earring_1'
    | 'earring_2'
    | 'artifact';

export interface Socket {
    index: number;
    type: SocketType;
    gem?: GemItem;
    locked: boolean;
}

export type SocketType = 'red' | 'blue' | 'green' | 'yellow' | 'prismatic';

export interface SetBonus {
    setId: string;
    setName: string;
    bonuses: SetBonusEffect[];
    requiredPieces: number;
}

export interface SetBonusEffect {
    pieces: number;
    effects: ItemEffect[];
}

export interface EquipmentRequirements {
    level: number;
    strength?: number;
    agility?: number;
    intelligence?: number;
    vitality?: number;
    class?: string[];
    quest?: string;
    reputation?: {
        faction: string;
        level: number;
    };
}

export interface EquipmentSkill {
    id: string;
    name: string;
    description: string;
    trigger: 'on_attack' | 'on_hit' | 'on_kill' | 'on_equip' | 'passive';
    cooldown?: number;
    chance?: number;
}
