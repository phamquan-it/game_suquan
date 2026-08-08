// src/components/admin/ui/StatsCard.tsx
import React from 'react';
import { Card, Statistic, Typography, Space, Progress, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const { Text } = Typography;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  extra?: React.ReactNode;
  loading?: boolean;
  subtitle?: string;
  progress?: {
    percent: number;
    status?: 'success' | 'exception' | 'normal' | 'active';
  };
  tooltip?: string;
  formatValue?: (value: string | number) => string;
}

export default function StatsCard({
  title,
  value,
  icon,
  color = '#8B0000',
  trend,
  extra,
  loading = false,
  subtitle,
  progress,
  tooltip,
  formatValue,
}: StatsCardProps) {
  // Format value if formatter provided
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <Card
      loading={loading}
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        borderRadius: 12,
        transition: 'all 0.3s ease',
        height: '100%',
      }}
      hoverable
    >
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {/* Header với title và tooltip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={4}>
            {icon}
            <Text type="secondary" style={{ fontSize: 14 }}>
              {title}
            </Text>
          </Space>
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoCircleOutlined style={{ color: '#999', fontSize: 14 }} />
            </Tooltip>
          )}
        </div>

        {/* Value và trend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Statistic
            value={displayValue}
            valueStyle={{
              color,
              fontSize: 28,
              fontWeight: 600,
            }}
          />
          {trend && (
            <Tag
              color={trend.isPositive ? 'green' : 'red'}
              icon={trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              style={{ borderRadius: 12, padding: '4px 12px' }}
            >
              {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
            </Tag>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <Text type="secondary" style={{ fontSize: 13 }}>
            {subtitle}
          </Text>
        )}

        {/* Progress bar */}
        {progress && (
          <Progress
            percent={progress.percent}
            status={progress.status || 'normal'}
            strokeColor={color}
            size="small"
            format={(percent) => `${percent}%`}
          />
        )}

        {/* Extra content */}
        {extra && (
          <div style={{ marginTop: 8, borderTop: `1px solid ${color}20`, paddingTop: 8 }}>
            {extra}
          </div>
        )}
      </Space>
    </Card>
  );
}
