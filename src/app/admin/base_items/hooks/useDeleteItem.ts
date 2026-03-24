// app/admin/base_items/hooks/useDeleteItem.ts
import { supabase } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('base_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['base_items'] });
      message.success('Item deleted successfully');
    },
    onError: (error) => {
      message.error('Failed to delete item: ' + error.message);
    },
  });
};
