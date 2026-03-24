import { Quest, QuestRequirement, QuestReward, CreateQuestInput, UpdateQuestInput, QuestCategory, QuestDifficulty, QuestStatus, QuestType } from '@/types'; // Your existing types

export interface QuestFormData extends Partial<Quest> {
  requirements?: Partial<QuestRequirement>[];
  rewards?: Partial<QuestReward>[];
}

export interface QuestFilters {
  search?: string;
  category?: QuestCategory | 'all';
  difficulty?: QuestDifficulty | 'all';
  status?: QuestStatus | 'all';
  type?: QuestType | 'all';
  minLevel?: number;
  maxLevel?: number;
  page?: number;
  pageSize?: number;
}

export interface QuestListResponse {
  data: Quest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RequirementFormData extends Omit<QuestRequirement, 'id' | 'quest_id'> {
  id?: string;
}

export interface RewardFormData extends Omit<QuestReward, 'id' | 'quest_id' | 'created_at'> {
  id?: string;
}

export const DEFAULT_QUEST_FORM: CreateQuestInput = {
  name: '',
  description: '',
  type: 'pve_battle',
  category: 'daily',
  difficulty: 'easy',
  status: 'active',
  completion_limit: 1,
  min_level: 1,
  max_level: 100,
};
