import { Card, Typography, Row, Col, Tag, Divider, Progress } from 'antd';
import { SkinOutlined, MedicineBoxOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Sword } from 'lucide-react';

const { Title, Paragraph, Text } = Typography;

export default function ItemTypes() {
    const itemTypes = [
        {
            type: 'weapon',
            icon: <Sword />,
            color: 'red',
            description: 'Vũ khí tấn công với chỉ số damage và attributes',
            examples: 'Kiếm, cung, pháp trượng, đao',
            slots: ['weapon'],
        },
        {
            type: 'armor',
            icon: <SkinOutlined />,
            color: 'blue',
            description: 'Trang bị phòng thủ với defense và resistance',
            examples: 'Giáp, mũ, găng tay, ủng',
            slots: ['head', 'chest', 'hands', 'legs', 'feet'],
        },
        {
            type: 'consumable',
            icon: <MedicineBoxOutlined />,
            color: 'green',
            description: 'Vật phẩm sử dụng một lần với hiệu ứng tạm thời',
            examples: 'Thuốc hồi máu, buff, scroll teleport',
            slots: [],
        },
        {
            type: 'material',
            icon: <ExperimentOutlined />,
            color: 'orange',
            description: 'Nguyên liệu cho crafting và upgrade',
            examples: 'Quặng, da thú, thảo dược, gem',
            slots: [],
        },
    ];

    const rarities = [
        { rarity: 'common', color: 'gray', chance: 40, description: 'Phổ thông' },
        { rarity: 'uncommon', color: 'green', chance: 25, description: 'Khá hiếm' },
        { rarity: 'rare', color: 'blue', chance: 15, description: 'Hiếm' },
        { rarity: 'epic', color: 'purple', chance: 10, description: 'Sử thi' },
        { rarity: 'legendary', color: 'orange', chance: 7, description: 'Huyền thoại' },
        { rarity: 'mythic', color: 'red', chance: 3, description: 'Thần thoại' },
    ];

    const qualities = [
        { quality: 'broken', color: 'gray', durability: 20 },
        { quality: 'damaged', color: 'volcano', durability: 50 },
        { quality: 'normal', color: 'blue', durability: 80 },
        { quality: 'good', color: 'green', durability: 100 },
        { quality: 'excellent', color: 'cyan', durability: 120 },
        { quality: 'perfect', color: 'gold', durability: 150 },
    ];

    return (
        <div>
            <Title level={2}>🎒 Item Types & Classification</Title>

            {/* Item Types */}
            <Row gutter={[16, 16]}>
                {itemTypes.map((item, index) => (
                    <Col xs={24} md={12} key={index}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                <Tag icon={item.icon} color={item.color} style={{ fontSize: '16px', padding: '4px 8px' }}>
                                    {item.type}
                                </Tag>
                            </div>
                            <Paragraph>{item.description}</Paragraph>
                            <Text strong>Ví dụ: </Text>
                            <Text type="secondary">{item.examples}</Text>
                            {item.slots.length > 0 && (
                                <>
                                    <br />
                                    <Text strong>Slots: </Text>
                                    {item.slots.map(slot => (
                                        <Tag key={slot} style={{ margin: '2px' }}>{slot}</Tag>
                                    ))}
                                </>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            <Divider />

            {/* Rarity System */}
            <Title level={3}>🌟 Rarity System</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card size="small">
                        {rarities.map((rarity, index) => (
                            <div key={index} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Tag color={rarity.color} style={{ minWidth: 100 }}>
                                        {rarity.rarity}
                                    </Tag>
                                    <Text>{rarity.chance}%</Text>
                                </div>
                                <Progress
                                    percent={rarity.chance}
                                    showInfo={false}
                                    strokeColor={index === 0 ? '#d9d9d9' : undefined}
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {rarity.description}
                                </Text>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Quality System */}
            <Title level={3}>⚡ Quality & Durability</Title>
            <Row gutter={[16, 16]}>
                {qualities.map((quality, index) => (
                    <Col xs={12} md={8} lg={4} key={index}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <Tag color={quality.color} style={{ width: '100%', marginBottom: 8 }}>
                                {quality.quality}
                            </Tag>
                            <Progress
                                type="circle"
                                percent={quality.durability}
                                width={60}
                                format={percent => `${percent}%`}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Divider />

            {/* Equipment Slots */}
            <Title level={3}>🎯 Equipment Slots</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card size="small">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <Tag color="red">weapon</Tag>
                            <Tag color="blue">head</Tag>
                            <Tag color="blue">chest</Tag>
                            <Tag color="blue">hands</Tag>
                            <Tag color="blue">legs</Tag>
                            <Tag color="blue">feet</Tag>
                            <Tag color="purple">accessory</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
