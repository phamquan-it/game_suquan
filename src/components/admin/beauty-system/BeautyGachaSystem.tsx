// components/admin/beauty-system/BeautyGachaSystem.tsx
'use client';

import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal, Progress, Tag, notification } from 'antd';
import { GiftOutlined, StarOutlined, CrownOutlined } from '@ant-design/icons';

const BeautyGachaSystem: React.FC = () => {
    const [gachaModalVisible, setGachaModalVisible] = useState(false);
    const [gachaResult, setGachaResult] = useState<any>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const gachaTypes = [
        {
            id: 'single',
            name: 'Triệu Hồi Đơn',
            cost: 100,
            description: 'Cơ hội nhận Hồng Nhan thường'
        },
        {
            id: 'multi',
            name: 'Triệu Hồi 10 Lần',
            cost: 900,
            description: 'Bảo đảm 1 Hồng Nhan hiếm',
            discount: 10
        },
        {
            id: 'premium',
            name: 'Triệu Hồi Cao Cấp',
            cost: 200,
            description: 'Tăng cơ hội nhận Hồng Nhan huyền thoại'
        }
    ];

    const performGacha = (type: string) => {
        setIsSpinning(true);
        
        // Mock gacha logic
        setTimeout(() => {
            const result = {
                character: {
                    name: 'Tây Thi',
                    rarity: 'legendary',
                    avatar: '/images/beauty/tay-thi.jpg',
                    attributes: {
                        charm: 95,
                        intelligence: 88,
                        diplomacy: 85,
                        intrigue: 78
                    }
                },
                isNew: true
            };
            
            setGachaResult(result);
            setGachaModalVisible(true);
            setIsSpinning(false);
            
            notification.success({
                message: 'Triệu Hồi Thành Công!',
                description: `Bạn đã triệu hồi ${result.character.name}`,
            });
        }, 2000);
    };

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
        <div className="space-y-6">
            {/* Gacha Type Selection */}
            <Row gutter={[16, 16]}>
                {gachaTypes.map(type => (
                    <Col xs={24} md={8} key={type.id}>
                        <Card 
                            className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => performGacha(type.id)}
                        >
                            <div className="text-2xl mb-2">
                                <GiftOutlined />
                            </div>
                            <h3 className="font-semibold mb-2">{type.name}</h3>
                            <div className="flex items-center justify-center mb-2">
                                <CrownOutlined className="text-yellow-500 mr-1" />
                                <span className="font-bold text-lg">{type.cost}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                            {type.discount && (
                                <Tag color="green">Tiết kiệm {type.discount}%</Tag>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Gacha History & Rates */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Tỷ Lệ Triệu Hồi">
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Huyền Thoại</span>
                                    <span>2%</span>
                                </div>
                                <Progress percent={2} strokeColor="#FAAD14" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Siêu Cấp</span>
                                    <span>8%</span>
                                </div>
                                <Progress percent={8} strokeColor="#722ED1" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Hiếm</span>
                                    <span>25%</span>
                                </div>
                                <Progress percent={25} strokeColor="#1890FF" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span>Thường</span>
                                    <span>65%</span>
                                </div>
                                <Progress percent={65} strokeColor="#8C8C8C" />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Gacha Result Modal */}
            <Modal
                open={gachaModalVisible}
                onCancel={() => setGachaModalVisible(false)}
                footer={null}
                width={400}
                centered
            >
                {gachaResult && (
                    <div className="text-center">
                        <div className={`p-4 rounded-lg border-2 border-${getRarityColor(gachaResult.character.rarity)}`}>
                            {gachaResult.isNew && (
                                <Tag color="red" className="mb-2">HỒNG NHAN MỚI!</Tag>
                            )}
                            <img
                                src={gachaResult.character.avatar}
                                alt={gachaResult.character.name}
                                className="w-32 h-32 mx-auto rounded-full mb-4"
                            />
                            <h2 className="text-xl font-bold mb-2">{gachaResult.character.name}</h2>
                            <Tag color={getRarityColor(gachaResult.character.rarity)} className="mb-3">
                                <StarOutlined /> {gachaResult.character.rarity.toUpperCase()}
                            </Tag>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Duyên: {gachaResult.character.attributes.charm}</div>
                                <div>Trí: {gachaResult.character.attributes.intelligence}</div>
                                <div>Giao: {gachaResult.character.attributes.diplomacy}</div>
                                <div>Mưu: {gachaResult.character.attributes.intrigue}</div>
                            </div>
                        </div>
                        <Button 
                            type="primary" 
                            className="mt-4"
                            onClick={() => setGachaModalVisible(false)}
                        >
                            Xác Nhận
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BeautyGachaSystem;
