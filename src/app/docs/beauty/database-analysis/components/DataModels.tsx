import { Card, Typography, Table, Tag, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function DataModels() {
    const characterModel = [
        { field: 'id', type: 'VARCHAR(50)', required: '✅', description: 'Primary key' },
        { field: 'name', type: 'VARCHAR(100)', required: '✅', description: 'Tên mỹ nhân' },
        { field: 'title', type: 'VARCHAR(100)', required: '✅', description: 'Danh hiệu (Tây Thi, Chiêu Quân...)' },
        { field: 'rarity', type: 'rarity_type', required: '✅', description: 'Độ hiếm' },
        { field: 'level', type: 'INTEGER', required: '✅', description: 'Cấp độ hiện tại' },
        { field: 'attributes', type: 'Multiple INT', required: '✅', description: 'Charm, Intelligence, Diplomacy, Intrigue, Loyalty' },
        { field: 'status', type: 'status_type', required: '✅', description: 'Trạng thái hiện tại' },
    ];

    const missionModel = [
        { field: 'id', type: 'VARCHAR(50)', required: '✅', description: 'Primary key' },
        { field: 'name', type: 'VARCHAR(100)', required: '✅', description: 'Tên nhiệm vụ' },
        { field: 'difficulty', type: 'difficulty_type', required: '✅', description: 'Độ khó' },
        { field: 'required_attributes', type: 'Multiple INT', required: '✅', description: 'Attributes yêu cầu' },
        { field: 'rewards', type: 'Multiple fields', required: '✅', description: 'Gold, Prestige, Experience, Items' },
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
            <Title level={2}>📐 Data Models</Title>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="👸 Character Model" size="small">
                        <Table
                            dataSource={characterModel}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="🎯 Mission Model" size="small">
                        <Table
                            dataSource={missionModel}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="🏷️ Rarity Types" size="small">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div><Tag color="gray">common</Tag> - Phổ thông</div>
                            <div><Tag color="green">rare</Tag> - Hiếm</div>
                            <div><Tag color="purple">epic</Tag> - Sử thi</div>
                            <div><Tag color="orange">legendary</Tag> - Huyền thoại</div>
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="📊 Status Types" size="small">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div><Tag color="green">available</Tag> - Sẵn sàng</div>
                            <div><Tag color="blue">mission</Tag> - Đang làm nhiệm vụ</div>
                            <div><Tag color="orange">training</Tag> - Đang huấn luyện</div>
                            <div><Tag color="red">resting</Tag> - Đang nghỉ ngơi</div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
