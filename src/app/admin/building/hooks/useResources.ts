import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Resource {
  resource_code: string;
  name: string;
  description: string;
  // ... other fields
}

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async (): Promise<Resource[]> => {
      const { data, error } = await supabase
        .from('resource_types')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};
