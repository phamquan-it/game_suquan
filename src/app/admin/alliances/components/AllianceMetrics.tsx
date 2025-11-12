'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import {
    TeamOutlined,
    CrownOutlined,
    TrophyOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface AllianceMetricsProps {
    metrics: {
        totalAlliances: number;
        activeAlliances: number;
        totalMembers: number;
        totalPower: number;
        avgWinRate: number;
    };
}

export default function AllianceMetrics({ metrics }: AllianceMetricsProps) {
    const {
        totalAlliances,
        activeAlliances,
        totalMembers,
        totalPower,
        avgWinRate,
    } = metrics;

    const activeRate = (activeAlliances / totalAlliances) * 100;

    return (
        <Card
            variant="borderless"
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                    <Card
                        size="small"
                        variant="borderless"
                        style={{
                            background: 'linear-gradient(135deg, #00336620, #00336610)',
                            border: '1px solid #00336630',
                        }}
                    >
                        <Statistic
                            title="Tổng Liên Minh"
                            value={totalAlliances}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#003366' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                Đang hoạt động: {activeAlliances}
                            </Text>
                            <Progress
                                percent={Math.round(activeRate)}
                                size="small"
                                strokeColor="#003366"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={6}>
                    <Card
                        size="small"
                        variant="borderless"
                        style={{
                            background: 'linear-gradient(135deg, #8B000020, #8B000010)',
                            border: '1px solid #8B000030',
                        }}
                    >
                        <Statistic
                            title="Tổng Thành Viên"
                            value={totalMembers}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#8B0000' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                Trung bình: {Math.round(totalMembers / totalAlliances)}/liên minh
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={6}>
                    <Card
                        size="small"
                        variant="borderless"
                        style={{
                            background: 'linear-gradient(135deg, #D4AF3720, #D4AF3710)',
                            border: '1px solid #D4AF3730',
                        }}
                    >
                        <Statistic
                            title="Tổng Sức Mạnh"
                            value={(totalPower / 1000000).toFixed(1)}
                            suffix="M"
                            prefix={<CrownOutlined />}
                            valueStyle={{ color: '#D4AF37' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                Trung bình: {((totalPower / totalAlliances) / 1000000).toFixed(1)}M
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={6}>
                    <Card
                        size="small"
                        variant="borderless"
                        style={{
                            background: 'linear-gradient(135deg, #2E8B5720, #2E8B5710)',
                            border: '1px solid #2E8B5730',
                        }}
                    >
                        <Statistic
                            title="Tỷ Lệ Thắng TB"
                            value={avgWinRate}
                            precision={1}
                            suffix="%"
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#2E8B57' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                                <BarChartOutlined /> Hiệu suất tổng
                            </Text>
                            <Progress
                                percent={Math.round(avgWinRate)}
                                size="small"
                                strokeColor={
                                    avgWinRate >= 80 ? '#2E8B57' :
                                        avgWinRate >= 60 ? '#D4AF37' : '#DC143C'
                                }
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
}
