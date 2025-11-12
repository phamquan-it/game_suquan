import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Player, CreatePlayerData, UpdatePlayerData, PlayerFilters, PlayersResponse } from '@/types/player';

export class PlayerService {
    // Get players with pagination and filtering
    async getPlayers(
        page: number = 1,
        pageSize: number = 5,
        filters: PlayerFilters = {}
    ): Promise<PlayersResponse> {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from('players')
            .select('*', { count: 'exact' })
            .range(from, to);

        // Apply filters
        if (filters.search) {
            query = query.or(`username.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.alliance) {
            query = query.eq('alliance', filters.alliance);
        }

        if (filters.country) {
            query = query.eq('country', filters.country);
        }

        if (filters.specialization) {
            query = query.eq('specialization', filters.specialization);
        }

        if (filters.level_min !== undefined) {
            query = query.gte('level', filters.level_min);
        }

        if (filters.level_max !== undefined) {
            query = query.lte('level', filters.level_max);
        }

        if (filters.power_min !== undefined) {
            query = query.gte('power', filters.power_min);
        }

        if (filters.power_max !== undefined) {
            query = query.lte('power', filters.power_max);
        }

        if (filters.win_rate_min !== undefined) {
            query = query.gte('win_rate', filters.win_rate_min);
        }

        if (filters.win_rate_max !== undefined) {
            query = query.lte('win_rate', filters.win_rate_max);
        }

        if (filters.violations_min !== undefined) {
            query = query.gte('violations', filters.violations_min);
        }

        if (filters.violations_max !== undefined) {
            query = query.lte('violations', filters.violations_max);
        }

        // Order by registration date descending
        query = query.order('registration_date', { ascending: false });

        const { data, error, count } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return {
            players: data as Player[],
            totalCount: count || 0,
            page,
            pageSize,
        };
    }

    // Get single player by ID
    async getPlayer(id: string): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Create new player
    async createPlayer(playerData: CreatePlayerData): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .insert([{
                ...playerData,
                registration_date: new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Update player
    async updatePlayer(id: string, playerData: UpdatePlayerData): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .update(playerData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Delete player
    async deletePlayer(id: string): Promise<void> {
        const { error } = await supabase
            .from('players')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    // Ban player (update status to banned)
    async banPlayer(id: string): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .update({ status: 'banned' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Unban player (update status to offline)
    async unbanPlayer(id: string): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .update({ status: 'offline' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Suspend player
    async suspendPlayer(id: string, durationHours?: number): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .update({ status: 'suspended' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Update player violations
    async updateViolations(id: string, violations: number): Promise<Player> {
        const { data, error } = await supabase
            .from('players')
            .update({ violations })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Player;
    }

    // Get player statistics
    async getPlayerStats() {
        const { data, error } = await supabase
            .from('players')
            .select(`
        count,
        status,
        alliance,
        specialization
      `);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

export const playerService = new PlayerService();
