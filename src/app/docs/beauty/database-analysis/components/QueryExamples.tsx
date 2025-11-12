import { Card, Typography, Collapse, Tag, Row, Col, Alert } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function QueryExamples() {
    const characterQueries = [
        {
            title: 'Lấy tất cả mỹ nhân huyền thoại',
            description: 'Query để lấy các mỹ nhân có độ hiếm legendary',
            sql: `SELECT * FROM beauty.characters 
WHERE rarity = 'legendary'
ORDER BY level DESC;`
        },
        {
            title: 'Tìm mỹ nhân có Charm cao nhất',
            description: 'Tìm top 5 mỹ nhân có chỉ số Charm cao nhất',
            sql: `SELECT id, name, title, charm, level 
FROM beauty.characters 
ORDER BY charm DESC 
LIMIT 5;`
        },
        {
            title: 'Mỹ nhân đang sẵn sàng nhận nhiệm vụ',
            description: 'Tìm mỹ nhân có trạng thái available',
            sql: `SELECT c.id, c.name, c.title, 
       c.charm + c.intelligence + c.diplomacy as total_attributes
FROM beauty.characters c
WHERE c.status = 'available'
ORDER BY total_attributes DESC;`
        },
    ];

    const missionQueries = [
        {
            title: 'Tìm nhiệm vụ phù hợp với mỹ nhân',
            description: 'Tìm nhiệm vụ mà mỹ nhân có đủ attributes yêu cầu',
            sql: `SELECT m.* 
FROM beauty.missions m
WHERE m.required_charm <= 85  -- Thay bằng charm thực tế của mỹ nhân
  AND m.required_intelligence <= 90
  AND m.required_diplomacy <= 75
  AND m.required_intrigue <= 80
ORDER BY m.success_rate DESC;`
        },
        {
            title: 'Lịch sử nhiệm vụ của mỹ nhân',
            description: 'Xem tất cả nhiệm vụ mà mỹ nhân đã thực hiện',
            sql: `SELECT cm.start_time, cm.end_time, cm.status,
       m.name as mission_name, m.difficulty,
       cm.actual_rewards
FROM beauty.character_missions cm
JOIN beauty.missions m ON cm.mission_id = m.id
WHERE cm.character_id = 'character_id_here'
ORDER BY cm.start_time DESC;`
        },
    ];

    const equipmentQueries = [
        {
            title: 'Trang bị đang được trang bị',
            description: 'Lấy tất cả trang phục và trang sức đang được trang bị',
            sql: `-- Trang phục đang trang bị
SELECT c.name as character_name, cos.name as costume_name, cos.rarity
FROM beauty.costumes cos
JOIN beauty.characters c ON cos.character_id = c.id
WHERE cos.equipped = true;

-- Trang sức đang trang bị
SELECT c.name as character_name, j.name as jewelry_name, j.type, j.rarity
FROM beauty.jewelry j
JOIN beauty.characters c ON j.character_id = c.id
WHERE j.equipped = true;`
        },
        {
            title: 'Tổng hợp attributes với trang bị',
            description: 'Tính tổng attributes của mỹ nhân bao gồm cả trang bị',
            sql: `SELECT 
  c.id,
  c.name,
  c.charm + COALESCE(cos.charm, 0) + COALESCE(j.charm, 0) as total_charm,
  c.intelligence + COALESCE(cos.intelligence, 0) as total_intelligence,
  c.diplomacy + COALESCE(cos.diplomacy, 0) as total_diplomacy,
  c.intrigue + COALESCE(j.intrigue, 0) as total_intrigue,
  c.loyalty + COALESCE(j.loyalty, 0) as total_loyalty
FROM beauty.characters c
LEFT JOIN beauty.costumes cos ON cos.character_id = c.id AND cos.equipped = true
LEFT JOIN beauty.jewelry j ON j.character_id = c.id AND j.equipped = true
WHERE c.id = 'character_id_here';`
        },
    ];

    const renderQueryPanel = (queries: any[], title: string) => (
        <Panel header={title} key={title}>
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
            <Title level={2}>🔍 Query Examples</Title>
            <Alert
                message="Query Performance Tips"
                description="Tất cả các query đều đã được tối ưu với indexes phù hợp. Sử dụng EXPLAIN ANALYZE để kiểm tra performance."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Collapse defaultActiveKey={['characters']}>
                {renderQueryPanel(characterQueries, '👸 Character Queries')}
                {renderQueryPanel(missionQueries, '🎯 Mission Queries')}
                {renderQueryPanel(equipmentQueries, '💎 Equipment Queries')}
            </Collapse>
        </div>
    );
}
