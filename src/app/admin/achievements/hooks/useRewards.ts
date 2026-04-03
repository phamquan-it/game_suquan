// hooks/useRewards.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { AchievementReward } from '../components/rewards/types';

interface UseRewardsOptions {
  requirementId?: number;
  enabled?: boolean; // allow manual control of fetch
}

export function useRewards({ requirementId, enabled = true }: UseRewardsOptions = {}) {
  const [rewards, setRewards] = useState<AchievementReward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchRewards = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('achievement_rewards')
          .select(`
            *,
            currency:currencies!achievement_rewards_currency_type_fkey (*),
            item:base_items!achievement_rewards_item_id_fkey (*)
          `);

        if (requirementId !== undefined) {
          query = query.eq('requirement_id', requirementId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setRewards(data as AchievementReward[]);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching rewards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [requirementId, enabled]);

  return { rewards, loading, error };
}
