'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Typography, Statistic } from 'antd';
import {
    MessageOutlined,
    TeamOutlined,
    UserOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { useChatConnections, useChatGroups, useChatMessages, useDirectTrades, useFriendRelationships } from '@/lib/hooks/admin/hooks/useChat';
import ConnectionsTab from './ConnectionsTab';
import TradesManagementTab from './TradesManagementTab';
import GroupsManagementTab from './GroupsManagementTab';
import MessagesManagementTab from './MessagesManagementTab';
import ChatOverviewTab from './ChatOverviewTab';

const { Title } = Typography;

export default function ChatManagementPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const { data: connections, isFetching: connectionsLoading } = useChatConnections();
    const { data: messages, isFetching: messagesLoading } = useChatMessages();
    const { data: groups, isFetching: groupsLoading } = useChatGroups();
    const { data: friends, isFetching: friendsLoading } = useFriendRelationships();
    const { data: trades, isFetching: tradesLoading } = useDirectTrades();

    // Thống kê
    const onlineUsers = connections?.filter(c => c.status === 'online').length || 0;
    const totalMessages = messages?.length || 0;
    const activeGroups = groups?.filter(g => g.is_active).length || 0;
    const pendingTrades = trades?.filter(t => t.status === 'pending').length || 0;

    return (
        <div className="chat-management-page">
            <Title level={2} style={{ color: '#8B4513' }}>
                Quản lý Chat & Giao dịch
            </Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Người dùng Online"
                            value={onlineUsers}
                            prefix={<LinkOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Tin nhắn (24h)"
                            value={totalMessages}
                            prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Nhóm chat"
                            value={activeGroups}
                            prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Giao dịch chờ"
                            value={pendingTrades}
                            prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Tabs */}
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    size="large"
                    items={[
                        {
                            key: 'overview',
                            label: (
                                <span>
                                    <UserOutlined />
                                    Tổng quan
                                </span>
                            ),
                            children: <ChatOverviewTab />
                        },
                        {
                            key: 'messages',
                            label: (
                                <span>
                                    <MessageOutlined />
                                    Tin nhắn
                                </span>
                            ),
                            children: <MessagesManagementTab />
                        },
                        {
                            key: 'groups',
                            label: (
                                <span>
                                    <TeamOutlined />
                                    Nhóm chat
                                </span>
                            ),
                            children: <GroupsManagementTab />
                        },
                        {
                            key: 'connections',
                            label: (
                                <span>
                                    <LinkOutlined />
                                    Kết nối
                                </span>
                            ),
                            children: <ConnectionsTab />
                        },
                        {
                            key: 'trades',
                            label: (
                                <span>
                                    <TeamOutlined />
                                    Giao dịch
                                </span>
                            ),
                            children: <TradesManagementTab />
                        }
                    ]}
                />
            </Card>
        </div>
    );
}

// Các tab components sẽ được implement trong các file riêng
