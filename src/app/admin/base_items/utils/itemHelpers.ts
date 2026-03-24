// app/admin/base_items/utils/itemHelpers.ts

import { ItemType } from "../types";

export const getItemTypeColor = (type: ItemType): string => {
  const colors: Record<string, string> = {
    weapon: '#DC143C',
    armor: '#1E90FF',
    consumable: '#32CD32',
    material: '#FF8C00',
    relic: '#9370DB',
    general: '#8B4513',
    // Add more as needed
  };
  return colors[type] || '#808080';
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#808080',
    uncommon: '#32CD32',
    rare: '#1E90FF',
    epic: '#9370DB',
    legendary: '#FF8C00',
    mythic: '#DC143C',
  };
  return colors[rarity] || '#808080';
};

export const getQualityColor = (quality: string): string => {
  const colors: Record<string, string> = {
    broken: '#808080',
    damaged: '#A0522D',
    normal: '#C0C0C0',
    good: '#32CD32',
    excellent: '#1E90FF',
    perfect: '#FFD700',
  };
  return colors[quality] || '#808080';
};

export const formatItemType = (type: string): string => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
