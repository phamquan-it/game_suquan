// app/admin/hooks/useCurrencies.ts
import { useEffect, useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export interface Currency {
  currency_type: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  exchange_rate: number;
  max_stack: number;
  tradable: boolean;
  destroyable: boolean;
  category: 'basic' | 'premium' | 'pvp' | 'social' | 'event' | 'special' | 'material';
}

export interface CurrencyFilters {
  search?: string;
  category?: string | null;
  tradable?: boolean | null;
  destroyable?: boolean | null;
  minExchangeRate?: number;
  maxExchangeRate?: number;
  minStack?: number;
  maxStack?: number;
}

export interface CurrencyStats {
  total: number;
  byCategory: {
    category: string;
    count: number;
  }[];
  tradable: number;
  nonTradable: number;
  destroyable: number;
  nonDestroyable: number;
  averageExchangeRate: number;
  totalMaxStack: number;
}

export interface CreateCurrencyData {
  currency_type: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  exchange_rate?: number;
  max_stack?: number;
  tradable?: boolean;
  destroyable?: boolean;
  category: 'basic' | 'premium' | 'pvp' | 'social' | 'event' | 'special' | 'material';
}

export interface UpdateCurrencyData {
  name?: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  exchange_rate?: number;
  max_stack?: number;
  tradable?: boolean;
  destroyable?: boolean;
  category?: 'basic' | 'premium' | 'pvp' | 'social' | 'event' | 'special' | 'material';
}

// Category options with labels and colors
export const CATEGORY_OPTIONS = [
  { value: 'basic', label: 'Cơ bản', color: '#2E8B57' },
  { value: 'premium', label: 'Cao cấp', color: '#D4AF37' },
  { value: 'pvp', label: 'PvP', color: '#DC143C' },
  { value: 'social', label: 'Xã hội', color: '#1E90FF' },
  { value: 'event', label: 'Sự kiện', color: '#FF8C00' },
  { value: 'special', label: 'Đặc biệt', color: '#9370DB' },
  { value: 'material', label: 'Nguyên liệu', color: '#8B4513' },
];

export const useCurrencies = (initialFilters?: CurrencyFilters) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CurrencyFilters>(initialFilters || {
    search: '',
    category: null,
    tradable: null,
    destroyable: null,
    minExchangeRate: undefined,
    maxExchangeRate: undefined,
    minStack: undefined,
    maxStack: undefined,
  });
  const [stats, setStats] = useState<CurrencyStats | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  // Fetch currencies with filters
  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('currencies')
        .select('*')
        .order('currency_type', { ascending: true });

      // Apply filters
      if (filters.search) {
        query = query.or(`currency_type.ilike.%${filters.search}%,name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.tradable !== null && filters.tradable !== undefined) {
        query = query.eq('tradable', filters.tradable);
      }

      if (filters.destroyable !== null && filters.destroyable !== undefined) {
        query = query.eq('destroyable', filters.destroyable);
      }

      if (filters.minExchangeRate !== undefined) {
        query = query.gte('exchange_rate', filters.minExchangeRate);
      }

      if (filters.maxExchangeRate !== undefined) {
        query = query.lte('exchange_rate', filters.maxExchangeRate);
      }

      if (filters.minStack !== undefined) {
        query = query.gte('max_stack', filters.minStack);
      }

      if (filters.maxStack !== undefined) {
        query = query.lte('max_stack', filters.maxStack);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      message.error('Không thể tải danh sách tiền tệ');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch currency statistics
  const fetchStats = useCallback(async () => {
    try {
      // Total currencies
      const { count: total } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true });

      // By category
      const { data: categoryData } = await supabase
        .from('currencies')
        .select('category');

      const categoryCounts: Record<string, number> = {};
      categoryData?.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      });

      const byCategory = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
      }));

      // Tradable stats
      const { count: tradable } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('tradable', true);

      const { count: nonTradable } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('tradable', false);

      // Destroyable stats
      const { count: destroyable } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('destroyable', true);

      const { count: nonDestroyable } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('destroyable', false);

      // Exchange rate stats
      const { data: rateData } = await supabase
        .from('currencies')
        .select('exchange_rate');

      const rates = rateData?.map(r => r.exchange_rate) || [];
      const averageExchangeRate = rates.length > 0
        ? rates.reduce((a, b) => a + b, 0) / rates.length
        : 0;

      // Total max stack
      const { data: stackData } = await supabase
        .from('currencies')
        .select('max_stack');

      const totalMaxStack = stackData?.reduce((sum, item) => sum + (item.max_stack || 0), 0) || 0;

      setStats({
        total: total || 0,
        byCategory,
        tradable: tradable || 0,
        nonTradable: nonTradable || 0,
        destroyable: destroyable || 0,
        nonDestroyable: nonDestroyable || 0,
        averageExchangeRate,
        totalMaxStack,
      });
    } catch (error) {
      console.error('Error fetching currency stats:', error);
    }
  }, []);

  // Fetch a single currency
  const fetchCurrencyDetails = useCallback(async (currencyType: string): Promise<Currency | null> => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('currency_type', currencyType)
        .single();

      if (error) throw error;
      setSelectedCurrency(data);
      return data;
    } catch (error) {
      console.error('Error fetching currency details:', error);
      message.error('Không thể tải thông tin tiền tệ');
      return null;
    }
  }, []);

  // Create a new currency
  const createCurrency = useCallback(async (data: CreateCurrencyData): Promise<Currency | null> => {
    try {
      // Check if currency type already exists
      const { count } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('currency_type', data.currency_type);

      if (count && count > 0) {
        message.error(`Loại tiền tệ "${data.currency_type}" đã tồn tại`);
        return null;
      }

      const { data: currency, error } = await supabase
        .from('currencies')
        .insert({
          currency_type: data.currency_type,
          name: data.name,
          description: data.description || null,
          icon: data.icon || null,
          color: data.color || null,
          exchange_rate: data.exchange_rate || 1.0,
          max_stack: data.max_stack || 999999,
          tradable: data.tradable !== undefined ? data.tradable : true,
          destroyable: data.destroyable !== undefined ? data.destroyable : false,
          category: data.category,
        })
        .select()
        .single();

      if (error) throw error;

      message.success(`Tiền tệ "${currency.name}" đã được tạo thành công`);
      await fetchCurrencies();
      await fetchStats();
      return currency;
    } catch (error) {
      console.error('Error creating currency:', error);
      message.error('Không thể tạo tiền tệ mới');
      return null;
    }
  }, [fetchCurrencies, fetchStats]);

  // Update a currency
  const updateCurrency = useCallback(async (currencyType: string, data: UpdateCurrencyData): Promise<Currency | null> => {
    try {
      const { data: currency, error } = await supabase
        .from('currencies')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('currency_type', currencyType)
        .select()
        .single();

      if (error) throw error;

      message.success(`Tiền tệ "${currency.name}" đã được cập nhật thành công`);
      await fetchCurrencies();
      await fetchStats();
      return currency;
    } catch (error) {
      console.error('Error updating currency:', error);
      message.error('Không thể cập nhật tiền tệ');
      return null;
    }
  }, [fetchCurrencies, fetchStats]);

  // Delete a currency
  const deleteCurrency = useCallback(async (currencyType: string): Promise<boolean> => {
    try {
      // Check if currency is in use (you may want to add additional checks)
      // For example, check if it's referenced in other tables

      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('currency_type', currencyType);

      if (error) throw error;

      message.success('Tiền tệ đã được xóa thành công');
      await fetchCurrencies();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting currency:', error);
      message.error('Không thể xóa tiền tệ');
      return false;
    }
  }, [fetchCurrencies, fetchStats]);

  // Bulk delete currencies
  const deleteCurrencies = useCallback(async (currencyTypes: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .in('currency_type', currencyTypes);

      if (error) throw error;

      message.success(`Đã xóa ${currencyTypes.length} tiền tệ thành công`);
      await fetchCurrencies();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting currencies:', error);
      message.error('Không thể xóa tiền tệ');
      return false;
    }
  }, [fetchCurrencies, fetchStats]);

  // Duplicate a currency
  const duplicateCurrency = useCallback(async (currencyType: string): Promise<Currency | null> => {
    try {
      // Get original currency
      const { data: original, error: fetchError } = await supabase
        .from('currencies')
        .select('*')
        .eq('currency_type', currencyType)
        .single();

      if (fetchError) throw fetchError;

      // Create new currency type
      const newType = `${original.currency_type}_copy`;
      
      // Check if new type already exists
      const { count } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true })
        .eq('currency_type', newType);

      if (count && count > 0) {
        message.error(`Loại tiền tệ "${newType}" đã tồn tại`);
        return null;
      }

      const { data: newCurrency, error: insertError } = await supabase
        .from('currencies')
        .insert({
          currency_type: newType,
          name: `${original.name} (Sao chép)`,
          description: original.description,
          icon: original.icon,
          color: original.color,
          exchange_rate: original.exchange_rate,
          max_stack: original.max_stack,
          tradable: original.tradable,
          destroyable: original.destroyable,
          category: original.category,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      message.success(`Đã nhân bản tiền tệ "${original.name}" thành công`);
      await fetchCurrencies();
      await fetchStats();
      return newCurrency;
    } catch (error) {
      console.error('Error duplicating currency:', error);
      message.error('Không thể nhân bản tiền tệ');
      return null;
    }
  }, [fetchCurrencies, fetchStats]);

  // Search currencies
  const searchCurrencies = useCallback(async (searchTerm: string): Promise<Currency[]> => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .or(`currency_type.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching currencies:', error);
      return [];
    }
  }, []);

  // Get currencies by category
  const getCurrenciesByCategory = useCallback(async (category: string): Promise<Currency[]> => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('category', category)
        .order('currency_type', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching currencies by category:', error);
      message.error('Không thể tải tiền tệ theo danh mục');
      return [];
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: null,
      tradable: null,
      destroyable: null,
      minExchangeRate: undefined,
      maxExchangeRate: undefined,
      minStack: undefined,
      maxStack: undefined,
    });
  }, []);

  // Initial load
  useEffect(() => {
    fetchCurrencies();
    fetchStats();
  }, [fetchCurrencies, fetchStats]);

  return {
    // State
    currencies,
    loading,
    filters,
    setFilters,
    stats,
    selectedCurrency,

    // CRUD Operations
    createCurrency,
    updateCurrency,
    deleteCurrency,
    deleteCurrencies,
    duplicateCurrency,
    fetchCurrencyDetails,

    // Query Operations
    searchCurrencies,
    getCurrenciesByCategory,

    // Utility
    refresh: fetchCurrencies,
    refreshStats: fetchStats,
    clearFilters,
  };
};

// Helper function to format currency amount
export const formatCurrencyAmount = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(amount);
};

// Helper function to get category label
export const getCategoryLabel = (category: string): string => {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return option?.label || category;
};

// Helper function to get category color
export const getCategoryColor = (category: string): string => {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return option?.color || '#666';
};
