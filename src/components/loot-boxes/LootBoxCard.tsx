// components/loot-boxes/LootBoxCard.tsx
import React from 'react';
import { Card, Button, Tag, Space, Badge, Tooltip } from 'antd';
import { 
    GiftOutlined, 
    StarFilled, 
    CrownFilled,
    FireFilled 
} from '@ant-design/icons';
import { LootBox } from '@/lib/types/loot-box';
import { BOX_TIERS, BOX_TYPE_ICONS } from '@/lib/constants/loot-box-types';

interface LootBoxCardProps {
    lootBox: LootBox;
    quantity?: number;
    onOpen?: (box: LootBox) => void;
    onPreview?: (box: LootBox) => void;
    disabled?: boolean;
}

export const LootBoxCard: React.FC<LootBoxCardProps> = ({
    lootBox,
    quantity = 0,
    onOpen,
    onPreview,
    disabled = false
}) => {
    const tierConfig = BOX_TIERS[lootBox.tier];
    const boxIcon = BOX_TYPE_ICONS[lootBox.boxType];
    
    const getBoxGlow = () => {
        const baseColor = tierConfig.color;
        return {
            background: `linear-gradient(135deg, ${baseColor}20, ${baseColor}08)`,
            border: `2px solid ${baseColor}40`,
            boxShadow: `0 4px 20px ${baseColor}30`
        };
    };

    return (
        <Card
            style={getBoxGlow()}
            hoverable={!disabled}
            cover={
                <div style={{ 
                    padding: 20, 
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    {/* Box Icon with Effects */}
                    <div style={{
                        fontSize: 48,
                        filter: lootBox.visualEffects.shineEffect ? 
                            'drop-shadow(0 0 20px rgba(255,255,255,0.5))' : 'none',
                        animation: lootBox.visualEffects.rarityPulse ? 
                            'pulse 2s infinite' : 'none'
                    }}>
                        {boxIcon}
                    </div>
                    
                    {/* Quantity Badge */}
                    {quantity > 0 && (
                        <Badge 
                            count={quantity} 
                            style={{ 
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: '#52c41a'
                            }}
                        />
                    )}
                    
                    {/* Exclusive Tag */}
                    {lootBox.exclusive && (
                        <Tag 
                            color="gold" 
                            style={{ 
                                position: 'absolute',
                                top: 8,
                                left: 8
                            }}
                        >
                            <CrownFilled /> Độc Quyền
                        </Tag>
                    )}
                </div>
            }
            actions={[
                <Tooltip key="preview" title="Xem phần thưởng có thể nhận">
                    <Button 
                        type="text" 
                        icon={<GiftOutlined />}
                        onClick={() => onPreview?.(lootBox)}
                    >
                        Xem Trước
                    </Button>
                </Tooltip>,
                <Button
                    key="open"
                    type="primary"
                    disabled={disabled || quantity === 0}
                    onClick={() => onOpen?.(lootBox)}
                    style={{
                        background: tierConfig.color,
                        borderColor: tierConfig.color
                    }}
                >
                    Mở Ngay
                </Button>
            ]}
        >
            <Card.Meta
                title={
                    <Space>
                        <span style={{ color: tierConfig.color, fontWeight: 600 }}>
                            {lootBox.name}
                        </span>
                        <Tag color={tierConfig.color}>
                            {tierConfig.name}
                        </Tag>
                    </Space>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {lootBox.description}
                        </div>
                        
                        {/* Cost Display */}
                        <div style={{ marginTop: 8 }}>
                            <strong>Chi phí mở:</strong>
                            <div style={{ fontSize: 12 }}>
                                💰 {lootBox.openCost.amount} {lootBox.openCost.currency}
                            </div>
                        </div>
                        
                        {/* Limits Display */}
                        {lootBox.openLimits.daily && (
                            <div style={{ fontSize: 11, color: '#999' }}>
                                📊 {lootBox.openLimits.daily}/ngày
                            </div>
                        )}
                        
                        {/* Time Limited Warning */}
                        {lootBox.timeLimited && lootBox.availableUntil && (
                            <Tag color="red" style={{ fontSize: 10 }}>
                                ⏳ Hết hạn: {new Date(lootBox.availableUntil).toLocaleDateString('vi-VN')}
                            </Tag>
                        )}
                    </Space>
                }
            />
        </Card>
    );
};
