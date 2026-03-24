import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Unit {
  id: string;
  name: string;
  description: string;
  // ... other fields
}

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async (): Promise<Unit[]> => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};
