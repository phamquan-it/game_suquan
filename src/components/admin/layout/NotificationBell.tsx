'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Dropdown, Button, Space, Typography, Divider, App } from 'antd';
import {
  BellOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useSystemAlerts, SystemAlert, ALERT_LEVELS } from '@/app/admin/system/hooks/useSystemAlerts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

const { Text } = Typography;

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface NotificationBellProps {
  onShowNotificationCenter: () => void;
}

// Helper lấy icon theo level
const getAlertIcon = (level: string) => {
  switch (level) {
    case 'critical':
      return <WarningOutlined style={{ color: '#8B0000' }} />;
    case 'error':
      return <CloseCircleOutlined style={{ color: '#DC143C' }} />;
    case 'warning':
      return <WarningOutlined style={{ color: '#FF8C00' }} />;
    case 'info':
      return <InfoCircleOutlined style={{ color: '#1E90FF' }} />;
    default:
      return <InfoCircleOutlined />;
  }
};

// Helper lấy màu theo level
const getAlertColor = (level: string): string => {
  const config = ALERT_LEVELS.find(l => l.value === level);
  return config?.color || '#666';
};

// Helper lấy label theo level
const getAlertLabel = (level: string): string => {
  const config = ALERT_LEVELS.find(l => l.value === level);
  return config?.label || level;
};

// Helper format thời gian
const formatTime = (timestamp: string): string => {
  return dayjs(timestamp).fromNow();
};

export default function NotificationBell({ onShowNotificationCenter }: NotificationBellProps) {
  // Dùng message từ App context (không static) để tránh cảnh báo dynamic theme.
  const { message } = App.useApp();

  const {
    alerts,
    loading,
    acknowledgeAlert,
    getUnacknowledgedCount,
    refresh,
    newAlertCount,
    resetNewAlertCount,
    isRealtimeEnabled,
  } = useSystemAlerts({
    acknowledged: false,
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnacknowledgedCount();
      setUnreadCount(count);
    };
    fetchUnreadCount();
  }, [getUnacknowledgedCount, alerts]);

  const handleOpenChange = (open: boolean) => {
    setDropdownVisible(open);
    if (open) {
      resetNewAlertCount();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      await refresh();
      message.success('Đã xác nhận cảnh báo');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      message.error('Không thể xác nhận cảnh báo');
    }
  };

  const criticalAlerts = alerts.filter(
    n => (n.level === 'critical' || n.level === 'error')
  );

  const recentAlerts = alerts.slice(0, 5);

  // ✅ Tạo dropdown items đúng cấu trúc
  const dropdownItems: any[] = [
    {
      key: 'header',
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
          <Text strong>Thông báo hệ thống</Text>
          <Space>
            {isRealtimeEnabled && (
              <Badge 
                status="processing" 
                color="#52c41a"
                text={<span style={{ fontSize: 11, color: '#52c41a' }}>Trực tiếp</span>}
              />
            )}
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {unreadCount} chưa đọc
            </Text>
          </Space>
        </div>
      ),
      disabled: true,
    },
  ];

  // ✅ Thêm critical alerts với đúng cấu trúc
  if (criticalAlerts.length > 0) {
    dropdownItems.push({
      key: 'critical-section',
      label: (
        <Space>
          <WarningOutlined style={{ color: '#ff4d4f' }} />
          <Text type="danger">Cảnh báo quan trọng</Text>
        </Space>
      ),
      disabled: true,
    });
    
    criticalAlerts.slice(0, 3).forEach((alert) => {
      dropdownItems.push({
        key: `critical-${alert.id}`,
        label: (
          <div
            style={{ 
              maxWidth: 350, 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 6,
              background: `${getAlertColor(alert.level)}10`,
              borderLeft: `4px solid ${getAlertColor(alert.level)}`,
              marginBottom: 4,
            }}
            onClick={() => handleMarkAsRead(alert.id)}
          >
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <Space size={4}>
                  {getAlertIcon(alert.level)}
                  <Text strong style={{ fontSize: '13px', lineHeight: 1.3 }}>
                    {alert.title}
                  </Text>
                </Space>
                <Badge 
                  color={getAlertColor(alert.level)}
                  text={<span style={{ fontSize: 10, color: getAlertColor(alert.level) }}>
                    {getAlertLabel(alert.level)}
                  </span>}
                />
              </div>
              <Text 
                type="secondary" 
                style={{ fontSize: '12px', lineHeight: 1.4, display: 'block' }}
              >
                {alert.message.length > 100 ? `${alert.message.substring(0, 100)}...` : alert.message}
              </Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {formatTime(alert.timestamp)}
                </Text>
                {alert.server && (
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    🖥️ {alert.server.name || alert.server_id}
                  </Text>
                )}
              </div>
            </Space>
          </div>
        ),
        // ✅ Thêm disabled: false để đảm bảo item có thể click
        disabled: false,
      });
    });
  }

  // ✅ Thêm recent alerts
  if (recentAlerts.length > 0 && criticalAlerts.length === 0) {
    dropdownItems.push({
      type: 'divider' as const,
    });
    
    dropdownItems.push({
      key: 'recent-section',
      label: 'Thông báo gần đây',
      disabled: true,
    });
    
    recentAlerts.slice(0, 3).forEach((alert) => {
      dropdownItems.push({
        key: `recent-${alert.id}`,
        label: (
          <div
            style={{ 
              maxWidth: 350, 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 4,
              borderBottom: '1px solid #f0f0f0',
              transition: 'background 0.2s',
            }}
            onClick={() => handleMarkAsRead(alert.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fafafa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space size={4}>
                  {getAlertIcon(alert.level)}
                  <Text strong style={{ fontSize: '12px', lineHeight: 1.2 }}>
                    {alert.title}
                  </Text>
                </Space>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: getAlertColor(alert.level),
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
              </div>
              <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.3 }}>
                {alert.message.length > 80 ? `${alert.message.substring(0, 80)}...` : alert.message}
              </Text>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {formatTime(alert.timestamp)}
              </Text>
            </Space>
          </div>
        ),
        disabled: false,
      });
    });
  }

  // ✅ Empty state
  if (alerts.length === 0) {
    dropdownItems.push({
      key: 'empty',
      label: (
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          <BellOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
          <div style={{ marginTop: 12 }}>
            <Text strong style={{ fontSize: 15 }}>Không có thông báo mới</Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Hệ thống đang hoạt động bình thường
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    });
  }

  // ✅ View all button
  dropdownItems.push({
    type: 'divider' as const,
  });
  
  dropdownItems.push({
    key: 'view-all',
    label: (
      <div style={{ padding: '4px 0', textAlign: 'center' }}>
        <Button
          type="link"
          style={{ padding: 0, height: 'auto' }}
          onClick={onShowNotificationCenter}
        >
          Xem tất cả thông báo
        </Button>
      </div>
    ),
    disabled: false,
  });

  if (loading) {
    return (
      <Badge dot>
        <BellOutlined style={{ fontSize: 18, color: 'white', cursor: 'pointer' }} />
      </Badge>
    );
  }

  return (
    <Dropdown
      menu={{ items: dropdownItems }}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={handleOpenChange}
      overlayStyle={{ 
        width: 380, 
        maxHeight: 500,
        zIndex: 9999,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
    >
      <div style={{ display: 'inline-block', cursor: 'pointer' }}>
        <Badge
          count={newAlertCount > 0 ? newAlertCount : (unreadCount > 0 ? unreadCount : 0)}
          size="small"
          offset={[-2, 2]}
          style={{
            backgroundColor: criticalAlerts.length > 0 ? '#DC143C' : 
                            unreadCount > 0 ? '#1E90FF' : '#d9d9d9',
            cursor: 'pointer',
          }}
        >
          <BellOutlined
            style={{
              color: criticalAlerts.length > 0 ? '#ffa39e' : 
                     unreadCount > 0 ? 'white' : '#999',
              fontSize: 18,
              transition: 'color 0.3s',
            }}
          />
        </Badge>
      </div>
    </Dropdown>
  );
}
