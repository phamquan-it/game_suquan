import { Card, Typography, Collapse, Row, Col, Alert } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function QueryExamples() {
    const equipmentQueries = [
        {
            title: 'Tìm vũ khí mạnh nhất theo level',
            description: 'Lấy top 10 vũ khí có attack cao nhất cho level requirement',
            sql: `SELECT 
  bi.name, 
  bi.rarity,
  ei.attack,
  ei.critical_chance,
  ei.enhancement_level
FROM items.equipment_items ei
JOIN items.base_items bi ON ei.id = bi.id
WHERE bi.type = 'weapon'
  AND bi.level_requirement <= 50
  AND bi.rarity IN ('epic', 'legendary', 'mythic')
ORDER BY ei.attack DESC, ei.critical_chance DESC
LIMIT 10;`
        },
        {
            title: 'Trang bị có socket trống',
            description: 'Tìm trang bị có socket chưa sử dụng để gắn gem',
            sql: `SELECT 
  bi.name,
  ei.slot,
  ei.total_sockets,
  ei.used_sockets,
  (ei.total_sockets - ei.used_sockets) as free_sockets
FROM items.equipment_items ei
JOIN items.base_items bi ON ei.id = bi.id
WHERE ei.total_sockets > ei.used_sockets
  AND bi.rarity >= 'rare'
ORDER BY free_sockets DESC, bi.rarity DESC;`
        },
    ];

    const craftingQueries = [
        {
            title: 'Công thức chế tạo cho item cụ thể',
            description: 'Tìm tất cả công thức có thể tạo ra item mong muốn',
            sql: `SELECT 
  cr.name as recipe_name,
  cr.success_rate,
  cr.crafting_time,
  cr.experience_gained,
  ri.item_id,
  ri.quantity,
  bi.name as ingredient_name
FROM items.crafting_recipes cr
JOIN items.recipe_ingredients ri ON cr.id = ri.recipe_id
JOIN items.base_items bi ON ri.item_id = bi.id
WHERE cr.result_item_id = 'sword_of_legends'
  AND cr.is_active = true
ORDER BY ri.ingredient_order;`
        },
        {
            title: 'Material farming locations',
            description: 'Tìm nơi farm material với tỷ lệ rơi tốt nhất',
            sql: `SELECT 
  bi.name as material_name,
  dr.source,
  dr.source_type,
  dr.drop_rate,
  dr.min_quantity,
  dr.max_quantity,
  ROUND((dr.drop_rate * (dr.min_quantity + dr.max_quantity) / 2), 2) as efficiency
FROM items.drop_rates dr
JOIN items.base_items bi ON dr.item_id = bi.id
WHERE bi.type = 'material'
  AND dr.drop_rate > 0.1
ORDER BY efficiency DESC, dr.drop_rate DESC
LIMIT 20;`
        },
    ];

    const marketQueries = [
        {
            title: 'Price history analysis',
            description: 'Phân tích biến động giá của item trong 30 ngày',
            sql: `SELECT 
  bi.name,
  DATE(ph.timestamp) as date,
  ROUND(AVG(ph.average_price), 2) as avg_price,
  MIN(ph.min_price) as min_price,
  MAX(ph.max_price) as max_price,
  SUM(ph.volume) as total_volume
FROM items.price_history ph
JOIN items.base_items bi ON ph.item_id = bi.id
WHERE ph.item_id = 'dragon_scale'
  AND ph.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY bi.name, DATE(ph.timestamp)
ORDER BY date DESC;`
        },
        {
            title: 'Most traded items',
            description: 'Top items có volume giao dịch cao nhất',
            sql: `SELECT 
  bi.name,
  bi.rarity,
  bi.type,
  SUM(ph.volume) as total_volume,
  ROUND(AVG(ph.average_price), 2) as current_price
FROM items.price_history ph
JOIN items.base_items bi ON ph.item_id = bi.id
WHERE ph.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY bi.id, bi.name, bi.rarity, bi.type
ORDER BY total_volume DESC
LIMIT 15;`
        },
    ];

    const renderQueryPanel = (queries: any[], title: string, key: string) => (
        <Panel header={title} key={key}>
            {queries.map((query, index) => (
                <Card key={index} size="small" style={{ marginBottom: 16 }}>
                    <Text strong>{query.title}</Text>
                    <Paragraph type="secondary">{query.description}</Paragraph>
                    <SyntaxHighlighter language="sql" style={atomDark}>
                        {query.sql}
                    </SyntaxHighlighter>
                </Card>
            ))}
        </Panel>
    );

    return (
        <div>
            <Title level={2}>🔍 Query Examples & Patterns</Title>

            <Alert
                message="Performance Optimized"
                description="Tất cả queries đều đã được tối ưu với indexes phù hợp. Sử dụng EXPLAIN ANALYZE để kiểm tra query plan."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Collapse defaultActiveKey={['equipment']}>
                        {renderQueryPanel(equipmentQueries, '⚔️ Equipment Queries', 'equipment')}
                        {renderQueryPanel(craftingQueries, '🔨 Crafting & Recipes', 'crafting')}
                        {renderQueryPanel(marketQueries, '💰 Market & Economy', 'market')}
                    </Collapse>
                </Col>
            </Row>

            {/* Best Practices */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="💡 Query Best Practices" size="small">
                        <ul>
                            <li>
                                <Text strong>Sử dụng JOIN thay vì subquery</Text> khi có thể để tận dụng indexes
                            </li>
                            <li>
                                <Text strong>Filter sớm</Text> - Áp dụng WHERE conditions càng sớm càng tốt
                            </li>
                            <li>
                                <Text strong>Limit kết quả</Text> - Luôn sử dụng LIMIT cho pagination
                            </li>
                            <li>
                                <Text strong>Avoid SELECT *</Text> - Chỉ select các columns cần thiết
                            </li>
                            <li>
                                <Text strong>Use EXPLAIN ANALYZE</Text> để phân tích query performance
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
