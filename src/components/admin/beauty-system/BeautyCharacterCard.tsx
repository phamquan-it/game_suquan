// components/admin/beauty-system/BeautyCharacterCard.tsx
'use client';

import React from 'react';
import { Card, Tag, Progress, Button, Tooltip, Badge } from 'antd';
import { 
    CrownOutlined, 
    StarOutlined, 
    TeamOutlined,
    RocketOutlined,
    ReadOutlined
} from '@ant-design/icons';
import { BeautyCharacter } from '@/types/beauty-system';

interface BeautyCharacterCardProps {
    character: BeautyCharacter;
    onViewDetails?: (character: BeautyCharacter) => void;
    onAssignMission?: (character: BeautyCharacter) => void;
}

const BeautyCharacterCard: React.FC<BeautyCharacterCardProps> = ({
    character,
    onViewDetails,
    onAssignMission
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

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            available: { color: 'green', text: 'Sẵn Sàng' },
            mission: { color: 'blue', text: 'Nhiệm Vụ' },
            training: { color: 'orange', text: 'Huấn Luyện' },
            resting: { color: 'purple', text: 'Nghỉ Ngơi' }
        };
        return statusConfig[status as keyof typeof statusConfig];
    };

    const status = getStatusBadge(character.status);

    return (
        <Badge.Ribbon 
            text={character.title} 
            color={getRarityColor(character.rarity)}
        >
            <Card
                className="beauty-character-card"
                cover={
                    <div className="relative">
                        <img
                            alt={character.name}
                            src={character.avatar}
                            className="h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                            <Tag color={getRarityColor(character.rarity)}>
                                <StarOutlined /> {character.rarity.toUpperCase()}
                            </Tag>
                        </div>
                        <div className="absolute bottom-2 left-2">
                            <Tag color={status.color}>
                                {status.text}
                            </Tag>
                        </div>
                    </div>
                }
                actions={[
                    <Tooltip title="Xem chi tiết" key={1}>
                        <Button 
                            type="text" 
                            icon={<ReadOutlined />}
                            onClick={() => onViewDetails?.(character)}
                        />
                    </Tooltip>,
                    <Tooltip title="Giao nhiệm vụ" key={2}>
                        <Button 
                            type="text" 
                            icon={<RocketOutlined />}
                            disabled={character.status !== 'available'}
                            onClick={() => onAssignMission?.(character)}
                        />
                    </Tooltip>
                ]}
            >
                <Card.Meta
                    title={
                        <div className="flex items-center justify-between">
                            <span className="font-cinzel">{character.name}</span>
                            <span className="text-sm text-gray-500">
                                Lv. {character.level}
                            </span>
                        </div>
                    }
                    description={
                        <div className="space-y-2">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Kinh nghiệm</span>
                                    <span>
                                        {character.experience} / {character.level * 100}
                                    </span>
                                </div>
                                <Progress 
                                    percent={Math.round((character.experience / (character.level * 100)) * 100)}
                                    size="small"
                                    strokeColor="#D4AF37"
                                />
                            </div>

                            {/* Attributes Summary */}
                            <div className="grid grid-cols-2 gap-1 text-xs">
                                <div className="flex items-center">
                                    <CrownOutlined className="text-red-500 mr-1" />
                                    <span>Duyên: {character.attributes.charm}</span>
                                </div>
                                <div className="flex items-center">
                                    <ReadOutlined className="text-blue-500 mr-1" />
                                    <span>Trí: {character.attributes.intelligence}</span>
                                </div>
                                <div className="flex items-center">
                                    <TeamOutlined className="text-green-500 mr-1" />
                                    <span>Giao: {character.attributes.diplomacy}</span>
                                </div>
                                <div className="flex items-center">
                                    <span>📈 Mưu: {character.attributes.intrigue}</span>
                                </div>
                            </div>

                            {/* Success Rate */}
                            <div className="flex items-center justify-between text-xs">
                                <span>Tỷ lệ thành công:</span>
                                <Tag color="success">
                                    {character.missionSuccessRate}%
                                </Tag>
                            </div>
                        </div>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );
};

export default BeautyCharacterCard;
