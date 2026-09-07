export const getTableColor = (tableName: string) => {
  const colors: Record<string, string> = {
    'users': '#E3F2FD',
    'orders': '#FFF3E0',
    'products': '#E8F5E9',
    'categories': '#FCE4EC',
    'profiles': '#F3E5F5',
    'messages': '#E0F7FA',
    'players': '#E8EAF6',
    'teams': '#FFF8E1',
    'player_generals': '#F3E5F5',
    'club': '#E0F2F1',
  };
  return colors[tableName?.toLowerCase()] || '#FFFFFF';
};

export const getBorderColor = (tableName: string) => {
  const colors: Record<string, string> = {
    'users': '#1976D2',
    'orders': '#F57C00',
    'products': '#388E3C',
    'categories': '#C2185B',
    'profiles': '#7B1FA2',
    'messages': '#00838F',
    'players': '#3949AB',
    'teams': '#F9A825',
    'player_generals': '#7B1FA2',
    'club': '#00796B',
  };
  return colors[tableName?.toLowerCase()] || '#8B0000';
};

