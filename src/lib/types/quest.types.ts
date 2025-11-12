export interface DailyQuest {
    id: string;
    name: string;
    description: string;
    type: 'login' | 'pvp_battle' | 'pve_battle' | 'exploration' | 'boss_hunt' | 'alliance' | 'crafting';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    status: 'active' | 'inactive';
    requirements: {
        type: string;
        target: number;
        bossLevel?: number;
        allianceLevel?: number;
        itemRequired?: string;
    };
    rewards: {
        gold: number;
        experience: number;
        diamonds?: number;
        items: string[];
        alliancePoints?: number;
        honorPoints?: number;
    };
    schedule: {
        startTime: string; // HH:mm
        endTime: string; // HH:mm
        resetDaily: boolean;
        daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    };
    completionLimit: number;
    currentCompletions: number;
    maxCompletions: number;
    createdAt: string;
    updatedAt: string;
}

export interface QuestStats {
    totalQuests: number;
    activeQuests: number;
    completedToday: number;
    completionRate: number;
    totalRewards: number;
    playerEngagement: number;
    popularQuests: Array<{
        questId: string;
        name: string;
        completions: number;
    }>;
}

export interface QuestTemplate {
    id: string;
    name: string;
    type: string;
    difficulty: string;
    baseRewards: {
        gold: number;
        experience: number;
        items: string[];
    };
    requirements: {
        type: string;
        target: number;
    };
    description: string;
}

export interface PlayerQuestProgress {
    playerId: string;
    playerName: string;
    questId: string;
    questName: string;
    progress: number;
    target: number;
    completed: boolean;
    completedAt?: string;
    claimed: boolean;
}

export interface QuestCompletionLog {
    id: string;
    playerId: string;
    playerName: string;
    questId: string;
    questName: string;
    completedAt: string;
    rewards: {
        gold: number;
        experience: number;
        items: string[];
    };
    ip: string;
    server: string;
}
