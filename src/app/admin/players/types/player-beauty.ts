// types/player-beauty.ts

export type BeautyCharacter = {
  id: string;
  name: string;
  title: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  avatar: string;
  full_image: string;
};

export type PlayerBeauty = {
  id: string;
  player_id: string;
  beauty_id: string;
  level: number;
  experience: number;
  status: 'available' | 'mission' | 'training' | 'resting';
  intimacy_points: number;
  intimacy_level: number;
  acquisition_date: string;
};

export type PlayerBeautyWithDetail = PlayerBeauty & {
  beauty: BeautyCharacter;
};
