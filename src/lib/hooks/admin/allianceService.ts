import { supabase } from '@/utils/supabase/client';
import { Alliance, CreateAllianceData, UpdateAllianceData } from '@/types/alliance';

interface AllianceListResult {
    data: Alliance[];
    totalCount: number;
}

interface AllianceStats {
    totalAlliances: number;
    activeAlliances: number;
    totalMembers: number;
    totalPower: number;
    avgVictoryPoints: number;
}

export const allianceService = {
    // Get all alliances with pagination
    async getAlliances(page: number = 0, pageSize: number = 20): Promise<AllianceListResult> {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from('alliances')
            .select('*', { count: 'exact' })
            .range(from, to)
            .order('total_power', { ascending: false });

        if (error) throw error;

        return {
            data: (data || []) as Alliance[],
            totalCount: count ?? 0,
        };
    },

    // Get alliance by ID
    async getAllianceById(id: string): Promise<Alliance | null> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Alliance | null;
    },

    // Get alliances by status
    async getAlliancesByStatus(
        status: 'active' | 'inactive' | 'suspended',
        page: number = 0
    ): Promise<AllianceListResult> {
        const from = page * 20;
        const to = from + 19;

        const { data, error, count } = await supabase
            .from('alliances')
            .select('*', { count: 'exact' })
            .eq('status', status)
            .range(from, to)
            .order('created_date', { ascending: false });

        if (error) throw error;

        return {
            data: (data || []) as Alliance[],
            totalCount: count ?? 0,
        };
    },

    // Search alliances by name or tag
    async searchAlliances(query: string): Promise<Alliance[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .or(`name.ilike.%${query}%,tag.ilike.%${query}%`)
            .limit(10);

        if (error) throw error;
        return (data || []) as Alliance[];
    },

    // Create new alliance
    async createAlliance(allianceData: CreateAllianceData): Promise<Alliance> {
        const { data, error } = await supabase
            .from('alliances')
            .insert([allianceData])
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

    // Get alliance statistics for dashboard
    async getAllianceStats(): Promise<AllianceStats> {
        const { data, error } = await supabase
            .from('alliances')
            .select('status, total_power, victory_points, members');

        if (error) throw error;

        const alliances = (data || []) as Alliance[];

        if (alliances.length === 0) {
            return {
                totalAlliances: 0,
                activeAlliances: 0,
                totalMembers: 0,
                totalPower: 0,
                avgVictoryPoints: 0,
            };
        }

        const totalAlliances = alliances.length;
        const activeAlliances = alliances.filter(a => a.status === 'active').length;
        const totalMembers = alliances.reduce((sum, a) => sum + (a.members || 0), 0);
        const totalPower = alliances.reduce((sum, a) => sum + (a.total_power || 0), 0);
        const avgVictoryPoints =
            alliances.reduce((sum, a) => sum + (a.victory_points || 0), 0) / totalAlliances;

        return {
            totalAlliances,
            activeAlliances,
            totalMembers,
            totalPower,
            avgVictoryPoints,
        };
    },

    // Get top alliances by power
    async getTopAlliances(limit: number = 10): Promise<Alliance[]> {
        const { data, error } = await supabase
            .from('alliances')
            .select('*')
            .order('total_power', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return (data || []) as Alliance[];
    },
};

