// components/admin/achievements/AchievementList.tsx
import React, { useState } from 'react';
import {
    Table,
    Card,
    Tag,
    Space,
    Button,
    Select,
    Row,
    Col,
    Progress,
    Statistic,
} from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    TrophyOutlined,
    FilterOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Achievement, AchievementType, AchievementTier } from '@/lib/types/achievements/achievement';

interface AchievementListProps {
    achievements: Achievement[];
    onView: (achievement: Achievement) => void;
    onEdit: (achievement: Achievement) => void;
    onCreate: () => void;
}

export const AchievementList: React.FC<AchievementListProps> = ({
    achievements,
    onView,
    onEdit,
    onCreate
}) => {
    const [filters, setFilters] = useState({
        type: undefined as string | undefined,
        tier: undefined as string | undefined,
        category: undefined as string | undefined,
        status: undefined as string | undefined
    });

    const columns = [
        {
            title: 'Thành tích',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Achievement) => (
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
            dataIndex: 'type',
            key: 'type',
            render: (type: AchievementType) => (
                <Tag color={getAchievementTypeColor(type)}>
                    {getAchievementTypeLabel(type)}
                </Tag>
            ),
        },
        {
            title: 'Hạng',
            dataIndex: 'tier',
            key: 'tier',
            render: (tier: AchievementTier) => (
                <Tag color={getAchievementTierColor(tier)}>
                    {getAchievementTierLabel(tier)}
                </Tag>
            ),
        },
        {
            title: 'Điểm',
            dataIndex: 'points',
            key: 'points',
            render: (points: number) => (
                <span style={{ fontWeight: 600, color: '#faad14' }}>
                    {points} pts
                </span>
            ),
        },
        {
            title: 'Hoàn thành',
            key: 'completion',
            render: (record: Achievement) => (
                <div style={{ width: 150 }}>
                    <Progress
                        percent={record.globalStats.completionRate}
                        size="small"
                        format={percent => `${percent}%`}
                    />
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.globalStats.totalCompletions.toLocaleString()} người chơi
                    </div>
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
            render: (record: Achievement) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                        size="small"
                    >
                        Chi tiết
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredAchievements = achievements.filter(achievement => {
        if (filters.type && achievement.type !== filters.type) return false;
        if (filters.tier && achievement.tier !== filters.tier) return false;
        if (filters.category && achievement.category !== filters.category) return false;
        if (filters.status && achievement.status !== filters.status) return false;
        return true;
    });

    const stats = {
        total: achievements.length,
        active: achievements.filter(a => a.status === 'active').length,
        totalPoints: achievements.reduce((sum, a) => sum + a.points, 0),
        averageCompletion: achievements.reduce((sum, a) => sum + a.globalStats.completionRate, 0) / achievements.length
    };

    return (
        <div>
            {/* Statistics Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng thành tích"
                            value={stats.total}
                            prefix={<TrophyOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Đang hoạt động"
                            value={stats.active}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng điểm"
                            value={stats.totalPoints}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Hoàn thành TB"
                            value={stats.averageCompletion}
                            precision={1}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card
                title={
                    <Space>
                        <FilterOutlined />
                        Bộ lọc thành tích
                    </Space>
                }
                style={{ marginBottom: 16 }}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                        Thêm thành tích
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Select
                            placeholder="Loại thành tích"
                            style={{ width: '100%' }}
                            value={filters.type}
                            onChange={(value) => setFilters({ ...filters, type: value })}
                            allowClear
                        >
                            <Select.Option value="progression">Tiến triển</Select.Option>
                            <Select.Option value="combat">Chiến đấu</Select.Option>
                            <Select.Option value="exploration">Khám phá</Select.Option>
                            <Select.Option value="collection">Sưu tập</Select.Option>
                            <Select.Option value="social">Xã hội</Select.Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Hạng thành tích"
                            style={{ width: '100%' }}
                            value={filters.tier}
                            onChange={(value) => setFilters({ ...filters, tier: value })}
                            allowClear
                        >
                            <Select.Option value="bronze">Đồng</Select.Option>
                            <Select.Option value="silver">Bạc</Select.Option>
                            <Select.Option value="gold">Vàng</Select.Option>
                            <Select.Option value="platinum">Bạch kim</Select.Option>
                            <Select.Option value="diamond">Kim cương</Select.Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Danh mục"
                            style={{ width: '100%' }}
                            value={filters.category}
                            onChange={(value) => setFilters({ ...filters, category: value })}
                            allowClear
                        >
                            <Select.Option value="beginner">Người mới</Select.Option>
                            <Select.Option value="intermediate">Trung cấp</Select.Option>
                            <Select.Option value="advanced">Nâng cao</Select.Option>
                            <Select.Option value="expert">Chuyên gia</Select.Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: '100%' }}
                            value={filters.status}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                            allowClear
                        >
                            <Select.Option value="active">Hoạt động</Select.Option>
                            <Select.Option value="inactive">Ẩn</Select.Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Achievements Table */}
            <Card title="Danh sách thành tích">
                <Table
                    columns={columns}
                    dataSource={filteredAchievements}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

// Helper functions
const getAchievementTypeColor = (type: AchievementType): string => {
    const colors: Record<string, string> = {
        progression: 'blue',
        combat: 'red',
        exploration: 'green',
        collection: 'purple',
        crafting: 'orange',
        social: 'cyan',
        economy: 'gold',
        alliance: 'magenta',
        seasonal: 'volcano',
        milestone: 'geekblue',
        secret: 'black'
    };
    return colors[type] || 'default';
};

const getAchievementTypeLabel = (type: AchievementType): string => {
    const labels: Record<string, string> = {
        progression: 'Tiến triển',
        combat: 'Chiến đấu',
        exploration: 'Khám phá',
        collection: 'Sưu tập',
        crafting: 'Chế tạo',
        social: 'Xã hội',
        economy: 'Kinh tế',
        alliance: 'Bang hội',
        seasonal: 'Mùa',
        milestone: 'Cột mốc',
        secret: 'Bí mật'
    };
    return labels[type] || type;
};

const getAchievementTierColor = (tier: AchievementTier): string => {
    const colors: Record<string, string> = {
        bronze: '#CD7F32',
        silver: '#C0C0C0',
        gold: '#FFD700',
        platinum: '#E5E4E2',
        diamond: '#B9F2FF',
        master: '#8A2BE2',
        grandmaster: '#FF4500'
    };
    return colors[tier] || 'default';
};

const getAchievementTierLabel = (tier: AchievementTier): string => {
    const labels: Record<string, string> = {
        bronze: 'Đồng',
        silver: 'Bạc',
        gold: 'Vàng',
        platinum: 'Bạch kim',
        diamond: 'Kim cương',
        master: 'Bậc thầy',
        grandmaster: 'Đại sư'
    };
    return labels[tier] || tier;
};
