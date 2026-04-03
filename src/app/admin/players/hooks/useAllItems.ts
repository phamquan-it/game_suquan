"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { BaseItem } from "../types/player-item";

export function useAllItems() {
  const [data, setData] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllItems = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("base_items")
      .select("*")
      .eq("status", "active")
      .order("rarity", { ascending: false })
      .order("level_requirement", { ascending: true });

    if (!error && data) {
      setData(data as BaseItem[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllItems();
  }, [fetchAllItems]);

  return {
    data,
    loading,
    refetch: fetchAllItems,
  };
}
