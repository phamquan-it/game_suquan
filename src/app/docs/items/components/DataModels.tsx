import { Card, Typography, Table, Tag, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function DataModels() {
    const baseItemModel = [
        { field: 'id', type: 'VARCHAR(50)', required: '✅', description: 'Primary key identifier' },
        { field: 'name', type: 'VARCHAR(200)', required: '✅', description: 'Item display name' },
        { field: 'type', type: 'item_type', required: '✅', description: 'Item classification' },
        { field: 'rarity', type: 'rarity_type', required: '✅', description: 'Rarity level' },
        { field: 'quality', type: 'quality_type', required: '✅', description: 'Condition quality' },
        { field: 'levelRequirement', type: 'INTEGER', required: '✅', description: 'Min level to use' },
        { field: 'stackable', type: 'BOOLEAN', required: '✅', description: 'Can stack in inventory' },
        { field: 'baseValue', type: 'DECIMAL(12,2)', required: '✅', description: 'Base gold value' },
        { field: 'isTradable', type: 'BOOLEAN', required: '✅', description: 'Can be traded' },
        { field: 'status', type: 'item_status_type', required: '✅', description: 'Active/inactive status' },
    ];

    const equipmentModel = [
        { field: 'id', type: 'VARCHAR(50)', required: '✅', description: 'References base_items' },
        { field: 'slot', type: 'equipment_slot_type', required: '✅', description: 'Equipment slot' },
        { field: 'current_durability', type: 'INTEGER', required: '✅', description: 'Current durability' },
        { field: 'attack', type: 'INTEGER', required: '❌', description: 'Attack power (weapons)' },
        { field: 'defense', type: 'INTEGER', required: '❌', description: 'Defense power (armor)' },
        { field: 'enhancement_level', type: 'INTEGER', required: '✅', description: 'Current upgrade level' },
        { field: 'total_sockets', type: 'INTEGER', required: '✅', description: 'Total gem sockets' },
    ];

    const craftingModel = [
        { field: 'id', type: 'VARCHAR(50)', required: '✅', description: 'Recipe identifier' },
        { field: 'result_item_id', type: 'VARCHAR(50)', required: '✅', description: 'Result item ID' },
        { field: 'result_quantity', type: 'INTEGER', required: '✅', description: 'Quantity produced' },
        { field: 'crafting_time', type: 'INTEGER', required: '✅', description: 'Time in seconds' },
        { field: 'success_rate', type: 'DECIMAL(5,4)', required: '✅', description: 'Chance of success' },
        { field: 'is_active', type: 'BOOLEAN', required: '✅', description: 'Recipe active status' },
    ];

    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Required',
            dataIndex: 'required',
            key: 'required',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <div>
            <Title level={2}>📐 Data Models & Field Definitions</Title>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="🎯 Base Item Model" size="small">
                        <Paragraph>
                            Core model cho tất cả items trong hệ thống. Mỗi item type đều kế thừa từ base model này.
                        </Paragraph>
                        <Table
                            dataSource={baseItemModel}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="⚔️ Equipment Item Model" size="small">
                        <Paragraph>
                            Extended model cho weapons và armor với combat stats và upgrade system.
                        </Paragraph>
                        <Table
                            dataSource={equipmentModel}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="🔨 Crafting Recipe Model" size="small">
                        <Paragraph>
                            Model cho crafting system với ingredients và success rates.
                        </Paragraph>
                        <Table
                            dataSource={craftingModel}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Relationships Diagram */}
            <Title level={3} style={{ marginTop: 24 }}>🔗 Database Relationships</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card size="small">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <Text strong>base_items</Text>
                                <Text> → 1:1 → </Text>
                                <Text strong>equipment_items</Text>
                                <Tag color="green" style={{ marginLeft: 8 }}>Inheritance</Tag>
                            </div>
                            <div>
                                <Text strong>base_items</Text>
                                <Text> → 1:1 → </Text>
                                <Text strong>consumable_items</Text>
                                <Tag color="green" style={{ marginLeft: 8 }}>Inheritance</Tag>
                            </div>
                            <div>
                                <Text strong>equipment_items</Text>
                                <Text> → 1:N → </Text>
                                <Text strong>equipment_sockets</Text>
                                <Tag color="blue" style={{ marginLeft: 8 }}>Composition</Tag>
                            </div>
                            <div>
                                <Text strong>crafting_recipes</Text>
                                <Text> → 1:N → </Text>
                                <Text strong>recipe_ingredients</Text>
                                <Tag color="orange" style={{ marginLeft: 8 }}>Aggregation</Tag>
                            </div>
                            <div>
                                <Text strong>base_items</Text>
                                <Text> → 1:N → </Text>
                                <Text strong>price_history</Text>
                                <Tag color="purple" style={{ marginLeft: 8 }}>History</Tag>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Index Information */}
            <Title level={3} style={{ marginTop: 24 }}>🚀 Performance Indexes</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card size="small">
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Text strong>Search Indexes</Text>
                                <ul>
                                    <li><Text code>idx_base_items_type</Text></li>
                                    <li><Text code>idx_base_items_rarity</Text></li>
                                    <li><Text code>idx_base_items_level</Text></li>
                                </ul>
                            </Col>
                            <Col span={8}>
                                <Text strong>Join Indexes</Text>
                                <ul>
                                    <li><Text code>idx_equipment_sockets_equipment</Text></li>
                                    <li><Text code>idx_recipe_ingredients_recipe</Text></li>
                                    <li><Text code>idx_price_history_item</Text></li>
                                </ul>
                            </Col>
                            <Col span={8}>
                                <Text strong>Composite Indexes</Text>
                                <ul>
                                    <li><Text code>idx_items_rarity_level</Text></li>
                                    <li><Text code>idx_equipment_attributes</Text></li>
                                    <li><Text code>idx_price_history_item_timestamp</Text></li>
                                </ul>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
