export interface Alliance {
    id: string;
    name: string;
    tag: string;
    level: number;
    description: string | null;
    members: number;
    max_members: number;
    leader: string;
    status: 'active' | 'inactive' | 'suspended';
    created_date: string;
    total_power: number;
    victory_points: number;
    win_rate: number;
    territory: number;
    requirements: AllianceRequirements;
}

export interface AllianceRequirements {
    minLevel: number;
    minPower: number;
    approvalRequired: boolean;
}

export interface CreateAllianceData {
    max_members: number;
    name: string;
    tag: string;
    description?: string;
    leader: string;
    requirements?: Partial<AllianceRequirements>;
}

export interface UpdateAllianceData {
    name?: string;
    tag?: string;
    description?: string;
    level?: number;
    max_members?: number;
    status?: 'active' | 'inactive' | 'suspended';
    total_power?: number;
    victory_points?: number;
    win_rate?: number;
    territory?: number;
    requirements?: Partial<AllianceRequirements>;
}

export interface AllianceFilters {
    status?: 'active' | 'inactive' | 'suspended';
    minLevel?: number;
    maxLevel?: number;
    minMembers?: number;
    maxMembers?: number;
    minPower?: number;
    maxPower?: number;
    searchQuery?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number | null;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export interface AllianceStats {
    totalAlliances: number;
    activeAlliances: number;
    inactiveAlliances: number;
    suspendedAlliances: number;
    totalMembers: number;
    totalPower: number;
    totalVictoryPoints: number;
    avgWinRate: number;
    avgMembersPerAlliance: number;
    avgPowerPerAlliance: number;
    totalTerritory: number;
}

export interface AllianceLeaderboardEntry {
    id: string;
    name: string;
    tag: string;
    rank: number;
    total_power: number;
    victory_points: number;
    win_rate: number;
    members: number;
    level: number;
    change?: number; // rank change from previous period
}

export interface AllianceSearchResult {
    id: string;
    name: string;
    tag: string;
    level: number;
    members: number;
    total_power: number;
    win_rate: number;
    status: string;
    requirements: AllianceRequirements;
}
