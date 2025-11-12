'use client';

import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    FireOutlined,
    DollarOutlined
} from '@ant-design/icons';
import OverviewStats from './components/OverviewStats';
import SystemHealth from './components/SystemHealth';
import QuickActions from './components/QuickActions';
import RealTimeChart from '@/components/admin/charts/RealTimeChart';

const { Title } = Typography;

export default function DashboardPage() {
    return (
        <div>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Tổng Quan Hệ Thống
            </Title>

            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <OverviewStats
                        title="Tổng Người Chơi"
                        value="15,247"
                        icon={<UserOutlined />}
                        color="#8B0000"
                        trend={{ value: 12.5, isPositive: true }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <OverviewStats
                        title="Liên Minh"
                        value="892"
                        icon={<TeamOutlined />}
                        color="#003366"
                        trend={{ value: 8.3, isPositive: true }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <OverviewStats
                        title="Trận Chiến Hôm Nay"
                        value="3,456"
                        icon={<FireOutlined />}
                        color="#DC143C"
                        trend={{ value: 15.2, isPositive: true }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <OverviewStats
                        title="Doanh Thu"
                        value="₫125M"
                        icon={<DollarOutlined />}
                        color="#2E8B57"
                        trend={{ value: 5.7, isPositive: true }}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Biểu đồ thời gian thực */}
                <Col xs={24} lg={16}>
                    <Card
                        title="Hoạt Động Người Chơi Theo Thời Gian Thực"
                        variant={"borderless"}
                        style={{ height: '100%' }}
                    >
                        <RealTimeChart />
                    </Card>
                </Col>

                {/* Sức khỏe hệ thống */}
                <Col xs={24} lg={8}>
                    <SystemHealth />
                </Col>
            </Row>

            {/* Hành động nhanh */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24}>
                    <QuickActions />
                </Col>
            </Row>
        </div>
    );
}
