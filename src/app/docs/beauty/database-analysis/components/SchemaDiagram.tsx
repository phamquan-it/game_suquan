import { Card, Typography, Table, Tag, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function SchemaDiagram() {
    const tableRelationships = [
        {
            table: 'beauty.characters',
            description: 'Bảng chính lưu thông tin mỹ nhân',
            columns: 'id, name, title, rarity, attributes, status...',
            relations: '1:N với skills, costumes, jewelry, character_missions',
        },
        {
            table: 'beauty.skills',
            description: 'Kỹ năng của mỹ nhân',
            columns: 'id, character_id, name, type, effect_type, effect_value...',
            relations: 'N:1 với characters',
        },
        {
            table: 'beauty.costumes',
            description: 'Trang phục mỹ nhân',
            columns: 'id, character_id, name, rarity, attributes, equipped...',
            relations: 'N:1 với characters',
        },
        {
            table: 'beauty.jewelry',
            description: 'Trang sức mỹ nhân',
            columns: 'id, character_id, name, type, rarity, attributes, equipped...',
            relations: 'N:1 với characters',
        },
        {
            table: 'beauty.missions',
            description: 'Nhiệm vụ trong hệ thống',
            columns: 'id, name, difficulty, duration, required_attributes, rewards...',
            relations: '1:N với mission_reward_items, mission_special_rewards, character_missions',
        },
        {
            table: 'beauty.character_missions',
            description: 'Lịch sử nhiệm vụ của mỹ nhân',
            columns: 'id, character_id, mission_id, start_time, end_time, status...',
            relations: 'N:1 với characters và missions',
        },
    ];

    const columns = [
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            render: (text: string) => <Text strong code>{text}</Text>,
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

    return (
        <div>
            <Title level={2}>🗄️ Database Schema Overview</Title>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="📋 Table Relationships" size="small">
                        <Table
                            dataSource={tableRelationships}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="🎯 Key Features" size="small">
                        <ul>
                            <li><Text strong>Normalized Design</Text> - Thiết kế chuẩn hóa cao</li>
                            <li><Text strong>Foreign Key Constraints</Text> - Đảm bảo toàn vẹn dữ liệu</li>
                            <li><Text strong>Enum Types</Text> - Kiểm soát giá trị đầu vào</li>
                            <li><Text strong>JSONB Support</Text> - Linh hoạt cho dữ liệu phức tạp</li>
                            <li><Text strong>Index Optimization</Text> - Tối ưu hiệu năng query</li>
                        </ul>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="🏷️ Enum Types" size="small">
                        <div>
                            <Tag color="blue">rarity_type</Tag>
                            <Tag color="green">skill_type</Tag>
                            <Tag color="orange">effect_type</Tag>
                            <Tag color="purple">jewelry_type</Tag>
                            <Tag color="red">status_type</Tag>
                            <Tag color="cyan">difficulty_type</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
