// types/player-general.ts

export type General = {
  id: string;
  name: string;
  title?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  element: 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark';
  type: string;

  level: number;
  max_level: number;

  base_attack: number;
  base_defense: number;
  base_health: number;
  base_speed: number;
  base_intelligence: number;
  base_leadership: number;

  image?: string;
  thumbnail?: string;
};

export type PlayerGeneral = {
  id: string;
  player_id: string;
  general_id: string;

  level: number;
  experience: number;

  star_level: number;
  max_star_level: number;

  awakening_level: number;
  bond_level: number;

  current_attack: number;
  current_defense: number;
  current_health: number;
  current_speed: number;
  current_intelligence: number;
  current_leadership: number;

  favorite: boolean;

  obtained_date?: string;
  last_used?: string;

  battle_count: number;
  win_rate: number;
};

export type PlayerGeneralWithDetail = PlayerGeneral & {
  general: General;
};
