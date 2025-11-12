'use client';

import React from 'react';
import { Table, Card, Tag, Space, Typography, Button, Popconfirm, message } from 'antd';
import {
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDirectTrades } from '@/lib/hooks/admin/hooks/useChat';
import { DirectTrade } from '@/lib/types/chat.types';

const { Title, Text } = Typography;

export default function TradesManagementTab() {
    const { data: trades, isFetching } = useDirectTrades();

    const statusConfig = {
        pending: { color: 'orange', text: 'Chờ xử lý' },
        accepted: { color: 'blue', text: 'Đã chấp nhận' },
        confirmed: { color: 'cyan', text: 'Đã xác nhận' },
        completed: { color: 'green', text: 'Hoàn thành' },
        cancelled: { color: 'red', text: 'Đã hủy' },
        expired: { color: 'default', text: 'Hết hạn' }
    };

    const handleCancelTrade = async (tradeId: string) => {
        // Implement cancel trade logic
        message.success('Đã hủy giao dịch:' + tradeId);
    };

    const columns = [
        {
            title: 'Người khởi tạo',
            dataIndex: 'initiator',
            key: 'initiator',
            render: (initiator: any) => (
                <Text strong>{initiator?.username}</Text>
            ),
        },
        {
            title: 'Người nhận',
            dataIndex: 'recipient',
            key: 'recipient',
            render: (recipient: any) => (
                <Text strong>{recipient?.username}</Text>
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
            title: 'Items Trao đổi',
            key: 'items',
            render: (_: any, record: DirectTrade) => (
                <Space direction="vertical" size="small">
                    <div>
                        <Text type="secondary">Từ {record.initiator?.username}:</Text>
                        <div>
                            {record.initiator_items.map((item: any, index: number) => (
                                <Tag key={index} color="blue">
                                    {item.metadata?.name} x{item.quantity}
                                </Tag>
                            ))}
                            {record.initiator_currency.map((currency: any, index: number) => (
                                <Tag key={index} color="gold">
                                    {currency.amount} {currency.currency_type}
                                </Tag>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Text type="secondary">Từ {record.recipient?.username}:</Text>
                        <div>
                            {record.recipient_items.map((item: any, index: number) => (
                                <Tag key={index} color="green">
                                    {item.metadata?.name} x{item.quantity}
                                </Tag>
                            ))}
                            {record.recipient_currency.map((currency: any, index: number) => (
                                <Tag key={index} color="gold">
                                    {currency.amount} {currency.currency_type}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Hết hạn',
            dataIndex: 'expired_date',
            key: 'expired_date',
            render: (date: string) => {
                const isExpired = dayjs().isAfter(dayjs(date));
                return (
                    <Text type={isExpired ? 'danger' : 'secondary'}>
                        {dayjs(date).format('DD/MM/YYYY HH:mm')}
                    </Text>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: DirectTrade) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            // Show trade details
                        }}
                    >
                        Chi tiết
                    </Button>

                    {record.status === 'pending' && (
                        <Popconfirm
                            title="Hủy giao dịch này?"
                            icon={<ExclamationCircleOutlined />}
                            onConfirm={() => handleCancelTrade(record.id)}
                        >
                            <Button danger icon={<CloseOutlined />}>
                                Hủy
                            </Button>
                        </Popconfirm>
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
                    dataSource={trades}
                    rowKey="id"
                    loading={isFetching}
                    scroll={{ x: 1200 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                    }}
                    expandable={{
                        expandedRowRender: (record: DirectTrade) => (
                            <div style={{ margin: 0 }}>
                                <Title level={5}>Thông tin bổ sung</Title>
                                <p><strong>Tin nhắn giao dịch:</strong> {record.trade_message || 'Không có'}</p>
                                <p><strong>Thời gian tạo:</strong> {dayjs(record.created_date).format('DD/MM/YYYY HH:mm:ss')}</p>
                                {record.completed_date && (
                                    <p><strong>Thời gian hoàn thành:</strong> {dayjs(record.completed_date).format('DD/MM/YYYY HH:mm:ss')}</p>
                                )}
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
}
