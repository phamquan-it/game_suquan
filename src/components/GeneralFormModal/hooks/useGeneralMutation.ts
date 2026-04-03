// components/GeneralFormModal/hooks/useGeneralMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';
import type { GeneralFormData } from '@/types/general';

export const useGeneralMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: GeneralFormData) => {
            const generalData = {
                ...data,
                id: crypto.randomUUID(),
                current_attack: data.base_attack,
                current_defense: data.base_defense,
                current_health: data.base_health,
                current_speed: data.base_speed,
                current_intelligence: data.base_intelligence,
                current_leadership: data.base_leadership,
                obtained_date: new Date().toISOString(),
                battle_count: 0,
                win_rate: 0,
                experience: 0,
                required_exp: 0,
                star_level: 1,
                max_star_level: 5,
                awakening_level: 0,
                bond_level: 0,
            };

            const { data: general, error } = await supabase
                .from('generals')
                .insert([generalData])
                .select()
                .single();

            if (error) throw error;
            return general;
        },
        onSuccess: () => {
            message.success('General created successfully!');
            queryClient.invalidateQueries({ queryKey: ['generals'] });
            onSuccess?.();
        },
        onError: (error) => {
            message.error('Failed to create general: ' + error.message);
        },
    });
};
