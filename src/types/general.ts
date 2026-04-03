// types/general.ts
export interface General {
    id: string;
    name: string;
    title?: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    element: 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark';
    type: 'warrior' | 'archer' | 'mage' | 'assassin' | 'support' | 'tank';
    level: number;
    max_level: number;
    base_attack: number;
    base_defense: number;
    base_health: number;
    base_speed: number;
    base_intelligence: number;
    base_leadership: number;
    status: 'active' | 'inactive' | 'training' | 'deployed';
    owner?: string;
    location?: string;
    voice_actor?: string;
    biography?: string;
    image?: string;
    thumbnail?: string;
}

export type GeneralFormData = Omit<General, 'id'>;
