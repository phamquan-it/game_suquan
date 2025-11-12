// components/admin/loot-box/LootBoxList.tsx
import React from 'react';
import { Card, Table, Tag, Progress, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, GiftOutlined } from '@ant-design/icons';
import { LootBox } from '@/lib/types/loot-box';
import { getBoxTypeColor, getBoxTypeLabel, getCurrencyLabel, getRarityColor, getRarityLabel, getTierColor, getTierLabel } from './helpers';

interface LootBoxListProps {
    lootBoxes: LootBox[];
    onViewDetails: (lootBox: LootBox) => void;
    onEdit: (lootBox: LootBox) => void;
}

export const LootBoxList: React.FC<LootBoxListProps> = ({
    lootBoxes,
    onViewDetails,
    onEdit
}) => {
    const columns = [
        {
            title: 'Tên Rương',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: LootBox) => (
                <Space>
                    <img
                        src={record.icon}
                        alt={name}
                        style={{ width: 32, height: 32, borderRadius: 4 }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {record.description}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'boxType',
            key: 'boxType',
            render: (type: string) => (
                <Tag color={getBoxTypeColor(type)}>
                    {getBoxTypeLabel(type)}
                </Tag>
            ),
        },
        {
            title: 'Cấp độ',
            dataIndex: 'tier',
            key: 'tier',
            render: (tier: string) => (
                <Tag color={getTierColor(tier)}>
                    {getTierLabel(tier)}
                </Tag>
            ),
        },
        {
            title: 'Độ hiếm',
            dataIndex: 'rarity',
            key: 'rarity',
            render: (rarity: string) => (
                <Tag color={getRarityColor(rarity)}>
                    {getRarityLabel(rarity)}
                </Tag>
            ),
        },
        {
            title: 'Chi phí mở',
            key: 'openCost',
            render: (record: LootBox) => (
                <div>
                    {record.open_cost_amount} {getCurrencyLabel(record.open_cost_currency)}
                </div>
            ),
        },
        {
            title: 'Giới hạn',
            key: 'limits',
            render: (record: LootBox) => (
                <div style={{ fontSize: 12 }}>
                    {//record.loot_box_limits.daily_limit && `Hàng ngày: ${loot_box_limits.daily_limit}`
                    }
                    {//record.openLimits.weekly && ` • Tuần: ${record.openLimits.weekly}`
                    }
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Ẩn'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (record: LootBox) => (
                <Space>
                    <Tooltip title="Xem chi tiết vật phẩm">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(record)}
                        >
                            Vật phẩm
                        </Button>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Quản lý Rương Quà"
            extra={
                <Button type="primary" icon={<GiftOutlined />}>
                    Thêm Rương Mới
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={lootBoxes}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

;
