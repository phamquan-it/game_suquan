// components/admin/beauty-system/BeautyCostumeManager.tsx
'use client';

import React from 'react';
import { Card, Row, Col, Button, Tag, Switch, Tooltip } from 'antd';
import { EyeOutlined, StarOutlined } from '@ant-design/icons';
import { Costume } from '@/types/beauty-system';

interface BeautyCostumeManagerProps {
    costumes: Costume[];
    onEquip: (costumeId: string) => void;
    onUnequip: (costumeId: string) => void;
}

const BeautyCostumeManager: React.FC<BeautyCostumeManagerProps> = ({
    costumes,
    onEquip,
    onUnequip
}) => {
    const getRarityColor = (rarity: string) => {
        const colors = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FAAD14'
        };
        return colors[rarity as keyof typeof colors];
    };

    return (
        <div className="costume-manager">
            <Row gutter={[16, 16]}>
                {costumes.map(costume => (
                    <Col xs={12} sm={8} md={6} key={costume.id}>
                        <Card
                            cover={
                                <div className="relative">
                                    <img
                                        alt={costume.name}
                                        src={costume.image}
                                        className="h-32 object-cover"
                                    />
                                    <div className="absolute top-1 right-1">
                                        <Tag color={getRarityColor(costume.rarity)}>
                                            <StarOutlined />
                                        </Tag>
                                    </div>
                                </div>
                            }
                            size="small"
                        >
                            <Card.Meta
                                title={
                                    <div className="text-sm font-semibold truncate">
                                        {costume.name}
                                    </div>
                                }
                                description={
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>Duyên:</span>
                                            <span>+{costume.attributes.charm}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span>Trí:</span>
                                            <span>+{costume.attributes.intelligence}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span>Giao:</span>
                                            <span>+{costume.attributes.diplomacy}</span>
                                        </div>
                                        <div className="flex justify-center mt-2">
                                            <Tooltip 
                                                title={costume.equipped ? 'Đang trang bị' : 'Trang bị'}
                                            >
                                                <Switch
                                                    checked={costume.equipped}
                                                    onChange={(checked) => {
                                                        if (checked) {
                                                            onEquip(costume.id);
                                                        } else {
                                                            onUnequip(costume.id);
                                                        }
                                                    }}
                                                    size="small"
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BeautyCostumeManager;
