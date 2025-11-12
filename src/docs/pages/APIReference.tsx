import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Alert, Collapse, Space, Divider } from 'antd';
import {
    CrownOutlined,
    ApiOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    CodeOutlined,
    DatabaseOutlined,
    FunctionOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const APIReference: React.FC = () => {
    const coreFunctions = [
        {
            function: 'can_open_loot_box',
            description: 'Check if player can open a specific loot box',
            parameters: [
                { name: 'p_player_id', type: 'VARCHAR(50)', description: 'Player identifier' },
                { name: 'p_loot_box_id', type: 'VARCHAR(50)', description: 'Loot box identifier' },
                { name: 'p_vip_level', type: 'INTEGER', description: 'Player VIP level (optional)' },
                { name: 'p_player_level', type: 'INTEGER', description: 'Player level (optional)' }
            ],
            returns: 'TABLE(can_open BOOLEAN, reason VARCHAR, required_currency currency_type, required_amount INTEGER, alternative_cost_available BOOLEAN)',
            usage: `SELECT * FROM game_economy.can_open_loot_box('player_001', 'premium_box_1', 2, 25);`
        },
        {
            function: 'open_loot_box',
            description: 'Open a loot box and receive rewards',
            parameters: [
                { name: 'p_player_id', type: 'VARCHAR(50)', description: 'Player identifier' },
                { name: 'p_loot_box_id', type: 'VARCHAR(50)', description: 'Loot box identifier' },
                { name: 'p_use_alternative_cost', type: 'BOOLEAN', description: 'Use alternative payment method' },
                { name: 'p_alternative_cost_type', type: 'VARCHAR(20)', description: 'Type of alternative cost' }
            ],
            returns: 'TABLE(success BOOLEAN, message VARCHAR, rewards JSONB, opening_id VARCHAR(50))',
            usage: `SELECT * FROM game_economy.open_loot_box('player_001', 'premium_box_1', false, NULL);`
        },
        {
            function: 'add_currency',
            description: 'Add currency to player wallet',
            parameters: [
                { name: 'p_player_id', type: 'VARCHAR(50)', description: 'Player identifier' },
                { name: 'p_currency_type', type: 'currency_type', description: 'Type of currency' },
                { name: 'p_amount', type: 'BIGINT', description: 'Amount to add' },
                { name: 'p_source', type: 'VARCHAR(100)', description: 'Source of currency' },
                { name: 'p_description', type: 'TEXT', description: 'Transaction description' },
                { name: 'p_metadata', type: 'JSONB', description: 'Additional metadata' }
            ],
            returns: 'TABLE(success BOOLEAN, new_balance BIGINT, transaction_id VARCHAR(50))',
            usage: `SELECT * FROM game_economy.add_currency('player_001', 'gold', 1000, 'quest_reward', 'Completed Royal Quest', '{"quest_id": "dragon_slayer"}');`
        },
        {
            function: 'spend_currency',
            description: 'Spend currency from player wallet',
            parameters: [
                { name: 'p_player_id', type: 'VARCHAR(50)', description: 'Player identifier' },
                { name: 'p_currency_type', type: 'currency_type', description: 'Type of currency' },
                { name: 'p_amount', type: 'BIGINT', description: 'Amount to spend' },
                { name: 'p_source', type: 'VARCHAR(100)', description: 'Spending source' },
                { name: 'p_description', type: 'TEXT', description: 'Transaction description' },
                { name: 'p_metadata', type: 'JSONB', description: 'Additional metadata' }
            ],
            returns: 'TABLE(success BOOLEAN, new_balance BIGINT, transaction_id VARCHAR(50))',
            usage: `SELECT * FROM game_economy.spend_currency('player_001', 'gold', 500, 'shop_purchase', 'Bought Health Potion', '{"item_id": "potion_health_1"}');`
        },
        {
            function: 'exchange_currency',
            description: 'Exchange one currency for another',
            parameters: [
                { name: 'p_player_id', type: 'VARCHAR(50)', description: 'Player identifier' },
                { name: 'p_from_currency', type: 'currency_type', description: 'Source currency' },
                { name: 'p_to_currency', type: 'currency_type', description: 'Target currency' },
                { name: 'p_amount', type: 'BIGINT', description: 'Amount to exchange' }
            ],
            returns: 'TABLE(success BOOLEAN, message VARCHAR, from_new_balance BIGINT, to_new_balance BIGINT)',
            usage: `SELECT * FROM game_economy.exchange_currency('player_001', 'gold', 'diamond', 1000);`
        },
        {
            function: 'calculate_wallet_total_value',
            description: 'Calculate total value of player wallet across all currencies',
            parameters: [
                { name: 'player_id', type: 'VARCHAR', description: 'Player identifier' }
            ],
            returns: 'BIGINT',
            usage: `SELECT game_economy.calculate_wallet_total_value('player_001');`
        }
    ];

    const views = [
        {
            name: 'loot_box_details',
            description: 'Complete information about loot boxes including costs and limits',
            columns: [
                'id', 'name', 'description', 'box_type', 'tier', 'category',
                'primary_currency', 'primary_cost', 'daily_limit', 'weekly_limit', 'distribution_type'
            ],
            usage: `SELECT * FROM game_economy.loot_box_details WHERE tier = 'advanced';`
        },
        {
            name: 'loot_box_stats',
            description: 'Statistical overview of loot box usage and rewards',
            columns: [
                'id', 'name', 'box_type', 'tier', 'total_opens', 'unique_players',
                'avg_reward_amount', 'min_reward_amount', 'max_reward_amount'
            ],
            usage: `SELECT * FROM game_economy.loot_box_stats ORDER BY total_opens DESC;`
        },
        {
            name: 'player_wallet_summary',
            description: 'Summary view of player wallets with total values',
            columns: [
                'player_id', 'currency_types_owned', 'total_value', 'wallet_details'
            ],
            usage: `SELECT * FROM game_economy.player_wallet_summary WHERE total_value > 10000;`
        }
    ];

    const dataTypes = [
        {
            type: 'item_type',
            values: ['weapon', 'armor', 'consumable', 'material', 'currency', 'cosmetic', 'loot_box', 'quest_item', 'special'],
            description: 'Type of in-game items'
        },
        {
            type: 'rarity',
            values: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'ancient', 'divine'],
            description: 'Item rarity levels'
        },
        {
            type: 'currency_type',
            values: ['gold', 'silver', 'diamond', 'crystal', 'honor', 'alliance_point', 'vip_point', 'event_coin', 'arena_point'],
            description: 'Supported currency types'
        },
        {
            type: 'reward_type',
            values: ['item', 'currency', 'experience', 'vip_points', 'alliance_points', 'cosmetic', 'title', 'mount', 'pet'],
            description: 'Types of rewards'
        },
        {
            type: 'bound_type',
            values: ['none', 'account', 'character'],
            description: 'Item binding types'
        },
        {
            type: 'distribution_type',
            values: ['weighted', 'random', 'sequential', 'pity'],
            description: 'Reward distribution methods'
        }
    ];

    const errorCodes = [
        {
            code: 'EC-001',
            message: 'Insufficient currency',
            description: 'Player does not have enough currency for the transaction',
            resolution: 'Check player balance before transaction'
        },
        {
            code: 'EC-002',
            message: 'Daily limit reached',
            description: 'Player has exceeded daily limit for this action',
            resolution: 'Wait for reset or implement limit increase mechanics'
        },
        {
            code: 'EC-003',
            message: 'Requirements not met',
            description: 'Player does not meet level, VIP, or other requirements',
            resolution: 'Check player status and requirements before action'
        },
        {
            code: 'EC-004',
            message: 'Loot box not available',
            description: 'Loot box is time-limited or otherwise unavailable',
            resolution: 'Check availability dates and conditions'
        },
        {
            code: 'EC-005',
            message: 'Transaction failed',
            description: 'Database transaction could not be completed',
            resolution: 'Check database connectivity and constraints'
        }
    ];

    return (
        <div className="p-6">
            <div className="p-6 rounded-lg imperial-border parchment-bg">
                <Title level={1} className="text-imperial-red font-imperial text-center">
                    <ApiOutlined className="mr-2" />
                    Imperial API Reference
                </Title>
                <Paragraph className="text-noble-brown text-center text-lg">
                    Complete documentation of royal functions, views, and data types
                </Paragraph>

                <Alert
                    message="Royal API Access"
                    description="All functions are executed within the game_economy schema. Ensure proper permissions are set for database users."
                    type="info"
                    showIcon
                    icon={<CrownOutlined />}
                    className="mb-6 bg-blue-50 border-blue-200"
                />

                {/* Core Functions Section */}
                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">
                    <FunctionOutlined className="mr-2" />
                    Core Royal Functions
                </Title>
                <Paragraph className="text-noble-brown mb-6">
                    Essential functions for managing the imperial economy. All functions include transaction safety and audit logging.
                </Paragraph>

                {coreFunctions.map((func, index) => (
                    <Card
                        key={index}
                        className="border-2 border-imperial-gold bg-white mb-4 hover:shadow-lg transition-all"
                        title={
                            <Space>
                                <CodeOutlined className="text-imperial-red" />
                                <Text strong className="text-imperial-red font-mono">{func.function}</Text>
                                <Tag color="blue">FUNCTION</Tag>
                            </Space>
                        }
                        extra={<ThunderboltOutlined className="text-imperial-gold" />}
                    >
                        <Paragraph className="text-noble-brown mb-4">
                            {func.description}
                        </Paragraph>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Text strong className="text-imperial-red">Parameters:</Text>
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={func.parameters}
                                    columns={[
                                        {
                                            title: 'Name',
                                            dataIndex: 'name',
                                            key: 'name',
                                            render: (name) => <Text code>{name}</Text>
                                        },
                                        {
                                            title: 'Type',
                                            dataIndex: 'type',
                                            key: 'type',
                                            render: (type) => <Tag color="purple">{type}</Tag>
                                        },
                                        {
                                            title: 'Description',
                                            dataIndex: 'description',
                                            key: 'description',
                                        }
                                    ]}
                                    className="mt-2"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong className="text-imperial-red">Returns:</Text>
                                <div className="bg-gray-100 p-3 rounded mt-2">
                                    <Text code className="text-sm">{func.returns}</Text>
                                </div>

                                <Text strong className="text-imperial-red mt-4 block">Usage Example:</Text>
                                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mt-2 overflow-x-auto">
                                    {func.usage}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}

                {/* Views Section */}
                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2 mt-8">
                    <EyeInvisibleOutlined className="mr-2" />
                    Royal Analytical Views
                </Title>
                <Paragraph className="text-noble-brown mb-6">
                    Pre-built views for analytics and monitoring of the imperial economy.
                </Paragraph>

                <Row gutter={[16, 16]}>
                    {views.map((view, index) => (
                        <Col xs={24} md={12} lg={8} key={index}>
                            <Card
                                className="h-full border-2 border-imperial-gold bg-white hover:shadow-lg transition-all"
                                title={
                                    <Space>
                                        <DatabaseOutlined className="text-imperial-red" />
                                        <Text strong className="text-imperial-red font-mono">{view.name}</Text>
                                        <Tag color="green">VIEW</Tag>
                                    </Space>
                                }
                            >
                                <Paragraph className="text-noble-brown mb-3">
                                    {view.description}
                                </Paragraph>

                                <div className="mb-3">
                                    <Text strong className="text-imperial-red">Columns:</Text>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {view.columns.map((column, idx) => (
                                            <Tag key={idx} color="default" className="text-xs">
                                                {column}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>

                                <Collapse ghost size="small">
                                    <Panel header="View Usage Example" key="usage">
                                        <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs overflow-x-auto">
                                            {view.usage}
                                        </div>
                                    </Panel>
                                </Collapse>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Data Types Section */}
                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2 mt-8">
                    <DatabaseOutlined className="mr-2" />
                    Imperial Data Types
                </Title>
                <Paragraph className="text-noble-brown mb-6">
                    Custom enumerated types used throughout the royal economy system.
                </Paragraph>

                <Row gutter={[16, 16]}>
                    {dataTypes.map((dataType, index) => (
                        <Col xs={24} md={12} lg={8} key={index}>
                            <Card
                                className="h-full border-2 border-imperial-gold bg-white"
                                title={
                                    <Text strong className="text-imperial-red font-mono">
                                        {dataType.type}
                                    </Text>
                                }
                                extra={<Tag color="orange">ENUM</Tag>}
                            >
                                <Paragraph className="text-noble-brown mb-3">
                                    {dataType.description}
                                </Paragraph>

                                <Text strong className="text-imperial-red">Values:</Text>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {dataType.values.map((value, idx) => (
                                        <Tag key={idx} color="blue" className="text-xs">
                                            {value}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Error Codes Section */}
                <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2 mt-8">
                    <SafetyOutlined className="mr-2" />
                    Royal Error Codes
                </Title>
                <Paragraph className="text-noble-brown mb-6">
                    Standard error codes and their resolutions for imperial system integration.
                </Paragraph>

                <Table
                    dataSource={errorCodes}
                    pagination={false}
                    className="border border-imperial-gold"
                    columns={[
                        {
                            title: 'Error Code',
                            dataIndex: 'code',
                            key: 'code',
                            render: (code) => <Tag color="red">{code}</Tag>,
                            width: 100
                        },
                        {
                            title: 'Message',
                            dataIndex: 'message',
                            key: 'message',
                            render: (message) => <Text strong>{message}</Text>
                        },
                        {
                            title: 'Description',
                            dataIndex: 'description',
                            key: 'description',
                        },
                        {
                            title: 'Resolution',
                            dataIndex: 'resolution',
                            key: 'resolution',
                        }
                    ]}
                />

                {/* Integration Examples */}
                <Card
                    title="🏛️ Royal Integration Examples" 
                    className="border-2 border-imperial-gold bg-white mt-8"
                    extra={<Tag color="red">Advanced</Tag>}
                >
                    <Collapse ghost>
                        <Panel header="Complete Player Purchase Flow" key="purchase">
                            <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                                {`-- Complete purchase flow with error handling
BEGIN;
  -- Check if player can open the loot box
  SELECT * FROM game_economy.can_open_loot_box('player_001', 'premium_box_1') INTO can_open_result;
  
  IF can_open_result.can_open THEN
    -- Open the loot box
    SELECT * FROM game_economy.open_loot_box('player_001', 'premium_box_1', false, NULL) INTO open_result;
    
    IF open_result.success THEN
      -- Log successful purchase
      INSERT INTO purchase_logs (player_id, loot_box_id, rewards, timestamp) 
      VALUES ('player_001', 'premium_box_1', open_result.rewards, NOW());
      COMMIT;
    ELSE
      ROLLBACK;
      RAISE NOTICE 'Failed to open loot box: %', open_result.message;
    END IF;
  ELSE
    RAISE NOTICE 'Cannot open loot box: %', can_open_result.reason;
  END IF;
END;`}
                            </div>
                        </Panel>

                        <Panel header="Batch Currency Distribution" key="batch">
                            <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                                {`-- Distribute currency to multiple players efficiently
CREATE OR REPLACE FUNCTION batch_currency_distribution(
  player_ids VARCHAR(50)[], 
  currency game_economy.currency_type, 
  amount BIGINT, 
  source VARCHAR(100)
) RETURNS TABLE(player_id VARCHAR, success BOOLEAN, new_balance BIGINT) AS $$
DECLARE
  player_id VARCHAR;
BEGIN
  FOREACH player_id IN ARRAY player_ids
  LOOP
    BEGIN
      SELECT * FROM game_economy.add_currency(player_id, currency, amount, source, 'Batch distribution') 
      INTO success, new_balance, transaction_id;
      
      RETURN QUERY SELECT player_id, success, new_balance;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN QUERY SELECT player_id, false, NULL::BIGINT;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;`}
                            </div>
                        </Panel>

                        <Panel header="Economic Health Monitoring" key="monitoring">
                            <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                                {`-- Monitor economic health with daily snapshots
CREATE OR REPLACE FUNCTION generate_economic_snapshot()
RETURNS TABLE(metric_name VARCHAR, metric_value NUMERIC, snapshot_time TIMESTAMP) AS $$
BEGIN
  RETURN QUERY 
  SELECT 'total_currency_in_circulation' as metric_name,
         SUM(amount) as metric_value,
         NOW() as snapshot_time
  FROM game_economy.player_wallets
  UNION ALL
  SELECT 'total_loot_boxes_opened_today',
         COUNT(*)::NUMERIC,
         NOW()
  FROM game_economy.loot_box_openings 
  WHERE opened_at >= CURRENT_DATE
  UNION ALL
  SELECT 'average_player_wealth',
         AVG(total_value),
         NOW()
  FROM game_economy.player_wallet_summary;
END;
$$ LANGUAGE plpgsql;`}
                            </div>
                        </Panel>
                    </Collapse>
                </Card>

                <Alert
                    message="Royal Performance Notes"
                    description="All functions are optimized for high concurrency. Use connection pooling and consider read replicas for analytical queries."
                    type="warning"
                    showIcon
                    icon={<ThunderboltOutlined />}
                    className="mt-6 bg-yellow-50 border-yellow-200"
                />
            </div>
        </div>
    );
};

export default APIReference;
