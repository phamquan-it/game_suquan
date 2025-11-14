// hooks/useAllianceMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';
import type { CreateAllianceData, UpdateAllianceData, Alliance } from '@/types/alliance';

export const useAllianceMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    const createAlliance = useMutation({
        mutationFn: async (data: CreateAllianceData) => {
            // Get current user as leader
            //    const { data: { user } } = await supabase.auth.getUser();
            //    if (!user) throw new Error('User not authenticated');

            const allianceData = {
                ...data,
                id: crypto.randomUUID(),
                level: 1,
                members: 1,
                status: 'active' as const,
                created_date: new Date().toISOString(),
                total_power: 0,
                victory_points: 0,
                win_rate: 0.00,
                territory: 0,
                max_members: data.max_members || 50,
                requirements: {
                    minLevel: data.requirements?.minLevel || 1,
                    minPower: data.requirements?.minPower || 0,
                    approvalRequired: data.requirements?.approvalRequired || false,
                },
            };

            const { data: alliance, error } = await supabase
                .from('alliances')
                .insert([allianceData])
                .select()
                .single();

            if (error) throw error;
            return alliance as Alliance;
        },
        onSuccess: () => {
            message.success('Alliance created successfully!');
            queryClient.invalidateQueries({ queryKey: ['alliances'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-stats'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-leaderboard'] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Alliance creation error:', error);
            message.error(`Failed to create alliance: ${error.message}`);
        },
    });

    const updateAlliance = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateAllianceData }) => {
            const { data: alliance, error } = await supabase
                .from('alliances')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return alliance as Alliance;
        },
        onSuccess: () => {
            message.success('Alliance updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['alliances'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-stats'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-leaderboard'] });
        },
        onError: (error) => {
            console.error('Alliance update error:', error);
            message.error(`Failed to update alliance: ${error.message}`);
        },
    });

    const deleteAlliance = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('alliances')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            message.success('Alliance deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['alliances'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-stats'] });
            queryClient.invalidateQueries({ queryKey: ['alliance-leaderboard'] });
        },
        onError: (error) => {
            console.error('Alliance deletion error:', error);
            message.error(`Failed to delete alliance: ${error.message}`);
        },
    });

    return {
        createAlliance,
        updateAlliance,
        deleteAlliance,
    };
};
