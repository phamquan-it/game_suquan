// app/admin/units/page.tsx
import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import UnitManagementPage from './components/UnitManagementPage';

export const metadata: Metadata = {
  title: 'Unit Management - 12 Warlords Admin',
  description: 'Manage game units, their stats, skills, and configurations',
};

export default async function UnitsPage() {
  const queryClient = new QueryClient();

  // Prefetch units data on server
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['units', {}],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .range(0, 19)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return {
        data: data || [],
        total: data?.length || 0,
        page: 0,
        limit: 20,
      };
    },
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UnitManagementPage />
    </HydrationBoundary>
  );
}
