// components/gems/GemCard.tsx
import React from 'react';
import { Card, Tag, Space, Progress, Tooltip, Badge } from 'antd';
import { GEM_CATEGORY_COLORS, GEM_CATEGORY_ICONS, GEM_GRADE_LABELS, GEM_QUALITY_LABELS } from '@/lib/constants/gem-constants';
import { RenderFunction } from 'antd/es/_util/getRenderPropValue';
import { GemItem } from '@/types/items/gem';

interface GemCardProps {
    gem: GemItem;
    onSelect?: (gem: GemItem) => void;
    showDetails?: boolean;
    selected?: boolean;
}

export const GemCard: React.FC<GemCardProps> = ({ 
    gem, 
    onSelect, 
    showDetails = false,
    selected = false 
}) => {
    const gemColor = GEM_CATEGORY_COLORS[gem.category];
    
    return (
        <Card
            hoverable
            onClick={() => onSelect?.(gem)}
            style={{
                border: `2px solid ${selected ? gemColor : '#d9d9d9'}`,
                background: `linear-gradient(135deg, ${gemColor}15, transparent)`,
                position: 'relative'
            }}
            cover={
                <div style={{ padding: 16, textAlign: 'center' }}>
                    <Badge 
                        count={gem.level} 
                        style={{ 
                            backgroundColor: gemColor,
                            zIndex: 1
                        }}
                    >
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: '12px',
                                background: gemColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                fontSize: 24,
                                boxShadow: `0 4px 12px ${gemColor}40`
                            }}
                        >
                            {GEM_CATEGORY_ICONS[gem.category]}
                        </div>
                    </Badge>
                </div>
            }
        >
            <Card.Meta
                title={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ color: gemColor, fontWeight: 600, fontSize: 14 }}>
                            {gem.name}
                        </div>
                        <Space size={[4, 4]} wrap>
                            <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>
                                {GEM_GRADE_LABELS[gem.grade]}
                            </Tag>
                            <Tag color="green" style={{ margin: 0, fontSize: 10 }}>
                                {GEM_QUALITY_LABELS[gem.quality]}
                            </Tag>
                            {gem.setGem && (
                                <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>
                                    Bộ
                                </Tag>
                            )}
                        </Space>
                    </Space>
                }
                description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
                            {gem.description}
                        </div>
                        
                        {/* Gem Stats */}
                        {showDetails && (
                            <>
                                <div style={{ marginTop: 8, fontSize: 11 }}>
                                    <strong>Chỉ số chính:</strong>
                                    <div>⚔️ Tấn công: {gem.stats.attack}</div>
                                    {gem.stats.criticalChance && (
                                        <div>🎯 Chí mạng: {gem.stats.criticalChance}%</div>
                                    )}
                                    {gem.stats.elementalDamage && (
                                        <div>🔥 {gem.stats.elementalDamage.type}: {gem.stats.elementalDamage.value}</div>
                                    )}
                                </div>
                                
                                {/* Level Progress */}
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ fontSize: 11 }}>Cấp {gem.level}/{gem.maxLevel}</div>
                                    <Progress 
                                        percent={(gem.level / gem.maxLevel) * 100} 
                                        size="small" 
                                        showInfo={false}
                                        strokeColor={gemColor}
                                    />
                                </div>
                                
                                {/* Special Effects */}
                                {gem.specialEffects.length > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <strong style={{ fontSize: 11 }}>Hiệu ứng:</strong>
                                        {gem.specialEffects.slice(0, 1).map((effect: { id: React.Key | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | RenderFunction | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                                            <Tooltip key={effect.id} title={effect.description}>
                                                <Tag 
                                                    color="purple" 
                                                    style={{ 
                                                        marginTop: 4, 
                                                        fontSize: 10,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {effect.name}
                                                </Tag>
                                            </Tooltip>
                                        ))}
                                        {gem.specialEffects.length > 1 && (
                                            <Tag style={{ marginTop: 4, fontSize: 10 }}>
                                                +{gem.specialEffects.length - 1}
                                            </Tag>
                                        )}
                                    </div>
                                )}
                                
                                {/* Compatible Slots */}
                                <div style={{ marginTop: 8 }}>
                                    <strong style={{ fontSize: 11 }}>Gắn được:</strong>
                                    <div style={{ fontSize: 10, color: '#666' }}>
                                        {gem.compatibleSlots.slice(0, 3).join(', ')}
                                        {gem.compatibleSlots.length > 3 && '...'}
                                    </div>
                                </div>
                            </>
                        )}
                    </Space>
                }
            />
        </Card>
    );
};
