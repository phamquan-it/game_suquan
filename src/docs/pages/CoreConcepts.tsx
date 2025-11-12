import React from 'react';
import { Typography, Table, Tag, Collapse, Alert } from 'antd';
import { CrownOutlined, SafetyCertificateOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const CoreConcepts: React.FC = () => {
    const currencyTypes = [
        {
            type: 'Gold Coins',
            category: 'royal',
            exchangeRate: '1.0',
            maxStack: '999,999,999',
            tradable: 'Yes',
            usage: 'Common purchases, basic upgrades'
        },
        {
            type: 'Imperial Diamonds',
            category: 'premium',
            exchangeRate: '100.0',
            maxStack: '999,999',
            tradable: 'Yes',
            usage: 'Rare items, premium chests'
        },
        {
            type: 'Honor Points',
            category: 'military',
            exchangeRate: '5.0',
            maxStack: '99,999',
            tradable: 'No',
            usage: 'Military gear, combat skills'
        },
        {
            type: 'Royal Crystals',
            category: 'special',
            exchangeRate: '50.0',
            maxStack: '999,999',
            tradable: 'No',
            usage: 'Advanced crafting, special upgrades'
        }
    ];

    const rarityTypes = [
        {
            rarity: 'Common',
            probability: '45%',
            color: 'gray',
            description: 'Common items, easily found'
        },
        {
            rarity: 'Uncommon',
            probability: '25%',
            color: 'green',
            description: 'Uncommon items'
        },
        {
            rarity: 'Rare',
            probability: '15%',
            color: 'blue',
            description: 'Rare items, high value'
        },
        {
            rarity: 'Epic',
            probability: '8%',
            color: 'purple',
            description: 'Extremely rare items'
        },
        {
            rarity: 'Legendary',
            probability: '5%',
            color: 'orange',
            description: 'Legendary artifacts'
        },
        {
            rarity: 'Imperial',
            probability: '1.5%',
            color: 'gold',
            description: 'Imperial treasures'
        },
        {
            rarity: 'Divine',
            probability: '0.5%',
            color: 'cyan',
            description: 'Divine relics'
        }
    ];

    return (
        <div className="p-6">
            <div className="p-6 rounded-lg imperial-border parchment-bg">
                <Title level={1} className="text-imperial-red font-imperial">👑 Imperial Concepts</Title>
                <Paragraph className="text-noble-brown">
                    Understanding the fundamental concepts is key to successfully implementing the imperial economy.
                </Paragraph>

                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">💰 Royal Currency System</Title>
                <Paragraph className="text-noble-brown">
                    The kingdom supports various currency types for different purposes:
                </Paragraph>

                <Table
                    dataSource={currencyTypes}
                    pagination={false}
                    className="mb-6 border border-imperial-gold"
                    columns={[
                        {
                            title: 'Currency Type',
                            dataIndex: 'type',
                            key: 'type',
                            render: (type) => <Tag color="red" className="font-imperial">{type}</Tag>
                        },
                        {
                            title: 'Category',
                            dataIndex: 'category',
                            key: 'category',
                            render: (category) => <Tag color="blue">{category}</Tag>
                        },
                        {
                            title: 'Exchange Rate',
                            dataIndex: 'exchangeRate',
                            key: 'exchangeRate'
                        },
                        {
                            title: 'Max Stack',
                            dataIndex: 'maxStack',
                            key: 'maxStack'
                        },
                        {
                            title: 'Tradable',
                            dataIndex: 'tradable',
                            key: 'tradable'
                        },
                        {
                            title: 'Royal Usage',
                            dataIndex: 'usage',
                            key: 'usage'
                        }
                    ]}
                />

                <Alert
                    message="Royal Economic Balance"
                    description="Exchange rates can be dynamically adjusted to control inflation in the kingdom's economy."
                    type="info"
                    showIcon
                    icon={<CrownOutlined />}
                    className="mb-6 bg-blue-50 border-blue-200"
                />

                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🎁 Imperial Rarity System</Title>
                <Paragraph className="text-noble-brown">
                    Each item has a rarity level that affects appearance probability and value:
                </Paragraph>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {rarityTypes.map((rarity, index) => (
                        <div key={index} className="bg-white p-4 rounded border-2 border-imperial-gold shadow-md">
                            <div className="flex items-center justify-between mb-2">
                                <Tag color={rarity.color} className="font-imperial font-bold">
                                    {rarity.rarity}
                                </Tag>
                                <Text strong className="text-imperial-red">{rarity.probability}</Text>
                            </div>
                            <Text className="text-noble-brown">{rarity.description}</Text>
                        </div>
                    ))}
                </div>

                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🛡️ Royal Protection Systems</Title>

                <Collapse ghost className="bg-transparent">
                    <Panel
                        header={
                            <span className="text-imperial-red font-imperial text-lg">
                                <CrownOutlined className="mr-2" />
                                Imperial Pity System
                            </span>
                        }
                        key="pity"
                        className="bg-noble-parchment border border-imperial-gold rounded mb-2"
                    >
                        <Paragraph className="text-noble-brown">
                            <Text strong>Pity System</Text> ensures royal subjects receive rare treasures after a certain number of attempts.
                        </Paragraph>
                        <div className="bg-white p-4 rounded border border-noble-bronze">
                            <Text strong className="text-imperial-red">Royal Example:</Text>
                            <ul className="mt-2 ml-4 text-noble-brown">
                                <li>Legendary item guaranteed after 50 openings</li>
                                <li>Counter resets when receiving rare items</li>
                                <li>Multi-tier pity for different rarity levels</li>
                            </ul>
                        </div>
                    </Panel>

                    <Panel
                        header={
                            <span className="text-imperial-red font-imperial text-lg">
                                <GiftOutlined className="mr-2" />
                                Royal Streak Bonus
                            </span>
                        }
                        key="streak"
                        className="bg-noble-parchment border border-imperial-gold rounded mb-2"
                    >
                        <Paragraph className="text-noble-brown">
                            <Text strong>Streak Bonus</Text> rewards loyal subjects for continuous activity.
                        </Paragraph>
                        <div className="bg-white p-4 rounded border border-noble-bronze">
                            <Text strong className="text-imperial-red">Royal Example:</Text>
                            <ul className="mt-2 ml-4 text-noble-brown">
                                <li>+10% reward value for 3 consecutive days</li>
                                <li>+25% reward value for 7 consecutive days</li>
                                <li>Guaranteed epic item after 30 consecutive days</li>
                            </ul>
                        </div>
                    </Panel>

                    <Panel
                        header={
                            <span className="text-imperial-red font-imperial text-lg">
                                <SafetyCertificateOutlined className="mr-2" />
                                Imperial Guaranteed Drops
                            </span>
                        }
                        key="guaranteed"
                        className="bg-noble-parchment border border-imperial-gold rounded"
                    >
                        <Paragraph className="text-noble-brown">
                            <Text strong>Guaranteed Drops</Text> ensure special rewards after specific numbers of openings.
                        </Paragraph>
                        <div className="bg-white p-4 rounded border border-noble-bronze">
                            <Text strong className="text-imperial-red">Royal Example:</Text>
                            <ul className="mt-2 ml-4 text-noble-brown">
                                <li>Open 10 chests → receive guaranteed rare item</li>
                                <li>Open 50 chests → receive guaranteed epic item</li>
                                <li>Can reset after claim or maintain permanently</li>
                            </ul>
                        </div>
                    </Panel>
                </Collapse>

                <Alert
                    message="Royal Best Practice"
                    description="Combine multiple systems (Pity + Streak + Guaranteed) to create a fair and engaging experience for royal subjects."
                    type="success"
                    showIcon
                    icon={<CrownOutlined />}
                    className="mt-6 bg-green-50 border-green-200"
                />
            </div>
        </div>
    );
};

export default CoreConcepts;
