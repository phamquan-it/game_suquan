'use client';

import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Progress, Avatar, Badge } from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    CrownOutlined,
    TrophyOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { Player } from '@/types/player';
import type { ColumnsType } from 'antd/es/table';
import { Sword } from 'lucide-react';

interface PlayerTableProps {
    players: Player[];
    selectedPlayers: Player[];
    onSelectionChange: (players: Player[]) => void;
    loading?: boolean;
    onViewDetails?: (player: Player) => void;
    onEditPlayer?: (player: Player) => void;
    totalCount?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function PlayerTable({
    players,
    selectedPlayers,
    onSelectionChange,
    loading = false,
    onViewDetails,
    onEditPlayer,
    totalCount = 0,
    currentPage = 1,
    pageSize = 10,
    onPageChange
}: PlayerTableProps) {
    const getStatusColor = (status: Player['status']) => {
        switch (status) {
            case 'online': return 'green';
            case 'offline': return 'default';
            case 'banned': return 'red';
            case 'suspended': return 'orange';
            default: return 'default';
        }
    };

    const getStatusText = (status: Player['status']) => {
        switch (status) {
            case 'online': return 'Đang online';
            case 'offline': return 'Offline';
            case 'banned': return 'Bị cấm';
            case 'suspended': return 'Tạm ngưng';
            default: return status;
        }
    };

    const getSpecializationColor = (spec?: string | null) => {
        if (!spec) return 'default';

        const colors: { [key: string]: string } = {
            'warrior': 'red',
            'archer': 'green',
            'mage': 'purple',
            'assassin': 'volcano',
            'support': 'blue',
            'tank': 'orange',
        };
        return colors[spec] || 'default';
    };

    const getSpecializationText = (spec?: string | null) => {
        if (!spec) return 'Chưa có';

        const texts: { [key: string]: string } = {
            'warrior': 'Chiến binh',
            'archer': 'Cung thủ',
            'mage': 'Pháp sư',
            'assassin': 'Sát thủ',
            'support': 'Hỗ trợ',
            'tank': 'TanK',
        };
        return texts[spec] || spec;
    };

    const getAllianceColor = (alliance?: string | null) => {
        if (!alliance) return 'default';

        const colors: { [key: string]: string } = {
            'ThienDang': 'red',
            'LongMon': 'blue',
            'NguCo': 'green',
            'DuongMon': 'orange',
            'ThieuLam': 'purple',
            'VoDang': 'cyan',
            'CaiBang': 'volcano',
            'ThienNhan': 'magenta',
            'ConLon': 'geekblue',
            'NgaMy': 'pink',
            'DoanThi': 'lime',
            'HoaSon': 'gold',
        };
        return colors[alliance] || 'default';
    };

    const getAllianceText = (alliance?: string | null) => {
        if (!alliance) return 'Không có';

        const texts: { [key: string]: string } = {
            'ThienDang': 'Thiên Đàng',
            'LongMon': 'Long Môn',
            'NguCo': 'Ngư Cô',
            'DuongMon': 'Dương Môn',
            'ThieuLam': 'Thiếu Lâm',
            'VoDang': 'Võ Đang',
            'CaiBang': 'Cái Bang',
            'ThienNhan': 'Thiên Nhẫn',
            'ConLon': 'Côn Lôn',
            'NgaMy': 'Nga My',
            'DoanThi': 'Đoàn Thị',
            'HoaSon': 'Hoa Sơn',
        };
        return texts[alliance] || alliance;
    };

    const getRoleColor = (role?: string | null) => {
        switch (role) {
            case 'leader': return 'gold';
            case 'member': return 'blue';
            default: return 'default';
        }
    };

    const getRoleText = (role?: string | null) => {
        switch (role) {
            case 'leader': return 'Lãnh đạo';
            case 'member': return 'Thành viên';
            default: return 'Không có';
        }
    };

    const formatPower = (power: number) => {
        if (power >= 1_000_000) {
            return `${(power / 1_000_000).toFixed(1)}M`;
        } else if (power >= 1_000) {
            return `${(power / 1_000).toFixed(1)}K`;
        }
        return power.toLocaleString();
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Chưa đăng nhập';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const calculateWinRate = (wins: number, battles: number) => {
        if (battles === 0) return 0;
        return (wins / battles) * 100;
    };

    const columns: ColumnsType<Player> = [
        {
            title: 'Người chơi',
            dataIndex: 'username',
            key: 'username',
            fixed: 'left',
            width: 220,
            render: (username: string, record: Player) => (
                <Space>
                    <Badge
                        dot={record.status === 'online'}
                        color="green"
                        offset={[-5, 5]}
                    >
                        <Avatar
                            size="small"
                            src={record.avatar}
                            style={{
                                backgroundColor: record.avatar ? 'transparent' : '#8B0000',
                                fontSize: 12
                            }}
                        >
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>
                    <div>
                        <div style={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {username}
                            {record.role_in_alliance === 'leader' && (
                                <CrownOutlined style={{ marginLeft: 4, color: '#D4AF37' }} />
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
                        {record.country && (
                            <div style={{ fontSize: 11, color: '#999' }}>
                                {record.country}
                            </div>
                        )}
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
                <Tag color="gold" icon={<CrownOutlined />}>
                    Lv.{level}
                </Tag>
            ),
        },
        {
            title: 'Sức mạnh',
            dataIndex: 'power',
            key: 'power',
            width: 120,
            sorter: (a, b) => a.power - b.power,
            render: (power: number) => (
                <Tooltip title={`${power.toLocaleString()} sức mạnh`}>
                    <div style={{ fontWeight: 600, color: '#8B0000' }}>
                        {formatPower(power)}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Chuyên môn',
            dataIndex: 'specialization',
            key: 'specialization',
            width: 120,
            render: (specialization: string | null) => (
                <Tag color={getSpecializationColor(specialization)}>
                    {getSpecializationText(specialization)}
                </Tag>
            ),
        },
        {
            title: 'Liên minh',
            dataIndex: 'alliance',
            key: 'alliance',
            width: 130,
            render: (alliance: string | null, record: Player) => (
                <Space direction="vertical" size={4}>
                    <Tag color={getAllianceColor(alliance)}>
                        {getAllianceText(alliance)}
                    </Tag>
                    {record.role_in_alliance && (
                        <Tag color={getRoleColor(record.role_in_alliance)} size="small">
                            {getRoleText(record.role_in_alliance)}
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Tỷ lệ thắng',
            dataIndex: 'win_rate',
            key: 'win_rate',
            width: 150,
            sorter: (a, b) => a.win_rate - b.win_rate,
            render: (winRate: number) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <Progress
                            percent={Math.round(winRate)}
                            size="small"
                            strokeColor={
                                winRate >= 80 ? '#2E8B57' :
                                    winRate >= 60 ? '#D4AF37' : '#DC143C'
                            }
                            showInfo={false}
                        />
                    </div>
                    <div style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: winRate >= 80 ? '#2E8B57' :
                            winRate >= 60 ? '#D4AF37' : '#DC143C',
                        fontWeight: 500
                    }}>
                        {winRate.toFixed(1)}%
                    </div>
                </div>
            ),
        },
        {
            title: 'Điểm chiến thắng',
            dataIndex: 'victory_points',
            key: 'victory_points',
            width: 120,
            sorter: (a, b) => a.victory_points - b.victory_points,
            render: (points: number) => (
                <Space>
                    <TrophyOutlined style={{ color: '#D4AF37' }} />
                    <span style={{ fontWeight: 500 }}>
                        {points.toLocaleString()}
                    </span>
                </Space>
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
                    <span style={{ fontWeight: 500 }}>
                        {territory}%
                    </span>
                </Space>
            ),
        },
        {
            title: 'Trận chiến',
            key: 'battles',
            width: 140,
            sorter: (a, b) => a.battles - b.battles,
            render: (_: any, record: Player) => {
                const winRate = calculateWinRate(record.wins, record.battles);
                return (
                    <Tooltip title={`${record.wins} thắng / ${record.battles - record.wins} thua - Tỷ lệ thắng: ${winRate.toFixed(1)}%`}>
                        <Space>
                            <Sword style={{ color: '#8B0000' }} />
                            <div>
                                <div style={{ fontWeight: 500 }}>{record.battles}</div>
                                <div style={{ fontSize: 11, color: '#666' }}>
                                    ({record.wins}W)
                                </div>
                            </div>
                        </Space>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Đang online', value: 'online' },
                { text: 'Offline', value: 'offline' },
                { text: 'Bị cấm', value: 'banned' },
                { text: 'Tạm ngưng', value: 'suspended' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: Player['status']) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Vi phạm',
            dataIndex: 'violations',
            key: 'violations',
            width: 100,
            sorter: (a, b) => a.violations - b.violations,
            render: (violations: number) => (
                <Tag color={violations === 0 ? 'green' : violations <= 2 ? 'orange' : 'red'}>
                    {violations}
                </Tag>
            ),
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'last_login',
            key: 'last_login',
            width: 130,
            sorter: (a, b) => {
                const dateA = a.last_login ? new Date(a.last_login).getTime() : 0;
                const dateB = b.last_login ? new Date(b.last_login).getTime() : 0;
                return dateA - dateB;
            },
            render: (lastLogin: string | null) => (
                <div style={{ fontSize: 12 }}>
                    {formatDate(lastLogin)}
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onViewDetails?.(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEditPlayer?.(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedPlayers.map(player => player.id),
        onChange: (_: React.Key[], selectedRows: Player[]) => {
            onSelectionChange(selectedRows);
        },
    };

    const paginationConfig = onPageChange ? {
        current: currentPage,
        pageSize: pageSize,
        total: totalCount,
        onChange: onPageChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} người chơi`,
        pageSizeOptions: ['10', '20', '50', '100'],
    } : false;

    return (
        <Table
            columns={columns}
            dataSource={players}
            rowSelection={rowSelection}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1800 }}
            pagination={paginationConfig}
            size="middle"
            style={{ marginTop: 16 }}
        />
    );
}
