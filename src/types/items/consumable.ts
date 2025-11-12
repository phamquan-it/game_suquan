import { BaseItem } from "./base";

// lib/types/consumable.ts
export interface Consumable extends BaseItem {
    type: 'consumable';
    category: ConsumableCategory;
    effects: ConsumableEffect[];
    cooldown: number; // Global cooldown in seconds
    duration?: number; // Effect duration
    consumeOnUse: boolean;
    maxCharges?: number; // For multi-use items
    currentCharges?: number;
}

export type ConsumableCategory =
    | 'potion'
    | 'elixir'
    | 'food'
    | 'drink'
    | 'scroll'
    | 'book'
    | 'key'
    | 'other';

export interface ConsumableEffect {
    type: ConsumableEffectType;
    value: number;
    duration?: number;
    target: 'self' | 'party' | 'raid' | 'target';
    modifier?: 'flat' | 'percentage';
}

export type ConsumableEffectType =
    | 'heal'
    | 'mana_restore'
    | 'stat_boost'
    | 'exp_boost'
    | 'drop_boost'
    | 'speed_boost'
    | 'invisibility'
    | 'resurrection'
    | 'teleport'
    | 'summon';
