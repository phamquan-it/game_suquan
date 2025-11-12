import React from 'react';
import { Typography, Space, Alert, Card, Row, Col, Tag } from 'antd';
import { CrownOutlined, SafetyOutlined, TeamOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Introduction: React.FC = () => {
    return (
        <div className="p-6">
            <div className="p-6 rounded-lg imperial-border parchment-bg">
                <Space direction="vertical" size="large" className="w-full">
                    <div className="text-center">
                        <Title level={1} className="text-imperial-red font-imperial m-0">👑 Imperial Game Economy</Title>
                        <Paragraph className="text-noble-brown text-lg">
                            A royal documentation for the imperial game economy system, designed for modern gaming kingdoms
                        </Paragraph>
                    </div>

                    <Alert
                        message="Royal Announcement"
                        description="This system is designed for high-traffic gaming kingdoms with requirements for performance and security."
                        type="info"
                        showIcon
                        className="bg-blue-50 border-blue-200"
                    />

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Card
                                className="bg-gradient-to-br from-imperial-gold to-yellow-500 border-2 border-imperial-gold text-imperial-red shadow-lg"
                            >
                                <Space direction="vertical" size="middle" className="w-full text-center">
                                    <CrownOutlined className="text-3xl" />
                                    <Title level={4} className="m-0 font-imperial">Royal Performance</Title>
                                    <Text className="text-imperial-red font-semibold">Optimized for millions of subjects with advanced caching</Text>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="bg-gradient-to-br from-status-success to-green-500 border-2 border-green-500 text-white shadow-lg">
                                <Space direction="vertical" size="middle" className="w-full text-center">
                                    <SafetyOutlined className="text-3xl" />
                                    <Title level={4} className="m-0 text-white font-imperial">Imperial Security</Title>
                                    <Text className="text-white font-semibold">Transaction integrity and comprehensive audit trails</Text>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="bg-gradient-to-br from-imperial-navy to-blue-800 border-2 border-imperial-navy text-white shadow-lg">
                                <Space direction="vertical" size="middle" className="w-full text-center">
                                    <TeamOutlined className="text-3xl" />
                                    <Title level={4} className="m-0 text-white font-imperial">Kingdom Scale</Title>
                                    <Text className="text-white font-semibold">Easily expandable with modular architecture</Text>
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🏰 Imperial Architecture Overview</Title>
                    <Paragraph className="text-noble-brown">
                        The system is divided into main modules that operate independently but integrate tightly:
                    </Paragraph>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">💰 Royal Treasury</Title>
                                <Text className="text-noble-brown">Multi-currency management with exchange rates and transaction history</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">🎁 Treasure Chests</Title>
                                <Text className="text-noble-brown">Intelligent loot box system with pity mechanisms and limits</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">📈 Royal Rewards</Title>
                                <Text className="text-noble-brown">Reward distribution with weighted probability and dynamic conditions</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">🛡️ Imperial Guards</Title>
                                <Text className="text-noble-brown">Access control with time-based limits and VIP tiers</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">📊 Royal Analytics</Title>
                                <Text className="text-noble-brown">Detailed tracking and reporting on subject behavior</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="h-full border-2 border-imperial-gold bg-noble-parchment hover:shadow-lg transition-shadow">
                                <Title level={4} className="text-imperial-red font-imperial">🔧 Royal Management</Title>
                                <Text className="text-noble-brown">Tools for real-time economy balancing</Text>
                            </Card>
                        </Col>
                    </Row>

                    <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🎯 Royal Design Goals</Title>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-noble-parchment p-4 rounded border border-imperial-gold">
                            <Text strong className="text-imperial-red">👥 Subject Engagement:</Text>
                            <Text className="text-noble-brown ml-2">Create desire and anticipation for royal subjects</Text>
                        </div>
                        <div className="bg-noble-parchment p-4 rounded border border-imperial-gold">
                            <Text strong className="text-imperial-red">⚖️ Economic Balance:</Text>
                            <Text className="text-noble-brown ml-2">Maintain long-term kingdom economy balance</Text>
                        </div>
                        <div className="bg-noble-parchment p-4 rounded border border-imperial-gold">
                            <Text strong className="text-imperial-red">💰 Royal Revenue:</Text>
                            <Text className="text-noble-brown ml-2">Optimize revenue through smart pricing</Text>
                        </div>
                        <div className="bg-noble-parchment p-4 rounded border border-imperial-gold">
                            <Text strong className="text-imperial-red">⚔️ Royal Fairness:</Text>
                            <Text className="text-noble-brown ml-2">Ensure fairness with pity and anti-exploit mechanisms</Text>
                        </div>
                    </div>

                    <Alert
                        message="Royal Implementation Notice"
                        description={
                            <div>
                                <Text>The system requires PostgreSQL 12+ and is optimized for cloud deployment. </Text>
                                <Text strong>Royal Recommendations:</Text>
                                <ul className="mt-2 ml-4">
                                    <li>Connection pooling with PgBouncer</li>
                                    <li>Redis for caching and session management</li>
                                    <li>Monitoring with Prometheus + Grafana</li>
                                </ul>
                            </div>
                        }
                        type="warning"
                        showIcon
                        className="bg-yellow-50 border-yellow-200"
                    />
                </Space>
            </div>
        </div>
    );
};

export default Introduction;
