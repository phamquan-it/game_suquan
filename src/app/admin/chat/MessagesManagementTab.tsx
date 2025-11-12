'use client';

import React, { useState } from 'react';
import {
    Table,
    Card,
    Input,
    Select,
    DatePicker,
    Button,
    Tag,
    Space,
    Modal,
    message,
    Popconfirm,
    Typography
} from 'antd';
import {
    SearchOutlined,
    DeleteOutlined,
    EyeOutlined,
    BankOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ChatMessage } from '@/lib/types/chat.types';
import { useBanUser, useChatMessages, useDeleteMessage } from '@/lib/hooks/admin/hooks/useChat';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

export default function MessagesManagementTab() {
    const [filters, setFilters] = useState({
        channel_type: undefined as string | undefined,
        player_id: undefined as string | undefined,
        date_range: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined
    });
    const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const { data: messages, isFetching } = useChatMessages({
        channel_type: filters.channel_type,
        player_id: filters.player_id,
        date_from: filters.date_range?.[0]?.toISOString(),
        date_to: filters.date_range?.[1]?.toISOString()
    });

    const deleteMessageMutation = useDeleteMessage();
    const banUserMutation = useBanUser();

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessageMutation.mutateAsync(messageId);
            message.success('Đã xóa tin nhắn thành công');
        } catch (error) {
            message.error('Lỗi khi xóa tin nhắn');
        }
    };

    const handleBanUser = async (playerId: string) => {
        try {
            await banUserMutation.mutateAsync(playerId);
            message.success('Đã ban người dùng thành công');
        } catch (error) {
            message.error('Lỗi khi ban người dùng');
        }
    };

    const columns = [
        {
            title: 'Người gửi',
            dataIndex: 'sender',
            key: 'sender',
            render: (sender: any) => (
                <Text strong>{sender?.username || 'Unknown'}</Text>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (content: string, record: ChatMessage) => (
                <div style={{ maxWidth: 300 }}>
                    <Text 
                        type={record.is_deleted ? 'secondary' : undefined}
                        delete={record.is_deleted}
                    >
                        {content}
                    </Text>
                    {record.is_edited && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>Đã chỉnh sửa</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Kênh',
            dataIndex: 'channel_type',
            key: 'channel_type',
            render: (type: string, record: ChatMessage) => {
                const channelConfig = {
                    world: { color: 'green', text: 'World' },
                    alliance: { color: 'blue', text: 'Alliance' },
                    group: { color: 'purple', text: 'Group' },
                    private: { color: 'orange', text: 'Private' }
                };
                const config = channelConfig[type as keyof typeof channelConfig] || { color: 'default', text: type };
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a: ChatMessage, b: ChatMessage) => 
                dayjs(a.created_date).unix() - dayjs(b.created_date).unix(),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: ChatMessage) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedMessage(record);
                            setDetailModalVisible(true);
                        }}
                    >
                        Chi tiết
                    </Button>
                    
                    {!record.is_deleted && (
                        <Popconfirm
                            title="Xóa tin nhắn này?"
                            onConfirm={() => handleDeleteMessage(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    )}

                    <Popconfirm
                        title="Ban người dùng này?"
                        onConfirm={() => handleBanUser(record.sender_id)}
                        okText="Ban"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<BankOutlined />}>
                            Ban
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Select
                        placeholder="Loại kênh"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(value) => setFilters(prev => ({ ...prev, channel_type: value }))}
                    >
                        <Option value="world">World Chat</Option>
                        <Option value="alliance">Alliance</Option>
                        <Option value="group">Group</Option>
                        <Option value="private">Private</Option>
                    </Select>

                    <Input
                        placeholder="Tìm theo người gửi..."
                        style={{ width: 200 }}
                        onChange={(e) => setFilters(prev => ({ ...prev, player_id: e.target.value }))}
                    />

                    <RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        onChange={(dates) => setFilters(prev => ({ 
                            ...prev, 
                            date_range: dates as [dayjs.Dayjs, dayjs.Dayjs] 
                        }))}
                    />

                    <Button 
                        type="primary" 
                        icon={<SearchOutlined />}
                        loading={isFetching}
                    >
                        Tìm kiếm
                    </Button>
                </Space>
            </Card>

            {/* Messages Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={messages}
                    rowKey="id"
                    loading={isFetching}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} tin nhắn`
                    }}
                />
            </Card>

            {/* Message Detail Modal */}
            <Modal
                title="Chi tiết tin nhắn"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
            >
                {selectedMessage && (
                    <div>
                        <p><strong>Người gửi:</strong> {selectedMessage.sender?.username}</p>
                        <p><strong>Kênh:</strong> {selectedMessage.channel_type}</p>
                        <p><strong>Thời gian:</strong> {dayjs(selectedMessage.created_date).format('DD/MM/YYYY HH:mm:ss')}</p>
                        <p><strong>Nội dung:</strong></p>
                        <Card 
                            style={{ 
                                backgroundColor: '#f5f5dc',
                                borderColor: '#d4af37'
                            }}
                        >
                            {selectedMessage.content}
                        </Card>
                        {selectedMessage.metadata && Object.keys(selectedMessage.metadata).length > 0 && (
                            <>
                                <p><strong>Metadata:</strong></p>
                                <pre>{JSON.stringify(selectedMessage.metadata, null, 2)}</pre>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
