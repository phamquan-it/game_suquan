'use client';

import React from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Tooltip,
    Avatar,
    Progress,
    Dropdown,
    Typography
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    MoreOutlined,
    CrownOutlined,
    TrophyOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { Alliance } from '@/types/alliance'; // Updated import path
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface AllianceTableProps {
    alliances: Alliance[];
    selectedAlliances: Alliance[];
    onSelectionChange: (alliances: Alliance[]) => void;
    onBulkAction: (action: string, allianceIds: string[]) => void;
    loading: boolean;
}

export default function AllianceTable({
    alliances,
    selectedAlliances,
    onSelectionChange,
    onBulkAction,
    loading
}: AllianceTableProps) {
    const getStatusColor = (status: Alliance['status']) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'default';
            case 'suspended': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: Alliance['status']) => {
        switch (status) {
            case 'active': return 'Đang hoạt động';
            case 'inactive': return 'Không hoạt động';
            case 'suspended': return 'Bị đình chỉ';
            default: return status;
        }
    };

    const getLevelColor = (level: number) => {
        if (level >= 9) return 'gold';
        if (level >= 7) return 'orange';
        if (level >= 5) return 'blue';
        return 'default';
    };

    const columns: ColumnsType<Alliance> = [
        {
            title: 'Liên Minh',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 200,
            render: (name: string, record: Alliance) => (
                <Space>
                    <Avatar
                        size="small"
                        style={{
                            backgroundColor: '#003366',
                            fontSize: 10,
                            fontWeight: 'bold'
                        }}
                    >
                        {record.tag}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            [{record.tag}] • {record.leader.substring(0, 8)}...
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Cấp độ',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            sorter: (a, b) => a.level - b.level,
            render: (level: number) => (
                <Tag color={getLevelColor(level)} icon={<CrownOutlined />}>
                    Cấp {level}
                </Tag>
            ),
        },
        {
            title: 'Thành viên',
            dataIndex: 'members',
            key: 'members',
            width: 150,
            sorter: (a, b) => a.members - b.members,
            render: (members: number, record: Alliance) => (
                <div>
                    <Space>
                        <TeamOutlined />
                        <Text strong>{members}</Text>
                        <Text type="secondary">/ {record.max_members}</Text>
                    </Space>
                    <Progress
                        percent={Math.round((members / record.max_members) * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor={
                            members === record.max_members ? '#DC143C' :
                                members >= record.max_members * 0.8 ? '#D4AF37' : '#2E8B57'
                        }
                    />
                </div>
            ),
        },
        {
            title: 'Sức mạnh',
            dataIndex: 'total_power',
            key: 'total_power',
            width: 120,
            sorter: (a, b) => a.total_power - b.total_power,
            render: (total_power: number) => (
                <Tooltip title={`${total_power.toLocaleString()} sức mạnh`}>
                    <div style={{ fontWeight: 600, color: '#D4AF37' }}>
                        {(total_power / 1000000).toFixed(1)}M
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Điểm chiến thắng',
            dataIndex: 'victory_points',
            key: 'victory_points',
            width: 120,
            sorter: (a, b) => a.victory_points - b.victory_points,
            render: (victory_points: number) => (
                <Space>
                    <TrophyOutlined style={{ color: '#D4AF37' }} />
                    {victory_points.toLocaleString()}
                </Space>
            ),
        },
        {
            title: 'Tỷ lệ thắng',
            dataIndex: 'win_rate',
            key: 'win_rate',
            width: 150,
            sorter: (a, b) => a.win_rate - b.win_rate,
            render: (win_rate: number) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <Progress
                            percent={Math.round(win_rate)}
                            size="small"
                            strokeColor={
                                win_rate >= 80 ? '#2E8B57' :
                                    win_rate >= 60 ? '#D4AF37' : '#DC143C'
                            }
                            showInfo={false}
                        />
                    </div>
                    <div style={{ fontSize: 12, textAlign: 'center' }}>
                        {win_rate.toFixed(1)}%
                    </div>
                </div>
            ),
        },
        {
            title: 'Lãnh thổ',
            dataIndex: 'territory',
            key: 'territory',
            width: 100,
            sorter: (a, b) => a.territory - b.territory,
            render: (territory: number) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#8B4513' }} />
                    {territory}
                </Space>
            ),
        },
        {
            title: 'Yêu cầu gia nhập',
            key: 'requirements',
            width: 180,
            render: (_: any, record: Alliance) => (
                <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Cấp {record.requirements.minLevel}+
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {(record.requirements.minPower / 1000).toFixed(0)}K+ sức mạnh
                    </Text>
                    <Tag
                        color={record.requirements.approvalRequired ? 'blue' : 'green'}
                    >
                        {record.requirements.approvalRequired ? 'Duyệt' : 'Tự do'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_date',
            key: 'created_date',
            width: 120,
            sorter: (a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
            render: (created_date: string) => (
                <Text style={{ fontSize: 12 }}>
                    {new Date(created_date).toLocaleDateString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Đang hoạt động', value: 'active' },
                { text: 'Không hoạt động', value: 'inactive' },
                { text: 'Bị đình chỉ', value: 'suspended' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: Alliance['status']) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            fixed: 'right',
            width: 100,
            render: (_, record) => {
                const actionItems = [
                    {
                        key: 'view',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                    },
                    {
                        type: 'divider' as const,
                    },
                    record.status === 'active' ? {
                        key: 'suspend',
                        label: 'Tạm đình chỉ',
                        icon: <PauseCircleOutlined />,
                        danger: true,
                    } : {
                        key: 'activate',
                        label: 'Kích hoạt',
                        icon: <PlayCircleOutlined />,
                    },
                    {
                        type: 'divider' as const,
                    },
                    {
                        key: 'disband',
                        label: 'Giải tán',
                        icon: <DeleteOutlined />,
                        danger: true,
                    },
                ];

                return (
                    <Space>
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => window.open(`/admin/alliances/${record.id}`, '_blank')}
                            />
                        </Tooltip>

                        <Dropdown
                            menu={{
                                items: actionItems,
                                onClick: ({ key }) => onBulkAction(key, [record.id]),
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                size="small"
                            />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedAlliances.map(alliance => alliance.id),
        onChange: (_: React.Key[], selectedRows: Alliance[]) => {
            onSelectionChange(selectedRows);
        },
    };

    const bulkActionItems = [
        {
            key: 'activate',
            label: 'Kích hoạt liên minh',
            icon: <PlayCircleOutlined />,
        },
        {
            key: 'suspend',
            label: 'Tạm đình chỉ',
            icon: <PauseCircleOutlined />,
            danger: true,
        },
        {
            key: 'disband',
            label: 'Giải tán liên minh',
            icon: <DeleteOutlined />,
            danger: true,
        },
    ];

    return (
        <div>
            {/* Bulk Actions Bar */}
            {selectedAlliances.length > 0 && (
                <div style={{
                    padding: '16px',
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Space>
                        <Text strong>
                            Đã chọn {selectedAlliances.length} liên minh
                        </Text>
                        <Dropdown
                            menu={{
                                items: bulkActionItems,
                                onClick: ({ key }) => onBulkAction(key, selectedAlliances.map(a => a.id)),
                            }}
                            placement="bottomLeft"
                        >
                            <Button type="primary">
                                Hành động hàng loạt
                            </Button>
                        </Dropdown>
                    </Space>

                    <Button
                        type="text"
                        onClick={() => onSelectionChange([])}
                    >
                        Bỏ chọn
                    </Button>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={alliances}
                rowSelection={rowSelection}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1500 }}
                pagination={{
                    total: alliances.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} liên minh`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                size="middle"
                style={{ marginTop: 16 }}
            />
        </div>
    );
}
