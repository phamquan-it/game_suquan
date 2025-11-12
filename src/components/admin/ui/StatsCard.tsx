import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

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
}

export default function StatsCard({
    title,
    value,
    icon,
    color = '#8B0000',
    trend
}: StatsCardProps) {
    return (
        <Card
            style={{
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                border: `1px solid ${color}30`,
                borderRadius: 12,
            }}
        >
            <Statistic
                title={title}
                value={value}
                prefix={icon}
                valueStyle={{ color }}
                suffix={
                    trend && (
                        <Text
                            type={trend.isPositive ? 'success' : 'danger'}
                            style={{ fontSize: 12 }}
                        >
                            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            {trend.value}%
                        </Text>
                    )
                }
            />
        </Card>
    );
}
