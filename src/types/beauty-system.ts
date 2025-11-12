// types/beauty-system.ts
export interface BeautyCharacter {
    id: string;
    name: string;
    title: string; // "Tây Thi", "Chiêu Quân", "Điêu Thuyền", "Dương Quý Phi"
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    level: number;
    experience: number;
    maxLevel: number;
    description?:  string; 
    // Thuộc tính chính
    attributes: {
        charm: number;          // Sức hút
        intelligence: number;   // Trí tuệ
        diplomacy: number;      // Ngoại giao
        intrigue: number;       // Mưu mẹo
        loyalty: number;        // Trung thành
    };
    
    // Kỹ năng đặc biệt
    skills: BeautySkill[];
    
    // Trang phục và trang sức
    costumes: Costume[];
    jewelry: Jewelry[];
    
    // Trạng thái
    status: 'available' | 'mission' | 'training' | 'resting';
    currentMission?: string;
    trainingEndTime?: string;
    
    // Hình ảnh
    avatar: string;
    fullImage: string;
    
    // Lịch sử
    acquisitionDate: string;
    lastUsed: string;
    missionSuccessRate: number;
}

export interface BeautySkill {
    id: string;
    name: string;
    description: string;
    type: 'passive' | 'active';
    effect: {
        type: 'attribute_boost' | 'mission_success' | 'resource_bonus' | 'special_event';
        value: number;
        target: string;
    };
    cooldown?: number;
    level: number;
    maxLevel: number;
}

export interface Costume {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    attributes: {
        charm: number;
        intelligence: number;
        diplomacy: number;
    };
    equipped: boolean;
    image: string;
}

export interface Jewelry {
    id: string;
    name: string;
    type: 'hairpin' | 'necklace' | 'bracelet' | 'ring' | 'earring';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    attributes: {
        charm: number;
        intrigue: number;
        loyalty: number;
    };
    equipped: boolean;
    image: string;
}

export interface BeautyMission {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    duration: number; // in hours
    requiredAttributes: {
        charm: number;
        intelligence: number;
        diplomacy: number;
        intrigue: number;
    };
    rewards: MissionReward;
    successRate: number;
    specialConditions?: string[];
}

export interface MissionReward {
    gold: number;
    prestige: number;
    items: string[];
    experience: number;
    specialRewards?: string[];
}
