import { ItemRarity, ItemType, ItemQuality } from "@/lib/types/items";

export const getRarityColor = (rarity: ItemRarity): string => {
    switch (rarity) {
        case "common":
            return "#95a5a6";
        case "uncommon":
            return "#2ecc71";
        case "rare":
            return "#3498db";
        case "epic":
            return "#9b59b6";
        case "legendary":
            return "#f39c12";
        case "mythic":
            return "#e74c3c";
        default:
            return "#95a5a6";
    }
};

export const getRarityText = (rarity: ItemRarity): string => {
    switch (rarity) {
        case "common":
            return "Phổ Thông";
        case "uncommon":
            return "Khá Hiếm";
        case "rare":
            return "Hiếm";
        case "epic":
            return "Cực Hiếm";
        case "legendary":
            return "Huyền Thoại";
        case "mythic":
            return "Thần Thoại";
        default:
            return "Phổ Thông";
    }
};

export const getTypeColor = (type: ItemType): string => {
    switch (type) {
        case "weapon":
            return "#e74c3c";
        case "armor":
            return "#3498db";
        case "consumable":
            return "#2ecc71";
        case "material":
            return "#f39c12";
        case "quest":
            return "#9b59b6";
        case "special":
            return "#1abc9c";
        case "currency":
            return "#f1c40f";
        default:
            return "#95a5a6";
    }
};

export const getTypeText = (type: ItemType): string => {
    switch (type) {
        case "weapon":
            return "Vũ Khí";
        case "armor":
            return "Giáp Trụ";
        case "consumable":
            return "Tiêu Hao";
        case "material":
            return "Nguyên Liệu";
        case "quest":
            return "Nhiệm Vụ";
        case "special":
            return "Đặc Biệt";
        case "currency":
            return "Tiền Tệ";
        default:
            return "Khác";
    }
};

export const getQualityColor = (quality: ItemQuality): string => {
    switch (quality) {
        case "broken":
            return "#7f8c8d";
        case "damaged":
            return "#e67e22";
        case "normal":
            return "#2ecc71";
        case "good":
            return "#3498db";
        case "excellent":
            return "#9b59b6";
        case "perfect":
            return "#f1c40f";
        default:
            return "#95a5a6";
    }
};

export const formatItemValue = (value: number): string => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
    }
    return value.toString();
};

export const generateItemId = (): string => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
