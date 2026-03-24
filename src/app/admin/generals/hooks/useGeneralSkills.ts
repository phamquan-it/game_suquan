import { useQuery } from '@tanstack/react-query';
import { GeneralSkill } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useGeneralSkills = (generalId: string) => {
  return useQuery({
    queryKey: ['general-skills', generalId],
    queryFn: async (): Promise<GeneralSkill[]> => {
      const { data, error } = await supabase
        .from('general_skills')
        .select('*')
        .eq('general_id', generalId)
        .order('type')
        .order('level');

      if (error) throw error;
      return data || [];
    },
    enabled: !!generalId,
  });
};
