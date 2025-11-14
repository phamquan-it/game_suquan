// types/admin.ts
export interface UserRole {
    role_id: string;
    role_name: string;
}

export interface UserProfileWithPermissions {
    player_id: string;
    user_id: string;
    username: string;
    email: string;
    alliance_role: string;
    status: string;
    avatar: string | null;
    join_date: string;
    last_login: string | null;
    location: string | null;
    title: string | null;
    specialization: string | null;
    ip_address: string | null;
    roles: UserRole[];
    permissions: string[];
    is_admin: boolean;
}


export interface AdminActivity {
    id: string;
    action: string;
    description: string;
    target: string;
    timestamp: string;
    ip: string;
    severity: 'high' | 'medium' | 'low';
}

export interface SecuritySetting {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
    lastUpdated: string;
}
