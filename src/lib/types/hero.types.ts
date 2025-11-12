// lib/types/general.ts
export interface General {
    id: string;
    name: string;
    title: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    element: 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark';
    type: 'warrior' | 'archer' | 'mage' | 'assassin' | 'support' | 'tank';
    level: number;
    maxLevel: number;
    baseStats: {
        attack: number;
        defense: number;
        health: number;
        speed: number;
        intelligence: number;
        leadership: number;
    };
    currentStats: {
        attack: number;
        defense: number;
        health: number;
        speed: number;
        intelligence: number;
        leadership: number;
    };
    skills: GeneralSkill[];
    equipment: Equipment[];
    status: 'active' | 'inactive' | 'training' | 'deployed';
    owner?: string; // Player ID
    location: string;
    experience: number;
    requiredExp: number;
    starLevel: number;
    maxStarLevel: number;
    awakeningLevel: number;
    bondLevel: number;
    favorite: boolean;
    obtainedDate: string;
    lastUsed: string;
    battleCount: number;
    winRate: number;
    specialAbilities: string[];
    voiceActor: string;
    biography: string;
    quotes: string[];
    image: string;
    thumbnail: string;
}

export interface GeneralSkill {
    id: string;
    name: string;
    description: string;
    type: 'active' | 'passive' | 'ultimate';
    level: number;
    maxLevel: number;
    cooldown?: number;
    manaCost?: number;
    effects: SkillEffect[];
    upgradeRequirements: SkillUpgradeRequirement[];
    icon: string;
}

export interface SkillEffect {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon' | 'control';
    target: 'self' | 'enemy' | 'ally' | 'all_enemies' | 'all_allies';
    value: number;
    duration?: number;
    chance: number;
}

export interface Equipment {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'accessory' | 'artifact';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    level: number;
    enhancement: number;
    stats: EquipmentStats;
    slots: number;
    equipped: boolean;
}

export interface GeneralFilter {
    rarity?: string[];
    element?: string[];
    type?: string[];
    status?: string[];
    levelRange?: [number, number];
    starLevel?: number[];
    owner?: string;
}

export interface EquipmentStats {
    attack?: number;         // + sát thương
    defense?: number;        // + phòng thủ
    health?: number;         // + máu tối đa
    speed?: number;          // + tốc độ hành động
    intelligence?: number;   // + trí tuệ (buff/mana)
    leadership?: number;     // + chỉ huy, ảnh hưởng buff team
    criticalRate?: number;   // % chí mạng
    criticalDamage?: number; // % sát thương chí mạng
    dodge?: number;          // % né tránh
    block?: number;          // % chặn đòn
    resistance?: number;     // kháng hiệu ứng
    elementBonus?: { [element in 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark']?: number };
    // bonus damage hoặc giảm damage theo nguyên tố
}
export interface SkillUpgradeRequirement {
    requiredLevel?: number;       // level của General
    requiredSkillLevel?: number;  // level hiện tại của skill
    requiredEquipment?: {         // cần trang bị đặc biệt
        id: string;
        quantity: number;
    }[];
    requiredCurrency?: {          // cần tiền, vàng, gem, v.v
        type: 'gold' | 'gem' | 'manaStone';
        amount: number;
    }[];
    requiredItem?: {              // các item nâng cấp chung
        id: string;
        quantity: number;
    }[];
    specialCondition?: string;    // ví dụ: phải đánh thắng dungeon X, hoàn thành quest Y
}

