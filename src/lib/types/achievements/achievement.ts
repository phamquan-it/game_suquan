import { BaseItem, Rarity } from "@/types/items/base";
import { AchievementRequirement } from "./requirements";
import { RewardItem } from "../loot-box";

// lib/types/achievements/achievement.ts
export interface Achievement {
    id: string;
    name: string;
    description: string;
    type: AchievementType;
    category: AchievementCategory;
    tier: AchievementTier;
    rarity: Rarity;

    // Requirements
    requirements: AchievementRequirement[];
    logic: 'AND' | 'OR'; // All requirements or any requirement

    // Rewards
    rewards: Array<RewardItem>;
    repeatable: boolean;
    maxCompletions?: number; // For repeatable achievements

    // Progress Tracking
    progress: {
        current: number;
        target: number;
        percentage: number;
    };

    // Metadata
    icon: string;
    image: string;
    hidden: boolean; // Hidden until discovered
    secret: boolean; // Never shown until completed

    // Gameplay
    points: number;
    difficulty: Difficulty;
    timeLimit?: number; // Time limit in seconds (optional)

    // Social
    shareable: boolean;
    globalStats: {
        completionRate: number;
        averageTime: number;
        firstCompletion?: string;
        totalCompletions: number;
    };

    // Administrative
    status: 'active' | 'inactive' | 'hidden';
    tags: string[];
    version: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;

    // Events
    triggers: string[]; // Event names that trigger progress
}

// Achievement Types
export type AchievementType =
    | 'progression'    // Level-based
    | 'combat'         // Battle-related
    | 'exploration'    // Map discovery
    | 'collection'     // Item collection
    | 'crafting'       // Crafting related
    | 'social'         // Social interactions
    | 'economy'        // Economy related
    | 'alliance'       // Alliance activities
    | 'seasonal'       // Seasonal events
    | 'milestone'      // Major milestones
    | 'secret';        // Hidden discoveries

// Achievement Categories
export type AchievementCategory =
    | 'beginner'       // New player
    | 'intermediate'   // Experienced player
    | 'advanced'       // Veteran player
    | 'expert'         // Elite player
    | 'master'         // Master player
    | 'legendary';     // Legendary challenges

// Achievement Tiers
export type AchievementTier =
    | 'bronze'
    | 'silver'
    | 'gold'
    | 'platinum'
    | 'diamond'
    | 'master'
    | 'grandmaster';

// Difficulty Levels
export type Difficulty =
    | 'very_easy'
    | 'easy'
    | 'medium'
    | 'hard'
    | 'very_hard'
    | 'extreme'
    | 'impossible';
