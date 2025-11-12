import {
    Card,
    Row,
    Col,
    Avatar,
    Typography,
    Space,
    Tag,
    Button,
    Statistic,
    Modal,
    Descriptions,

} from 'antd';
const { Text, Title, Paragraph } = Typography
import { Users } from 'lucide-react';
import { getRegionInfo, getStatusColor, getStatusText } from './data';
// Additional Components
export const AllianceDetailModal = ({
    alliance,
    visible,
    onClose,
    onJoin
}: {
    alliance: Alliance | null;
    visible: boolean;
    onClose: () => void;
    onJoin: () => void;
}) => {
    if (!alliance) return null;

    return (
        <Modal
            title={
                <Space>
                    <Users style={{ color: '#8B0000' }} />
                    <Text strong>Thông Tin Liên Minh</Text>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <Avatar
                        size={100}
                        style={{
                            background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                            border: '4px solid #D4AF37',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}
                    >
                        {alliance.tag}
                    </Avatar>
                    <Title level={2} style={{ color: '#8B0000', margin: '8px 0' }}>
                        {alliance.name}
                    </Title>
                    <Space>
                        <Tag color="#003366">Lv.{alliance.level}</Tag>
                        <Tag color={getStatusColor(alliance.status)}>
                            {getStatusText(alliance.status)}
                        </Tag>
                        <Tag color={getRegionInfo(alliance.region).color}>
                            {getRegionInfo(alliance.region).label}
                        </Tag>
                        <Tag color="#8B0000">Hạng #{alliance.rank}</Tag>
                    </Space>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Thông Tin Cơ Bản" size="small">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Tộc trưởng">
                                    {alliance.leader}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày thành lập">
                                    {alliance.foundedDate}
                                </Descriptions.Item>
                                <Descriptions.Item label="Thành viên">
                                    {alliance.memberCount} / {alliance.maxMembers}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngôn ngữ">
                                    {alliance.language === 'vietnamese' ? 'Tiếng Việt' : 'English'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Cách gia nhập">
                                    {alliance.joinType === 'open' ? 'Mở' :
                                        alliance.joinType === 'approval' ? 'Duyệt' : 'Mời'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Thống Kê" size="small">
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Sức mạnh"
                                        value={(alliance.totalPower / 1000000).toFixed(1)}
                                        suffix="M"
                                        valueStyle={{ color: '#8B0000' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Lãnh thổ"
                                        value={alliance.territory}
                                        valueStyle={{ color: '#D4AF37' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Tỷ lệ thắng"
                                        value={alliance.winRate}
                                        suffix="%"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Cấp trung bình"
                                        value={alliance.avgMemberLevel}
                                        valueStyle={{ color: '#003366' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Description */}
                <Card title="Giới Thiệu" size="small">
                    <Paragraph>
                        {alliance.description}
                    </Paragraph>
                </Card>

                {/* Requirements */}
                <Card title="Yêu Cầu Gia Nhập" size="small">
                    <Space direction="vertical" size="small">
                        <Text>Cấp độ tối thiểu: <Text strong>Lv.{alliance.requirements.minLevel}</Text></Text>
                        <Text>Sức mạnh tối thiểu: <Text strong>{(alliance.requirements.minPower / 1000).toFixed(0)}K</Text></Text>
                        <Text>Phê duyệt: <Text strong>{alliance.requirements.approvalRequired ? 'Có' : 'Không'}</Text></Text>
                    </Space>
                </Card>

                {/* Achievements */}
                {alliance.achievements.length > 0 && (
                    <Card title="Thành Tích" size="small">
                        <Space wrap>
                            {alliance.achievements.map((achievement, index) => (
                                <Tag key={index} color="gold" style={{ color: '#8B0000' }}>
                                    {achievement}
                                </Tag>
                            ))}
                        </Space>
                    </Card>
                )}

                {/* Specialties */}
                <Card title="Chuyên Môn" size="small">
                    <Space wrap>
                        {alliance.specialties.map((specialty, index) => (
                            <Tag key={index} color="#003366">
                                {specialty}
                            </Tag>
                        ))}
                    </Space>
                </Card>

                {/* Action Buttons */}
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                    {alliance.status === 'recruiting' && (
                        <Button
                            type="primary"
                            size="large"
                            onClick={onJoin}
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                        >
                            Gửi Yêu Cầu Gia Nhập
                        </Button>
                    )}
                    <Button size="large">
                        Xem Thành Viên
                    </Button>
                </Space>
            </Space>
        </Modal>
    );
};


