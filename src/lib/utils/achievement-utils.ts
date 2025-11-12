// lib/utils/achievement-utils.ts

// Achievement Tier Colors and Labels
export const getAchievementTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
        bronze: '#CD7F32',      // Bronze color
        silver: '#C0C0C0',      // Silver color
        gold: '#FFD700',        // Gold color
        platinum: '#E5E4E2',    // Platinum color
        diamond: '#B9F2FF',     // Diamond blue
        master: '#8A2BE2',      // Master purple
        grandmaster: '#FF4500'  // Grandmaster red
    };
    return colors[tier] || '#8C8C8C';
};

export const getAchievementTierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
        bronze: 'Đồng',
        silver: 'Bạc',
        gold: 'Vàng',
        platinum: 'Bạch kim',
        diamond: 'Kim cương',
        master: 'Bậc thầy',
        grandmaster: 'Đại sư'
    };
    return labels[tier] || tier;
};

export const getAchievementTierIcon = (tier: string): string => {
    const icons: Record<string, string> = {
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇',
        platinum: '🏆',
        diamond: '💎',
        master: '👑',
        grandmaster: '⚡'
    };
    return icons[tier] || '🎯';
};

// Achievement Type Colors and Labels
export const getAchievementTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        progression: '#1890FF',    // Blue - Progress
        combat: '#CF1322',         // Red - Combat
        exploration: '#52C41A',    // Green - Exploration
        collection: '#722ED1',     // Purple - Collection
        crafting: '#FA8C16',       // Orange - Crafting
        social: '#13C2C2',         // Cyan - Social
        economy: '#FAAD14',        // Gold - Economy
        alliance: '#EB2F96',       // Magenta - Alliance
        seasonal: '#FF7A45',       // Coral - Seasonal
        milestone: '#2F54EB',      // Blue - Milestone
        secret: '#000000'          // Black - Secret
    };
    return colors[type] || '#8C8C8C';
};

export const getAchievementTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        progression: 'Tiến triển',
        combat: 'Chiến đấu',
        exploration: 'Khám phá',
        collection: 'Sưu tập',
        crafting: 'Chế tạo',
        social: 'Xã hội',
        economy: 'Kinh tế',
        alliance: 'Bang hội',
        seasonal: 'Mùa',
        milestone: 'Cột mốc',
        secret: 'Bí mật'
    };
    return labels[type] || type;
};

export const getAchievementTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
        progression: '📈',
        combat: '⚔️',
        exploration: '🗺️',
        collection: '🛍️',
        crafting: '⚒️',
        social: '👥',
        economy: '💰',
        alliance: '🤝',
        seasonal: '🍂',
        milestone: '🏁',
        secret: '🕵️'
    };
    return icons[type] || '🎯';
};

// Difficulty Colors and Labels
export const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
        very_easy: '#52C41A',     // Green
        easy: '#73D13D',          // Light Green
        medium: '#FAAD14',        // Orange
        hard: '#FA541C',          // Red Orange
        very_hard: '#CF1322',     // Red
        extreme: '#722ED1',       // Purple
        impossible: '#000000'     // Black
    };
    return colors[difficulty] || '#8C8C8C';
};

export const getDifficultyLabel = (difficulty: string): string => {
    const labels: Record<string, string> = {
        very_easy: 'Rất dễ',
        easy: 'Dễ',
        medium: 'Trung bình',
        hard: 'Khó',
        very_hard: 'Rất khó',
        extreme: 'Cực khó',
        impossible: 'Bất khả thi'
    };
    return labels[difficulty] || difficulty;
};

// Requirement Type Labels
export const getRequirementTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        level: 'Đạt cấp độ',
        quest_completion: 'Hoàn thành nhiệm vụ',
        item_collection: 'Thu thập vật phẩm',
        kill_count: 'Tiêu diệt kẻ địch',
        boss_defeat: 'Đánh bại Boss',
        alliance_join: 'Tham gia bang hội',
        alliance_level: 'Cấp độ bang hội',
        crafting_count: 'Chế tạo vật phẩm',
        exploration: 'Khám phá địa điểm',
        time_played: 'Thời gian chơi',
        login_streak: 'Chuỗi đăng nhập',
        pvp_wins: 'Chiến thắng PvP',
        pve_wins: 'Chiến thắng PvE',
        resource_gathering: 'Thu thập tài nguyên',
        currency_earned: 'Kiếm tiền tệ',
        item_enhancement: 'Nâng cấp vật phẩm',
        skill_mastery: 'Làm chủ kỹ năng',
        title_earned: 'Nhận danh hiệu',
        mount_collection: 'Sưu tập mount',
        pet_collection: 'Sưu tập pet',
        achievement_points: 'Điểm thành tích',
        seasonal_event: 'Sự kiện mùa',
        time_limited: 'Giới hạn thời gian',
        combo: 'Combo',
        perfection: 'Hoàn hảo'
    };
    return labels[type] || type;
};

// Reward Type Labels
export const getRewardTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        currency: 'Tiền tệ',
        item: 'Vật phẩm',
        experience: 'Kinh nghiệm',
        skill_point: 'Điểm kỹ năng',
        stat_point: 'Điểm thuộc tính',
        title: 'Danh hiệu',
        cosmetic: 'Cosmetic',
        mount: 'Mount',
        pet: 'Pet',
        recipe: 'Công thức',
        blueprint: 'Bản vẽ',
        buff: 'Buff',
        vip_time: 'Thời gian VIP',
        loot_box: 'Rương quà',
        achievement_point: 'Điểm thành tích'
    };
    return labels[type] || type;
};

export const getRewardIcon = (type: string): string => {
    const icons: Record<string, string> = {
        currency: '💰',
        item: '🎁',
        experience: '⭐',
        skill_point: '🔧',
        stat_point: '📊',
        title: '🏷️',
        cosmetic: '👕',
        mount: '🐴',
        pet: '🐾',
        recipe: '📜',
        blueprint: '📐',
        buff: '✨',
        vip_time: '👑',
        loot_box: '🎁',
        achievement_point: '🏆'
    };
    return icons[type] || '🎁';
};
