// hooks/useAllianceQueries.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import type {
    Alliance,
    AllianceFilters,
    AllianceStats,
    AllianceLeaderboardEntry,
    AllianceSearchResult,
    PaginatedResponse
} from '@/types/alliance';

export const useAlliances = (filters?: AllianceFilters, pageSize: number = 10) => {
    return useQuery({
        queryKey: ['alliances', filters],
        queryFn: async () => {
            let query = supabase
                .from('alliances')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.minLevel) {
                query = query.gte('level', filters.minLevel);
            }
            if (filters?.maxLevel) {
                query = query.lte('level', filters.maxLevel);
            }
            if (filters?.minMembers) {
                query = query.gte('members', filters.minMembers);
            }
            if (filters?.maxMembers) {
                query = query.lte('members', filters.maxMembers);
            }
            if (filters?.minPower) {
                query = query.gte('total_power', filters.minPower);
            }
            if (filters?.maxPower) {
                query = query.lte('total_power', filters.maxPower);
            }
            if (filters?.searchQuery) {
                query = query.or(`name.ilike.%${filters.searchQuery}%,tag.ilike.%${filters.searchQuery}%`);
            }

            const { data, error, count } = await query
                .order('total_power', { ascending: false })
                .limit(pageSize);

            if (error) throw error;

            return {
                data: data as Alliance[],
                totalCount: count,
            };
        },
    });
};

export const useAllianceStats = () => {
    return useQuery({
        queryKey: ['alliance-stats'],
        queryFn: async (): Promise<AllianceStats> => {
            const { data, error } = await supabase
                .from('alliances')
                .select('status, members, total_power, victory_points, win_rate, territory');

            if (error) throw error;

            const alliances = data as Alliance[];

            return {
                totalAlliances: alliances.length,
                activeAlliances: alliances.filter(a => a.status === 'active').length,
                inactiveAlliances: alliances.filter(a => a.status === 'inactive').length,
                suspendedAlliances: alliances.filter(a => a.status === 'suspended').length,
                totalMembers: alliances.reduce((sum, a) => sum + a.members, 0),
                totalPower: alliances.reduce((sum, a) => sum + a.total_power, 0),
                totalVictoryPoints: alliances.reduce((sum, a) => sum + a.victory_points, 0),
                avgWinRate: alliances.length > 0 ? alliances.reduce((sum, a) => sum + a.win_rate, 0) / alliances.length : 0,
                avgMembersPerAlliance: alliances.length > 0 ? alliances.reduce((sum, a) => sum + a.members, 0) / alliances.length : 0,
                avgPowerPerAlliance: alliances.length > 0 ? alliances.reduce((sum, a) => sum + a.total_power, 0) / alliances.length : 0,
                totalTerritory: alliances.reduce((sum, a) => sum + a.territory, 0),
            };
        },
    });
};

export const useAllianceLeaderboard = (limit: number = 10) => {
    return useQuery({
        queryKey: ['alliance-leaderboard', limit],
        queryFn: async (): Promise<AllianceLeaderboardEntry[]> => {
            const { data, error } = await supabase
                .from('alliances')
                .select('*')
                .order('total_power', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return (data as Alliance[]).map((alliance, index) => ({
                id: alliance.id,
                name: alliance.name,
                tag: alliance.tag,
                rank: index + 1,
                total_power: alliance.total_power,
                victory_points: alliance.victory_points,
                win_rate: alliance.win_rate,
                members: alliance.members,
                level: alliance.level,
            }));
        },
    });
};

export const useSearchAlliances = (searchQuery: string, limit: number = 5) => {
    return useQuery({
        queryKey: ['search-alliances', searchQuery],
        queryFn: async (): Promise<AllianceSearchResult[]> => {
            if (!searchQuery.trim()) return [];

            const { data, error } = await supabase
                .from('alliances')
                .select('*')
                .or(`name.ilike.%${searchQuery}%,tag.ilike.%${searchQuery}%`)
                .limit(limit);

            if (error) throw error;

            return (data as Alliance[]).map(alliance => ({
                id: alliance.id,
                name: alliance.name,
                tag: alliance.tag,
                level: alliance.level,
                members: alliance.members,
                total_power: alliance.total_power,
                win_rate: alliance.win_rate,
                status: alliance.status,
                requirements: alliance.requirements,
            }));
        },
        enabled: searchQuery.length > 0,
    });
};

export const useAlliance = (id: string) => {
    return useQuery({
        queryKey: ['alliance', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('alliances')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Alliance;
        },
        enabled: !!id,
    });
};

export const useInfiniteAlliances = (filters?: AllianceFilters, pageSize: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['infinite-alliances', filters],
        queryFn: async ({ pageParam = 0 }): Promise<PaginatedResponse<Alliance>> => {
            const from = pageParam * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('alliances')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.searchQuery) {
                query = query.or(`name.ilike.%${filters.searchQuery}%,tag.ilike.%${filters.searchQuery}%`);
            }

            const { data, error, count } = await query
                .order('created_date', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                data: data as Alliance[],
                totalCount: count,
                page: pageParam,
                pageSize,
                hasNextPage: (data?.length || 0) === pageSize,
            };
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasNextPage ? pages.length : undefined;
        },
        initialPageParam: 0,
    });
};
