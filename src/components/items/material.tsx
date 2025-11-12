// components/items/ItemCard.tsx
import React from 'react';
import { Card, Space, Statistic, Tag } from 'antd';
import { BaseItem } from '@/types/items/base';
import { getRarityColor } from '@/lib/utils/hero-utils';

interface ItemCardProps {
    item: BaseItem;
    onClick?: (item: BaseItem) => void;
    actions?: React.ReactNode[];
    showStats?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
    item,
    onClick,
    actions,
    showStats = false
}) => {
    return (
        <Card
            hoverable
            onClick={() => onClick?.(item)}
            actions={actions}
            cover={
                <div style={{ 
                    background: `linear-gradient(135deg, ${getRarityColor(item.rarity)}20, transparent)`,
                    padding: 16,
                    textAlign: 'center'
                }}>
                    <img
                        alt={item.name}
                        src={item.icon}
                        style={{ 
                            width: 64, 
                            height: 64,
                            filter: item.status === 'inactive' ? 'grayscale(100%)' : 'none'
                        }}
                    />
                </div>
            }
        >
            <Card.Meta
                title={
                    <Space>
                        <span style={{ 
                            color: getRarityColor(item.rarity),
                            fontWeight: 600 
                        }}>
                            {item.name}
                        </span>
                        {item.bound !== 'none' && (
                            <Tag color="blue" >
                                {item.bound}
                            </Tag>
                        )}
                    </Space>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {item.description}
                        </div>
                        <Space>
                            <Tag icon={getItemTypeIcon(item.type)}>
                                {item.type}
                            </Tag>
                            <Tag color={getRarityColor(item.rarity)}>
                                {item.rarity}
                            </Tag>
                        </Space>
                        {showStats && 'stats' in item && (
                            <div style={{ marginTop: 8 }}>
                                <Space size="large">
                                    {'stats' in item && (item as any).stats.attack && (
                                        <Statistic
                                            value={(item as any).stats.attack}
                                            prefix="⚔️"
                                            valueStyle={{ fontSize: 12 }}
                                        />
                                    )}
                                    {'stats' in item && (item as any).stats.defense && (
                                        <Statistic
                                            value={(item as any).stats.defense}
                                            prefix="🛡️"
                                            valueStyle={{ fontSize: 12 }}
                                        />
                                    )}
                                </Space>
                            </div>
                        )}
                    </Space>
                }
            />
        </Card>
    );
};
