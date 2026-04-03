"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { PlayerGeneralWithDetail } from "../types/player-general";

export function usePlayerGenerals(playerId: string) {
  const [data, setData] = useState<PlayerGeneralWithDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // ========================
  // FETCH
  // ========================
  const fetchGenerals = useCallback(async () => {
    if (!playerId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("player_generals")
      .select(`
        *,
        general:general_id (
          id,
          name,
          title,
          rarity,
          element,
          type,
          image,
          thumbnail
        )
      `)
      .eq("player_id", playerId)
      .order("obtained_date", { ascending: false });

    if (!error && data) {
      setData(data as PlayerGeneralWithDetail[]);
    }

    setLoading(false);
  }, [playerId]);

  // ========================
  // ADD GENERAL
  // ========================
  const addGeneral = useCallback(
    async (general: {
      general_id: string;
      stats: {
        attack: number;
        defense: number;
        health: number;
        speed: number;
        intelligence: number;
        leadership: number;
      };
    }) => {
      const { error } = await supabase
        .from("player_generals")
        .insert({
          id: crypto.randomUUID(),

          player_id: playerId,
          general_id: general.general_id,

          current_attack: general.stats.attack,
          current_defense: general.stats.defense,
          current_health: general.stats.health,
          current_speed: general.stats.speed,
          current_intelligence: general.stats.intelligence,
          current_leadership: general.stats.leadership,
        });

      if (!error) {
        await fetchGenerals();
      }

      return { error };
    },
    [playerId, fetchGenerals]
  );

  // ========================
  // DELETE
  // ========================
  const removeGeneral = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("player_generals")
        .delete()
        .eq("id", id);

      if (!error) {
        setData((prev) => prev.filter((g) => g.id !== id));
      }

      return { error };
    },
    []
  );

  // ========================
  // TOGGLE FAVORITE
  // ========================
  const toggleFavorite = useCallback(
    async (id: string, favorite: boolean) => {
      const { error } = await supabase
        .from("player_generals")
        .update({ favorite })
        .eq("id", id);

      if (!error) {
        setData((prev) =>
          prev.map((g) =>
            g.id === id ? { ...g, favorite } : g
          )
        );
      }

      return { error };
    },
    []
  );

  useEffect(() => {
    fetchGenerals();
  }, [fetchGenerals]);

  return {
    data,
    loading,
    refetch: fetchGenerals,
    addGeneral,
    removeGeneral,
    toggleFavorite,
  };
}
