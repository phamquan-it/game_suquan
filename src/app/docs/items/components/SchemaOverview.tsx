import { Card, Typography, Table, Tag, Row, Col, Tree } from 'antd';
import { DatabaseOutlined, TableOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function SchemaOverview() {
    const tableStructure = [
        {
            table: 'base_items',
            description: 'Core table for all items',
            columns: 'id, name, type, rarity, quality, levelRequirement...',
            relations: 'Parent table for all item types',
        },
        {
            table: 'equipment_items',
            description: 'Weapons and armor with combat stats',
            columns: 'slot, durability, attributes, enhancement, sockets...',
            relations: '1:1 with base_items, 1:N with equipment_sockets',
        },
        {
            table: 'consumable_items',
            description: 'Potions, scrolls, and usable items',
            columns: 'cooldown, effects (via consumable_effects)',
            relations: '1:1 with base_items, 1:N with consumable_effects',
        },
        {
            table: 'material_items',
            description: 'Crafting materials and resources',
            columns: 'source_type, source_location, drop_rate...',
            relations: '1:1 with base_items, N:N with recipes',
        },
        {
            table: 'crafting_recipes',
            description: 'Crafting formulas and requirements',
            columns: 'result_item, ingredients, crafting_time, success_rate...',
            relations: '1:N with recipe_ingredients',
        },
        {
            table: 'price_history',
            description: 'Market price tracking over time',
            columns: 'item_id, timestamp, average_price, volume...',
            relations: 'N:1 with base_items',
        },
    ];

    const columns = [
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            render: (text: string) => (
                <Text strong code>
                    <TableOutlined /> {text}
                </Text>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Relationships',
            dataIndex: 'relations',
            key: 'relations',
        },
    ];

    const treeData = [
        {
            title: 'items Schema',
            key: 'schema',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: 'Core Tables',
                    key: 'core',
                    children: [
                        { title: 'base_items', key: 'base_items' },
                        { title: 'categories', key: 'categories' },
                    ],
                },
                {
                    title: 'Item Type Tables',
                    key: 'item_types',
                    children: [
                        { title: 'equipment_items', key: 'equipment_items' },
                        { title: 'consumable_items', key: 'consumable_items' },
                        { title: 'material_items', key: 'material_items' },
                    ],
                },
                {
                    title: 'Game Systems',
                    key: 'systems',
                    children: [
                        { title: 'crafting_recipes', key: 'crafting_recipes' },
                        { title: 'recipe_ingredients', key: 'recipe_ingredients' },
                        { title: 'price_history', key: 'price_history' },
                        { title: 'drop_rates', key: 'drop_rates' },
                    ],
                },
                {
                    title: 'Relationship Tables',
                    key: 'relationships',
                    children: [
                        { title: 'equipment_sockets', key: 'equipment_sockets' },
                        { title: 'consumable_effects', key: 'consumable_effects' },
                        { title: 'material_recipes', key: 'material_recipes' },
                        { title: 'category_item_types', key: 'category_item_types' },
                    ],
                },
            ],
        },
    ];

    return (
        <div>
            <Title level={2}>🗄️ Database Schema Structure</Title>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="📋 Table Overview" size="small">
                        <Table
                            dataSource={tableStructure}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="🌳 Schema Tree" size="small">
                        <Tree
                            showIcon
                            defaultExpandAll
                            treeData={treeData}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="🎯 Key Features" size="small">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <Tag color="blue">Inheritance Pattern</Tag>
                                <Text>Base table with specialized child tables</Text>
                            </div>
                            <div>
                                <Tag color="green">Flexible Attributes</Tag>
                                <Text>Separate tables for effects and sockets</Text>
                            </div>
                            <div>
                                <Tag color="orange">Performance Optimized</Tag>
                                <Text>25+ indexes for fast queries</Text>
                            </div>
                            <div>
                                <Tag color="purple">Data Integrity</Tag>
                                <Text>Foreign keys and enum constraints</Text>
                            </div>
                            <div>
                                <Tag color="red">Audit Trail</Tag>
                                <Text>created_at/updated_at tracking</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Card title="🏷️ Enum Types" size="small">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <Tag color="blue">rarity_type</Tag>
                            <Tag color="green">item_type</Tag>
                            <Tag color="orange">quality_type</Tag>
                            <Tag color="purple">equipment_slot_type</Tag>
                            <Tag color="red">effect_type</Tag>
                            <Tag color="cyan">target_type</Tag>
                            <Tag color="magenta">source_type</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
