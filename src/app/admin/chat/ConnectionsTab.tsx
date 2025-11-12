'use client';

import React from 'react';
import { Table, Card, Tag, Space, Typography, Progress } from 'antd';
import { 
    MobileOutlined, 
    DesktopOutlined,
    ClockCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChatConnections } from '@/lib/hooks/admin/hooks/useChat';
import { ChatConnection } from '@/lib/types/chat.types';

const { Text } = Typography;

export default function ConnectionsTab() {
    const { data: connections, isFetching } = useChatConnections();

    const statusConfig = {
        online: { color: 'green', text: 'Online' },
        away: { color: 'orange', text: 'Away' },
        dnd: { color: 'red', text: 'Do Not Disturb' },
        offline: { color: 'default', text: 'Offline' }
    };

    const columns = [
        {
            title: 'Người chơi',
            dataIndex: 'player',
            key: 'player',
            render: (player: any) => (
                <Space>
                    <Text strong>{player?.username || 'Unknown'}</Text>
                    <Tag>Lv. {player?.level || 0}</Tag>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Thiết bị',
            dataIndex: 'device_info',
            key: 'device',
            render: (device: any) => (
                <Space>
                    {device?.isMobile ? <MobileOutlined /> : <DesktopOutlined />}
                    <Text>{device?.platform} - {device?.browser}</Text>
                </Space>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            render: (date: string) => (
                <Space>
                    <ClockCircleOutlined />
                    {dayjs(date).format('DD/MM/YYYY HH:mm')}
                </Space>
            ),
            sorter: (a: ChatConnection, b: ChatConnection) => 
                dayjs(a.last_seen).unix() - dayjs(b.last_seen).unix(),
        },
    ];

    const onlineCount = connections?.filter(c => c.status === 'online').length || 0;
    const totalCount = connections?.length || 0;
    const onlinePercentage = totalCount > 0 ? (onlineCount / totalCount) * 100 : 0;

    return (
        <div>
            {/* Connection Stats */}
            <Card style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Tổng số kết nối: </Text>
                        <Text>{totalCount}</Text>
                    </div>
                    <div>
                        <Text strong>Online: </Text>
                        <Text type="success">{onlineCount}</Text>
                        <Text> / </Text>
                        <Text>{totalCount}</Text>
                    </div>
                    <Progress 
                        percent={Math.round(onlinePercentage)} 
                        status="active"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </Space>
            </Card>

            {/* Connections Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={connections}
                    rowKey="id"
                    loading={isFetching}
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                    }}
                />
            </Card>
        </div>
    );
}
