'use client';

import { Card, Row, Col, Typography, Tabs, Alert, Tag, Divider } from 'antd';
import { DatabaseOutlined, ApiOutlined, CodeOutlined, ShopOutlined } from '@ant-design/icons';
import SchemaOverview from './components/SchemaOverview';
import ItemTypes from './components/ItemTypes';
import QueryExamples from './components/QueryExamples';
import APIIntegration from './components/APIIntegration';
import DataModels from './components/DataModels';

const { Title, Paragraph, Text } = Typography;

export default function ItemsDocumentationPage() {
    const stats = [
        { label: 'Total Tables', value: '12', color: 'blue' },
        { label: 'Enum Types', value: '7', color: 'green' },
        { label: 'Indexes', value: '25+', color: 'orange' },
        { label: 'Relationships', value: 'Complex', color: 'purple' },
    ];

    return (
        <div style={{ padding: '24px', background: '#F5F5DC', minHeight: '100vh' }}>
            <Card>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={1}>🎮 Items System Documentation</Title>
                    <Paragraph style={{ fontSize: '16px' }}>
                        Complete guide for the PostgreSQL item management system with TypeScript integration
                    </Paragraph>
                </div>

                {/* Stats */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {stats.map((stat, index) => (
                        <Col xs={12} sm={6} key={index}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                                <Text type="secondary">{stat.label}</Text>
                                <div>
                                    <Tag color={stat.color} style={{ marginTop: 8, fontSize: '16px' }}>
                                        {stat.value}
                                    </Tag>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Alert
                    message="Database Schema: items"
                    description="All tables and types are organized under the 'items' schema for better namespace management"
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                {/* Main Tabs */}
                <Tabs
                    size="large"
                    items={[
                        {
                            key: 'schema',
                            label: (
                                <span>
                                    <DatabaseOutlined />
                                    Schema Overview
                                </span>
                            ),
                            children: <SchemaOverview />,
                        },
                        {
                            key: 'types',
                            label: (
                                <span>
                                    <ShopOutlined />
                                    Item Types
                                </span>
                            ),
                            children: <ItemTypes />,
                        },
                        {
                            key: 'queries',
                            label: (
                                <span>
                                    <CodeOutlined />
                                    Query Examples
                                </span>
                            ),
                            children: <QueryExamples />,
                        },
                        {
                            key: 'api',
                            label: (
                                <span>
                                    <ApiOutlined />
                                    API Integration
                                </span>
                            ),
                            children: <APIIntegration />,
                        },
                        {
                            key: 'models',
                            label: 'Data Models',
                            children: <DataModels />,
                        },
                    ]}
                />

                <Divider />

                {/* Quick Links */}
                <Title level={3}>🚀 Quick Links</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            hoverable
                            onClick={() => window.open('/docs/items/examples', '_self')}
                            style={{ cursor: 'pointer' }}
                        >
                            <Title level={4}>📚 Live Examples</Title>
                            <Paragraph>Interactive examples with real data</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            hoverable
                            onClick={() => window.open('#api', '_self')}
                            style={{ cursor: 'pointer' }}
                        >
                            <Title level={4}>🔗 API Reference</Title>
                            <Paragraph>Complete API endpoints documentation</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card
                            size="small"
                            hoverable
                            onClick={() => window.open('#queries', '_self')}
                            style={{ cursor: 'pointer' }}
                        >
                            <Title level={4}>💡 Query Patterns</Title>
                            <Paragraph>Common database query patterns</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}
