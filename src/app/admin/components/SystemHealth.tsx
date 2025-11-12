"use client"
import React from 'react';
import { Card, Progress, Row, Col, Typography, Tag } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const systemMetrics = [
    { name: 'CPU Usage', value: 45, status: 'healthy' as const },
    { name: 'Memory', value: 68, status: 'warning' as const },
    { name: 'Storage', value: 32, status: 'healthy' as const },
    { name: 'Network', value: 82, status: 'critical' as const },
];

const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
        case 'healthy': return '#2E8B57';
        case 'warning': return '#FF8C00';
        case 'critical': return '#DC143C';
    }
};

const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
        case 'healthy': return <CheckCircleOutlined style={{ color: '#2E8B57' }} />;
        case 'warning': return <ExclamationCircleOutlined style={{ color: '#FF8C00' }} />;
        case 'critical': return <CloseCircleOutlined style={{ color: '#DC143C' }} />;
    }
};

export default function SystemHealth() {
    return (
        <Card
            title="Sức Khỏe Hệ Thống"
            variant="borderless"
            style={{ height: '100%' }}
        >
            <div style={{ marginBottom: 16 }}>
                <Tag
                    color="green"
                    icon={<CheckCircleOutlined />}
                    style={{ marginBottom: 8 }}
                >
                    Tất cả hệ thống hoạt động bình thường
                </Tag>
                <Text type="secondary">Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</Text>
            </div>

            {systemMetrics.map((metric, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text>{metric.name}</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Text strong>{metric.value}%</Text>
                            {getStatusIcon(metric.status)}
                        </div>
                    </div>
                    <Progress
                        percent={metric.value}
                        strokeColor={getStatusColor(metric.status)}
                        showInfo={false}
                    />
                </div>
            ))}

            <Row gutter={8} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={4} style={{ margin: 0, color: '#2E8B57' }}>99.8%</Title>
                        <Text type="secondary">Uptime</Text>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={4} style={{ margin: 0, color: '#1E90FF' }}>45ms</Title>
                        <Text type="secondary">Ping</Text>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
