// Enums based on PostgreSQL enums
export type AchievementType = 
  | 'progression'
  | 'combat'
  | 'exploration'
  | 'collection'
  | 'crafting'
  | 'social'
  | 'economy'
  | 'alliance'
  | 'seasonal'
  | 'milestone'
  | 'secret';

export type AchievementCategory = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master'
  | 'legendary';

export type AchievementTier = 
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'grandmaster';

export type Rarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type AchievementLogic = 'AND' | 'OR';

export type Difficulty = 
  | 'very_easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'very_hard'
  | 'extreme'
  | 'impossible';

export type AchievementStatus = 
  | 'active'
  | 'inactive'
  | 'hidden';



// Main Achievements table
export interface Achievement {
  id: string;                    // varchar(50) primary key
  name: string;                   // varchar(255) not null
  description: string;            // text not null
  type: AchievementType;          // achievement_type enum not null
  category: AchievementCategory;  // achievement_category enum not null
  tier: AchievementTier;          // achievement_tier enum not null
  rarity: Rarity;                 // rarity enum not null
  logic: AchievementLogic;        // achievement_logic enum, default 'AND'
  repeatable: boolean;            // bool default false
  max_completions: number | null; // int4 nullable
  progress_percentage: number | null; // numeric(5,2) default 0
  icon: string | null;            // varchar(500) nullable
  image: string | null;           // varchar(500) nullable
  hidden: boolean;                // bool default false
  secret: boolean;                // bool default false
  points: number;                 // int4 default 0, >= 0
  difficulty: Difficulty;         // difficulty enum not null
  time_limit: number | null;      // int4 nullable
  shareable: boolean;             // bool default true
  completion_rate: number | null; // numeric(5,2) default 0
  average_time: number | null;    // numeric(10,2) default 0
  first_completion: Date | null;  // timestamp nullable
  total_completions: number | null; // int4 default 0
  status: AchievementStatus;      // achievement_status enum default 'active'
  tags: string[] | null;          // _text (text array) nullable
  version: string;                // varchar(20) default '1.0.0'
  created_by: string;             // varchar(100) not null
  created_at: Date;               // timestamp default now()
  updated_at: Date;               // timestamp default now()
}

// Player Achievements junction table
export interface PlayerAchievement {
  id: string;                     // uuid primary key
  player_id: string;              // uuid not null, references players
  achievement_id: string;         // varchar(50) not null, references achievements
  unlocked_at: Date | null;       // timestamptz default now()
  reward_claimed: boolean;        // bool default false
  metadata: Record<string, any> | null; // jsonb default '{}'
  repeat_count: number;           // int4 default 0
}

// Achievement Requirements
export interface AchievementRequirement {
  id: number;                     // serial4 primary key
  achievement_id: string;         // varchar(50) not null, references achievements
  requirement_type: string;       // text not null, references game_actions
  display_text: string | null;    // varchar(500) nullable
  sort_order: number | null;      // int4 default 0
  created_at: Date | null;        // timestamp default now()
  updated_at: Date | null;        // timestamp default now()
  target: number;                 // int4 default 1
}

// Player Achievement Tier Progress
export interface PlayerAchievementTierProgress {
  player_id: string;              // uuid not null, references players
  requirement_id: number;         // int4 not null, references achievement_requirements
  progress: number;               // int4 default 0
  completed: boolean | null;      // bool default false
  reward_claimed: boolean | null; // bool default false
  updated_at: Date | null;        // timestamptz default now()
}

// Achievement Rewards
export interface AchievementReward {
  id: number;                     // serial4 primary key
  item_id: string | null;         // varchar(50) nullable, references base_items
  quantity: number;               // int4 default 1, > 0
  probability: number | null;     // numeric(5,4) default 1.0, between 0 and 1
  currency_type: string | null;   // text nullable, references currencies
  requirement_id: number | null;  // int4 nullable, references achievement_requirements
}

// Game Actions (reference table for requirement types)
export interface GameAction {
  id: string;                     // text primary key
  description: string;            // text not null
  category: string;               // text not null
  repeatable: boolean;            // bool default true
  metadata: Record<string, any>;  // jsonb default '{}'
  created_at: Date;               // timestamptz default now()
}

// Helper types for creating/updating records
export type CreateAchievement = Omit<Achievement, 'id' | 'created_at' | 'updated_at' | 'completion_rate' | 'average_time' | 'first_completion' | 'total_completions'>;
export type UpdateAchievement = Partial<Omit<Achievement, 'id' | 'created_at'>>;

export type CreatePlayerAchievement = Omit<PlayerAchievement, 'id' | 'unlocked_at'>;
export type UpdatePlayerAchievement = Partial<Omit<PlayerAchievement, 'id' | 'player_id' | 'achievement_id'>>;

export type CreateAchievementRequirement = Omit<AchievementRequirement, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAchievementRequirement = Partial<Omit<AchievementRequirement, 'id' | 'achievement_id'>>;

export type CreatePlayerAchievementTierProgress = Omit<PlayerAchievementTierProgress, 'updated_at'>;
export type UpdatePlayerAchievementTierProgress = Partial<Omit<PlayerAchievementTierProgress, 'player_id' | 'requirement_id'>>;

export type CreateAchievementReward = Omit<AchievementReward, 'id'>;
export type UpdateAchievementReward = Partial<Omit<AchievementReward, 'id'>>;

export type CreateGameAction = Omit<GameAction, 'created_at'>;
export type UpdateGameAction = Partial<Omit<GameAction, 'id' | 'created_at'>>;


// Form types
export type AchievementFormData = Omit<
  Achievement,
  'id' | 'created_at' | 'updated_at' | 'completion_rate' | 'average_time' | 'first_completion' | 'total_completions'
>;

// Filter types
export interface AchievementFilters {
  search: string;
  type: string[];
  category: string[];
  tier: string[];
  rarity: string[];
  difficulty: string[];
  status: string[];
  repeatable: boolean | null;
}

// Achievement with relations
export interface AchievementWithRelations extends Achievement {
  requirements?: AchievementRequirement[];
  rewards?: AchievementReward[];
}

// Requirement with reward
export interface RequirementWithReward extends AchievementRequirement {
  rewards?: AchievementReward[];
}

// Stats types
export interface AchievementStats {
  total: number;
  active: number;
  inactive: number;
  hidden: number;
  totalPoints: number;
  avgCompletionRate: number;
  mostUnlocked: Achievement | null;
  leastUnlocked: Achievement | null;
}
