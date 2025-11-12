"use client"
import { Card, Row, Col, Typography, Divider, Tabs } from 'antd';
import SchemaDiagram from './components/SchemaDiagram';
import QueryExamples from './components/QueryExamples';
import DataModels from './components/DataModels';

const { Title, Paragraph, Text } = Typography;

export default function DatabaseAnalysisPage() {
    return (
        <div style={{ padding: '24px', background: '#F5F5DC' }}>
            <Card>
                <Title level={1}>📊 Database Structure Analysis</Title>
                <Paragraph>
                    Phân tích chi tiết cấu trúc database cho hệ thống quản lý mỹ nhân với PostgreSQL.
                </Paragraph>

                <Tabs
                    items={[
                        {
                            key: 'schema',
                            label: 'Schema Diagram',
                            children: <SchemaDiagram />,
                        },
                        {
                            key: 'queries',
                            label: 'Query Examples',
                            children: <QueryExamples />,
                        },
                        {
                            key: 'models',
                            label: 'Data Models',
                            children: <DataModels />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
