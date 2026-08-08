// app/admin/hooks/useSystemAlerts.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { message, Modal } from 'antd';
import { supabase } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types
export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

export interface SystemAlert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  server_id: string;
  timestamp: string;
  acknowledged: boolean;
  // Joined data
  server?: {
    id: string;
    name: string;
    status?: string;
  };
}

export interface AlertFilters {
  search?: string;
  level?: AlertLevel | null;
  serverId?: string | null;
  acknowledged?: boolean | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface AlertStats {
  total: number;
  unacknowledged: number;
  acknowledged: number;
  byLevel: {
    level: AlertLevel;
    count: number;
    percentage: number;
  }[];
  byServer: {
    serverId: string;
    serverName: string;
    count: number;
    percentage: number;
  }[];
  criticalCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
}

export interface AlertLevelConfig {
  value: AlertLevel;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  severity: number;
}

// Alert level configurations
export const ALERT_LEVELS: AlertLevelConfig[] = [
  { 
    value: 'info', 
    label: 'Thông tin', 
    color: '#1E90FF', 
    bgColor: '#F0F8FF',
    icon: 'ℹ️',
    severity: 1
  },
  { 
    value: 'warning', 
    label: 'Cảnh báo', 
    color: '#FF8C00', 
    bgColor: '#FFF8F0',
    icon: '⚠️',
    severity: 2
  },
  { 
    value: 'error', 
    label: 'Lỗi', 
    color: '#DC143C', 
    bgColor: '#FFF0F0',
    icon: '❌',
    severity: 3
  },
  { 
    value: 'critical', 
    label: 'Nghiêm trọng', 
    color: '#8B0000', 
    bgColor: '#FFE8E8',
    icon: '🚨',
    severity: 4
  },
];

export const useSystemAlerts = (initialFilters?: AlertFilters) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AlertFilters>(initialFilters || {
    search: '',
    level: null,
    serverId: null,
    acknowledged: null,
    dateFrom: null,
    dateTo: null,
  });
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [availableServers, setAvailableServers] = useState<{ id: string; name: string }[]>([]);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const [lastAlertTime, setLastAlertTime] = useState<string | null>(null);
  
  // Realtime subscription reference
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const alertSoundRef = useRef<HTMLAudioElement | null>(null);

  // Get alert level config
  const getAlertLevelConfig = useCallback((level: AlertLevel): AlertLevelConfig => {
    return ALERT_LEVELS.find(l => l.value === level) || ALERT_LEVELS[0];
  }, []);

  // Get alert level label
  const getAlertLevelLabel = useCallback((level: AlertLevel): string => {
    return getAlertLevelConfig(level).label;
  }, [getAlertLevelConfig]);

  // Get alert level color
  const getAlertLevelColor = useCallback((level: AlertLevel): string => {
    return getAlertLevelConfig(level).color;
  }, [getAlertLevelConfig]);

  // Get alert level background color
  const getAlertLevelBgColor = useCallback((level: AlertLevel): string => {
    return getAlertLevelConfig(level).bgColor;
  }, [getAlertLevelConfig]);

  // Get alert level icon
  const getAlertLevelIcon = useCallback((level: AlertLevel): string => {
    return getAlertLevelConfig(level).icon;
  }, [getAlertLevelConfig]);

  // Play alert sound
  const playAlertSound = useCallback((level: AlertLevel) => {
    try {
      // Create audio context for different alert sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Different frequencies for different levels
      const frequencies = {
        info: 800,
        warning: 600,
        error: 400,
        critical: 200,
      };
      
      const frequency = frequencies[level] || 600;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Volume based on severity
      const severity = ALERT_LEVELS.find(l => l.value === level)?.severity || 1;
      gainNode.gain.value = 0.1 + (severity - 1) * 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 300);
    } catch (error) {
      // Silent fail if audio not supported
      console.debug('Audio not supported');
    }
  }, []);

  // Show notification for new alert
  const showAlertNotification = useCallback((alert: SystemAlert) => {
    const config = getAlertLevelConfig(alert.level);
    
    // Play sound
    playAlertSound(alert.level);
    
    // Show browser notification if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🔔 ${config.icon} ${alert.title}`, {
          body: alert.message,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    
    // Show Ant Design notification
    message.info({
      content: `🔔 ${config.icon} ${alert.title}`,
      duration: 5,
      onClick: () => {
        // Navigate to alert detail or handle click
        setSelectedAlert(alert);
      },
    });
  }, [getAlertLevelConfig, playAlertSound]);

  // Fetch alerts with filters
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('system_alerts')
        .select(`
          *,
          server:server_id (
            id,
            name,
            status
          )
        `)
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,message.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      if (filters.level) {
        query = query.eq('level', filters.level);
      }

      if (filters.serverId) {
        query = query.eq('server_id', filters.serverId);
      }

      if (filters.acknowledged !== null && filters.acknowledged !== undefined) {
        query = query.eq('acknowledged', filters.acknowledged);
      }

      if (filters.dateFrom) {
        query = query.gte('timestamp', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('timestamp', filters.dateTo);
      }

      // Limit to 500 alerts for performance
      query = query.limit(500);

      const { data, error } = await query;

      if (error) throw error;
      setAlerts(data || []);
      
      // Update last alert time
      if (data && data.length > 0) {
        setLastAlertTime(data[0].timestamp);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      message.error('Không thể tải cảnh báo hệ thống');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch alert statistics
  const fetchStats = useCallback(async () => {
    try {
      // Total alerts
      const { count: total } = await supabase
        .from('system_alerts')
        .select('*', { count: 'exact', head: true });

      // Unacknowledged alerts
      const { count: unacknowledged } = await supabase
        .from('system_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);

      // Acknowledged alerts
      const { count: acknowledged } = await supabase
        .from('system_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', true);

      // By level
      const { data: levelData } = await supabase
        .from('system_alerts')
        .select('level');

      const levelCounts: Record<AlertLevel, number> = {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0,
      };

      levelData?.forEach(item => {
        if (item.level in levelCounts) {
          levelCounts[item.level as AlertLevel]++;
        }
      });

      const totalCount = levelData?.length || 0;
      const byLevel = Object.entries(levelCounts).map(([level, count]) => ({
        level: level as AlertLevel,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      }));

      // By server
      const { data: serverData } = await supabase
        .from('system_alerts')
        .select(`
          server_id,
          server:server_id (
            id,
            name
          )
        `);

      const serverCounts: Record<string, { name: string; count: number }> = {};
      serverData?.forEach(item => {
        if (item.server_id) {
          const serverName = (item.server as any)?.name || item.server_id;
          if (!serverCounts[item.server_id]) {
            serverCounts[item.server_id] = {
              name: serverName,
              count: 0,
            };
          }
          serverCounts[item.server_id].count++;
        }
      });

      const byServer = Object.entries(serverCounts)
        .map(([serverId, data]) => ({
          serverId,
          serverName: data.name,
          count: data.count,
          percentage: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        total: total || 0,
        unacknowledged: unacknowledged || 0,
        acknowledged: acknowledged || 0,
        byLevel,
        byServer,
        criticalCount: levelCounts.critical,
        errorCount: levelCounts.error,
        warningCount: levelCounts.warning,
        infoCount: levelCounts.info,
      });
    } catch (error) {
      console.error('Error fetching alert stats:', error);
    }
  }, []);

  // Fetch available servers
  const fetchServers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('id, name, status')
        .order('name', { ascending: true });

      if (error) throw error;
      setAvailableServers(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching servers:', error);
      return [];
    }
  }, []);

  // Fetch a single alert detail
  const fetchAlertDetail = useCallback(async (alertId: string): Promise<SystemAlert | null> => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select(`
          *,
          server:server_id (
            id,
            name,
            status
          )
        `)
        .eq('id', alertId)
        .single();

      if (error) throw error;
      setSelectedAlert(data);
      return data;
    } catch (error) {
      console.error('Error fetching alert detail:', error);
      message.error('Không thể tải chi tiết cảnh báo');
      return null;
    }
  }, []);

  // Acknowledge an alert
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ acknowledged: true })
        .eq('id', alertId);

      if (error) throw error;

      message.success('Đã xác nhận cảnh báo');
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      message.error('Không thể xác nhận cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Acknowledge multiple alerts
  const acknowledgeAlerts = useCallback(async (alertIds: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ acknowledged: true })
        .in('id', alertIds);

      if (error) throw error;

      message.success(`Đã xác nhận ${alertIds.length} cảnh báo`);
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error acknowledging alerts:', error);
      message.error('Không thể xác nhận cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Unacknowledge an alert
  const unacknowledgeAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ acknowledged: false })
        .eq('id', alertId);

      if (error) throw error;

      message.success('Đã bỏ xác nhận cảnh báo');
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error unacknowledging alert:', error);
      message.error('Không thể bỏ xác nhận cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Delete an alert
  const deleteAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      message.success('Đã xóa cảnh báo thành công');
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      message.error('Không thể xóa cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Bulk delete alerts
  const deleteAlerts = useCallback(async (alertIds: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .delete()
        .in('id', alertIds);

      if (error) throw error;

      message.success(`Đã xóa ${alertIds.length} cảnh báo thành công`);
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting alerts:', error);
      message.error('Không thể xóa cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Clear all alerts
  const clearAllAlerts = useCallback(async (): Promise<boolean> => {
    try {
      const confirmed = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: 'Xóa tất cả cảnh báo',
          content: 'Bạn có chắc chắn muốn xóa tất cả cảnh báo? Hành động này không thể hoàn tác.',
          okText: 'Xóa tất cả',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return false;

      const { error } = await supabase
        .from('system_alerts')
        .delete()
        .neq('id', 'none');

      if (error) throw error;

      message.success('Đã xóa tất cả cảnh báo thành công');
      await fetchAlerts();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error clearing alerts:', error);
      message.error('Không thể xóa tất cả cảnh báo');
      return false;
    }
  }, [fetchAlerts, fetchStats]);

  // Export alerts
  const exportAlerts = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select(`
          *,
          server:server_id (
            name
          )
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_alerts_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('Xuất cảnh báo thành công');
      } else {
        if (!data || data.length === 0) {
          message.warning('Không có dữ liệu để xuất');
          return;
        }

        const headers = ['id', 'level', 'title', 'message', 'server', 'timestamp', 'acknowledged'];
        const csvRows = [headers.join(',')];
        
        data.forEach((alert: any) => {
          const row = [
            alert.id,
            alert.level,
            `"${alert.title.replace(/"/g, '""')}"`,
            `"${alert.message.replace(/"/g, '""')}"`,
            alert.server?.name || alert.server_id,
            alert.timestamp,
            alert.acknowledged ? 'Yes' : 'No',
          ];
          csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_alerts_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('Xuất cảnh báo thành công');
      }
    } catch (error) {
      console.error('Error exporting alerts:', error);
      message.error('Không thể xuất cảnh báo');
    }
  }, []);

  // Get unacknowledged alerts count
  const getUnacknowledgedCount = useCallback(async (): Promise<number> => {
    try {
      const { count } = await supabase
        .from('system_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);

      return count || 0;
    } catch (error) {
      console.error('Error getting unacknowledged count:', error);
      return 0;
    }
  }, []);

  // Get alerts by level
  const getAlertsByLevel = useCallback(async (level: AlertLevel): Promise<SystemAlert[]> => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('level', level)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching alerts by level:', error);
      return [];
    }
  }, []);

  // Get recent alerts
  const getRecentAlerts = useCallback(async (limit: number = 50): Promise<SystemAlert[]> => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      return [];
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      level: null,
      serverId: null,
      acknowledged: null,
      dateFrom: null,
      dateTo: null,
    });
  }, []);

  // ============================================================
  // REALTIME SUBSCRIPTION
  // ============================================================
  const setupRealtimeSubscription = useCallback(() => {
    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    if (!isRealtimeEnabled) {
      return;
    }

    // Create subscription
    const subscription = supabase
      .channel('system_alerts_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_alerts',
        },
        (payload) => {
          const newAlert = payload.new as SystemAlert;
          
          // Update alerts list
          setAlerts(prev => [newAlert, ...prev]);
          
          // Update new alert count
          setNewAlertCount(prev => prev + 1);
          
          // Update last alert time
          setLastAlertTime(newAlert.timestamp);
          
          // Show notification
          showAlertNotification(newAlert);
          
          // Update stats
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'system_alerts',
        },
        (payload) => {
          const updatedAlert = payload.new as SystemAlert;
          
          // Update alerts list
          setAlerts(prev => 
            prev.map(alert => 
              alert.id === updatedAlert.id ? updatedAlert : alert
            )
          );
          
          // Update stats
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'system_alerts',
        },
        (payload) => {
          const deletedId = payload.old.id;
          
          // Remove from alerts list
          setAlerts(prev => 
            prev.filter(alert => alert.id !== deletedId)
          );
          
          // Update stats
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          message.success('Đã kết nối realtime cho cảnh báo');
        } else if (status === 'CHANNEL_ERROR') {
          message.warning('Mất kết nối realtime, đang thử lại...');
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            setupRealtimeSubscription();
          }, 5000);
        }
      });

    subscriptionRef.current = subscription;

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isRealtimeEnabled, fetchStats, showAlertNotification]);

  // Toggle realtime
  const toggleRealtime = useCallback(() => {
    setIsRealtimeEnabled(prev => !prev);
    if (!isRealtimeEnabled) {
      // Re-enable
      setupRealtimeSubscription();
    }
  }, [isRealtimeEnabled, setupRealtimeSubscription]);

  // Reset new alert counter
  const resetNewAlertCount = useCallback(() => {
    setNewAlertCount(0);
  }, []);

  // Initial load
  useEffect(() => {
    fetchAlerts();
    fetchStats();
    fetchServers();
    
    // Request notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [fetchAlerts, fetchStats, fetchServers]);

  // Setup realtime subscription
  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [setupRealtimeSubscription]);

  // Re-fetch when filters change
  useEffect(() => {
    fetchAlerts();
  }, [filters, fetchAlerts]);

  return {
    // State
    alerts,
    loading,
    filters,
    setFilters,
    stats,
    selectedAlert,
    availableServers,
    isRealtimeEnabled,
    newAlertCount,
    lastAlertTime,

    // CRUD Operations
    acknowledgeAlert,
    acknowledgeAlerts,
    unacknowledgeAlert,
    deleteAlert,
    deleteAlerts,
    clearAllAlerts,
    fetchAlertDetail,

    // Query Operations
    getAlertsByLevel,
    getRecentAlerts,
    getUnacknowledgedCount,
    exportAlerts,

    // Realtime
    toggleRealtime,
    resetNewAlertCount,

    // Utility
    getAlertLevelConfig,
    getAlertLevelLabel,
    getAlertLevelColor,
    getAlertLevelBgColor,
    getAlertLevelIcon,
    playAlertSound,

    // Refresh
    refresh: fetchAlerts,
    refreshStats: fetchStats,
    fetchServers,
    clearFilters,
  };
};

// Helper function to format timestamp
export const formatAlertTimestamp = (timestamp: string): string => {
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
export const getAlertRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const alertTime = new Date(timestamp);
  const diffMs = now.getTime() - alertTime.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${diffDay} ngày trước`;
};

// Helper function to get severity level
export const getAlertSeverity = (level: AlertLevel): number => {
  const config = ALERT_LEVELS.find(l => l.value === level);
  return config?.severity || 1;
};
