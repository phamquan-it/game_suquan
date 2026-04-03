import General from "@/app/admin/generals/types";

// 📁 lib/utils/hero-utils.ts
export const getRarityColor = (rarity: string): string => {
  return {
    common: '#8C8C8C',
    rare: '#1890FF',
    epic: '#722ED1',
    legendary: '#FA8C16',
    mythical: '#F5222D'
  }[rarity] || '#8C8C8C';
};

export const getElementColor = (element: string): string => {
  return {
    fire: '#FF4D4F',
    water: '#1890FF',
    earth: '#52C41A',
    wind: '#13C2C2',
    light: '#FAAD14',
    dark: '#722ED1'
  }[element] || '#8C8C8C';
};

export const getRarityIcon = (rarity: string): React.ReactNode => {
  return {
    common: '⭐',
    rare: '🌟🌟',
    epic: '🌟🌟🌟',
    legendary: '🌟🌟🌟🌟',
    mythical: '🌟🌟🌟🌟🌟'
  }[rarity] || '⭐';
};

export const calculateHeroPower = (hero: General): number => {
  return 100;
};
