'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

// ==============================
// Types
// ==============================

export interface PityItem {
  id: string;
  reward_item_id: string;
  weight: number;
  reward_item?: any;
}

export interface PityCounter {
  id: string;
  pity_system_id: string;
  rarity: string;
  threshold: number;
  pity_items?: PityItem[];
}

export interface PitySystem {
  id: string;
  loot_box_id: string;
  enabled: boolean;
  reset_on_rare_drop: boolean;
  pity_counters?: PityCounter[];
}

// ==============================
// Hook
// ==============================

export const useLootBoxPitySystem = (lootBoxId?: string) => {
  const [data, setData] = useState<PitySystem | null>(null);
  const [loading, setLoading] = useState(false);

  // ==============================
  // FETCH FULL TREE
  // ==============================
  const fetchPitySystem = useCallback(async () => {
    if (!lootBoxId) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .rpc('get_loot_box_pity_system', { lb_id: lootBoxId });

      if (error) {
        console.error('❌ fetchPitySystem RPC', error);
      } else {
        setData(data);
      }
    } catch (err) {
      console.error('❌ fetchPitySystem catch', err);
    }

    setLoading(false);
  }, [lootBoxId]);

  // ==============================
  // CREATE
  // ==============================
  const createPitySystem = useCallback(async () => {
    if (!lootBoxId) return;

    const { data, error } = await supabase
      .from('loot_box_pity_systems')
      .insert({
        loot_box_id: lootBoxId,
        enabled: false,
        reset_on_rare_drop: true,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ createPitySystem', error);
      return null;
    }

    setData(data);
    return data;
  }, [lootBoxId]);

  // ==============================
  // UPDATE SYSTEM
  // ==============================
  const updatePitySystem = useCallback(
    async (updates: Partial<PitySystem>) => {
      if (!data?.id) return;

      const { error } = await supabase
        .from('loot_box_pity_systems')
        .update(updates)
        .eq('id', data.id);

      if (error) {
        console.error('❌ updatePitySystem', error);
      } else {
        setData((prev) => (prev ? { ...prev, ...updates } : prev));
      }
    },
    [data]
  );

  // ==============================
  // DELETE SYSTEM
  // ==============================
  const deletePitySystem = useCallback(async () => {
    if (!data?.id) return;

    const { error } = await supabase
      .from('loot_box_pity_systems')
      .delete()
      .eq('id', data.id);

    if (error) {
      console.error('❌ deletePitySystem', error);
    } else {
      setData(null);
    }
  }, [data]);

  // ==============================
  // ADD COUNTER
  // ==============================
  const addCounter = useCallback(
    async (counter: Omit<PityCounter, 'id' | 'pity_items'>) => {
      const { data: inserted, error } = await supabase
        .from('loot_box_pity_counters')
        .insert(counter)
        .select()
        .single();

      if (error) {
        console.error('❌ addCounter', error);
        return null;
      }

      await fetchPitySystem();
      return inserted;
    },
    [fetchPitySystem]
  );

  // ==============================
  // UPDATE COUNTER
  // ==============================
  const updateCounter = useCallback(
    async (id: string, updates: Partial<PityCounter>) => {
      const { error } = await supabase
        .from('loot_box_pity_counters')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ updateCounter', error);
      } else {
        await fetchPitySystem();
      }
    },
    [fetchPitySystem]
  );

  // ==============================
  // DELETE COUNTER
  // ==============================
  const deleteCounter = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('loot_box_pity_counters')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ deleteCounter', error);
      } else {
        await fetchPitySystem();
      }
    },
    [fetchPitySystem]
  );

  // ==============================
  // ADD PITY ITEM
  // ==============================
  const addPityItem = useCallback(
    async (item: Omit<PityItem, 'id' | 'reward_item'> & { pity_counter_id: string }) => {
      const { error } = await supabase
        .from('loot_box_pity_items')
        .insert(item);

      if (error) {
        console.error('❌ addPityItem', error);
      } else {
        await fetchPitySystem();
      }
    },
    [fetchPitySystem]
  );

  // ==============================
  // DELETE PITY ITEM
  // ==============================
  const deletePityItem = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('loot_box_pity_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ deletePityItem', error);
      } else {
        await fetchPitySystem();
      }
    },
    [fetchPitySystem]
  );

  // ==============================
  // INIT
  // ==============================
  useEffect(() => {
    fetchPitySystem();
  }, [fetchPitySystem]);

  return {
    data,
    loading,

    // system
    createPitySystem,
    updatePitySystem,
    deletePitySystem,

    // counter
    addCounter,
    updateCounter,
    deleteCounter,

    // items
    addPityItem,
    deletePityItem,

    refetch: fetchPitySystem,
  };
};
