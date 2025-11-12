export type BattleType = 'pvp' | 'pve' | 'tournament' | 'alliance_war' | 'boss_raid' | 'territory_war';
export type BattleStatus = 'ongoing' | 'completed' | 'cancelled' | 'pending' | 'timeout';
export type BattleResult = 'win' | 'lose' | 'draw' | 'cancelled';

export interface BattleReward {
    gold: number;
    experience: number;
    items: string[];
    honorPoints?: number;
    alliancePoints?: number;
    specialItems?: {
        id: string;
        name: string;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
        quantity: number;
    }[];
}

export interface BattleParticipant {
    id: string;
    username: string;
    level: number;
    power: number;
    alliance?: string;
    specialization: string;
    heroId?: string;
    heroLevel?: number;
    troops?: {
        infantry: number;
        cavalry: number;
        archers: number;
        siege: number;
    };
    casualties?: {
        infantry: number;
        cavalry: number;
        archers: number;
        siege: number;
        total: number;
    };
}

export interface BattleRound {
    round: number;
    actions: BattleAction[];
    damageDealt: {
        player1: number;
        player2: number;
    };
    hpRemaining: {
        player1: number;
        player2: number;
    };
}

export interface BattleAction {
    timestamp: number;
    actor: string;
    target: string;
    action: 'attack' | 'skill' | 'heal' | 'buff' | 'debuff' | 'ultimate';
    value: number;
    critical: boolean;
    skillId?: string;
    skillName?: string;
}

export interface BattleStatistics {
    totalDamage: number;
    maxDamage: number;
    healing: number;
    criticalHits: number;
    skillsUsed: number;
    rounds: number;
    duration: number;
}

export interface BattleCheatDetection {
    suspicious: boolean;
    flags: string[];
    confidence: number;
    details?: {
        speedHack: boolean;
        damageModification: boolean;
        cooldownExploit: boolean;
        resourceManipulation: boolean;
    };
}

export interface Battle {
    // Basic Information
    id: string;
    type: BattleType;
    status: BattleStatus;
    timestamp: string;
    duration: number;

    // Participants
    player1: BattleParticipant | string; // Can be object or just username for simple cases
    player2: BattleParticipant | string;
    winner?: string;
    loser?: string;
    result?: BattleResult;

    // Battle Details
    rounds?: BattleRound[];
    statistics?: {
        player1: BattleStatistics;
        player2: BattleStatistics;
    };

    // Rewards
    rewards: BattleReward;
    penalty?: {
        gold: number;
        experience: number;
        reason: string;
    };

    // Location & Context
    location?: {
        map: string;
        x: number;
        y: number;
        territory?: string;
    };
    allianceWar?: {
        alliance1: string;
        alliance2: string;
        warId: string;
    };

    // System Information
    server: string;
    version: string;
    battleLogId?: string;

    // Cheat Detection
    cheatDetection?: BattleCheatDetection;

    // Tournament Information
    tournament?: {
        id: string;
        name: string;
        round: number;
        bracket: string;
    };

    // Technical Metadata
    createdAt: string;
    updatedAt: string;
    processed: boolean;
}

// For real-time battle monitoring
export interface LiveBattle extends Battle {
    spectators: number;
    startTime: string;
    estimatedEndTime?: string;
    currentRound: number;
    lastActionTime: string;
}

// For battle analytics
export interface BattleAnalytics {
    totalBattles: number;
    pvpBattles: number;
    pveBattles: number;
    tournamentBattles: number;
    allianceWarBattles: number;
    averageDuration: number;
    winRates: {
        overall: number;
        pvp: number;
        pve: number;
        tournament: number;
    };
    popularMaps: Array<{
        map: string;
        battles: number;
        winRate: number;
    }>;
    peakHours: Array<{
        hour: number;
        battles: number;
    }>;
    rewardDistribution: {
        gold: number;
        experience: number;
        items: number;
    };
}

// For battle filters
export interface BattleFilters {
    type?: BattleType | 'all';
    status?: BattleStatus | 'all';
    dateRange?: [Date, Date];
    player?: string;
    alliance?: string;
    tournament?: string;
    minDuration?: number;
    maxDuration?: number;
    hasCheating?: boolean;
}

// API Response Types
export interface BattleListResponse {
    battles: Battle[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface BattleDetailResponse {
    battle: Battle;
    participants: BattleParticipant[];
    rounds: BattleRound[];
    log: BattleAction[];
}

// Real-time Events
export interface BattleEvent {
    type: 'battle_start' | 'battle_end' | 'round_start' | 'round_end' | 'action' | 'battle_cancelled';
    battleId: string;
    data: any;
    timestamp: string;
}
