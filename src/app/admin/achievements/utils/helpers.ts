// app/admin/achievements/utils/helpers.ts
import { Achievement } from '../types';

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#808080',
    uncommon: '#32CD32',
    rare: '#4169E1',
    epic: '#9370DB',
    legendary: '#FFA500',
    mythic: '#FF1493',
  };
  return colors[rarity as keyof typeof colors] || '#000000';
};

export const getTierColor = (tier: string): string => {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
    master: '#8A2BE2',
    grandmaster: '#FF4500',
  };
  return colors[tier as keyof typeof colors] || '#000000';
};

export const getDifficultyLabel = (difficulty: string): string => {
  const labels = {
    very_easy: 'Very Easy',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    very_hard: 'Very Hard',
    extreme: 'Extreme',
    impossible: 'Impossible',
  };
  return labels[difficulty as keyof typeof labels] || difficulty;
};

export const validateAchievement = (achievement: Partial<Achievement>): string[] => {
  const errors: string[] = [];

  if (!achievement.id) errors.push('ID is required');
  if (!achievement.name) errors.push('Name is required');
  if (!achievement.type) errors.push('Type is required');
  if (!achievement.category) errors.push('Category is required');
  if (!achievement.tier) errors.push('Tier is required');
  if (!achievement.rarity) errors.push('Rarity is required');
  if (!achievement.difficulty) errors.push('Difficulty is required');

  if (achievement.points && achievement.points < 0) {
    errors.push('Points must be non-negative');
  }

  if (achievement.progress_percentage) {
    if (achievement.progress_percentage < 0 || achievement.progress_percentage > 100) {
      errors.push('Progress percentage must be between 0 and 100');
    }
  }

  return errors;
};
