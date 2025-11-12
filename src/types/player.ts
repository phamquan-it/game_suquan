// types/player.ts
export interface Player {
    id: string;
    username: string;
    email: string;
    level: number;
    power: number;
    alliance?: string | null;
    status: 'online' | 'offline' | 'banned' | 'suspended';
    last_login?: string | null;
    registration_date: string;
    ip_address?: string | null;
    country?: string | null;
    violations: number;
    title?: string | null;
    specialization?: string | null;
    victory_points: number;
    win_rate: number;
    battles: number;
    wins: number;
    territory: number;
    avatar?: string | null;
    role_in_alliance: 'leader' | 'member';
}

export interface CreatePlayerData {
    username: string;
    email: string;
    level?: number;
    power?: number;
    alliance?: string;
    status?: 'online' | 'offline' | 'banned' | 'suspended';
    country?: string;
    specialization?: string;
    title?: string;
    role_in_alliance?: 'leader' | 'member';
}

export interface UpdatePlayerData {
    username?: string;
    email?: string;
    level?: number;
    power?: number;
    alliance?: string | null;
    status?: 'online' | 'offline' | 'banned' | 'suspended';
    country?: string | null;
    violations?: number;
    title?: string | null;
    specialization?: string | null;
    victory_points?: number;
    win_rate?: number;
    battles?: number;
    wins?: number;
    territory?: number;
    avatar?: string | null;
    role_in_alliance?: 'leader' | 'member';
}

export interface PlayerFilters {
    search?: string;
    status?: string;
    alliance?: string;
    level_min?: number;
    level_max?: number;
    power_min?: number;
    power_max?: number;
    win_rate_min?: number;
    win_rate_max?: number;
    country?: string;
    specialization?: string;
    violations_min?: number;
    violations_max?: number;
}

export interface PlayersResponse {
    players: Player[];
    totalCount: number;
    page: number;
    pageSize: number;
}
