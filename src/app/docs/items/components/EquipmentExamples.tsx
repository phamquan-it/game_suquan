'use client';

import { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Slider, Select, Progress, Alert, Statistic } from 'antd';
import { SearchOutlined, ExperimentOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface EquipmentItem {
    id: string;
    name: string;
    rarity: string;
    level: number;
    slot: string;
    attack: number;
    defense: number;
    enhancement: number;
    sockets: number;
    usedSockets: number;
}

export default function EquipmentExamples() {
    const [rarityFilter, setRarityFilter] = useState<string>('all');
    const [levelRange, setLevelRange] = useState<[number, number]>([1, 100]);
    const [minAttack, setMinAttack] = useState<number>(0);
    const [results, setResults] = useState<EquipmentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const mockEquipment: EquipmentItem[] = [
        {
            id: 'dragonslayer',
            name: 'Dragon Slayer Greatsword',
            rarity: 'legendary',
            level: 75,
            slot: 'weapon',
            attack: 245,
            defense: 0,
            enhancement: 12,
            sockets: 3,
            usedSockets: 2
        },
        {
            id: 'phoenix_armor',
            name: 'Phoenix Plate Armor',
            rarity: 'epic',
            level: 68,
            slot: 'chest',
            attack: 0,
            defense: 185,
            enhancement: 8,
            sockets: 2,
            usedSockets: 1
        },
        {
            id: 'shadow_dagger',
            name: 'Shadow Assassin Dagger',
            rarity: 'rare',
            level: 45,
            slot: 'weapon',
            attack: 120,
            defense: 0,
            enhancement: 5,
            sockets: 1,
            usedSockets: 1
        },
        {
            id: 'titan_helmet',
            name: 'Titan War Helmet',
            rarity: 'epic',
            level: 72,
            slot: 'head',
            attack: 15,
            defense: 95,
            enhancement: 10,
            sockets: 2,
            usedSockets: 0
        },
        {
            id: 'mythic_staff',
            name: 'Staff of Ancient Wisdom',
            rarity: 'mythic',
            level: 90,
            slot: 'weapon',
            attack: 320,
            defense: 0,
            enhancement: 15,
            sockets: 4,
            usedSockets: 3
        }
    ];

    const simulateSearch = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const filtered = mockEquipment.filter(item => {
                const rarityMatch = rarityFilter === 'all' || item.rarity === rarityFilter;
                const levelMatch = item.level >= levelRange[0] && item.level <= levelRange[1];
                const attackMatch = item.attack >= minAttack;
                return rarityMatch && levelMatch && attackMatch;
            });
            setResults(filtered);
            setLoading(false);
        }, 800);
    };

    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            common: 'gray',
            uncommon: 'green',
            rare: 'blue',
            epic: 'purple',
            legendary: 'orange',
            mythic: 'red'
        };
        return colors[rarity] || 'default';
    };

    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: EquipmentItem) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Tag color={getRarityColor(record.rarity)}>{record.rarity}</Tag>
                    <Tag>Lv. {record.level}</Tag>
                </div>
            ),
        },
        {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Stats',
            key: 'stats',
            render: (record: EquipmentItem) => (
                <div>
                    {record.attack > 0 && <div>⚔️ Attack: {record.attack}</div>}
                    {record.defense > 0 && <div>🛡️ Defense: {record.defense}</div>}
                </div>
            ),
        },
        {
            title: 'Enhancement',
            key: 'enhancement',
            render: (record: EquipmentItem) => (
                <div>
                    <Progress
                        percent={(record.enhancement / record.enhancement) * 100}
                        size="small"
                        format={() => `+${record.enhancement}`}
                    />
                    <Text type="secondary">Sockets: {record.usedSockets}/{record.sockets}</Text>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>⚔️ Equipment System Examples</Title>

            {/* Search Filters */}
            <Card title="🔍 Equipment Search" style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6}>
                        <Text strong>Rarity:</Text>
                        <Select
                            value={rarityFilter}
                            onChange={setRarityFilter}
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            <Option value="all">All Rarities</Option>
                            <Option value="common">Common</Option>
                            <Option value="uncommon">Uncommon</Option>
                            <Option value="rare">Rare</Option>
                            <Option value="epic">Epic</Option>
                            <Option value="legendary">Legendary</Option>
                            <Option value="mythic">Mythic</Option>
                        </Select>
                    </Col>

                    <Col xs={24} md={8}>
                        <Text strong>Level Range: {levelRange[0]} - {levelRange[1]}</Text>
                        <Slider
                            range
                            min={1}
                            max={100}
                            value={levelRange}
                            onChange={(v) => {
                                //@ts-expect-error  // some thing
                                setLevelRange([...v])
                            }}
                            style={{ marginTop: 8 }}
                        />
                    </Col>

                    <Col xs={24} md={6}>
                        <Text strong>Min Attack: {minAttack}</Text>
                        <Slider
                            min={0}
                            max={500}
                            value={minAttack}
                            onChange={setMinAttack}
                            style={{ marginTop: 8 }}
                        />
                    </Col>

                    <Col xs={24} md={4}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={simulateSearch}
                            loading={loading}
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Results */}
            <Card title={`📊 Search Results (${results.length} items)`}>
                {results.length > 0 ? (
                    <Table
                        dataSource={results}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        size="small"
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <ExperimentOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: 16 }} />
                        <Paragraph type="secondary">
                            No equipment found. Adjust your filters and search again.
                        </Paragraph>
                    </div>
                )}
            </Card>

            {/* Enhancement Simulation */}
            <Card title="⚡ Enhancement Simulation" style={{ marginTop: 24 }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Current Enhancement"
                            value={12}
                            prefix="+"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Success Rate"
                            value={65}
                            suffix="%"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Break Chance"
                            value={15}
                            suffix="%"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Col>
                </Row>

                <Alert
                    message="Enhancement Strategy"
                    description="Higher enhancement levels provide better stats but have lower success rates and higher break chances. Use protection scrolls for valuable items."
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                />

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button type="primary" icon={<ThunderboltOutlined />} size="large">
                        Simulate Enhancement
                    </Button>
                </div>
            </Card>

            {/* SQL Query Example */}
            <Card title="💡 SQL Query Example" style={{ marginTop: 24 }}>
                <Paragraph>
                    This is the actual SQL query that would be executed for the search above:
                </Paragraph>
                <pre style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '6px',
                    fontSize: '14px'
                }}>
                    {`SELECT 
  bi.name, 
  bi.rarity,
  bi.level_requirement,
  ei.slot,
  ei.attack,
  ei.defense,
  ei.enhancement_level,
  ei.total_sockets,
  ei.used_sockets
FROM items.equipment_items ei
JOIN items.base_items bi ON ei.id = bi.id
WHERE bi.rarity = 'epic'
  AND bi.level_requirement BETWEEN 60 AND 80
  AND ei.attack >= 100
  AND bi.status = 'active'
ORDER BY ei.attack DESC, bi.rarity DESC;`}
                </pre>
            </Card>
        </div>
    );
}
