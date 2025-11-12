// types/filters.ts

// Base filter types
export interface RangeFilter {
    min?: number;
    max?: number;
}

export interface SelectFilter {
    value: string;
    label: string;
}

// Main filter interface
export interface PlayerFilters {
    // Search
    search?: string;

    // Basic info
    status?: 'online' | 'offline' | 'banned' | 'suspended';
    alliance?: string;
    role_in_alliance?: 'leader' | 'member';

    // Personal info
    country?: string;
    specialization?: string;
    title?: string;

    // Stats
    level?: RangeFilter;
    power?: RangeFilter;
    win_rate?: RangeFilter;
    victory_points?: RangeFilter;
    territory?: RangeFilter;
    battles?: RangeFilter;
    wins?: RangeFilter;

    // Behavior
    violations_level?: string;
    account_status?: string;

    // Dates
    last_login?: RangeFilter;
    registration_date?: RangeFilter;
}

// URL params structure (how filters are stored in URL)
export interface URLFilterParams {
    // Single values
    search?: string;
    status?: string;
    alliance?: string;
    role_in_alliance?: string;
    country?: string;
    specialization?: string;
    title?: string;
    violations_level?: string;
    account_status?: string;

    // Range values (min/max)
    level_min?: string;
    level_max?: string;
    power_min?: string;
    power_max?: string;
    win_rate_min?: string;
    win_rate_max?: string;
    victory_points_min?: string;
    victory_points_max?: string;
    territory_min?: string;
    territory_max?: string;
    battles_min?: string;
    battles_max?: string;
    wins_min?: string;
    wins_max?: string;
    last_login_min?: string;
    last_login_max?: string;
    registration_date_min?: string;
    registration_date_max?: string;
}

// Form values structure (how filters are handled in the form)
export interface FilterFormValues {
    search?: string;
    status?: string;
    alliance?: string;
    role_in_alliance?: string;
    country?: string;
    specialization?: string;
    title?: string;
    violations_level?: string;
    account_status?: string;

    // Range values as arrays for Antd Slider
    level?: [number, number];
    power?: [number, number];
    win_rate?: [number, number];
    victory_points?: [number, number];
    territory?: [number, number];
    battles?: [number, number];
    wins?: [number, number];
    last_login?: [number, number];
    registration_date?: [number, number];
}

// Options for select filters
export interface FilterOptions {
    allianceOptions: SelectFilter[];
    statusOptions: SelectFilter[];
    roleOptions: SelectFilter[];
    specializationOptions: SelectFilter[];
    countryOptions: SelectFilter[];
    titleOptions: SelectFilter[];
    violationsOptions: SelectFilter[];
    accountStatusOptions: SelectFilter[];
}

// Filter config for validation and defaults
export interface FilterConfig {
    ranges: {
        level: { min: number; max: number };
        power: { min: number; max: number };
        win_rate: { min: number; max: number };
        victory_points: { min: number; max: number };
        territory: { min: number; max: number };
        battles: { min: number; max: number };
        wins: { min: number; max: number };
    };
}

// Props for filter component
export interface PlayerFiltersProps {
    onFilterChange: (filters: PlayerFilters) => void;
    initialFilters?: PlayerFilters;
    loading?: boolean;
}
