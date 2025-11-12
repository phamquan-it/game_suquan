// 📁 lib/utils/hero-utils.ts
export const getRarityColor = (rarity: string): string => {
    const colors = {
        common: '#8C8C8C',
        rare: '#1890FF',
        epic: '#722ED1',
        legendary: '#FA8C16',
        mythical: '#F5222D'
    };
    return colors[rarity] || '#8C8C8C';
};

export const getElementColor = (element: string): string => {
    const colors = {
        fire: '#FF4D4F',
        water: '#1890FF',
        earth: '#52C41A',
        wind: '#13C2C2',
        light: '#FAAD14',
        dark: '#722ED1'
    };
    return colors[element] || '#8C8C8C';
};

export const getRarityIcon = (rarity: string): React.ReactNode => {
    const icons = {
        common: '⭐',
        rare: '🌟🌟',
        epic: '🌟🌟🌟', 
        legendary: '🌟🌟🌟🌟',
        mythical: '🌟🌟🌟🌟🌟'
    };
    return icons[rarity] || '⭐';
};

export const calculateHeroPower = (hero: Hero): number => {
    const { stats } = hero;
    return Math.floor(
        (stats.attack * 0.3) +
        (stats.defense * 0.25) +
        (stats.health * 0.2) +
        (stats.speed * 0.15) +
        (stats.intelligence * 0.1)
    );
};
