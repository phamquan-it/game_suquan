import { TagProps } from 'antd';
import { Quest, QuestCategory, QuestDifficulty, QuestStatus, QuestType } from '../types';

export const getCategoryColor = (category: QuestCategory): string => {
  const colors: Record<QuestCategory, string> = {
    daily: 'blue',
    weekly: 'purple',
    alliance: 'green',
    event: 'orange',
  };
  return colors[category] || 'default';
};

export const getDifficultyColor = (difficulty: QuestDifficulty): string => {
  const colors: Record<QuestDifficulty, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
    expert: 'volcano',
  };
  return colors[difficulty] || 'default';
};

export const getStatusColor = (status: QuestStatus): TagProps['color'] => {
  return status === 'active' ? 'success' : 'error';
};

export const getQuestTypeLabel = (type: QuestType): string => {
  const labels: Record<QuestType, string> = {
    login: 'Đăng nhập',
    pvp_battle: 'Chiến đấu PvP',
    pve_battle: 'Chiến đấu PvE',
    exploration: 'Khám phá',
    boss_hunt: 'Săn Boss',
    alliance: 'Bang hội',
    alliance_battle: 'Chiến đấu Bang hội',
    crafting: 'Chế tạo',
    beauty: 'Làm đẹp',
  };
  return labels[type];
};

export const validateLevelRange = (minLevel: number, maxLevel: number): boolean => {
  return minLevel <= maxLevel && minLevel >= 1 && maxLevel <= 100;
};

export const formatQuestName = (quest: Quest): string => {
  return `${quest.name} (Cấp ${quest.min_level}-${quest.max_level})`;
};
