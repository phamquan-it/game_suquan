// app/admin/lootboxes/services/lootbox.service.ts
import { supabase } from '@/utils/supabase/client';
import { ApiResponse, LootBoxFilters, PaginationParams } from '../types/lootbox.types';
import { LootBox } from '@/lib/types/loot-box';
import { LootBoxFirstTimeBonus, LootBoxGuaranteedDrop, LootBoxPitySystem, LootBoxRewardTable, LootBoxStreakBonus } from '../types';
class LootBoxService {
  // Loot Boxes
  async getLootBoxes(
    filters?: LootBoxFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<LootBox[]>> {
    try {
      let query = supabase
        .from('loot_boxes')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.tier) {
        query = query.eq('tier', filters.tier);
      }
      if (filters?.season) {
        query = query.eq('season', filters.season);
      }
      if (filters?.event) {
        query = query.eq('event', filters.event);
      }
      if (filters?.isActive !== undefined) {
        const now = new Date().toISOString();
        if (filters.isActive) {
          query = query
            .or(`available_from.is.null,available_from.lte.${now}`)
            .or(`available_until.is.null,available_until.gte.${now}`);
        }
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as LootBox[],
        total: count || 0,
        page: pagination?.page || 1,
        limit: pagination?.limit || data?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching loot boxes:', error);
      throw error;
    }
  }

  async getLootBoxById(id: string): Promise<LootBox> {
    try {
      const { data, error } = await supabase
        .from('loot_boxes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as LootBox;
    } catch (error) {
      console.error('Error fetching loot box:', error);
      throw error;
    }
  }

  async createLootBox(data: Partial<LootBox>): Promise<LootBox> {
    try {
      const { data: result, error } = await supabase
        .from('loot_boxes')
        .insert([{ ...data, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return result as LootBox;
    } catch (error) {
      console.error('Error creating loot box:', error);
      throw error;
    }
  }

  async updateLootBox(id: string, data: Partial<LootBox>): Promise<LootBox> {
    try {
      const { data: result, error } = await supabase
        .from('loot_boxes')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as LootBox;
    } catch (error) {
      console.error('Error updating loot box:', error);
      throw error;
    }
  }

  async deleteLootBox(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('loot_boxes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting loot box:', error);
      throw error;
    }
  }

  // Reward Tables
  async getRewardTables(lootBoxId: string): Promise<LootBoxRewardTable[]> {
    try {
      const { data, error } = await supabase
        .from('loot_box_reward_tables')
        .select(`
          *,
          pools:loot_box_reward_pools(
            *,
            items:loot_box_reward_items(*)
          ),
          streak_bonus:loot_box_streak_bonuses(
            *,
            tiers:loot_box_streak_bonus_tiers(
              *,
              items:loot_box_streak_items(*)
            )
          ),
          first_time_bonus:loot_box_first_time_bonuses(
            *,
            rewards:loot_box_first_time_rewards(*)
          )
        `)
        .eq('loot_box_id', lootBoxId);

      if (error) throw error;
      return data as LootBoxRewardTable[];
    } catch (error) {
      console.error('Error fetching reward tables:', error);
      throw error;
    }
  }

  async createRewardTable(lootBoxId: string, data: any): Promise<LootBoxRewardTable> {
    try {
      // Start a transaction
      const { data: table, error: tableError } = await supabase
        .from('loot_box_reward_tables')
        .insert([{
          loot_box_id: lootBoxId,
          name: data.name,
          distribution_type: data.distribution_type,
          anti_duplicate: data.anti_duplicate,
          duplicate_protection: data.duplicate_protection
        }])
        .select()
        .single();

      if (tableError) throw tableError;

      // Create pools and items
      if (data.pools && data.pools.length > 0) {
        for (const pool of data.pools) {
          const { data: poolData, error: poolError } = await supabase
            .from('loot_box_reward_pools')
            .insert([{
              reward_table_id: table.id,
              name: pool.name,
              weight: pool.weight,
              min_drops: pool.min_drops,
              max_drops: pool.max_drops,
              guaranteed: pool.guaranteed
            }])
            .select()
            .single();

          if (poolError) throw poolError;

          if (pool.items && pool.items.length > 0) {
            const { error: itemsError } = await supabase
              .from('loot_box_reward_items')
              .insert(
                pool.items.map((item: any) => ({
                  reward_pool_id: poolData.id,
                  ...item
                }))
              );

            if (itemsError) throw itemsError;
          }
        }
      }

      // Create streak bonus if provided
      if (data.streak_bonus) {
        await this.createStreakBonus(table.id, data.streak_bonus);
      }

      // Create first time bonus if provided
      if (data.first_time_bonus) {
        await this.createFirstTimeBonus(table.id, data.first_time_bonus);
      }

      return table as LootBoxRewardTable;
    } catch (error) {
      console.error('Error creating reward table:', error);
      throw error;
    }
  }

  async updateRewardTable(tableId: string, data: any): Promise<LootBoxRewardTable> {
    try {
      const { data: table, error } = await supabase
        .from('loot_box_reward_tables')
        .update({
          name: data.name,
          distribution_type: data.distribution_type,
          anti_duplicate: data.anti_duplicate,
          duplicate_protection: data.duplicate_protection
        })
        .eq('id', tableId)
        .select()
        .single();

      if (error) throw error;
      return table as LootBoxRewardTable;
    } catch (error) {
      console.error('Error updating reward table:', error);
      throw error;
    }
  }

  async deleteRewardTable(tableId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('loot_box_reward_tables')
        .delete()
        .eq('id', tableId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting reward table:', error);
      throw error;
    }
  }

  async getPitySystem(lootBoxId: string): Promise<any> {
    try {
      console.log(`called ${lootBoxId}`);

      const { data, error } = await supabase
        .rpc('get_loot_box_pity_system', { lb_id: lootBoxId });

      if (error) {
        console.error('Error fetching pity system via RPC:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getPitySystem RPC call:', error);
      throw error;
    }
  }


  async updatePitySystem(lootBoxId: string, data: any): Promise<LootBoxPitySystem> {
    try {
      // First, check if pity system exists
      const { data: existing } = await supabase
        .from('loot_box_pity_systems')
        .select('id')
        .eq('loot_box_id', lootBoxId)
        .single();

      let pitySystem;

      if (existing) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('loot_box_pity_systems')
          .update({
            enabled: data.enabled,
            reset_on_rare_drop: data.reset_on_rare_drop
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        pitySystem = updated;
      } else {
        // Create new
        const { data: created, error } = await supabase
          .from('loot_box_pity_systems')
          .insert([{
            loot_box_id: lootBoxId,
            enabled: data.enabled,
            reset_on_rare_drop: data.reset_on_rare_drop
          }])
          .select()
          .single();

        if (error) throw error;
        pitySystem = created;
      }

      // Handle counters
      if (data.counters && data.counters.length > 0) {
        // Delete existing counters
        await supabase
          .from('loot_box_pity_counters')
          .delete()
          .eq('pity_system_id', pitySystem.id);

        // Create new counters
        for (const counter of data.counters) {
          const { data: counterData, error: counterError } = await supabase
            .from('loot_box_pity_counters')
            .insert([{
              pity_system_id: pitySystem.id,
              rarity: counter.rarity,
              threshold: counter.threshold
            }])
            .select()
            .single();

          if (counterError) throw counterError;

          if (counter.items && counter.items.length > 0) {
            const { error: itemsError } = await supabase
              .from('loot_box_pity_items')
              .insert(
                counter.items.map((item: any) => ({
                  pity_counter_id: counterData.id,
                  reward_item_id: item.reward_item_id,
                  weight: item.weight
                }))
              );

            if (itemsError) throw itemsError;
          }
        }
      }

      return pitySystem;
    } catch (error) {
      console.error('Error updating pity system:', error);
      throw error;
    }
  }

  // Guaranteed Drops
  async getGuaranteedDrops(lootBoxId: string): Promise<LootBoxGuaranteedDrop[]> {
    try {
      const { data, error } = await supabase
        .from('loot_box_guaranteed_drops')
        .select(`
          *,
          rewards:loot_box_guaranteed_rewards(
            *,
            reward_item:loot_box_reward_items(*)
          )
        `)
        .eq('loot_box_id', lootBoxId);

      if (error) throw error;
      return data as LootBoxGuaranteedDrop[];
    } catch (error) {
      console.error('Error fetching guaranteed drops:', error);
      throw error;
    }
  }

  async createGuaranteedDrop(lootBoxId: string, data: any): Promise<LootBoxGuaranteedDrop> {
    try {
      const { data: drop, error } = await supabase
        .from('loot_box_guaranteed_drops')
        .insert([{
          loot_box_id: lootBoxId,
          open_count: data.open_count,
          reset_after_claim: data.reset_after_claim
        }])
        .select()
        .single();

      if (error) throw error;

      // Create rewards
      if (data.rewards && data.rewards.length > 0) {
        const { error: rewardsError } = await supabase
          .from('loot_box_guaranteed_rewards')
          .insert(
            data.rewards.map((rewardItemId: string) => ({
              guaranteed_drop_id: drop.id,
              reward_item_id: rewardItemId
            }))
          );

        if (rewardsError) throw rewardsError;
      }

      return drop as LootBoxGuaranteedDrop;
    } catch (error) {
      console.error('Error creating guaranteed drop:', error);
      throw error;
    }
  }

  async updateGuaranteedDrop(dropId: string, data: any): Promise<LootBoxGuaranteedDrop> {
    try {
      const { data: drop, error } = await supabase
        .from('loot_box_guaranteed_drops')
        .update({
          open_count: data.open_count,
          reset_after_claim: data.reset_after_claim
        })
        .eq('id', dropId)
        .select()
        .single();

      if (error) throw error;

      // Update rewards (delete and recreate)
      await supabase
        .from('loot_box_guaranteed_rewards')
        .delete()
        .eq('guaranteed_drop_id', dropId);

      if (data.rewards && data.rewards.length > 0) {
        const { error: rewardsError } = await supabase
          .from('loot_box_guaranteed_rewards')
          .insert(
            data.rewards.map((rewardItemId: string) => ({
              guaranteed_drop_id: dropId,
              reward_item_id: rewardItemId
            }))
          );

        if (rewardsError) throw rewardsError;
      }

      return drop as LootBoxGuaranteedDrop;
    } catch (error) {
      console.error('Error updating guaranteed drop:', error);
      throw error;
    }
  }

  async deleteGuaranteedDrop(dropId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('loot_box_guaranteed_drops')
        .delete()
        .eq('id', dropId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting guaranteed drop:', error);
      throw error;
    }
  }

  // Streak Bonuses
  async getStreakBonuses(rewardTableId: string): Promise<LootBoxStreakBonus> {
    try {
      const { data, error } = await supabase
        .from('loot_box_streak_bonuses')
        .select(`
          *,
          tiers:loot_box_streak_bonus_tiers(
            *,
            items:loot_box_streak_items(*)
          )
        `)
        .eq('reward_table_id', rewardTableId)
        .single();

      if (error) throw error;
      return data as LootBoxStreakBonus;
    } catch (error) {
      console.error('Error fetching streak bonuses:', error);
      throw error;
    }
  }

  async createStreakBonus(rewardTableId: string, data: any): Promise<LootBoxStreakBonus> {
    try {
      const { data: bonus, error } = await supabase
        .from('loot_box_streak_bonuses')
        .insert([{
          reward_table_id: rewardTableId,
          enabled: data.enabled,
          streak_type: data.streak_type
        }])
        .select()
        .single();

      if (error) throw error;

      // Create tiers
      if (data.tiers && data.tiers.length > 0) {
        for (const tier of data.tiers) {
          const { data: tierData, error: tierError } = await supabase
            .from('loot_box_streak_bonus_tiers')
            .insert([{
              streak_bonus_id: bonus.id,
              streak_count: tier.streak_count,
              multiplier: tier.multiplier,
              guaranteed_rarity: tier.guaranteed_rarity
            }])
            .select()
            .single();

          if (tierError) throw tierError;

          if (tier.items && tier.items.length > 0) {
            const { error: itemsError } = await supabase
              .from('loot_box_streak_items')
              .insert(
                tier.items.map((item: any) => ({
                  streak_tier_id: tierData.id,
                  reward_item_id: item.reward_item_id,
                  weight: item.weight
                }))
              );

            if (itemsError) throw itemsError;
          }
        }
      }

      return bonus as LootBoxStreakBonus;
    } catch (error) {
      console.error('Error creating streak bonus:', error);
      throw error;
    }
  }

  async updateStreakBonus(rewardTableId: string, data: any): Promise<LootBoxStreakBonus> {
    try {
      // Check if exists
      const { data: existing } = await supabase
        .from('loot_box_streak_bonuses')
        .select('id')
        .eq('reward_table_id', rewardTableId)
        .single();

      if (existing) {
        // Delete existing tiers and items
        await supabase
          .from('loot_box_streak_bonus_tiers')
          .delete()
          .eq('streak_bonus_id', existing.id);

        // Update bonus
        const { data: bonus, error } = await supabase
          .from('loot_box_streak_bonuses')
          .update({
            enabled: data.enabled,
            streak_type: data.streak_type
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return bonus as LootBoxStreakBonus;
      } else {
        // Create new
        return this.createStreakBonus(rewardTableId, data);
      }
    } catch (error) {
      console.error('Error updating streak bonus:', error);
      throw error;
    }
  }

  // First Time Bonuses
  async getFirstTimeBonuses(rewardTableId: string): Promise<LootBoxFirstTimeBonus> {
    try {
      const { data, error } = await supabase
        .from('loot_box_first_time_bonuses')
        .select(`
          *,
          rewards:loot_box_first_time_rewards(*)
        `)
        .eq('reward_table_id', rewardTableId)
        .single();

      if (error) throw error;
      return data as LootBoxFirstTimeBonus;
    } catch (error) {
      console.error('Error fetching first time bonuses:', error);
      throw error;
    }
  }

  async createFirstTimeBonus(rewardTableId: string, data: any): Promise<LootBoxFirstTimeBonus> {
    try {
      const { data: bonus, error } = await supabase
        .from('loot_box_first_time_bonuses')
        .insert([{
          reward_table_id: rewardTableId,
          enabled: data.enabled,
          multiplier: data.multiplier
        }])
        .select()
        .single();

      if (error) throw error;

      // Create rewards
      if (data.rewards && data.rewards.length > 0) {
        const { error: rewardsError } = await supabase
          .from('loot_box_first_time_rewards')
          .insert(
            data.rewards.map((rewardItemId: string) => ({
              first_time_bonus_id: bonus.id,
              reward_item_id: rewardItemId
            }))
          );

        if (rewardsError) throw rewardsError;
      }

      return bonus as LootBoxFirstTimeBonus;
    } catch (error) {
      console.error('Error creating first time bonus:', error);
      throw error;
    }
  }

  async updateFirstTimeBonus(rewardTableId: string, data: any): Promise<LootBoxFirstTimeBonus> {
    try {
      // Check if exists
      const { data: existing } = await supabase
        .from('loot_box_first_time_bonuses')
        .select('id')
        .eq('reward_table_id', rewardTableId)
        .single();

      if (existing) {
        // Delete existing rewards
        await supabase
          .from('loot_box_first_time_rewards')
          .delete()
          .eq('first_time_bonus_id', existing.id);

        // Update bonus
        const { data: bonus, error } = await supabase
          .from('loot_box_first_time_bonuses')
          .update({
            enabled: data.enabled,
            multiplier: data.multiplier
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;

        // Create new rewards
        if (data.rewards && data.rewards.length > 0) {
          const { error: rewardsError } = await supabase
            .from('loot_box_first_time_rewards')
            .insert(
              data.rewards.map((rewardItemId: string) => ({
                first_time_bonus_id: bonus.id,
                reward_item_id: rewardItemId
              }))
            );

          if (rewardsError) throw rewardsError;
        }

        return bonus as LootBoxFirstTimeBonus;
      } else {
        // Create new
        return this.createFirstTimeBonus(rewardTableId, data);
      }
    } catch (error) {
      console.error('Error updating first time bonus:', error);
      throw error;
    }
  }

  // Utility methods for fetching related data
  async getAvailableItems() {
    try {
      const { data, error } = await supabase
        .from('base_items')
        .select('id, name, type, rarity');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async getRewardItems(lootBoxId?: string) {
    try {
      let query = supabase
        .from('loot_box_reward_items')
        .select(`
          *,
          reward_pool:loot_box_reward_pools(
            reward_table:loot_box_reward_tables(
              loot_box_id
            )
          )
        `);

      if (lootBoxId) {
        query = query.eq('reward_pool.reward_table.loot_box_id', lootBoxId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching reward items:', error);
      throw error;
    }
  }
}

export const lootBoxService = new LootBoxService();
