interface Alliance {
    id: string;
    name: string;
    tag: string;
    level: number;
    rank: number;
    totalPower: number;
    memberCount: number;
    maxMembers: number;
    territory: number;
    victoryPoints: number;
    winRate: number;
    avgMemberLevel: number;
    leader: string;
    foundedDate: string;
    region: string;
    language: string;
    requirements: {
        minLevel: number;
        minPower: number;
        approvalRequired: boolean;
    };
    status: 'recruiting' | 'full' | 'closed' | 'inviteOnly';
    achievements: string[];
    recentActivity: string;
    joinType: 'open' | 'approval' | 'invite';
    discord?: string;
    website?: string;
    description: string;
    specialties: string[];
}

interface AllianceMember {
    id: string;
    name: string;
    level: number;
    power: number;
    role: 'leader' | 'deputy' | 'elite' | 'member' | 'recruit';
    joinDate: string;
    lastActive: string;
    contribution: number;
    status: 'online' | 'offline' | 'away';
    avatar: string;
}

interface AllianceStats {
    totalBattles: number;
    wins: number;
    losses: number;
    winRate: number;
    totalTerritory: number;
    averagePower: number;
    seasonRank: number;
    eventWins: number;
    resources: {
        gold: number;
        wood: number;
        stone: number;
        food: number;
    };
}


