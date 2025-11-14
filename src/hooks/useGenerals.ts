// hooks/useGenerals.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { General, GeneralFormData } from '@/types/general';
import { supabase } from '@/utils/supabase/client';

export const useGenerals = () => {
    const queryClient = useQueryClient();

    const createGeneral = useMutation({
        mutationFn: async (data: GeneralFormData) => {
            const { data: general, error } = await supabase
                .from('generals')
                .insert([data])
                .select()
                .single();

            if (error) throw error;
            return general;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generals'] });
        },
    });

    return {
        createGeneral,
    };
};
