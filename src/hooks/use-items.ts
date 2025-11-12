// lib/hooks/use-items.ts
import { Rarity } from '@/types/items/base';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useState, useCallback } from 'react';

interface UseItemsProps {
    initialFilters?: ItemFilters;
}

interface ItemFilters {
    type?: ItemType;
    rarity?: Rarity;
    levelRange?: [number, number];
    search?: string;
    status?: string;
}

export const useItems = ({ initialFilters = {} }: UseItemsProps = {}) => {
    const [filters, setFilters] = useState<ItemFilters>(initialFilters);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const updateFilter = useCallback((key: keyof ItemFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const selectItem = useCallback((itemId: string) => {
        setSelectedItems(prev => [...prev, itemId]);
    }, []);

    const deselectItem = useCallback((itemId: string) => {
        setSelectedItems(prev => prev.filter(id => id !== itemId));
    }, []);

    const selectAll = useCallback((itemIds: string[]) => {
        setSelectedItems(itemIds);
    }, []);

    const deselectAll = useCallback(() => {
        setSelectedItems([]);
    }, []);

    return {
        filters,
        selectedItems,
        loading,
        updateFilter,
        clearFilters,
        selectItem,
        deselectItem,
        selectAll,
        deselectAll
    };
};
