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
    Divider
} from 'antd';
import { Badge, Castle, Settings, Sword, TrendingUp, Trophy, UserPlus, Users } from 'lucide-react';
import { getRegionInfo, getStatusColor, getStatusText, myAlliance } from './data';
const { Text, Title } = Typography
export const MyAllianceCard = () => (
    <Card
        style={{
            border: '2px solid #D4AF37',
            borderRadius: '12px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #FFFFFF, #F5F5DC)'
        }}
        title={
            <Space>
                <Users style={{ color: '#8B0000' }} />
                <Text strong>Liên Minh Của Bạn</Text>
                <Badge style={{ backgroundColor: '#8B0000' }} />
            </Space>
        }
    >
        <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="middle">
                    <Avatar
                        size={80}
                        style={{
                            background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                            border: '3px solid #D4AF37',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '24px',
                            margin: '0 auto'
                        }}
                    >
                        {myAlliance.tag}
                    </Avatar>

                    <Space direction="vertical" size={0}>
                        <Title level={4} style={{ color: '#8B0000', margin: 0 }}>
                            {myAlliance.name}
                        </Title>
                        <Text type="secondary">[{myAlliance.tag}]</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Hạng #{myAlliance.rank}
                        </Text>
                    </Space>

                    <Space>
                        <Tag color={getStatusColor(myAlliance.status)}>
                            {getStatusText(myAlliance.status)}
                        </Tag>
                        <Tag color={getRegionInfo(myAlliance.region).color}>
                            {getRegionInfo(myAlliance.region).label}
                        </Tag>
                    </Space>
                </Space>
            </Col>

            <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Title level={5} style={{ color: '#8B0000', margin: 0 }}>
                        Thống Kê
                    </Title>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Statistic
                                title="Cấp Độ"
                                value={myAlliance.level}
                                valueStyle={{ color: '#003366', fontSize: '16px' }}
                                prefix={<TrendingUp size={14} />}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="Sức Mạnh"
                                value={(myAlliance.totalPower / 1000000).toFixed(1)}
                                suffix="M"
                                valueStyle={{ color: '#8B0000', fontSize: '16px' }}
                                prefix={<Sword size={14} />}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="Thành Viên"
                                value={myAlliance.memberCount}
                                suffix={`/ ${myAlliance.maxMembers}`}
                                valueStyle={{ color: '#D4AF37', fontSize: '16px' }}
                                prefix={<Users size={14} />}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="TL Thắng"
                                value={myAlliance.winRate}
                                suffix="%"
                                valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                                prefix={<Trophy size={14} />}
                            />
                        </Col>
                    </Row>
                </Space>
            </Col>

            <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Title level={5} style={{ color: '#8B0000', margin: 0 }}>
                        Hành Động
                    </Title>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Button
                            icon={<Users size={16} />}
                            block
                            style={{ textAlign: 'left', height: '40px' }}
                        >
                            Quản Lý Thành Viên
                        </Button>
                        <Button
                            icon={<Castle size={16} />}
                            block
                            style={{ textAlign: 'left', height: '40px' }}
                        >
                            Xem Lãnh Thổ
                        </Button>
                        <Button
                            icon={<UserPlus size={16} />}
                            block
                            style={{ textAlign: 'left', height: '40px' }}
                        >
                            Mời Thành Viên
                        </Button>
                        <Button
                            icon={<Settings size={16} />}
                            block
                            style={{ textAlign: 'left', height: '40px' }}
                        >
                            Cài Đặt Liên Minh
                        </Button>
                    </Space>
                </Space>
            </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Text strong style={{ color: '#8B0000' }}>Mô tả:</Text>
                <Text style={{ display: 'block', marginTop: '8px' }}>
                    {myAlliance.description}
                </Text>
            </Col>
        </Row>
    </Card>
);


