'use client';

import React from 'react';
import { Table, Card, Tag, Space, Typography, Button, Badge } from 'antd';
import { 
    TeamOutlined, 
    CrownOutlined,
    UserOutlined,
    LockOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useChatGroups } from '@/lib/hooks/admin/hooks/useChat';
import { ChatGroup } from '@/lib/types/chat.types';

const { Text } = Typography;

export default function GroupsManagementTab() {
    const { data: groups, isFetching } = useChatGroups();

    const typeConfig = {
        public: { color: 'green', icon: <GlobalOutlined />, text: 'Công khai' },
        private: { color: 'orange', icon: <LockOutlined />, text: 'Riêng tư' },
        alliance: { color: 'blue', icon: <TeamOutlined />, text: 'Liên minh' }
    };

    const columns = [
        {
            title: 'Tên nhóm',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: ChatGroup) => (
                <Space>
                    <Text strong>{name}</Text>
                    {!record.is_active && <Badge status="error" text="Inactive" />}
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const config = typeConfig[type as keyof typeof typeConfig];
                return (
                    <Tag icon={config.icon} color={config.color}>
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Chủ sở hữu',
            dataIndex: 'owner',
            key: 'owner',
            render: (owner: any) => (
                <Space>
                    <CrownOutlined style={{ color: '#d4af37' }} />
                    <Text>{owner?.username}</Text>
                </Space>
            ),
        },
        {
            title: 'Thành viên',
            dataIndex: 'member_count',
            key: 'members',
            render: (count: number, record: ChatGroup) => (
                <Space>
                    <UserOutlined />
                    <Text>{count} / {record.max_members}</Text>
                </Space>
            ),
            sorter: (a: ChatGroup, b: ChatGroup) => (a.member_count || 0) - (b.member_count || 0),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (desc: string) => (
                <Text type="secondary" ellipsis={{ tooltip: desc }}>
                    {desc || 'Không có mô tả'}
                </Text>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: ChatGroup, b: ChatGroup) => 
                dayjs(a.created_date).unix() - dayjs(b.created_date).unix(),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: ChatGroup) => (
                <Space>
                    <Button type="link">Xem thành viên</Button>
                    <Button type="link">Chi tiết</Button>
                    {record.is_active ? (
                        <Button danger>Vô hiệu hóa</Button>
                    ) : (
                        <Button type="primary">Kích hoạt</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card>
                <Table
                    columns={columns}
                    dataSource={groups}
                    rowKey="id"
                    loading={isFetching}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                    }}
                />
            </Card>
        </div>
    );
}
