// app/admin/hooks/useSystemLogs.ts
import { useEffect, useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface SystemLog {
  id: string;
  level: LogLevel;
  message: string;
  source: string;
  timestamp: string;
  details: Record<string, any> | null;
}

export interface LogFilters {
  search?: string;
  level?: LogLevel | null;
  source?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  hasDetails?: boolean | null;
}

export interface LogStats {
  total: number;
  byLevel: {
    level: LogLevel;
    count: number;
    percentage: number;
  }[];
  bySource: {
    source: string;
    count: number;
    percentage: number;
  }[];
  errorRate: number;
  timeRange: {
    start: string;
    end: string;
  };
  logsByHour: {
    hour: string;
    count: number;
  }[];
  logsByDay: {
    day: string;
    count: number;
  }[];
}

export interface LogLevelConfig {
  value: LogLevel;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

// Log level configurations
export const LOG_LEVELS: LogLevelConfig[] = [
  { 
    value: 'debug', 
    label: 'Debug', 
    color: '#708090', 
    bgColor: '#F0F0F0',
    icon: '🐛'
  },
  { 
    value: 'info', 
    label: 'Info', 
    color: '#1E90FF', 
    bgColor: '#F0F8FF',
    icon: 'ℹ️'
  },
  { 
    value: 'warn', 
    label: 'Warning', 
    color: '#FF8C00', 
    bgColor: '#FFF8F0',
    icon: '⚠️'
  },
  { 
    value: 'error', 
    label: 'Error', 
    color: '#DC143C', 
    bgColor: '#FFF0F0',
    icon: '❌'
  },
  { 
    value: 'fatal', 
    label: 'Fatal', 
    color: '#8B0000', 
    bgColor: '#FFE8E8',
    icon: '💀'
  },
];

export const useSystemLogs = (initialFilters?: LogFilters) => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LogFilters>(initialFilters || {
    search: '',
    level: null,
    source: null,
    dateFrom: null,
    dateTo: null,
    hasDetails: null,
  });
  const [stats, setStats] = useState<LogStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [availableSources, setAvailableSources] = useState<string[]>([]);

  // Get log level config
  const getLogLevelConfig = useCallback((level: LogLevel): LogLevelConfig => {
    return LOG_LEVELS.find(l => l.value === level) || LOG_LEVELS[1];
  }, []);

  // Format log level label
  const getLogLevelLabel = useCallback((level: LogLevel): string => {
    return getLogLevelConfig(level).label;
  }, [getLogLevelConfig]);

  // Get log level color
  const getLogLevelColor = useCallback((level: LogLevel): string => {
    return getLogLevelConfig(level).color;
  }, [getLogLevelConfig]);

  // Get log level background color
  const getLogLevelBgColor = useCallback((level: LogLevel): string => {
    return getLogLevelConfig(level).bgColor;
  }, [getLogLevelConfig]);

  // Get log level icon
  const getLogLevelIcon = useCallback((level: LogLevel): string => {
    return getLogLevelConfig(level).icon;
  }, [getLogLevelConfig]);

  // Fetch logs with filters
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`message.ilike.%${filters.search}%,source.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      if (filters.level) {
        query = query.eq('level', filters.level);
      }

      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      if (filters.dateFrom) {
        query = query.gte('timestamp', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('timestamp', filters.dateTo);
      }

      if (filters.hasDetails === true) {
        query = query.not('details', 'is', null);
      } else if (filters.hasDetails === false) {
        query = query.is('details', null);
      }

      // Limit to 1000 logs for performance
      query = query.limit(1000);

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      message.error('Không thể tải nhật ký hệ thống');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch log statistics
  const fetchStats = useCallback(async () => {
    try {
      // Total logs
      const { count: total } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true });

      // By level
      const { data: levelData } = await supabase
        .from('system_logs')
        .select('level');

      const levelCounts: Record<LogLevel, number> = {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
        fatal: 0,
      };

      levelData?.forEach(item => {
        if (item.level in levelCounts) {
          levelCounts[item.level as LogLevel]++;
        }
      });

      const totalCount = levelData?.length || 0;
      const byLevel = Object.entries(levelCounts).map(([level, count]) => ({
        level: level as LogLevel,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      }));

      // By source
      const { data: sourceData } = await supabase
        .from('system_logs')
        .select('source');

      const sourceCounts: Record<string, number> = {};
      sourceData?.forEach(item => {
        sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
      });

      const bySource = Object.entries(sourceCounts)
        .map(([source, count]) => ({
          source,
          count,
          percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 sources

      // Set available sources
      setAvailableSources(Object.keys(sourceCounts));

      // Error rate
      const errorCount = levelCounts.error + levelCounts.fatal;
      const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;

      // Time range
      const { data: timeRangeData } = await supabase
        .from('system_logs')
        .select('timestamp')
        .order('timestamp', { ascending: true })
        .limit(1);

      const { data: timeRangeDataEnd } = await supabase
        .from('system_logs')
        .select('timestamp')
        .order('timestamp', { ascending: false })
        .limit(1);

      const timeRange = {
        start: timeRangeData?.[0]?.timestamp || new Date().toISOString(),
        end: timeRangeDataEnd?.[0]?.timestamp || new Date().toISOString(),
      };

      // Logs by hour (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: hourlyData } = await supabase
        .from('system_logs')
        .select('timestamp')
        .gte('timestamp', twentyFourHoursAgo.toISOString());

      const hourlyCounts: Record<string, number> = {};
      hourlyData?.forEach(item => {
        const hour = new Date(item.timestamp).toLocaleString('vi-VN', {
          hour: '2-digit',
          day: '2-digit',
          month: '2-digit',
        });
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
      });

      const logsByHour = Object.entries(hourlyCounts)
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour.localeCompare(b.hour));

      // Logs by day (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: dailyData } = await supabase
        .from('system_logs')
        .select('timestamp')
        .gte('timestamp', sevenDaysAgo.toISOString());

      const dailyCounts: Record<string, number> = {};
      dailyData?.forEach(item => {
        const day = new Date(item.timestamp).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        });
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      });

      const logsByDay = Object.entries(dailyCounts)
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => a.day.localeCompare(b.day));

      setStats({
        total: total || 0,
        byLevel,
        bySource,
        errorRate,
        timeRange,
        logsByHour,
        logsByDay,
      });
    } catch (error) {
      console.error('Error fetching log stats:', error);
    }
  }, []);

  // Fetch a single log detail
  const fetchLogDetail = useCallback(async (logId: string): Promise<SystemLog | null> => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('id', logId)
        .single();

      if (error) throw error;
      setSelectedLog(data);
      return data;
    } catch (error) {
      console.error('Error fetching log detail:', error);
      message.error('Không thể tải chi tiết nhật ký');
      return null;
    }
  }, []);

  // Delete a log
  const deleteLog = useCallback(async (logId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      message.success('Đã xóa nhật ký thành công');
      await fetchLogs();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting log:', error);
      message.error('Không thể xóa nhật ký');
      return false;
    }
  }, [fetchLogs, fetchStats]);

  // Bulk delete logs
  const deleteLogs = useCallback(async (logIds: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_logs')
        .delete()
        .in('id', logIds);

      if (error) throw error;

      message.success(`Đã xóa ${logIds.length} nhật ký thành công`);
      await fetchLogs();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting logs:', error);
      message.error('Không thể xóa nhật ký');
      return false;
    }
  }, [fetchLogs, fetchStats]);

  // Clear all logs
  const clearAllLogs = useCallback(async (): Promise<boolean> => {
    try {
      const confirmed = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: 'Xóa tất cả nhật ký',
          content: 'Bạn có chắc chắn muốn xóa tất cả nhật ký? Hành động này không thể hoàn tác.',
          okText: 'Xóa tất cả',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return false;

      const { error } = await supabase
        .from('system_logs')
        .delete()
        .neq('id', 'none'); // Delete all records

      if (error) throw error;

      message.success('Đã xóa tất cả nhật ký thành công');
      await fetchLogs();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error clearing logs:', error);
      message.error('Không thể xóa tất cả nhật ký');
      return false;
    }
  }, [fetchLogs, fetchStats]);

  // Export logs
  const exportLogs = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('Xuất nhật ký thành công');
      } else {
        // CSV export
        if (!data || data.length === 0) {
          message.warning('Không có dữ liệu để xuất');
          return;
        }

        const headers = ['id', 'level', 'message', 'source', 'timestamp', 'details'];
        const csvRows = [headers.join(',')];
        
        data.forEach((log: SystemLog) => {
          const row = [
            log.id,
            log.level,
            `"${log.message.replace(/"/g, '""')}"`,
            log.source,
            log.timestamp,
            log.details ? `"${JSON.stringify(log.details).replace(/"/g, '""')}"` : '',
          ];
          csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('Xuất nhật ký thành công');
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
      message.error('Không thể xuất nhật ký');
    }
  }, []);

  // Get logs by level
  const getLogsByLevel = useCallback(async (level: LogLevel): Promise<SystemLog[]> => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('level', level)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching logs by level:', error);
      return [];
    }
  }, []);

  // Get recent logs
  const getRecentLogs = useCallback(async (limit: number = 50): Promise<SystemLog[]> => {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return [];
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      level: null,
      source: null,
      dateFrom: null,
      dateTo: null,
      hasDetails: null,
    });
  }, []);

  // Initial load
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters, fetchLogs, fetchStats]);

  return {
    // State
    logs,
    loading,
    filters,
    setFilters,
    stats,
    selectedLog,
    availableSources,

    // CRUD Operations
    deleteLog,
    deleteLogs,
    clearAllLogs,
    fetchLogDetail,

    // Query Operations
    getLogsByLevel,
    getRecentLogs,
    exportLogs,

    // Utility
    getLogLevelConfig,
    getLogLevelLabel,
    getLogLevelColor,
    getLogLevelBgColor,
    getLogLevelIcon,

    // Refresh
    refresh: fetchLogs,
    refreshStats: fetchStats,
    clearFilters,
  };
};

// Helper function to format timestamp
export const formatLogTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Helper function to get relative time
export const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const logTime = new Date(timestamp);
  const diffMs = now.getTime() - logTime.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${diffDay} ngày trước`;
};

// Helper function to truncate message
export const truncateMessage = (message: string, maxLength: number = 100): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};
