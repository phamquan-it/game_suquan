// utils/beauty-helpers.ts

/**
 * Hàm lấy màu sắc cho độ hiếm của nhân vật
 */
export const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
        common: '#8C8C8C',      // Xám - Thường
        rare: '#1890FF',        // Xanh dương - Hiếm
        epic: '#722ED1',        // Tím - Siêu cấp
        legendary: '#FAAD14',   // Vàng - Huyền thoại
        mythic: '#FF4D4F'       // Đỏ - Thần thoại
    };
    return colors[rarity] || '#8C8C8C';
};

/**
 * Hàm lấy gradient background cho độ hiếm
 */
export const getRarityGradient = (rarity: string): string => {
    const gradients: { [key: string]: string } = {
        common: 'linear-gradient(135deg, #8C8C8C 0%, #BFBFBF 100%)',
        rare: 'linear-gradient(135deg, #1890FF 0%, #69C0FF 100%)',
        epic: 'linear-gradient(135deg, #722ED1 0%, #9254DE 100%)',
        legendary: 'linear-gradient(135deg, #FAAD14 0%, #FFC53D 100%)',
        mythic: 'linear-gradient(135deg, #FF4D4F 0%, #FF7875 100%)'
    };
    return gradients[rarity] || gradients.common;
};

/**
 * Hàm lấy text hiển thị cho độ hiếm
 */
export const getRarityText = (rarity: string): string => {
    const texts: { [key: string]: string } = {
        common: 'Thường',
        rare: 'Hiếm',
        epic: 'Siêu Cấp',
        legendary: 'Huyền Thoại',
        mythic: 'Thần Thoại'
    };
    return texts[rarity] || rarity;
};

/**
 * Hàm lấy màu sắc cho giá trị thuộc tính (dựa trên điểm số)
 */
export const getAttributeColor = (value: number): string => {
    if (value >= 95) return '#FF4D4F'; // Đỏ - Xuất sắc
    if (value >= 90) return '#FA541C'; // Cam đỏ - Rất tốt
    if (value >= 85) return '#FAAD14'; // Vàng - Tốt
    if (value >= 80) return '#52C41A'; // Xanh lá - Khá
    if (value >= 70) return '#1890FF'; // Xanh dương - Trung bình
    if (value >= 60) return '#722ED1'; // Tím - Yếu
    return '#8C8C8C'; // Xám - Rất yếu
};

/**
 * Hàm lấy gradient cho thanh progress thuộc tính
 */
export const getAttributeGradient = (value: number): { from: string; to: string } => {
    if (value >= 90) return { from: '#FF4D4F', to: '#FF7A45' };
    if (value >= 80) return { from: '#FAAD14', to: '#FFC53D' };
    if (value >= 70) return { from: '#52C41A', to: '#73D13D' };
    if (value >= 60) return { from: '#1890FF', to: '#69C0FF' };
    return { from: '#8C8C8C', to: '#BFBFBF' };
};

/**
 * Hàm lấy màu sắc cho trạng thái nhân vật
 */
export const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
        available: 'green',     // Xanh - Sẵn sàng
        mission: 'blue',        // Xanh dương - Đang nhiệm vụ
        training: 'orange',     // Cam - Đang huấn luyện
        resting: 'purple',      // Tím - Nghỉ ngơi
        injured: 'red',         // Đỏ - Bị thương
        suspended: 'default'    // Mặc định - Tạm ngừng
    };
    return colors[status] || 'default';
};

/**
 * Hàm lấy text hiển thị cho trạng thái
 */
export const getStatusText = (status: string): string => {
    const texts: { [key: string]: string } = {
        available: 'Sẵn Sàng',
        mission: 'Nhiệm Vụ',
        training: 'Huấn Luyện',
        resting: 'Nghỉ Ngơi',
        injured: 'Bị Thương',
        suspended: 'Tạm Ngừng'
    };
    return texts[status] || status;
};

/**
 * Hàm lấy màu sắc cho loại nhân vật
 */
export const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
        elegant: 'pink',        // Hồng - Quý phái
        mysterious: 'purple',   // Tím - Bí ẩn
        noble: 'gold',          // Vàng - Cao quý
        passionate: 'red',      // Đỏ - Đam mê
        wise: 'blue',           // Xanh - Thông thái
        warrior: 'volcano'      // Núi lửa - Chiến binh
    };
    return colors[type] || 'default';
};

/**
 * Hàm lấy text hiển thị cho loại nhân vật
 */
export const getTypeText = (type: string): string => {
    const texts: { [key: string]: string } = {
        elegant: 'Quý Phái',
        mysterious: 'Bí Ẩn',
        noble: 'Cao Quý',
        passionate: 'Đam Mê',
        wise: 'Thông Thái',
        warrior: 'Chiến Binh'
    };
    return texts[type] || type;
};

/**
 * Hàm lấy icon cho thuộc tính
 */
export const getAttributeIcon = (attribute: string): string => {
    const icons: { [key: string]: string } = {
        charm: '💝',           // Duyên dáng
        intelligence: '🧠',    // Trí tuệ
        diplomacy: '🤝',       // Ngoại giao
        intrigue: '🎭',        // Mưu mẹo
        loyalty: '🛡️',        // Trung thành
        leadership: '👑'       // Lãnh đạo
    };
    return icons[attribute] || '⭐';
};

/**
 * Hàm lấy text hiển thị cho thuộc tính
 */
export const getAttributeText = (attribute: string): string => {
    const texts: { [key: string]: string } = {
        charm: 'Duyên Dáng',
        intelligence: 'Trí Tuệ',
        diplomacy: 'Ngoại Giao',
        intrigue: 'Mưu Mẹo',
        loyalty: 'Trung Thành',
        leadership: 'Lãnh Đạo'
    };
    return texts[attribute] || attribute;
};

/**
 * Hàm đánh giá chất lượng thuộc tính
 */
export const getAttributeQuality = (value: number): string => {
    if (value >= 95) return 'Xuất Sắc';
    if (value >= 90) return 'Rất Tốt';
    if (value >= 85) return 'Tốt';
    if (value >= 80) return 'Khá';
    if (value >= 70) return 'Trung Bình';
    if (value >= 60) return 'Yếu';
    return 'Rất Yếu';
};

/**
 * Hàm tính điểm tổng hợp (Overall Score)
 */
export const calculateOverallScore = (attributes: { [key: string]: number }): number => {
    const values = Object.values(attributes);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

/**
 * Hàm lấy màu cho điểm tổng hợp
 */
export const getOverallScoreColor = (score: number): string => {
    return getAttributeColor(score);
};

/**
 * Hàm lấy đánh giá cho điểm tổng hợp
 */
export const getOverallScoreText = (score: number): string => {
    return getAttributeQuality(score);
};

// Export tất cả các hàm
export default {
    getRarityColor,
    getRarityGradient,
    getRarityText,
    getAttributeColor,
    getAttributeGradient,
    getStatusColor,
    getStatusText,
    getTypeColor,
    getTypeText,
    getAttributeIcon,
    getAttributeText,
    getAttributeQuality,
    calculateOverallScore,
    getOverallScoreColor,
    getOverallScoreText
};
