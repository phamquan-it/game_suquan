// components/GeneralFormModal/constants/elements.ts
export const ELEMENT_CONFIG = {
    fire: { color: '#DC143C', icon: '🔥', label: 'Fire' },
    water: { color: '#1E90FF', icon: '💧', label: 'Water' },
    earth: { color: '#8B4513', icon: '🌍', label: 'Earth' },
    wind: { color: '#2E8B57', icon: '💨', label: 'Wind' },
    light: { color: '#D4AF37', icon: '✨', label: 'Light' },
    dark: { color: '#4B0082', icon: '🌑', label: 'Dark' },
} as const;

// components/GeneralFormModal/constants/rarities.ts
export const RARITY_CONFIG = {
    common: { color: '#808080', label: 'Common' },
    rare: { color: '#1E90FF', label: 'Rare' },
    epic: { color: '#8A2BE2', label: 'Epic' },
    legendary: { color: '#D4AF37', label: 'Legendary' },
    mythic: { color: '#DC143C', label: 'Mythic' },
} as const;

// components/GeneralFormModal/constants/types.ts
export const TYPE_CONFIG = {
    warrior: { icon: '⚔️', label: 'Warrior' },
    archer: { icon: '🏹', label: 'Archer' },
    mage: { icon: '🔮', label: 'Mage' },
    assassin: { icon: '🗡️', label: 'Assassin' },
    support: { icon: '💖', label: 'Support' },
    tank: { icon: '🛡️', label: 'Tank' },
} as const;

// components/GeneralFormModal/constants/stats.ts
export const STATS_CONFIG = [
    { label: 'Attack', name: 'base_attack', min: 1, max: 999, defaultValue: 10 },
    { label: 'Defense', name: 'base_defense', min: 1, max: 999, defaultValue: 10 },
    { label: 'Health', name: 'base_health', min: 1, max: 9999, defaultValue: 100 },
    { label: 'Speed', name: 'base_speed', min: 1, max: 999, defaultValue: 10 },
    { label: 'Intelligence', name: 'base_intelligence', min: 1, max: 999, defaultValue: 10 },
    { label: 'Leadership', name: 'base_leadership', min: 1, max: 999, defaultValue: 10 },
] as const;
