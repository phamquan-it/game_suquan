"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { PlayerItemWithDetail } from "../types/player-item";

export function usePlayerItems(playerId: string) {
  const [data, setData] = useState<PlayerItemWithDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // ========================
  // FETCH
  // ========================
  const fetchItems = useCallback(async () => {
    if (!playerId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("player_items")
      .select(`
        *,
        item:item_id (
          id,
          name,
          type,
          rarity,
          quality,
          icon,
          svg_icon,
          stackable,
          max_stack
        )
      `)
      .eq("player_id", playerId)
      .order("acquired_at", { ascending: false });

    if (!error && data) {
      setData(data as PlayerItemWithDetail[]);
    }

    setLoading(false);
  }, [playerId]);

  // ========================
  // ADD ITEM (SMART STACK)
  // ========================
  const addItem = useCallback(
    async (itemId: string, quantity = 1) => {
      // check existing
      const existing = data.find((i) => i.item_id === itemId);

      if (existing) {
        // update quantity
        const { error } = await supabase
          .from("player_items")
          .update({
            quantity: existing.quantity + quantity,
          })
          .eq("id", existing.id);

        if (!error) {
          setData((prev) =>
            prev.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          );
        }

        return { error };
      }

      // insert new
      const { error } = await supabase.from("player_items").insert({
        player_id: playerId,
        item_id: itemId,
        quantity,
      });

      if (!error) {
        await fetchItems();
      }

      return { error };
    },
    [data, playerId, fetchItems]
  );

  // ========================
  // REMOVE ITEM
  // ========================
  const removeItem = useCallback(
    async (itemId: string, quantity = 1) => {
      const existing = data.find((i) => i.item_id === itemId);
      if (!existing) return;

      // nếu còn > quantity → trừ
      if (existing.quantity > quantity) {
        const { error } = await supabase
          .from("player_items")
          .update({
            quantity: existing.quantity - quantity,
          })
          .eq("id", existing.id);

        if (!error) {
          setData((prev) =>
            prev.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity - quantity }
                : i
            )
          );
        }

        return { error };
      }

      // nếu hết → delete row
      const { error } = await supabase
        .from("player_items")
        .delete()
        .eq("id", existing.id);

      if (!error) {
        setData((prev) =>
          prev.filter((i) => i.id !== existing.id)
        );
      }

      return { error };
    },
    [data]
  );


  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    data,
    loading,
    refetch: fetchItems,
    addItem,
    removeItem,
  };
}
