'use client';

import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export interface AllianceDetail {
  id: string;
  name: string;
  tag: string;
  level: number;
  members: number;
  max_members: number;
  leader: string;
  status: string;
  created_date: string;
  total_power: number;
  victory_points: number;
  win_rate: number;
  territory: number;
  description: string;
  requirements: {
    minLevel: number;
    minPower: number;
    approvalRequired: boolean;
  };
  leaderInfo?: {
    id: string;
    username: string;
  };
  membersList: any[];
}

export const useAllianceDetail = (allianceId?: string) => {
  const [data, setData] = useState<AllianceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!allianceId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get alliance
        const { data: alliance, error: allianceError } = await supabase
          .from('alliances')
          .select('*')
          .eq('id', allianceId)
          .single();

        if (allianceError) throw allianceError;

        // 2️⃣ Get leader info
        const { data: leader } = await supabase
          .from('players')
          .select('id, username')
          .eq('id', alliance.leader)
          .single();

        // 3️⃣ Get members (join)
        const { data: members } = await supabase
          .from('alliance_members')
          .select(`
            id,
            role,
            joined_at,
            player:players (
              id,
              username,
              level,
              power
            )
          `)
          .eq('alliance_id', allianceId);

        setData({
          ...alliance,
          leaderInfo: leader || null,
          membersList: members || [],
        });

      } catch (err) {
        console.error('Fetch alliance error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [allianceId]);

  return { data, loading };
};
