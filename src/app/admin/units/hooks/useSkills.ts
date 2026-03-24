// app/admin/units/hooks/useSkills.ts
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skill } from '../types';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Skill[];
    },
  });
};
