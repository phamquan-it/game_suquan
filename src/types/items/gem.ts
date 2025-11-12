// lib/types/gem.ts

import { BaseItem, ItemStats, Rarity } from "./base";


/**
 * Gem Item - Đá quý có thể gắn vào trang bị (đã loại bỏ socket)
 */
export interface GemItem extends BaseItem {
    description: string;
    name: string;
    type: 'gem';
    category: GemCategory;
    grade: GemGrade;
    quality: GemQuality;
    stats: GemStats;
    specialEffects: GemEffect[];
    level: number;
    maxLevel: number;
    upgradeable: boolean;
    upgradeRequirements?: GemUpgradeRequirements;
    setGem?: boolean;
    setBonusId?: string;
    compatibleSlots: EquipmentSlot[]; // Các slot trang bị có thể gắn gem
}

/**
 * Phân loại đá quý
 */
export type GemCategory =
    | 'attack'           // Tăng sức tấn công
    | 'defense'          // Tăng phòng thủ
    | 'vitality'         // Tăng sinh lực
    | 'agility'          // Tăng tốc độ, né tránh
    | 'intelligence'     // Tăng trí tuệ, mana
    | 'critical'         // Tăng chí mạng
    | 'elemental'        // Nguyên tố
    | 'special'          // Hiệu ứng đặc biệt
    | 'set'              // Đá bộ
    | 'universal';       // Đa dụng

/**
 * Cấp độ đá quý
 */
export type GemGrade =
    | 'chipped'      // Vụn
    | 'flawed'       // Có vết nứt
    | 'normal'       // Bình thường
    | 'flawless'     // Hoàn hảo
    | 'perfect'      // Hoàn mỹ
    | 'radiant';     // Rực rỡ

/**
 * Chất lượng đá quý
 */
export type GemQuality =
    | 'poor'         // Kém
    | 'common'       // Thường
    | 'good'         // Tốt
    | 'excellent'    // Xuất sắc
    | 'perfect'      // Hoàn hảo
    | 'divine';      // Thần thánh

/**
 * Chỉ số của đá quý
 */
    attack: ReactNode;
export interface GemStats extends ItemStats {
    // Base stats
    gemPower: number;           // Sức mạnh tổng của đá

    // Elemental stats
    elementalDamage?: {
        type: ElementalType;
        value: number;
    };
    elementalResistance?: {
        type: ElementalType;
        value: number;
    };

    // Special gem properties
    amplification?: number;     // Hệ số khuếch đại
    synergy?: number;           // Đồng bộ với gem khác
}

/**
 * Hiệu ứng đặc biệt của đá
 */
export interface GemEffect {
    id: string;
    name: string;
    description: string;
    type: GemEffectType;
    trigger: GemEffectTrigger;
    value: number;
    duration?: number;
    cooldown?: number;
    chance?: number;
    conditions?: GemEffectCondition[];
    stackable: boolean;
    maxStacks?: number;
}

/**
 * Loại hiệu ứng
 */
export type GemEffectType =
    | 'stat_boost'              // Tăng chỉ số
    | 'dot'                     // Damage over time
    | 'hot'                     // Heal over time
    | 'proc'                    // Kích hoạt ngẫu nhiên
    | 'on_hit'                  // Khi đánh trúng
    | 'on_crit'                 // Khi chí mạng
    | 'on_kill'                 // Khi hạ gục
    | 'on_damage_taken'         // Khi nhận sát thương
    | 'aura'                    // Vùng ảnh hưởng
    | 'summon'                  // Triệu hồi
    | 'transform'               // Biến đổi
    | 'teleport'                // Dịch chuyển
    | 'shield'                  // Khiên
    | 'cc'                      // Khống chế
    | 'cleanse'                 // Giải trừ
    | 'buff'                    // Tăng cường
    | 'debuff';                 // Giảm yếu

/**
 * Điều kiện kích hoạt
 */
export type GemEffectTrigger =
    | 'always'                  // Luôn luôn
    | 'on_attack'               // Khi tấn công
    | 'on_skill_use'            // Khi dùng kỹ năng
    | 'on_hit'                  // Khi đánh trúng
    | 'on_crit'                 // Khi chí mạng
    | 'on_dodge'                // Khi né tránh
    | 'on_block'                // Khi chặn
    | 'on_kill'                 // Khi hạ gục
    | 'on_death'                // Khi chết
    | 'on_low_health'           // Khi máu thấp
    | 'on_health_potion'        // Khi uống máu
    | 'on_enter_combat'         // Khi vào chiến đấu
    | 'on_leave_combat'         // Khi rời chiến đấu
    | 'on_move'                 // Khi di chuyển
    | 'manual';                 // Kích hoạt thủ công

/**
 * Điều kiện áp dụng
 */
export interface GemEffectCondition {
    type: 'health_below' | 'health_above' | 'mana_below' | 'mana_above' | 'has_buff' | 'has_debuff' | 'time_of_day';
    value: number | string;
    operator: 'lt' | 'gt' | 'eq' | 'lte' | 'gte';
}

/**
 * Yêu cầu nâng cấp đá
 */
export interface GemUpgradeRequirements {
    gold: number;
    materials: Array<{
        itemId: string;
        quantity: number;
    }>;
    catalyst?: string;          // Chất xúc tác đặc biệt
    baseGem?: string;           // Đá cơ bản để nâng cấp
    successRate: number;        // Tỷ lệ thành công
    destroyChance: number;      // Tỷ lệ hủy nếu thất bại
    minLevel: number;           // Cấp độ tối thiểu
    requiredQuest?: string;     // Nhiệm vụ yêu cầu
}

/**
 * Set bonus của bộ gem
 */
export interface GemSetBonus {
    setId: string;
    setName: string;
    description: string;
    gemsRequired: number;
    bonuses: Array<{
        gemsCount: number;
        effects: GemEffect[];
        description: string;
    }>;
    maxPieces: number;
}

/**
 * Nguyên tố
 */
export type ElementalType =
    | 'fire'
    | 'water'
    | 'earth'
    | 'wind'
    | 'lightning'
    | 'light'
    | 'dark'
    | 'chaos';

/**
 * Equipment slots (import từ equipment types)
 */
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

/**
 * Filter options cho gem
 */
export interface GemFilter {
    category?: GemCategory[];
    grade?: GemGrade[];
    quality?: GemQuality[];
    rarity?: Rarity[];
    levelRange?: [number, number];
    hasEffects?: boolean;
    upgradeable?: boolean;
    setGem?: boolean;
    compatibleWith?: EquipmentSlot;
}
