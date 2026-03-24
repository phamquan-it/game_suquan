// app/admin/base_items/hooks/useCreateItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemFormData } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ItemFormData) => {
      // Start a transaction
      const { data: baseItem, error: baseError } = await supabase
        .from('base_items')
        .insert([{
          id: data.id,
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
        }])
        .select()
        .single();

      if (baseError) throw baseError;

      // Insert stats if provided
      if (data.stats) {
        const { error: statsError } = await supabase
          .from('item_stats')
          .insert([{
            base_item_id: baseItem.id,
            ...data.stats,
          }]);

        if (statsError) throw statsError;
      }

      return baseItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['base_items'] });
      message.success('Item created successfully');
    },
    onError: (error) => {
      message.error('Failed to create item: ' + error.message);
    },
  });
};
