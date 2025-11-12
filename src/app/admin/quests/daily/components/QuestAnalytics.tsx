'use client';

import React from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Progress,
    List,
    Statistic,
    Space,
    Tag
} from 'antd';
import {
    UserOutlined,
    BarChartOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { DailyQuest, QuestStats } from '@/lib/types/quest.types';

const { Text } = Typography;

interface QuestAnalyticsProps {
    stats: QuestStats;
    quests: DailyQuest[];
}

export default function QuestAnalytics({ stats, quests }: QuestAnalyticsProps) {
    const getCompletionRateColor = (rate: number) => {
        if (rate >= 80) return '#2E8B57';
        if (rate >= 60) return '#D4AF37';
        return '#DC143C';
    };

    const getEngagementColor = (rate: number) => {
        if (rate >= 80) return '#2E8B57';
        if (rate >= 60) return '#D4AF37';
        return '#DC143C';
    };

    // Calculate quest performance
    const questPerformance = quests.map(quest => ({
        ...quest,
        completionRate: (quest.current_completions / quest.max_completions) * 100
    })).sort((a, b) => b.completionRate - a.completionRate);

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Performance Overview */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Hiệu Suất Tổng Quan" variant="borderless">
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <Text strong>Tỷ lệ hoàn thành: </Text>
                                <Progress
                                    percent={stats.completionRate}
                                    strokeColor={getCompletionRateColor(stats.completion_rate)}
                                    format={percent => `${percent}%`}
                                />
                            </div>

                            <div>
                                <Text strong>Tương tác người chơi: </Text>
                                <Progress
                                    percent={stats.playerEngagement}
                                    strokeColor={getEngagementColor(stats.playerEngagement)}
                                    format={percent => `${percent}%`}
                                />
                            </div>

                            <div>
                                <Text strong>Nhiệm vụ hoàn thành hôm nay: </Text>
                                <Text strong style={{ color: '#D4AF37' }}>
                                    {(stats?.completed_today ?? 0).toLocaleString()}
                                </Text>
                            </div>

                            <div>
                                <Text strong>Tổng phần thưởng đã phân phối: </Text>
                                <Text strong style={{ color: '#2E8B57' }}>
                                    ₫{(stats?.total_rewards ?? 0).toLocaleString()}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Nhiệm Vụ Phổ Biến" variant="borderless">
                        <List
                            dataSource={stats.popularQuests}
                            renderItem={(quest, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                background: '#8B0000',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </div>
                                        }
                                        title={quest.name}
                                        description={
                                            <Space>
                                                <Text type="secondary">
                                                    {quest.completions.toLocaleString()} lượt hoàn thành
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quest Performance Ranking */}
            <Card title="Xếp Hạng Hiệu Suất Nhiệm Vụ" variant="borderless">
                <List
                    dataSource={questPerformance}
                    renderItem={(quest, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: index < 3 ? '#D4AF37' : '#8B0000',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}>
                                        {index + 1}
                                    </div>
                                }
                                title={
                                    <Space>
                                        <Text strong>{quest.name}</Text>
                                        <Tag color={quest.status === 'active' ? 'green' : 'red'}>
                                            {quest.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">{quest.description}</Text>
                                        <Space>
                                            <Progress
                                                percent={Math.round(quest.completionRate)}
                                                size="small"
                                                style={{ width: 200 }}
                                                showInfo={false}
                                            />
                                            <Text type="secondary">
                                                {quest.current_completions.toLocaleString()}/{quest.max_completions.toLocaleString()}
                                            </Text>
                                        </Space>
                                    </Space>
                                }
                            />
                            <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ color: getCompletionRateColor(quest.completionRate) }}>
                                    {Math.round(quest.completionRate)}%
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Tỷ lệ hoàn thành
                                </Text>
                            </div>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Additional Metrics */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Thời gian hoạt động TB"
                            value={18.5}
                            suffix="giờ"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#2E8B57' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Người chơi tham gia"
                            value={18500}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Tỷ lệ giữ chân"
                            value={76.8}
                            suffix="%"
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#D4AF37' }}
                        />
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}
