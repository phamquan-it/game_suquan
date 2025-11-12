export * from './battle.types';

// Giữ nguyên các interface cũ và thêm Battle
export interface Battle {
    id: string;
    player1: string;
    player2: string;
    winner: string;
    duration: number;
    timestamp: string;
    type: 'pvp' | 'pve' | 'tournament';
    status: 'completed' | 'ongoing' | 'cancelled';
    rewards: {
        gold: number;
        experience: number;
        items: string[];
    };
}

export interface Player {
    id: string;
    username: string;
    email: string;
    level: number;
    power: number;
    alliance: string;
    status: 'online' | 'offline' | 'banned' | 'suspended';
    lastLogin: string;
    registrationDate: string;
    ipAddress: string;
    country: string;
    violations: number;
    title: string;
    specialization: string;
    victoryPoints: number;
    winRate: number;
    battles: number;
    wins: number;
    territory: number;
}

export interface Alliance {
    id: string;
    name: string;
    tag: string;
    level: number;
    description?: string;
    members: number;
    maxMembers: number;
    leader: string;
    status: 'active' | 'inactive' | 'suspended';
    createdDate: string;
    totalPower: number;
    victoryPoints: number;
    winRate: number;
    territory: number;
    requirements: {
        minLevel: number;
        minPower: number;
        approvalRequired: boolean;
    };
}

export interface SystemStats {
    onlinePlayers: number;
    totalPlayers: number;
    activeAlliances: number;
    totalBattles: number;
    serverUptime: string;
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkTraffic: number;
}

// ... existing types ...

export interface AdminProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'super_admin' | 'game_master' | 'moderator' | 'support' | 'analyst';
    status: 'active' | 'inactive' | 'suspended';
    avatar: string | null;
    phone: string;
    department: string;
    location: string;
    joinDate: string;
    lastLogin: string;
    permissions: string[];
    bio?: string;
}

export interface AdminActivity {
    id: string;
    action: string;
    description: string;
    target: string;
    timestamp: string;
    ip: string;
    severity: 'low' | 'medium' | 'high';
}

export interface SecuritySetting {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
    lastUpdated: string;
}

export interface LoginHistory {
    id: string;
    timestamp: string;
    ip: string;
    location: string;
    device: string;
    browser: string;
    success: boolean;
    failureReason?: string;
}
