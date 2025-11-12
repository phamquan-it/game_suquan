// lib/types/loot-box.ts
import { BaseItem, ItemType, Rarity } from '@/types/items/base';

/**
 * Core Loot Box Interface
 */
export interface LootBox extends BaseItem {
    type: ItemType;
    boxType: LootBoxType;
    tier: LootBoxTier;
    category: LootBoxCategory;
    
    // Box Configuration
    openCost: OpenCost;
    openRequirements: OpenRequirements;
    openLimits: OpenLimits;
    
    // Reward System
    rewardTable: RewardTable;
    guaranteedDrops: GuaranteedDrop[];
    pitySystem?: PitySystem;
    
    // Visual & UX
    openingAnimation: OpeningAnimation;
    visualEffects: VisualEffects;
    
    // Metadata
    tags: string[];
    season?: string;
    event?: string;
    exclusive: boolean;
    timeLimited: boolean;
    availableFrom?: string;
    availableUntil?: string;
}

/**
 * Loại rương
 */
export type LootBoxType = 
    | 'common'      // Rương thường
    | 'vip'         // Rương VIP
    | 'premium'     // Rương Premium
    | 'event'       // Rương sự kiện
    | 'seasonal'    // Rương mùa
    | 'boss'        // Rương boss
    | 'alliance'    // Rương bang hội
    | 'achievement' // Rương thành tích
    | 'special';    // Rương đặc biệt

/**
 * Cấp độ rương
 */
export type LootBoxTier = 
    | 'basic'       // Cơ bản
    | 'advanced'    // Nâng cao  
    | 'elite'       | 'Tinh anh'
    | 'master'      // Bậc thầy
    | 'legendary';  // Huyền thoại

/**
 * Phân loại rương
 */
export type LootBoxCategory =
    | 'equipment'   // Trang bị
    | 'consumable'  // Vật phẩm tiêu hao
    | 'material'    // Nguyên liệu
    | 'currency'    // Tiền tệ
    | 'cosmetic'    // Cosmetic
    | 'mixed'       // Hỗn hợp
    | 'starter'     // Cho người mới
    | 'daily'       | 'Hàng ngày'
    | 'weekly';     // Hàng tuần

/**
 * Chi phí mở rương
 */
export interface OpenCost {
    currency: CurrencyType;
    amount: number;
    alternativeCosts?: AlternativeCost[];
}

export interface AlternativeCost {
    type: 'item' | 'key' | 'vip_points' | 'alliance_points';
    itemId?: string;
    amount: number;
}

/**
 * Yêu cầu mở rương
 */
export interface OpenRequirements {
    minLevel?: number;
    maxLevel?: number;
    vipLevel?: number;
    questCompleted?: string[];
    achievements?: string[];
    timeRestriction?: TimeRestriction;
}

export interface TimeRestriction {
    startTime?: string;
    endTime?: string;
    dayOfWeek?: number[];
    cooldown?: number; // seconds
}

/**
 * Giới hạn mở rương
 */
export interface OpenLimits {
    daily?: number;
    weekly?: number;
    monthly?: number;
    total?: number;
    perAccount?: number;
    perCharacter?: number;
}

/**
 * Bảng phần thưởng
 */
export interface RewardTable {
    id: string;
    name: string;
    pools: RewardPool[];
    rules: DistributionRules;
}

export interface RewardPool {
    id: string;
    name: string;
    weight: number; // Tỷ trọng
    rewards: RewardItem[];
    minDrops: number;
    maxDrops: number;
    guaranteed?: boolean;
}

export interface RewardItem {
    id: string;
    type: RewardType;
    itemId?: string;
    currencyType?: CurrencyType;
    amount: number | [number, number]; // Fixed or range
    weight: number; // Drop rate weight
    rarity: Rarity;
    bound: 'none' | 'account' | 'character';
    conditions?: DropCondition[];
}

export type RewardType = 
    | 'item'
    | 'currency'
    | 'experience'
    | 'vip_points'
    | 'alliance_points'
    | 'cosmetic'
    | 'title'
    | 'mount'
    | 'pet'
    | 'skill_point'
    | 'stat_point';

export interface DropCondition {
    type: 'vip_level' | 'player_level' | 'quest_completed' | 'achievement' | 'time_of_day';
    value: any;
}

/**
 * Quy tắc phân phối
 */
export interface DistributionRules {
    distributionType: 'weighted' | 'random' | 'sequential' | 'pity';
    antiDuplicate?: boolean;
    duplicateProtection?: number; // % giảm trùng
    streakBonus?: StreakBonus;
    firstTimeBonus?: FirstTimeBonus;
}

export interface StreakBonus {
    enabled: boolean;
    streakType: 'consecutive' | 'total';
    bonuses: StreakBonusTier[];
}

export interface StreakBonusTier {
    streakCount: number;
    multiplier: number;
    guaranteedRarity?: Rarity;
}

export interface FirstTimeBonus {
    enabled: boolean;
    guaranteedRewards: string[]; // Reward IDs
    multiplier: number;
}

/**
 * Phần thưởng đảm bảo
 */
export interface GuaranteedDrop {
    openCount: number;
    rewards: RewardItem[];
    resetAfterClaim: boolean;
}

/**
 * Hệ thống bù (Pity System)
 */
export interface PitySystem {
    enabled: boolean;
    counters: PityCounter[];
    resetOnRareDrop: boolean;
}

export interface PityCounter {
    rarity: Rarity;
    threshold: number;
    guaranteedReward: RewardItem;
    currentCount: number; // Track per player
}

/**
 * Hiệu ứng mở rương
 */
export interface OpeningAnimation {
    type: 'simple' | 'epic' | 'custom';
    duration: number; // milliseconds
    soundEffect?: string;
    particleEffect?: string;
    customAnimation?: string;
}

export interface VisualEffects {
    glowColor: string;
    particleColor: string;
    shineEffect: boolean;
    rarityPulse: boolean;
}

// lib/types/economy.ts
/**
 * Hệ thống tiền tệ trong game
 */
export type CurrencyType =
    | 'gold'           // Vàng - Tiền cơ bản
    | 'silver'         // Bạc - Tiền trung cấp
    | 'diamond'        // Kim cương - Tiền cao cấp
    | 'crystal'        // Pha lê - Tiền đặc biệt
    | 'honor'          // Danh dự - PvP currency
    | 'alliance_point' // Điểm bang hội
    | 'vip_point'      // Điểm VIP
    | 'event_coin'     // Xu sự kiện
    | 'arena_point'    // Điểm đấu trường
    | 'guild_coin'     // Xu công hội
    | 'ancient_coin'   // Xu cổ đại
    | 'dragon_scale'   // Vảy rồng
    | 'phoenix_feather'// Lông phượng hoàng
    | 'spirit_stone'   // Đá linh hồn
    | 'karma_point';   // Điểm nghiệp lực

/**
 * Thông tin chi tiết về loại tiền tệ
 */
export interface CurrencyInfo {
    type: CurrencyType;
    name: string;
    description: string;
    icon: string;
    color: string;
    exchangeRate: number; // Tỷ giá so với gold
    maxStack: number;
    tradable: boolean;
    destroyable: boolean;
    category: CurrencyCategory;
    usage: string[];
}

/**
 * Phân loại tiền tệ
 */
export type CurrencyCategory =
    | 'basic'          // Tiền cơ bản
    | 'premium'        // Tiền cao cấp
    | 'pvp'            // PvP currency
    | 'social'         // Tiền xã hội
    | 'event'          // Tiền sự kiện
    | 'special'        // Tiền đặc biệt
    | 'material';      // Nguyên liệu đặc biệt

/**
 * Tỷ giá hối đoái
 */
export interface ExchangeRate {
    from: CurrencyType;
    to: CurrencyType;
    rate: number;
    fee: number;
    minAmount: number;
    maxAmount: number;
}

/**
 * Giao dịch tiền tệ
 */
export interface CurrencyTransaction {
    id: string;
    playerId: string;
    type: 'earn' | 'spend' | 'exchange' | 'reward' | 'penalty';
    currency: CurrencyType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    source: string; // Nguồn giao dịch
    timestamp: string;
    metadata?: Record<string, any>;
}

/**
 * Ví tiền của người chơi
 */
export interface PlayerWallet {
    playerId: string;
    currencies: Record<CurrencyType, number>;
    lastUpdated: string;
    totalValue: number; // Tính theo gold
}


