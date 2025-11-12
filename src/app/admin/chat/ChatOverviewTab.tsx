'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Typography, Tag, Space } from 'antd';
import { 
    MessageOutlined, 
    TeamOutlined, 
    UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChatConnections, useChatGroups, useChatMessages, useDirectTrades } from '@/lib/hooks/admin/hooks/useChat';

const {  Text } = Typography;

export default function ChatOverviewTab() {
    const { data: connections } = useChatConnections();
    const { data: messages } = useChatMessages();
    const { data: groups } = useChatGroups();
    const { data: trades } = useDirectTrades();

    // Calculate stats
    const onlineUsers = connections?.filter(c => c.status === 'online').length || 0;
    const totalUsers = connections?.length || 0;
    const todayMessages = messages?.filter(m => 
        dayjs(m.created_date).isSame(dayjs(), 'day')
    ).length || 0;
    const activeGroups = groups?.filter(g => g.is_active).length || 0;
    const pendingTrades = trades?.filter(t => t.status === 'pending').length || 0;

    // Recent activities
    const recentMessages = messages?.slice(0, 5) || [];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Online Users"
                            value={onlineUsers}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<UserOutlined />}
                            suffix={`/ ${totalUsers}`}
                        />
                        <Progress 
                            percent={Math.round((onlineUsers / totalUsers) * 100)} 
                            size="small" 
                            status="active"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tin nhắn hôm nay"
                            value={todayMessages}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <Text type="secondary">+12% so với hôm qua</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Nhóm hoạt động"
                            value={activeGroups}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Giao dịch chờ"
                            value={pendingTrades}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="Tin nhắn gần đây" size="small">
                        <List
                            dataSource={recentMessages}
                            renderItem={(message) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                <Text strong>{message.sender?.username}</Text>
                                                <Tag color="blue">{message.channel_type}</Tag>
                                            </Space>
                                        }
                                        description={
                                            <Text ellipsis={{ tooltip: message.content }}>
                                                {message.content}
                                            </Text>
                                        }
                                    />
                                    <Text type="secondary">
                                        {dayjs(message.created_date).format('HH:mm')}
                                    </Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Thống kê kênh chat" size="small">
                        <List
                            dataSource={[
                                { channel: 'World Chat', count: messages?.filter(m => m.channel_type === 'world').length || 0 },
                                { channel: 'Alliance', count: messages?.filter(m => m.channel_type === 'alliance').length || 0 },
                                { channel: 'Group', count: messages?.filter(m => m.channel_type === 'group').length || 0 },
                                { channel: 'Private', count: messages?.filter(m => m.channel_type === 'private').length || 0 },
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <Text>{item.channel}</Text>
                                    <Text strong>{item.count}</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
