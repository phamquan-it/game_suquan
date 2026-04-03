"use client"
import { useEffect, useState } from "react";
import { LootBoxRewardItem } from "../types";
import { supabase } from "@/utils/supabase/client";

export function useAllRewardItems() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('loot_box_reward_items')
        .select(`
          *,
          base_items(*)
        `);

      if (error) {
        console.error(error);
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  return { data, loading };
}
