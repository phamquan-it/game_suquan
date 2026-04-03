"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { PlayerBeautyWithDetail } from "../types/player-beauty";

export function usePlayerBeauties(playerId: string) {
  const [data, setData] = useState<PlayerBeautyWithDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // ========================
  // FETCH
  // ========================
  const fetchBeauties = useCallback(async () => {
    if (!playerId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("player_beauties")
      .select(`
        *,
        beauty:beauty_id (
          id,
          name,
          title,
          rarity,
          level,
          avatar,
          full_image
        )
      `)
      .eq("player_id", playerId)
      .order("acquisition_date", { ascending: false });

    if (!error && data) {
      setData(data as PlayerBeautyWithDetail[]);
    }

    setLoading(false);
  }, [playerId]);

  // ========================
  // ADD
  // ========================
  const addBeauty = useCallback(
    async (beautyId: string) => {
      const { error } = await supabase.from("player_beauties").insert({
        player_id: playerId,
        beauty_id: beautyId,
      });

      if (!error) {
        await fetchBeauties();
      }

      return { error };
    },
    [playerId, fetchBeauties]
  );

  // ========================
  // DELETE
  // ========================
  const removeBeauty = useCallback(
    async (beautyId: string) => {
      const { error } = await supabase
        .from("player_beauties")
        .delete()
        .eq("player_id", playerId)
        .eq("beauty_id", beautyId);

      if (!error) {
        setData((prev) =>
          prev.filter((b) => b.beauty_id !== beautyId)
        );
      }

      return { error };
    },
    [playerId]
  );

  useEffect(() => {
    fetchBeauties();
  }, [fetchBeauties]);

  return {
    data,
    loading,
    refetch: fetchBeauties,
    addBeauty,
    removeBeauty,
  };
}
