"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { General } from "../types/player-general";

export function useAllGenerals() {
  const [data, setData] = useState<General[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("generals")
      .select("*")
      .eq("status", "active");

    if (!error && data) {
      setData(data as General[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, refetch: fetchAll };
}
