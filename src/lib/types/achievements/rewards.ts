// lib/types/achievements/player-achievement.ts
export interface PlayerAchievement {
    id: string;
    achievementId: string;
    playerId: string;

    // Progress
    completed: boolean;
    completionDate?: string;
    completionTime?: number; // Time taken in seconds

    // Progress tracking
    requirements: PlayerRequirement[];
    currentProgress: number;
    totalProgress: number;

    // Rewards
    rewardsClaimed: boolean;
    rewardClaimDate?: string;

    // Statistics
    attempts: number;
    bestProgress: number;
    lastUpdated: string;

    // Multi-completion for repeatable achievements
    completionCount: number;
    lastCompletionDate?: string;
}

export interface PlayerRequirement {
    requirementId: string;
    current: number;
    target: number;
    completed: boolean;
}
