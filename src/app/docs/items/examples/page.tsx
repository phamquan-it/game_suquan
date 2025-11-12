'use client';

import { Card, Typography, Tabs, Button, Space } from 'antd';
import { PlayCircleOutlined, CodeOutlined, DatabaseOutlined } from '@ant-design/icons';
import EquipmentExamples from '../components/EquipmentExamples';
import CraftingExamples from '../components/CraftingExamples';
import MarketExamples from '../components/MarketExamples';

const { Title, Paragraph } = Typography;

export default function ExamplesPage() {
    return (
        <div style={{ padding: '24px', background: '#F5F5DC', minHeight: '100vh' }}>
            <Card>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={1}>🎯 Interactive Examples</Title>
                    <Paragraph>
                        Live examples với real database queries và kết quả thực tế
                    </Paragraph>
                </div>

                <Tabs
                    size="large"
                    items={[
                        {
                            key: 'equipment',
                            label: (
                                <span>
                                    <DatabaseOutlined />
                                    Equipment System
                                </span>
                            ),
                            children: <EquipmentExamples />,
                        },
                        {
                            key: 'crafting',
                            label: (
                                <span>
                                    <CodeOutlined />
                                    Crafting System
                                </span>
                            ),
                            children: <CraftingExamples />,
                        },
                        {
                            key: 'market',
                            label: (
                                <span>
                                    <PlayCircleOutlined />
                                    Market Economy
                                </span>
                            ),
                            children: <MarketExamples />,
                        },
                    ]}
                />

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Space>
                        <Button type="primary" size="large" href="/docs/items">
                            📚 Quay lại Documentation
                        </Button>
                        <Button size="large" href="/api/items" target="_blank">
                            🔗 Test API Endpoints
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
}
