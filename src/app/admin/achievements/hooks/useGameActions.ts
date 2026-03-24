// app/admin/achievements/hooks/useGameActions.ts
import { useEffect, useState } from 'react';
import { GameAction } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useGameActions = () => {
  const [gameActions, setGameActions] = useState<GameAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameActions = async () => {
      try {
        const { data, error } = await supabase
          .from('game_actions')
          .select('*')
          .order('category');

        if (error) throw error;
        setGameActions(data || []);
      } catch (error) {
        console.error('Error fetching game actions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameActions();
  }, []);

  return { gameActions, loading };
};
