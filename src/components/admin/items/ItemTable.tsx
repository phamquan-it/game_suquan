'use client';

import React from 'react';
import { Table, Button, Space, Tag, Image, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { BaseItem } from '@/lib/types/items';
import { getRarityColor, getRarityText, getTypeColor, getTypeText, formatItemValue } from '@/lib/utils/item-utils';

const { Column } = Table;

interface ItemTableProps {
    items: BaseItem[];
    loading: boolean;
    onEdit: (item: BaseItem) => void;
    onDelete: (itemId: string) => void;
}

export default function ItemTable({ items, loading, onEdit, onDelete }: ItemTableProps) {
    const handleView = (item: BaseItem) => {
        // TODO: Implement view details
        console.log('View item:', item);
    };

    return (
        <Table
            dataSource={items}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} vật phẩm`
            }}
        >
            <Column
                title="Thông Tin"
                key="info"
                fixed="left"
                width={300}
                render={(item: BaseItem) => (
                    <Space>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                                {item.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#666' }}>
                                {item.description}
                            </div>
                        </div>
                    </Space>
                )}
            />
            <Column
                title="Loại"
                key="type"
                width={120}
                render={(item: BaseItem) => (
                    <Tag color={getTypeColor(item.type)}>
                        {getTypeText(item.type)}
                    </Tag>
                )}
            />
            <Column
                title="Độ Hiếm"
                key="rarity"
                width={120}
                render={(item: BaseItem) => (
                    <Tag color={getRarityColor(item.rarity)}>
                        {getRarityText(item.rarity)}
                    </Tag>
                )}
            />
            <Column
                title="Cấp Yêu Cầu"
                dataIndex="levelRequirement"
                key="levelRequirement"
                width={120}
                render={(level: number) => (
                    <Tag color={level > 50 ? 'red' : level > 30 ? 'orange' : 'blue'}>
                        Lv. {level}
                    </Tag>
                )}
            />
            <Column
                title="Giá Trị"
                key="value"
                width={120}
                render={(item: BaseItem) => (
                    <span style={{ fontWeight: 'bold', color: '#faad14' }}>
                        {formatItemValue(item.baseValue)}
                    </span>
                )}
            />
            <Column
                title="Trạng Thái"
                key="status"
                width={120}
                render={(item: BaseItem) => (
                    <Tag color={item.status === 'active' ? 'green' : item.status === 'testing' ? 'orange' : 'red'}>
                        {item.status === 'active' ? 'Hoạt động' :
                            item.status === 'testing' ? 'Đang thử' : 'Ngừng hoạt động'}
                    </Tag>
                )}
            />
            <Column
                title="Giao Dịch"
                key="trading"
                width={150}
                render={(item: BaseItem) => (
                    <Space size="small">
                        <Tag color={item.isTradable ? 'green' : 'red'}>
                            {item.isTradable ? 'Có thể giao dịch' : 'Không giao dịch'}
                        </Tag>
                        <Tag color={item.isSellable ? 'blue' : 'red'}>
                            {item.isSellable ? 'Có thể bán' : 'Không bán'}
                        </Tag>
                    </Space>
                )}
            />
            <Column
                title="Thao Tác"
                key="actions"
                fixed="right"
                width={150}
                render={(item: BaseItem) => (
                    <Space size="small">
                        <Tooltip title="Xem chi tiết">
                            <Button
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => handleView(item)}
                            />
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => onEdit(item)}
                            />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                onClick={() => onDelete(item.id)}
                                disabled={!item.isDestroyable}
                            />
                        </Tooltip>
                    </Space>
                )}
            />
        </Table>
    );
}
