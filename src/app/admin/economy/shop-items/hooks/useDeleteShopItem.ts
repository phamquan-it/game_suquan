// app/admin/economy/shop-items/hooks/useDeleteShopItem.ts
import { supabase } from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const deleteShopItem = async (id: string) => {
  const { error } = await supabase
    .from('economy_shop_item')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return id
}

export const useDeleteShopItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteShopItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-items'] })
    },
  })
}
