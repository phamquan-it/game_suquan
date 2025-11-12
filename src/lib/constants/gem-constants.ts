// lib/constants/gem-constants.ts

import { GemCategory } from "@/types/items/gem";

/**
 * Constants for gem system (đã loại bỏ socket-related constants)
 */
export const GEM_GRADE_MULTIPLIERS = {
    chipped: 0.5,
    flawed: 0.75,
    normal: 1.0,
    flawless: 1.5,
    perfect: 2.0,
    radiant: 3.0
} as const;

export const GEM_QUALITY_MULTIPLIERS = {
    poor: 0.7,
    common: 1.0,
    good: 1.3,
    excellent: 1.7,
    perfect: 2.2,
    divine: 3.0
} as const;

export const GEM_UPGRADE_TIERS = {
    1: { requiredLevel: 1, successRate: 0.95, destroyChance: 0.01 },
    2: { requiredLevel: 10, successRate: 0.90, destroyChance: 0.02 },
    3: { requiredLevel: 20, successRate: 0.85, destroyChance: 0.03 },
    4: { requiredLevel: 30, successRate: 0.80, destroyChance: 0.05 },
    5: { requiredLevel: 40, successRate: 0.75, destroyChance: 0.08 },
    6: { requiredLevel: 50, successRate: 0.70, destroyChance: 0.12 },
    7: { requiredLevel: 60, successRate: 0.65, destroyChance: 0.17 },
    8: { requiredLevel: 70, successRate: 0.60, destroyChance: 0.23 },
    9: { requiredLevel: 80, successRate: 0.55, destroyChance: 0.30 },
    10: { requiredLevel: 90, successRate: 0.50, destroyChance: 0.40 }
} as const;

/**
 * Gem colors based on category for UI
 */
export const GEM_CATEGORY_COLORS: Record<GemCategory, string> = {
    attack: '#FF4444',
    defense: '#4444FF',
    vitality: '#44FF44',
    agility: '#FFFF44',
    intelligence: '#FF44FF',
    critical: '#FF8844',
    elemental: '#FF4444',
    special: '#44FFFF',
    set: '#8844FF',
    universal: '#888888'
};

export const GEM_CATEGORY_ICONS = {
    attack: '⚔️',
    defense: '🛡️',
    vitality: '❤️',
    agility: '👟',
    intelligence: '🧠',
    critical: '🎯',
    elemental: '🔥',
    special: '✨',
    set: '🔗',
    universal: '🔮'
} as const;

export const GEM_GRADE_LABELS = {
    chipped: 'Vụn',
    flawed: 'Có Vết Nứt',
    normal: 'Bình Thường',
    flawless: 'Hoàn Hảo',
    perfect: 'Hoàn Mỹ',
    radiant: 'Rực Rỡ'
} as const;

export const GEM_QUALITY_LABELS = {
    poor: 'Kém',
    common: 'Thường',
    good: 'Tốt',
    excellent: 'Xuất Sắc',
    perfect: 'Hoàn Hảo',
    divine: 'Thần Thánh'
} as const;
