// lib/types/achievements/requirements.ts
export interface AchievementRequirement {
    id: string;
    type: RequirementType;
    description: string;

    // Progress tracking
    current: number;
    target: number;

    // Conditional logic
    conditions?: Condition[];
    operator?: 'AND' | 'OR';

    // Metadata
    hidden: boolean;
    order: number;
}

export type RequirementType =
    | 'level'                  // Reach level X
    | 'quest_completion'       // Complete quests
    | 'item_collection'        // Collect items
    | 'kill_count'             // Defeat enemies
    | 'boss_defeat'            // Defeat specific boss
    | 'alliance_join'          // Join an alliance
    | 'alliance_level'         // Reach alliance level
    | 'crafting_count'         // Craft items
    | 'exploration'            // Discover locations
    | 'time_played'            // Play for X hours
    | 'login_streak'           // Consecutive logins
    | 'pvp_wins'               // PvP victories
    | 'pve_wins'               // PvE victories
    | 'resource_gathering'     // Gather resources
    | 'currency_earned'        // Earn currency
    | 'item_enhancement'       // Enhance items
    | 'skill_mastery'          // Master skills
    | 'title_earned'           // Earn titles
    | 'mount_collection'       // Collect mounts
    | 'pet_collection'         // Collect pets
    | 'achievement_points'     // Earn achievement points
    | 'seasonal_event'         // Participate in events
    | 'time_limited'           // Complete within time limit
    | 'combo'                  // Chain actions
    | 'perfection'             // Perfect execution;

export interface Condition {
    type: 'item_owned' | 'quest_completed' | 'level_min' | 'level_max' | 'time_of_day';
    value: any;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
}
