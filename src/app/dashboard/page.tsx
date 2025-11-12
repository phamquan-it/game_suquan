"use client"
// components/Dashboard.tsx
import React from 'react';
import { Layout, Card, Row, Col, Statistic, Button, Tag, List, Avatar, Menu } from 'antd';
import { Crown, Sword, Users, Trophy, AlertTriangle } from 'lucide-react';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--ivory)' }}>
            {/* Header */}
            <Header style={{
                background: 'var(--imperial-red)',
                borderBottom: '3px solid var(--imperial-gold)'
            }}>
                <div style={{
                    color: 'var(--imperial-gold)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Crown size={24} />
                    Quản Lý 12 Sứ Quân
                </div>
            </Header>

            <Layout>
                {/* Sidebar */}
                <Sider width={250} style={{ background: 'var(--royal-navy)' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{
                            border: 'none',
                            background: 'var(--royal-navy)',
                            color: 'white'
                        }}
                        items={[
                            {
                                key: '1',
                                icon: <Sword />,
                                label: 'Chiến Trường',
                                style: { color: 'white' }
                            },
                            {
                                key: '2',
                                icon: <Users />,
                                label: 'Quân Đội',
                                style: { color: 'white' }
                            },
                            {
                                key: '3',
                                icon: <Trophy />,
                                label: 'Thành Tích',
                                style: { color: 'white' }
                            }
                        ]}
                    />
                </Sider>

                {/* Main Content */}
                <Content style={{ padding: '24px', background: 'var(--ivory)' }}>
                    {/* Thống kê tổng quan */}
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="royal-card">
                                <Statistic
                                    title="Tổng Quân Số"
                                    value={12500}
                                    prefix={<Users style={{ color: 'var(--imperial-red)' }} />}
                                    valueStyle={{ color: 'var(--imperial-red)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="royal-card">
                                <Statistic
                                    title="Lãnh Thổ"
                                    value={8}
                                    suffix="vùng"
                                    prefix={<Crown style={{ color: 'var(--imperial-gold)' }} />}
                                    valueStyle={{ color: 'var(--imperial-gold)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="royal-card">
                                <Statistic
                                    title="Trận Thắng"
                                    value={47}
                                    prefix={<Trophy style={{ color: 'var(--success)' }} />}
                                    valueStyle={{ color: 'var(--success)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="royal-card">
                                <Statistic
                                    title="Cảnh Báo"
                                    value={3}
                                    prefix={<AlertTriangle style={{ color: 'var(--warning)' }} />}
                                    valueStyle={{ color: 'var(--warning)' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Danh sách quân đội */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <span style={{ color: 'var(--imperial-red)', fontWeight: 'bold' }}>
                                        🎖️ Quân Đội Các Sứ Quân
                                    </span>
                                }
                                className="royal-card"
                                extra={<Button type="primary" style={{ background: 'var(--imperial-red)' }}>Xem Tất Cả</Button>}
                            >
                                <List
                                    dataSource={[
                                        { name: 'Ngô Xương Xí', troops: 2500, status: 'active' },
                                        { name: 'Đỗ Cảnh Thạc', troops: 1800, status: 'training' },
                                        { name: 'Kiều Công Hãn', troops: 3200, status: 'active' },
                                        { name: 'Nguyễn Khoan', troops: 1500, status: 'resting' },
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item className="unit-card" style={{ padding: '12px', margin: '8px 0', borderRadius: '8px' }}>
                                            <List.Item.Meta
                                                avatar={<Avatar style={{ background: 'var(--imperial-gold)' }}>⚔️</Avatar>}
                                                title={<span style={{ fontWeight: 'bold', color: 'var(--royal-navy)' }}>{item.name}</span>}
                                                description={`Quân số: ${item.troops} | Trạng thái: ${getStatusTag(item.status)}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <span style={{ color: 'var(--imperial-red)', fontWeight: 'bold' }}>
                                        ⚔️ Nhật Ký Chiến Trận
                                    </span>
                                }
                                className="battle-card"
                            >
                                <div className="combat-log" style={{ padding: '12px', borderRadius: '4px', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--imperial-gold)' }}>Trận Hồi Quan</span>
                                        <Tag color="gold" style={{ color: 'var(--imperial-red)', fontWeight: 'bold' }}>Thắng</Tag>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--silver)' }}>
                                        Ngô Xương Xí đánh bại Đỗ Cảnh Thạc - Tổn thất: 350 quân
                                    </div>
                                </div>

                                <div className="combat-log" style={{ padding: '12px', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--imperial-gold)' }}>Phòng Thủ Bình Kiều</span>
                                        <Tag color="volcano" style={{ color: 'white', fontWeight: 'bold' }}>Phòng Thủ</Tag>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--silver)' }}>
                                        Kiều Công Hãn phòng thủ thành công - Tiêu diệt: 520 quân địch
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

// Helper function for status tags
const getStatusTag = (status: string) => {
    const statusConfig = {
        active: { color: 'success', text: 'Sẵn Sàng' },
        training: { color: 'processing', text: 'Huấn Luyện' },
        resting: { color: 'default', text: 'Nghỉ Ngơi' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
};

export default Dashboard;
