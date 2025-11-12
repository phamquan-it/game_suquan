import { Player } from "./admin.types";

export interface ChatConnection {
    id: string;
    player_id: string;
    connection_id: string;
    status: 'online' | 'away' | 'dnd' | 'offline';
    last_seen: string;
    device_info: {
        platform: string;
        browser: string;
        version: string;
        isMobile: boolean;
    };
    ip_address: string;
    player?: Player;
}

export interface ChatMessage {
    id: string;
    sender_id: string;
    message_type: 'text' | 'image' | 'system' | 'trade' | 'item';
    content: string;
    channel_type: 'world' | 'alliance' | 'group' | 'private';
    channel_id?: string;
    recipient_id?: string;
    created_date: string;
    is_edited: boolean;
    is_deleted: boolean;
    metadata: any;
    sender?: {
        username: string;
        avatar_url: string;
    };
    recipient?: {
        username: string;
    };
    group?: {
        name: string;
    };
}

export interface ChatGroup {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private' | 'alliance';
    owner_id: string;
    max_members: number;
    created_date: string;
    avatar_url: string;
    is_active: boolean;
    member_count?: number;
    owner?: {
        username: string;
    };
}

export interface FriendRelationship {
    id: string;
    player_id: string;
    friend_id: string;
    status: 'pending' | 'accepted' | 'blocked' | 'rejected';
    created_date: string;
    accepted_date?: string;
    nickname?: string;
    favorite: boolean;
    notes?: string;
    friend?: {
        username: string;
        avatar_url: string;
        level: number;
        status: string;
    };
}

export interface DirectTrade {
    id: string;
    initiator_id: string;
    recipient_id: string;
    status: 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
    created_date: string;
    expired_date: string;
    completed_date?: string;
    initiator_items: any[];
    recipient_items: any[];
    initiator_currency: any[];
    recipient_currency: any[];
    trade_message?: string;
    initiator?: {
        username: string;
        avatar_url: string;
    };
    recipient?: {
        username: string;
        avatar_url: string;
    };
}
