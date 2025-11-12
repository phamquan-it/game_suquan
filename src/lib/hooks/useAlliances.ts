import { AllianceFilters, AllianceLeaderboardEntry, AllianceRequirements, AllianceSearchResult, CreateAllianceData, PaginatedResponse, UpdateAllianceData } from "@/types/alliance";
import { supabase } from "@/utils/supabase/client";

export const allianceService = {
    // Get all alliances with pagination and filtering
    async getAlliances(
        page: number = 0,
        pageSize: number = 20,
        filters: AllianceFilters = {}
    ): Promise<PaginatedResponse<Alliance>> {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from('alliances')
            .select('*', { count: 'exact' });

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.minLevel) {
            query = query.gte('level', filters.minLevel);
        }

        if (filters.maxLevel) {
            query = query.lte('level', filters.maxLevel);
        }

        if (filters.minMembers) {
            query = query.gte('members', filters.minMembers);
        }

        if (filters.maxMembers) {
            query = query.lte('members', filters.maxMembers);
        }

        if (filters.minPower) {
            query = query.gte('total_power', filters.minPower);
        }

        if (filters.maxPower) {
            query = query.lte('total_power', filters.maxPower);
        }

        if (filters.searchQuery) {
            query = query.or(`name.ilike.%${filters.searchQuery}%,tag.ilike.%${filters.searchQuery}%`);
        }

        const { data, error, count } = await query
            .range(from, to)
            .order('total_power', { ascending: false });

        if (error) throw error;

        return {
            data: data as Alliance[],
            totalCount: count,
            page,
            pageSize,
            hasNextPage: to < (count || 0) - 1
        };
    },

    // Get alliance by ID
    async getAllianceById(id: string): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Alliance;
    },

    // Get alliances by status with pagination
    async getAlliancesByStatus(
        status: 'active' | 'inactive' | 'suspended',
        page: number = 0,
        pageSize: number = 20
    ): Promise<PaginatedResponse<Alliance>> {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from('alliances')
            .select('*', { count: 'exact' })
            .eq('status', status)
            .range(from, to)
            .order('created_date', { ascending: false });

        if (error) throw error;

        return {
            data: data as Alliance[],
            totalCount: count,
            page,
            pageSize,
            hasNextPage: to < (count || 0) - 1
        };
    },

    // Search alliances by name or tag
    async searchAlliances(query: string, limit: number = 10): Promise<AllianceSearchResult[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('id, name, tag, level, members, total_power, win_rate, status, requirements')
            .or(`name.ilike.%${query}%,tag.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;
        return data as AllianceSearchResult[];
    },

    // Create new alliance
    async createAlliance(allianceData: CreateAllianceData): Promise<Alliance> {
        const defaultRequirements: AllianceRequirements = {
            minLevel: 1,
            minPower: 0,
            approvalRequired: false
        };

        const payload = {
            ...allianceData,
            requirements: {
                ...defaultRequirements,
                ...allianceData.requirements
            }
        };

        const { data, error } = await supabase
            .from('alliances')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    },

    // Update alliance
    async updateAlliance(id: string, updates: UpdateAllianceData): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    },

    // Update alliance status
    async updateAllianceStatus(
        id: string,
        status: 'active' | 'inactive' | 'suspended'
    ): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    },

    // Delete alliance (soft delete by setting status to inactive)
    async deleteAlliance(id: string): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .update({ status: 'inactive' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    },

//    // Get alliance statistics for dashboard
//    async getAllianceStats(): Promise<AllianceStats> {
//        const { data, error } = await supabase
//            .from('alliances')
//            .select('status, total_power, victory_points, win_rate, members, territory');
//
//        if (error) throw error;
//
//        const alliances = (data || []) as Alliance[];
//
//        if (alliances.length === 0) {
//            // Return default stats if no data
//            return {
//                totalAlliances: 0,
//                activeAlliances: 0,
//                inactiveAlliances: 0,
//                suspendedAlliances: 0,
//                totalMembers: 0,
//                totalPower: 0,
//                totalVictoryPoints: 0,
//                avgWinRate: 0,
//                avgMembersPerAlliance: 0,
//                avgPowerPerAlliance: 0,
//                totalTerritory: 0,
//            };
//        }
//
//        const totalAlliances = alliances.length;
//        const activeAlliances = alliances.filter(a => a.status === 'active').length;
//        const inactiveAlliances = alliances.filter(a => a.status === 'inactive').length;
//        const suspendedAlliances = alliances.filter(a => a.status === 'suspended').length;
//
//        const totalMembers = alliances.reduce((sum, a) => sum + (a.members || 0), 0);
//        const totalPower = alliances.reduce((sum, a) => sum + (a.total_power || 0), 0);
//        const totalVictoryPoints = alliances.reduce((sum, a) => sum + (a.victory_points || 0), 0);
//        const totalTerritory = alliances.reduce((sum, a) => sum + (a.territory || 0), 0);
//        const avgWinRate = alliances.reduce((sum, a) => sum + (a.win_rate || 0), 0) / totalAlliances;
//
//        return {
//            totalAlliances,
//            activeAlliances,
//            inactiveAlliances,
//            suspendedAlliances,
//            totalMembers,
//            totalPower,
//            totalVictoryPoints,
//            avgWinRate,
//            avgMembersPerAlliance: totalMembers / totalAlliances,
//            avgPowerPerAlliance: totalPower / totalAlliances,
//            totalTerritory,
//        };
//    }
//
    // Get top alliances by power
    async getTopAlliances(limit: number = 10): Promise<Alliance[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .order('total_power', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as Alliance[];
    },

    // Get alliance leaderboard with ranking
    async getAllianceLeaderboard(limit: number = 50): Promise<AllianceLeaderboardEntry[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('id, name, tag, total_power, victory_points, win_rate, members, level')
            .order('total_power', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data as AllianceLeaderboardEntry[]).map((alliance, index) => ({
            ...alliance,
            rank: index + 1
        }));
    },

    // Bulk update alliance powers (for batch processing)
    async bulkUpdateAlliancePowers(updates: Array<{ id: string; total_power: number }>): Promise<void> {
        const { error } = await supabase
            .from('alliances')
            .upsert(updates);

        if (error) throw error;
    },

    // Get alliances by leader
    async getAlliancesByLeader(leaderId: string): Promise<Alliance[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .eq('leader', leaderId)
            .order('created_date', { ascending: false });

        if (error) throw error;
        return data as Alliance[];
    },

    // Check if alliance name or tag exists
    async checkAllianceExists(name: string, tag: string): Promise<{ nameExists: boolean; tagExists: boolean }> {
        const [nameCheck, tagCheck] = await Promise.all([
            supabase
                .from('alliances')
                .select('id')
                .eq('name', name)
                .single(),
            supabase
                .from('alliances')
                .select('id')
                .eq('tag', tag)
                .single()
        ]);

        return {
            nameExists: !!nameCheck.data,
            tagExists: !!tagCheck.data
        };
    },

    // Update alliance requirements
    async updateAllianceRequirements(
        id: string,
        requirements: Partial<AllianceRequirements>
    ): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .update({ requirements })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    },

    // Get alliances with territory
    async getAlliancesWithTerritory(minTerritory: number = 1): Promise<Alliance[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .gte('territory', minTerritory)
            .order('territory', { ascending: false });

        if (error) throw error;
        return data as Alliance[];
    },

    // Increment alliance victory points
    async incrementVictoryPoints(id: string, points: number = 1): Promise<Alliance> {
        const { data, error } = await supabase
            .rpc('increment_alliance_victory_points', {
                alliance_id: id,
                points
            });

        if (error) throw error;
        return data as Alliance;
    },

    // Update alliance win rate
    async updateWinRate(id: string, wins: number, totalBattles: number): Promise<Alliance> {
        const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

        const { data, error } = await supabase
            .from('alliances')
            .update({ win_rate: winRate })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Alliance;
    }
};
