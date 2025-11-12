// hooks/usePlayers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Player, CreatePlayerData, UpdatePlayerData, PlayerFilters } from '@/types/player';
import { playerService } from './admin/usePlayers';

// Query keys
export const playerKeys = {
    all: ['players'] as const,
    lists: () => [...playerKeys.all, 'list'] as const,
    list: (filters: PlayerFilters, page: number, pageSize: number) =>
        [...playerKeys.lists(), { filters, page, pageSize }] as const,
    details: () => [...playerKeys.all, 'detail'] as const,
    detail: (id: string) => [...playerKeys.details(), id] as const,
    stats: () => [...playerKeys.all, 'stats'] as const,
};

// Get players with pagination and filters
export const usePlayers = (
    page: number = 1,
    pageSize: number = 10,
    filters: PlayerFilters = {}
) => {
    return useQuery({
        queryKey: playerKeys.list(filters, page, pageSize),
        queryFn: () => playerService.getPlayers(page, pageSize, filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get single player
export const usePlayer = (id: string) => {
    return useQuery({
        queryKey: playerKeys.detail(id),
        queryFn: () => playerService.getPlayer(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Create player mutation
export const useCreatePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (playerData: CreatePlayerData) => playerService.createPlayer(playerData),
        onSuccess: () => {
            // Invalidate and refetch players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: playerKeys.stats() });
        },
    });
};

// Update player mutation
export const useUpdatePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePlayerData }) =>
            playerService.updatePlayer(id, data),
        onSuccess: (updatedPlayer) => {
            // Update the specific player in cache
            queryClient.setQueryData(playerKeys.detail(updatedPlayer.id), updatedPlayer);
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
        },
    });
};

// Delete player mutation
export const useDeletePlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => playerService.deletePlayer(id),
        onSuccess: (_, deletedId) => {
            // Remove the player from cache
            queryClient.removeQueries({ queryKey: playerKeys.detail(deletedId) });
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
            // Invalidate stats
            queryClient.invalidateQueries({ queryKey: playerKeys.stats() });
        },
    });
};

// Ban player mutation
export const useBanPlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => playerService.banPlayer(id),
        onSuccess: (updatedPlayer) => {
            // Update the specific player in cache
            queryClient.setQueryData(playerKeys.detail(updatedPlayer.id), updatedPlayer);
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
        },
    });
};

// Unban player mutation
export const useUnbanPlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => playerService.unbanPlayer(id),
        onSuccess: (updatedPlayer) => {
            // Update the specific player in cache
            queryClient.setQueryData(playerKeys.detail(updatedPlayer.id), updatedPlayer);
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
        },
    });
};

// Suspend player mutation
export const useSuspendPlayer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => playerService.suspendPlayer(id),
        onSuccess: (updatedPlayer) => {
            // Update the specific player in cache
            queryClient.setQueryData(playerKeys.detail(updatedPlayer.id), updatedPlayer);
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
        },
    });
};

// Update violations mutation
export const useUpdateViolations = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, violations }: { id: string; violations: number }) =>
            playerService.updateViolations(id, violations),
        onSuccess: (updatedPlayer) => {
            // Update the specific player in cache
            queryClient.setQueryData(playerKeys.detail(updatedPlayer.id), updatedPlayer);
            // Invalidate players list
            queryClient.invalidateQueries({ queryKey: playerKeys.lists() });
        },
    });
};

// Get player statistics
export const usePlayerStats = () => {
    return useQuery({
        queryKey: playerKeys.stats(),
        queryFn: () => playerService.getPlayerStats(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
