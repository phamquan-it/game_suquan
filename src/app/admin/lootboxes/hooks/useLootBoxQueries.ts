// app/admin/lootboxes/hooks/useLootBoxQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { lootBoxService } from '../services/lootbox.service';
import { LootBoxFilters, PaginationParams } from '../types/lootbox.types';

export const lootBoxKeys = {
  all: ['lootBoxes'] as const,
  lists: () => [...lootBoxKeys.all, 'list'] as const,
  list: (filters: LootBoxFilters, pagination: PaginationParams) =>
    [...lootBoxKeys.lists(), { filters, pagination }] as const,
  details: () => [...lootBoxKeys.all, 'detail'] as const,
  detail: (id: string) => [...lootBoxKeys.details(), id] as const,
  rewardTables: (id: string) => [...lootBoxKeys.detail(id), 'rewardTables'] as const,
  pitySystem: (id: string) => [...lootBoxKeys.detail(id), 'pitySystem'] as const,
  guaranteedDrops: (id: string) => [...lootBoxKeys.detail(id), 'guaranteedDrops'] as const,
};

export const useLootBoxes = (filters: LootBoxFilters, pagination: PaginationParams) => {
  return useQuery({
    queryKey: lootBoxKeys.list(filters, pagination),
    queryFn: () => lootBoxService.getLootBoxes(filters, pagination),
  });
};

export const useLootBox = (id: string) => {
  return useQuery({
    queryKey: lootBoxKeys.detail(id),
    queryFn: () => lootBoxService.getLootBoxById(id),
    enabled: !!id,
  });
};

export const useRewardTables = (lootBoxId: string) => {
  return useQuery({
    queryKey: lootBoxKeys.rewardTables(lootBoxId),
    queryFn: () => lootBoxService.getRewardTables(lootBoxId),
    enabled: !!lootBoxId,
  });
};

export const usePitySystem = (lootBoxId: string) => {
  return useQuery({
    queryKey: lootBoxKeys.pitySystem(lootBoxId),
    queryFn: () => lootBoxService.getPitySystem(lootBoxId),
    enabled: !!lootBoxId,
  });
};

export const useGuaranteedDrops = (lootBoxId: string) => {
  return useQuery({
    queryKey: lootBoxKeys.guaranteedDrops(lootBoxId),
    queryFn: () => lootBoxService.getGuaranteedDrops(lootBoxId),
    enabled: !!lootBoxId,
  });
};

// Mutations
export const useCreateLootBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => lootBoxService.createLootBox(data),
    onSuccess: () => {
      message.success('Loot box created successfully');
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create loot box');
    },
  });
};

export const useUpdateLootBox = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => lootBoxService.updateLootBox(id, data),
    onSuccess: () => {
      message.success('Loot box updated successfully');
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update loot box');
    },
  });
};

export const useDeleteLootBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lootBoxService.deleteLootBox(id),
    onSuccess: () => {
      message.success('Loot box deleted successfully');
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete loot box');
    },
  });
};

export const useCreateRewardTable = (lootBoxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => lootBoxService.createRewardTable(lootBoxId, data),
    onSuccess: () => {
      message.success('Reward table created successfully');
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.rewardTables(lootBoxId) });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create reward table');
    },
  });
};

export const useUpdatePitySystem = (lootBoxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => lootBoxService.updatePitySystem(lootBoxId, data),
    onSuccess: () => {
      message.success('Pity system updated successfully');
      queryClient.invalidateQueries({ queryKey: lootBoxKeys.pitySystem(lootBoxId) });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update pity system');
    },
  });
};
