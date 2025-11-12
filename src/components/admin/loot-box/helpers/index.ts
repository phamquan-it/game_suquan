// Helper functions for tier system
const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
        basic: '#8C8C8C',      // Xám - Cơ bản
        advanced: '#1E8E3E',   // Xanh lá - Nâng cao
        elite: '#1890FF',      // Xanh dương - Tinh anh
        master: '#722ED1',     // Tím - Bậc thầy
        legendary: '#FA8C16'   // Cam - Huyền thoại
    };
    return colors[tier] || '#8C8C8C';
};

const getTierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
        basic: 'Cơ bản',
        advanced: 'Nâng cao',
        elite: 'Tinh anh',
        master: 'Bậc thầy',
        legendary: 'Huyền thoại'
    };
    return labels[tier] || tier;
};

// Additional tier-related helper functions
const getTierGradient = (tier: string): string => {
    const gradients: Record<string, string> = {
        basic: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        advanced: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        elite: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        master: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
        legendary: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)'
    };
    return gradients[tier] || '#f5f5f5';
};

const getTierIcon = (tier: string): string => {
    const icons: Record<string, string> = {
        basic: '⚪',
        advanced: '🟢',
        elite: '🔵',
        master: '🟣',
        legendary: '🟠'
    };
    return icons[tier] || '⚪';
};

const getTierOrder = (tier: string): number => {
    const order: Record<string, number> = {
        basic: 1,
        advanced: 2,
        elite: 3,
        master: 4,
        legendary: 5
    };
    return order[tier] || 0;
};

// Function to get tier by order (reverse lookup)
const getTierByOrder = (order: number): string => {
    const tiers: Record<number, string> = {
        1: 'basic',
        2: 'advanced',
        3: 'elite',
        4: 'master',
        5: 'legendary'
    };
    return tiers[order] || 'basic';
};

// Function to get next tier
const getNextTier = (currentTier: string): string | null => {
    const currentOrder = getTierOrder(currentTier);
    return getTierByOrder(currentOrder + 1);
};

// Function to get previous tier
const getPreviousTier = (currentTier: string): string | null => {
    const currentOrder = getTierOrder(currentTier);
    return getTierByOrder(currentOrder - 1);
};

// Function to compare tiers
const compareTiers = (tier1: string, tier2: string): number => {
    return getTierOrder(tier1) - getTierOrder(tier2);
};

// Function to check if tier1 is higher than tier2
const isTierHigher = (tier1: string, tier2: string): boolean => {
    return getTierOrder(tier1) > getTierOrder(tier2);
};

// Function to check if tier1 is lower than tier2
const isTierLower = (tier1: string, tier2: string): boolean => {
    return getTierOrder(tier1) < getTierOrder(tier2);
};

// Function to get tier requirements (example)
const getTierRequirements = (tier: string): { minLevel: number; minPower: number } => {
    const requirements: Record<string, { minLevel: number; minPower: number }> = {
        basic: { minLevel: 1, minPower: 0 },
        advanced: { minLevel: 10, minPower: 5000 },
        elite: { minLevel: 30, minPower: 15000 },
        master: { minLevel: 50, minPower: 30000 },
        legendary: { minLevel: 70, minPower: 50000 }
    };
    return requirements[tier] || { minLevel: 1, minPower: 0 };
};

// Function to get tier rewards multiplier
const getTierRewardMultiplier = (tier: string): number => {
    const multipliers: Record<string, number> = {
        basic: 1.0,
        advanced: 1.5,
        elite: 2.0,
        master: 3.0,
        legendary: 5.0
    };
    return multipliers[tier] || 1.0;
};

// Export all tier utilities
export {
    getTierColor,
    getTierLabel,
    getTierGradient,
    getTierIcon,
    getTierOrder,
    getTierByOrder,
    getNextTier,
    getPreviousTier,
    compareTiers,
    isTierHigher,
    isTierLower,
    getTierRequirements,
    getTierRewardMultiplier
};

// Helper functions for rarity system
const getRarityLabel = (rarity: string): string => {
    const labels: Record<string, string> = {
        common: 'Phổ thông',
        uncommon: 'Tinh luyện',
        rare: 'Hiếm',
        epic: 'Cực hiếm',
        legendary: 'Huyền thoại',
        mythic: 'Thần thoại',
        ancient: 'Cổ xưa'
    };
    return labels[rarity] || rarity;
};

const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
        common: '#8C8C8C',      // Gray
        uncommon: '#1E8E3E',    // Green
        rare: '#1890FF',        // Blue
        epic: '#722ED1',        // Purple
        legendary: '#FA8C16',   // Orange
        mythic: '#FA541C',      // Red-Orange
        ancient: '#CF1322'      // Red
    };
    return colors[rarity] || '#8C8C8C';
};

const getRarityGradient = (rarity: string): string => {
    const gradients: Record<string, string> = {
        common: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        uncommon: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        rare: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        epic: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
        legendary: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
        mythic: 'linear-gradient(135deg, #fff2e8 0%, #ffbb96 100%)',
        ancient: 'linear-gradient(135deg, #fff1f0 0%, #ffa39e 100%)'
    };
    return gradients[rarity] || '#f5f5f5';
};

const getRarityIcon = (rarity: string): string => {
    const icons: Record<string, string> = {
        common: '⚪',
        uncommon: '🟢',
        rare: '🔵',
        epic: '🟣',
        legendary: '🟠',
        mythic: '🔴',
        ancient: '💀'
    };
    return icons[rarity] || '⚪';
};

const getRarityOrder = (rarity: string): number => {
    const order: Record<string, number> = {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5,
        mythic: 6,
        ancient: 7
    };
    return order[rarity] || 0;
};

const getRarityByOrder = (order: number): string => {
    const rarities: Record<number, string> = {
        1: 'common',
        2: 'uncommon',
        3: 'rare',
        4: 'epic',
        5: 'legendary',
        6: 'mythic',
        7: 'ancient'
    };
    return rarities[order] || 'common';
};

const getRarityDropRateRange = (rarity: string): [number, number] => {
    const ranges: Record<string, [number, number]> = {
        common: [15, 40],
        uncommon: [8, 20],
        rare: [3, 12],
        epic: [1, 5],
        legendary: [0.1, 2],
        mythic: [0.01, 0.5],
        ancient: [0.001, 0.1]
    };
    return ranges[rarity] || [0, 0];
};

const getRarityValueMultiplier = (rarity: string): number => {
    const multipliers: Record<string, number> = {
        common: 1.0,
        uncommon: 2.5,
        rare: 6.0,
        epic: 15.0,
        legendary: 40.0,
        mythic: 100.0,
        ancient: 250.0
    };
    return multipliers[rarity] || 1.0;
};

// Helper functions for currency system
const getCurrencyLabel = (currency: string): string => {
    const labels: Record<string, string> = {
        // Basic Currencies
        gold: 'Vàng',
        silver: 'Bạc',
        copper: 'Đồng',

        // Premium Currencies
        diamond: 'Kim cương',
        ruby: 'Ruby',
        sapphire: 'Sapphire',
        emerald: 'Ngọc lục bảo',

        // Game-specific Currencies
        honor: 'Danh vọng',
        glory: 'Vinh quang',
        merit: 'Công lao',
        alliance_points: 'Điểm bang hội',
        vip_points: 'Điểm VIP',
        conquest_points: 'Điểm chinh phục',

        // Event Currencies
        festival_coin: 'Xu lễ hội',
        lunar_token: 'Thẻ trăng',
        sun_crystal: 'Tinh thể mặt trời',

        // Special Currencies
        ancient_coin: 'Tiền cổ',
        dragon_scale: 'Vảy rồng',
        phoenix_feather: 'Lông phượng'
    };
    return labels[currency] || currency;
};

const getCurrencyColor = (currency: string): string => {
    const colors: Record<string, string> = {
        // Basic Currencies
        gold: '#FFD700',        // Gold
        silver: '#C0C0C0',      // Silver
        copper: '#B87333',      // Copper

        // Premium Currencies
        diamond: '#B9F2FF',     // Diamond blue
        ruby: '#E0115F',        // Ruby red
        sapphire: '#0F52BA',    // Sapphire blue
        emerald: '#50C878',     // Emerald green

        // Game-specific Currencies
        honor: '#8B0000',       // Dark red
        glory: '#D4AF37',       // Gold
        merit: '#228B22',       // Forest green
        alliance_points: '#1E90FF', // Dodger blue
        vip_points: '#FF69B4',  // Hot pink
        conquest_points: '#DC143C', // Crimson

        // Event Currencies
        festival_coin: '#FF6B6B', // Coral
        lunar_token: '#E6E6FA',   // Lavender
        sun_crystal: '#FFA500',   // Orange

        // Special Currencies
        ancient_coin: '#CD7F32',  // Bronze
        dragon_scale: '#4B0082',  // Indigo
        phoenix_feather: '#FF4500' // Orange red
    };
    return colors[currency] || '#8C8C8C';
};

const getCurrencyIcon = (currency: string): string => {
    const icons: Record<string, string> = {
        // Basic Currencies
        gold: '🪙',
        silver: '🥈',
        copper: '🔶',

        // Premium Currencies
        diamond: '💎',
        ruby: '🔴',
        sapphire: '🔵',
        emerald: '💚',

        // Game-specific Currencies
        honor: '⚔️',
        glory: '🏆',
        merit: '⭐',
        alliance_points: '🤝',
        vip_points: '👑',
        conquest_points: '🎯',

        // Event Currencies
        festival_coin: '🎪',
        lunar_token: '🌙',
        sun_crystal: '☀️',

        // Special Currencies
        ancient_coin: '🏺',
        dragon_scale: '🐉',
        phoenix_feather: '🔥'
    };
    return icons[currency] || '💰';
};

const getCurrencyType = (currency: string): 'basic' | 'premium' | 'special' | 'event' => {
    const types: Record<string, 'basic' | 'premium' | 'special' | 'event'> = {
        // Basic Currencies
        gold: 'basic',
        silver: 'basic',
        copper: 'basic',

        // Premium Currencies
        diamond: 'premium',
        ruby: 'premium',
        sapphire: 'premium',
        emerald: 'premium',

        // Game-specific Currencies
        honor: 'special',
        glory: 'special',
        merit: 'special',
        alliance_points: 'special',
        vip_points: 'special',
        conquest_points: 'special',

        // Event Currencies
        festival_coin: 'event',
        lunar_token: 'event',
        sun_crystal: 'event',

        // Special Currencies
        ancient_coin: 'special',
        dragon_scale: 'special',
        phoenix_feather: 'special'
    };
    return types[currency] || 'basic';
};

const getCurrencyExchangeRate = (currency: string): number => {
    const rates: Record<string, number> = {
        // Base: 1 Gold = ?
        gold: 1,
        silver: 100,        // 1 Gold = 100 Silver
        copper: 10000,      // 1 Gold = 10,000 Copper

        // Premium currencies (higher value)
        diamond: 0.01,      // 1 Diamond = 100 Gold
        ruby: 0.05,         // 1 Ruby = 20 Gold
        sapphire: 0.02,     // 1 Sapphire = 50 Gold
        emerald: 0.1,       // 1 Emerald = 10 Gold

        // Special currencies (variable rates)
        honor: 10,          // 1 Honor Point = 0.1 Gold
        glory: 5,           // 1 Glory Point = 0.2 Gold
        merit: 20,          // 1 Merit Point = 0.05 Gold
        alliance_points: 50, // 1 Alliance Point = 0.02 Gold
        vip_points: 0.001,  // 1 VIP Point = 1000 Gold
        conquest_points: 2, // 1 Conquest Point = 0.5 Gold

        // Event currencies (temporary)
        festival_coin: 5,
        lunar_token: 8,
        sun_crystal: 3,

        // Special currencies (rare)
        ancient_coin: 0.0001, // 1 Ancient Coin = 10,000 Gold
        dragon_scale: 0.0005, // 1 Dragon Scale = 2,000 Gold
        phoenix_feather: 0.0002 // 1 Phoenix Feather = 5,000 Gold
    };
    return rates[currency] || 1;
};

const formatCurrencyAmount = (amount: number, currency: string): string => {
    const exchangeRate = getCurrencyExchangeRate(currency);
    const goldValue = amount * exchangeRate;

    if (goldValue >= 1000000) {
        return `${(amount / 1000000).toFixed(2)}M ${getCurrencyLabel(currency)}`;
    } else if (goldValue >= 1000) {
        return `${(amount / 1000).toFixed(2)}K ${getCurrencyLabel(currency)}`;
    }

    return `${amount.toLocaleString()} ${getCurrencyLabel(currency)}`;
};

const getCurrencyDescription = (currency: string): string => {
    const descriptions: Record<string, string> = {
        gold: 'Tiền tệ cơ bản, có thể kiếm được từ nhiều hoạt động trong game',
        silver: 'Tiền tệ trung cấp, giá trị thấp hơn vàng',
        copper: 'Tiền tệ cơ bản nhất, giá trị thấp',

        diamond: 'Tiền tệ cao cấp, có thể mua được từ cửa hàng hoặc sự kiện',
        ruby: 'Đá quý hiếm, dùng để mua vật phẩm đặc biệt',
        sapphire: 'Đá quý quý hiếm, có giá trị trao đổi cao',
        emerald: 'Bảo thạch quý giá, dùng cho craft đồ cao cấp',

        honor: 'Điểm danh dự, kiếm được từ chiến đấu PvP',
        glory: 'Điểm vinh quang, đạt được từ thành tích cao',
        merit: 'Điểm công lao, nhận từ nhiệm vụ và sự kiện',
        alliance_points: 'Điểm bang hội, dùng để nâng cấp bang hội',
        vip_points: 'Điểm VIP, tích lũy từ việc mua gói VIP',
        conquest_points: 'Điểm chinh phục, nhận từ chế độ chinh phục',

        festival_coin: 'Tiền tệ sự kiện, chỉ có trong thời gian lễ hội',
        lunar_token: 'Thẻ mặt trăng, thu thập từ sự kiện trăng tròn',
        sun_crystal: 'Tinh thể mặt trời, nhận từ sự kiện ban ngày',

        ancient_coin: 'Tiền cổ cực hiếm, có giá trị cực cao',
        dragon_scale: 'Vảy rồng thần thoại, vật phẩm truyền thuyết',
        phoenix_feather: 'Lông phượng hoàng, báu vật bất tử'
    };
    return descriptions[currency] || 'Tiền tệ trong game';
};

// Helper functions for loot box type system
const getBoxTypeColor = (boxType: string): string => {
    const colors: Record<string, string> = {
        // Basic Box Types
        common: '#8C8C8C',      // Gray - Common
        vip: '#FFD700',         // Gold - VIP
        premium: '#722ED1',     // Purple - Premium

        // Game Content Box Types
        event: '#FF6B6B',       // Coral Red - Event
        seasonal: '#52C41A',    // Green - Seasonal
        boss: '#FA541C',        // Volcanic Red - Boss
        alliance: '#1890FF',    // Blue - Alliance

        // Achievement & Special Box Types
        achievement: '#FA8C16', // Orange - Achievement
        special: '#EB2F96',     // Magenta - Special
        starter: '#13C2C2',     // Cyan - Starter
        daily: '#2F54EB',       // Deep Blue - Daily
        weekly: '#531DAB',      // Deep Purple - Weekly
        monthly: '#C41D7F',     // Rose - Monthly

        // Special Event Box Types
        festival: '#FF4D4F',    // Bright Red - Festival
        tournament: '#FF7A45',  // Orange Red - Tournament
        holiday: '#FFEC3D',     // Yellow - Holiday
        anniversary: '#FF85C0', // Pink - Anniversary

        // Rank & Level Box Types
        level: '#389E0D',       // Success Green - Level
        rank: '#0958D9',        // Primary Blue - Rank
        tier: '#D48806',        // Golden Yellow - Tier

        // PvP & PvE Box Types
        pvp: '#CF1322',         // Danger Red - PvP
        pve: '#08979C',         // Cyan - PvE
        raid: '#D46B08',        // Brown - Raid

        // Crafting & Gathering Box Types
        crafting: '#7CB305',    // Lime Green - Crafting
        gathering: '#5CDBD3',   // Teal - Gathering
        mining: '#874D00',      // Brown - Mining
        fishing: '#1890FF',     // Blue - Fishing
        hunting: '#389E0D'      // Green - Hunting
    };
    return colors[boxType] || '#8C8C8C';
};

const getBoxTypeLabel = (boxType: string): string => {
    const labels: Record<string, string> = {
        // Basic Box Types
        common: 'Thường',
        vip: 'VIP',
        premium: 'Premium',

        // Game Content Box Types
        event: 'Sự kiện',
        seasonal: 'Mùa',
        boss: 'Boss',
        alliance: 'Bang hội',

        // Achievement & Special Box Types
        achievement: 'Thành tích',
        special: 'Đặc biệt',
        starter: 'Người mới',
        daily: 'Hàng ngày',
        weekly: 'Hàng tuần',
        monthly: 'Hàng tháng',

        // Special Event Box Types
        festival: 'Lễ hội',
        tournament: 'Giải đấu',
        holiday: 'Ngày lễ',
        anniversary: 'Kỷ niệm',

        // Rank & Level Box Types
        level: 'Cấp độ',
        rank: 'Hạng',
        tier: 'Bậc',

        // PvP & PvE Box Types
        pvp: 'PvP',
        pve: 'PvE',
        raid: 'Raid',

        // Crafting & Gathering Box Types
        crafting: 'Chế tạo',
        gathering: 'Thu thập',
        mining: 'Khoáng sản',
        fishing: 'Câu cá',
        hunting: 'Săn bắn'
    };
    return labels[boxType] || boxType;
};

const getBoxTypeIcon = (boxType: string): string => {
    const icons: Record<string, string> = {
        // Basic Box Types
        common: '📦',
        vip: '👑',
        premium: '💎',

        // Game Content Box Types
        event: '🎪',
        seasonal: '🍂',
        boss: '👹',
        alliance: '🤝',

        // Achievement & Special Box Types
        achievement: '🏆',
        special: '✨',
        starter: '🎯',
        daily: '📅',
        weekly: '🗓️',
        monthly: '📆',

        // Special Event Box Types
        festival: '🎉',
        tournament: '⚔️',
        holiday: '🎄',
        anniversary: '🎂',

        // Rank & Level Box Types
        level: '📊',
        rank: '🥇',
        tier: '🎖️',

        // PvP & PvE Box Types
        pvp: '⚡',
        pve: '🛡️',
        raid: '🐲',

        // Crafting & Gathering Box Types
        crafting: '⚒️',
        gathering: '🛒',
        mining: '⛏️',
        fishing: '🎣',
        hunting: '🏹'
    };
    return icons[boxType] || '🎁';
};

const getBoxTypeDescription = (boxType: string): string => {
    const descriptions: Record<string, string> = {
        common: 'Rương cơ bản, có thể nhận từ nhiều hoạt động trong game',
        vip: 'Rương VIP, chỉ dành cho thành viên VIP với phần thưởng cao cấp',
        premium: 'Rương cao cấp, chứa vật phẩm quý hiếm và độc đáo',

        event: 'Rương sự kiện, chỉ có trong thời gian sự kiện đặc biệt',
        seasonal: 'Rương mùa, thay đổi theo mùa trong năm',
        boss: 'Rương boss, nhận được sau khi đánh bại boss',
        alliance: 'Rương bang hội, nhận từ hoạt động bang hội',

        achievement: 'Rương thành tích, nhận khi đạt thành tựu',
        special: 'Rương đặc biệt, chứa vật phẩm độc nhất',
        starter: 'Rương người mới, dành cho người chơi mới bắt đầu',
        daily: 'Rương hàng ngày, nhận mỗi ngày khi đăng nhập',
        weekly: 'Rương hàng tuần, nhận mỗi tuần',
        monthly: 'Rương hàng tháng, nhận mỗi tháng',

        festival: 'Rương lễ hội, chỉ có trong dịp lễ hội',
        tournament: 'Rương giải đấu, nhận từ tham gia giải đấu',
        holiday: 'Rương ngày lễ, nhận trong các ngày lễ đặc biệt',
        anniversary: 'Rương kỷ niệm, nhân dịp kỷ niệm game',

        level: 'Rương cấp độ, nhận khi đạt cấp độ mới',
        rank: 'Rương hạng, nhận dựa trên xếp hạng',
        tier: 'Rương bậc, nhận khi đạt bậc mới',

        pvp: 'Rương PvP, nhận từ chiến đấu người chơi',
        pve: 'Rương PvE, nhận từ nội dung người chơi vs môi trường',
        raid: 'Rương raid, nhận từ tham gia raid',

        crafting: 'Rương chế tạo, nhận từ hoạt động chế tạo',
        gathering: 'Rương thu thập, nhận từ thu thập tài nguyên',
        mining: 'Rương khoáng sản, nhận từ đào mỏ',
        fishing: 'Rương câu cá, nhận từ câu cá',
        hunting: 'Rương săn bắn, nhận từ săn quái'
    };
    return descriptions[boxType] || 'Rương quà trong game';
};

const getBoxTypeCategory = (boxType: string): 'basic' | 'content' | 'achievement' | 'event' | 'gameplay' | 'special' => {
    const categories: Record<string, 'basic' | 'content' | 'achievement' | 'event' | 'gameplay' | 'special'> = {
        // Basic Box Types
        common: 'basic',
        vip: 'basic',
        premium: 'basic',

        // Game Content Box Types
        event: 'content',
        seasonal: 'content',
        boss: 'content',
        alliance: 'content',

        // Achievement & Special Box Types
        achievement: 'achievement',
        special: 'special',
        starter: 'special',
        daily: 'achievement',
        weekly: 'achievement',
        monthly: 'achievement',

        // Special Event Box Types
        festival: 'event',
        tournament: 'event',
        holiday: 'event',
        anniversary: 'event',

        // Rank & Level Box Types
        level: 'achievement',
        rank: 'achievement',
        tier: 'achievement',

        // PvP & PvE Box Types
        pvp: 'gameplay',
        pve: 'gameplay',
        raid: 'gameplay',

        // Crafting & Gathering Box Types
        crafting: 'gameplay',
        gathering: 'gameplay',
        mining: 'gameplay',
        fishing: 'gameplay',
        hunting: 'gameplay'
    };
    return categories[boxType] || 'basic';
};

const getBoxTypeRarityRange = (boxType: string): { minRarity: string; maxRarity: string } => {
    const ranges: Record<string, { minRarity: string; maxRarity: string }> = {
        common: { minRarity: 'common', maxRarity: 'rare' },
        vip: { minRarity: 'uncommon', maxRarity: 'epic' },
        premium: { minRarity: 'rare', maxRarity: 'legendary' },

        event: { minRarity: 'uncommon', maxRarity: 'epic' },
        seasonal: { minRarity: 'rare', maxRarity: 'legendary' },
        boss: { minRarity: 'rare', maxRarity: 'mythic' },
        alliance: { minRarity: 'common', maxRarity: 'epic' },

        achievement: { minRarity: 'rare', maxRarity: 'legendary' },
        special: { minRarity: 'epic', maxRarity: 'ancient' },
        starter: { minRarity: 'common', maxRarity: 'uncommon' },
        daily: { minRarity: 'common', maxRarity: 'rare' },
        weekly: { minRarity: 'uncommon', maxRarity: 'epic' },
        monthly: { minRarity: 'rare', maxRarity: 'legendary' },

        festival: { minRarity: 'uncommon', maxRarity: 'legendary' },
        tournament: { minRarity: 'rare', maxRarity: 'mythic' },
        holiday: { minRarity: 'uncommon', maxRarity: 'epic' },
        anniversary: { minRarity: 'epic', maxRarity: 'ancient' },

        level: { minRarity: 'common', maxRarity: 'epic' },
        rank: { minRarity: 'uncommon', maxRarity: 'legendary' },
        tier: { minRarity: 'rare', maxRarity: 'mythic' },

        pvp: { minRarity: 'uncommon', maxRarity: 'legendary' },
        pve: { minRarity: 'common', maxRarity: 'epic' },
        raid: { minRarity: 'rare', maxRarity: 'mythic' },

        crafting: { minRarity: 'common', maxRarity: 'rare' },
        gathering: { minRarity: 'common', maxRarity: 'uncommon' },
        mining: { minRarity: 'common', maxRarity: 'epic' },
        fishing: { minRarity: 'common', maxRarity: 'rare' },
        hunting: { minRarity: 'uncommon', maxRarity: 'epic' }
    };
    return ranges[boxType] || { minRarity: 'common', maxRarity: 'common' };
};

const getBoxTypeValueMultiplier = (boxType: string): number => {
    const multipliers: Record<string, number> = {
        common: 1.0,
        vip: 3.0,
        premium: 5.0,

        event: 2.5,
        seasonal: 3.5,
        boss: 4.0,
        alliance: 2.0,

        achievement: 3.0,
        special: 6.0,
        starter: 1.5,
        daily: 1.2,
        weekly: 2.0,
        monthly: 3.0,

        festival: 2.8,
        tournament: 4.5,
        holiday: 2.5,
        anniversary: 5.0,

        level: 1.8,
        rank: 3.2,
        tier: 4.0,

        pvp: 2.5,
        pve: 1.8,
        raid: 3.5,

        crafting: 1.3,
        gathering: 1.1,
        mining: 1.4,
        fishing: 1.2,
        hunting: 1.6
    };
    return multipliers[boxType] || 1.0;
};

const getBoxTypeDropRateBonus = (boxType: string): number => {
    const bonuses: Record<string, number> = {
        common: 0,
        vip: 15,
        premium: 25,

        event: 20,
        seasonal: 30,
        boss: 10,
        alliance: 5,

        achievement: 0,
        special: 50,
        starter: 0,
        daily: 5,
        weekly: 10,
        monthly: 15,

        festival: 25,
        tournament: 20,
        holiday: 15,
        anniversary: 40,

        level: 0,
        rank: 10,
        tier: 15,

        pvp: 8,
        pve: 5,
        raid: 12,

        crafting: 3,
        gathering: 2,
        mining: 4,
        fishing: 3,
        hunting: 6
    };
    return bonuses[boxType] || 0;
};

// Export all box type utility functions
export {
    getBoxTypeColor,
    getBoxTypeLabel,
    getBoxTypeIcon,
    getBoxTypeDescription,
    getBoxTypeCategory,
    getBoxTypeRarityRange,
    getBoxTypeValueMultiplier,
    getBoxTypeDropRateBonus
};

// Export all utility functions
export {
    // Rarity functions
    getRarityLabel,
    getRarityColor,
    getRarityGradient,
    getRarityIcon,
    getRarityOrder,
    getRarityByOrder,
    getRarityDropRateRange,
    getRarityValueMultiplier,

    // Currency functions
    getCurrencyLabel,
    getCurrencyColor,
    getCurrencyIcon,
    getCurrencyType,
    getCurrencyExchangeRate,
    formatCurrencyAmount,
    getCurrencyDescription
};


