// app/admin/base_items/hooks/useUpdateItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemFormData } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ItemFormData }) => {
      // Update base item
      const { error: baseError } = await supabase
        .from('base_items')
        .update({
          name: data.name,
          description: data.description,
          type: data.type,
          rarity: data.rarity,
          quality: data.quality,
          level_requirement: data.levelRequirement,
          stackable: data.stackable,
          max_stack: data.maxStack,
          base_value: data.baseValue,
          icon: data.icon,
          svg_icon: data.svgIcon,
          is_tradable: data.isTradable,
          is_sellable: data.isSellable,
          is_destroyable: data.isDestroyable,
          is_quest_item: data.isQuestItem,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (baseError) throw baseError;

      // Update or insert stats
      if (data.stats) {
        const { data: existingStats } = await supabase
          .from('item_stats')
          .select('id')
          .eq('base_item_id', id)
          .single();

        if (existingStats) {
          // Update existing stats
          const { error: statsError } = await supabase
            .from('item_stats')
            .update({
              ...data.stats,
              updated_at: new Date().toISOString(),
            })
            .eq('base_item_id', id);

          if (statsError) throw statsError;
        } else {
          // Insert new stats
          const { error: statsError } = await supabase
            .from('item_stats')
            .insert([{
              base_item_id: id,
              ...data.stats,
            }]);

          if (statsError) throw statsError;
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['base_items'] });
      queryClient.invalidateQueries({ queryKey: ['base_item', variables.id] });
      message.success('Item updated successfully');
    },
    onError: (error) => {
      message.error('Failed to update item: ' + error.message);
    },
  });
};
