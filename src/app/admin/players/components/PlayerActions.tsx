'use client';

import React from 'react';
import { Card, Button, Space, Typography, Tag, Dropdown } from 'antd';
import {
    UserAddOutlined,
    ExportOutlined,
    MoreOutlined,
    LockOutlined,
    UnlockOutlined,
    DeleteOutlined,
    GiftOutlined,
    MessageOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface PlayerActionsProps {
    onBulkAction: (action: string, playerIds: string[]) => void;
    handelModalOpen: ()=>void;
    loading: boolean;
}

export default function PlayerActions({
    onBulkAction,
    loading,
    handelModalOpen
}: PlayerActionsProps) {

    const bulkActionItems = [
        {
            key: 'ban',
            label: 'Cấm người chơi',
            icon: <LockOutlined />,
            danger: true,
        },
        {
            key: 'unban',
            label: 'Bỏ cấm',
            icon: <UnlockOutlined />,
        },
        {
            key: 'delete',
            label: 'Xóa tài khoản',
            icon: <DeleteOutlined />,
            danger: true,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'gift',
            label: 'Gửi quà tặng',
            icon: <GiftOutlined />,
        },
        {
            key: 'message',
            label: 'Gửi tin nhắn',
            icon: <MessageOutlined />,
        },
    ];

    return (
        <Card variant="borderless" styles={{ body: { padding: '16px' } }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                    <Button
                        onClick={handelModalOpen}
                        type="primary"
                        icon={<UserAddOutlined />}
                        style={{ background: '#8B0000', borderColor: '#8B0000' }}
                    >
                        Thêm Người Chơi
                    </Button>

                    <Button
                        icon={<ExportOutlined />}
                    >
                        Xuất Excel
                    </Button>
                </Space>

                <Space>
                    <Text type="secondary">
                        Tổng: 15,247 người chơi
                    </Text>
                </Space>
            </Space>
        </Card>
    );
}
