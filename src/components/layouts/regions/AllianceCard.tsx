
import {
    Card,
    Row,
    Col,
    Avatar,
    Space,
    Tag,
    Progress,
    Statistic,
    Typography
} from 'antd';
const { Text } = Typography
import { Castle, Crown, Trophy, Users } from 'lucide-react';
import { getRegionInfo, getStatusColor, getStatusText } from './data';
export const AllianceCard = ({ alliance, compact = false }: { alliance: Alliance, compact?: boolean }) => (
    <Card
        style={{
            border: `2px solid ${alliance.rank <= 3 ? '#D4AF37' : '#CD7F32'}`,
            borderRadius: '12px',
            background: alliance.rank <= 3 ? 'linear-gradient(135deg, #FFF9E6, #FFFFFF)' : 'white',
            marginBottom: '12px'
        }}
        styles={{ body:{ padding: compact ? '12px' : '16px' }}}
    >
        <Row gutter={[16, 16]} align="middle">
            <Col xs={compact ? 3 : 2}>
                <div style={{ textAlign: 'center' }}>
                    {alliance.rank <= 3 ? (
                        <Crown style={{
                            color: alliance.rank === 1 ? '#FFD700' :
                                alliance.rank === 2 ? '#C0C0C0' : '#CD7F32'
                        }} />
                    ) : (
                        <Text strong style={{ color: '#8B0000' }}>#{alliance.rank}</Text>
                    )}
                </div>
            </Col>

            <Col xs={compact ? 5 : 4}>
                <Avatar
                    size={compact ? 40 : 48}
                    style={{
                        background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                        border: `2px solid ${alliance.rank === 1 ? '#FFD700' : alliance.rank === 2 ? '#C0C0C0' : alliance.rank === 3 ? '#CD7F32' : '#D4AF37'}`,
                        fontWeight: 'bold',
                        color: 'white'
                    }}
                >
                    {alliance.tag}
                </Avatar>
            </Col>

            <Col xs={compact ? 16 : 18}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space direction="vertical" size={0}>
                            <Space>
                                <Text strong style={{ color: '#8B0000', fontSize: compact ? '14px' : '16px' }}>
                                    {alliance.name}
                                </Text>
                                <Tag color="#003366" style={{ margin: 0, fontSize: compact ? '10px' : '12px' }}>
                                    Lv.{alliance.level}
                                </Tag>
                            </Space>
                            <Text type="secondary" style={{ fontSize: compact ? '10px' : '12px' }}>
                                [{alliance.tag}] • {alliance.leader}
                            </Text>
                            <Space size={4} style={{ marginTop: '4px' }}>
                                <Tag
                                    color={getStatusColor(alliance.status)}
                                    style={{ margin: 0, fontSize: compact ? '10px' : '12px' }}
                                >
                                    {getStatusText(alliance.status)}
                                </Tag>
                                <Tag
                                    color={getRegionInfo(alliance.region).color}
                                    style={{ margin: 0, fontSize: compact ? '10px' : '12px' }}
                                >
                                    {getRegionInfo(alliance.region).label}
                                </Tag>
                            </Space>
                        </Space>

                        {!compact && (
                            <Space direction="vertical" align="end" size={0}>
                                <Text strong style={{ color: '#8B0000' }}>
                                    {(alliance.totalPower / 1000000).toFixed(1)}M
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Sức mạnh
                                </Text>
                            </Space>
                        )}
                    </Space>

                    {!compact && (
                        <>
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Statistic
                                    title="Thành viên"
                                    value={alliance.memberCount}
                                    suffix={`/ ${alliance.maxMembers}`}
                                    valueStyle={{ color: '#003366', fontSize: '14px' }}
                                    prefix={<Users size={12} />}
                                />
                                <Statistic
                                    title="Lãnh thổ"
                                    value={alliance.territory}
                                    valueStyle={{ color: '#D4AF37', fontSize: '14px' }}
                                    prefix={<Castle size={12} />}
                                />
                                <Statistic
                                    title="Thắng"
                                    value={alliance.winRate}
                                    suffix="%"
                                    valueStyle={{ color: '#52c41a', fontSize: '14px' }}
                                    prefix={<Trophy size={12} />}
                                />
                            </Space>

                            <Progress
                                percent={(alliance.memberCount / alliance.maxMembers) * 100}
                                size="small"
                                strokeColor={{
                                    '0%': '#D4AF37',
                                    '100%': '#8B0000',
                                }}
                                showInfo={false}
                            />

                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {alliance.recentActivity}
                            </Text>
                        </>
                    )}
                </Space>
            </Col>
        </Row>
    </Card>
);


