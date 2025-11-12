'use client';

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Table,
    Tag,
    Space,
    Button,
    DatePicker,
    Select,
    Statistic,
    Tooltip
} from 'antd';
import {
    ExportOutlined,
    FilterOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { Battle } from '@/lib/types/admin.types';
import type { ColumnsType } from 'antd/es/table';

const {  Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface BattleAnalyticsProps {
    battles: Battle[];
}

// Mock chart components - trong thực tế sẽ dùng thư viện chart
const BattleTrendChart = () => (
    <div style={{
        height: 200,
        background: 'linear-gradient(180deg, #f0f8ff, #e6f7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: '1px solid #d4af37'
    }}>
        <Space direction="vertical" align="center">
            <BarChartOutlined style={{ fontSize: 48, color: '#8B0000' }} />
            <Text type="secondary">Biểu đồ xu hướng trận chiến</Text>
        </Space>
    </div>
);

const WinRateChart = () => (
    <div style={{
        height: 200,
        background: 'linear-gradient(180deg, #f6ffed, #f0fff3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: '1px solid #2e8b57'
    }}>
        <Space direction="vertical" align="center">
            <PieChartOutlined style={{ fontSize: 48, color: '#2E8B57' }} />
            <Text type="secondary">Biểu đồ tỷ lệ thắng</Text>
        </Space>
    </div>
);

const BattleTypeDistribution = () => (
    <div style={{
        height: 200,
        background: 'linear-gradient(180deg, #fff7e6, #fff2e8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: '1px solid #d4af37'
    }}>
        <Space direction="vertical" align="center">
            <LineChartOutlined style={{ fontSize: 48, color: '#D4AF37' }} />
            <Text type="secondary">Phân bố loại trận chiến</Text>
        </Space>
    </div>
);

export default function BattleAnalytics({ battles }: BattleAnalyticsProps) {
    const [dateRange, setDateRange] = useState<any>(null);
    const [battleType, setBattleType] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredBattles = battles.filter(battle => {
        if (dateRange) {
            const battleDate = new Date(battle.timestamp);
            const [start, end] = dateRange;
            if (battleDate < start || battleDate > end) return false;
        }
        if (battleType !== 'all' && battle.type !== battleType) return false;
        if (statusFilter !== 'all' && battle.status !== statusFilter) return false;
        return true;
    });

    // Analytics calculations
    const totalBattles = filteredBattles.length;
    const pvpBattles = filteredBattles.filter(b => b.type === 'pvp').length;
    const pveBattles = filteredBattles.filter(b => b.type === 'pve').length;
    const tournamentBattles = filteredBattles.filter(b => b.type === 'tournament').length;

    const completedBattles = filteredBattles.filter(b => b.status === 'completed');
    const avgDuration = completedBattles.length > 0
        ? completedBattles.reduce((sum, b) => sum + b.duration, 0) / completedBattles.length
        : 0;

    const totalGoldRewards = completedBattles.reduce((sum, b) => sum + b.rewards_gold, 0);
    const totalExpRewards = completedBattles.reduce((sum, b) => sum + b.rewards_experience, 0);

    const columns: ColumnsType<Battle> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id: string) => <Text type="secondary">#{id}</Text>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 150,
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            render: (timestamp: string) => (
                <Text style={{ fontSize: 12 }}>
                    {new Date(timestamp).toLocaleString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Người chơi',
            key: 'players',
            width: 200,
            render: (_, record: Battle) => (
                <Space direction="vertical" size={0}>
                    <div>
                        <Text strong>{record.player1}</Text>
                        {record.winner === record.player1 && (
                            <Tag color="green" size="small" style={{ marginLeft: 4 }}>Thắng</Tag>
                        )}
                    </div>
                    <div>
                        <Text strong>{record.player2}</Text>
                        {record.winner === record.player2 && (
                            <Tag color="green" style={{ marginLeft: 4 }}>Thắng</Tag>
                        )}
                    </div>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            filters: [
                { text: 'PVP', value: 'pvp' },
                { text: 'PVE', value: 'pve' },
                { text: 'Giải đấu', value: 'tournament' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (type: Battle['type']) => (
                <Tag color={
                    type === 'pvp' ? 'red' :
                        type === 'pve' ? 'blue' : 'gold'
                }>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            sorter: (a, b) => a.duration - b.duration,
            render: (duration: number) => (
                <Text>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Đang diễn ra', value: 'ongoing' },
                { text: 'Đã kết thúc', value: 'completed' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: Battle['status']) => (
                <Tag color={
                    status === 'ongoing' ? 'red' :
                        status === 'completed' ? 'green' : 'default'
                }>
                    {status === 'ongoing' ? 'Đang diễn ra' :
                        status === 'completed' ? 'Đã kết thúc' : 'Đã hủy'}
                </Tag>
            ),
        },
        {
            title: 'Phần thưởng',
            key: 'rewards',
            width: 150,
            render: (_, record: Battle) => (
                <Space direction="vertical" size={0}>
                    {record.rewards_gold > 0 && (
                        <Text type="secondary">{record.rewards_gold.toLocaleString()} vàng</Text>
                    )}
                    {record.rewards_experience > 0 && (
                        <Text type="secondary">{record.rewards_experience.toLocaleString()} EXP</Text>
                    )}
                    {record.reward_items.slice(0, 1).map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                        <Tag key={index} color="blue" >{item}</Tag>
                    ))}
                    {record.reward_items.length > 1 && (
                        <Tooltip title={record.reward_items.join(', ')}>
                            <Tag color="cyan" >+{record.reward_items.length - 1}</Tag>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Filters */}
            <Card size="small" variant="borderless">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8} md={6}>
                        <RangePicker
                            style={{ width: '100%' }}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={setDateRange}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Loại trận"
                            value={battleType}
                            onChange={setBattleType}
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="pvp">PVP</Option>
                            <Option value="pve">PVE</Option>
                            <Option value="tournament">Giải đấu</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={8} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="completed">Đã kết thúc</Option>
                            <Option value="ongoing">Đang diễn ra</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={10}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button icon={<FilterOutlined />}>
                                Lọc
                            </Button>
                            <Button icon={<ExportOutlined />}>
                                Xuất báo cáo
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Analytics Overview */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Tổng trận"
                            value={totalBattles}
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="PVP"
                            value={pvpBattles}
                            valueStyle={{ color: '#dc143c' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="PVE"
                            value={pveBattles}
                            valueStyle={{ color: '#1e90ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Giải đấu"
                            value={tournamentBattles}
                            valueStyle={{ color: '#d4af37' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Thời lượng TB"
                            value={Math.round(avgDuration)}
                            suffix="giây"
                            valueStyle={{ color: '#2e8b57' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={4}>
                    <Card size="small">
                        <Statistic
                            title="Tổng vàng thưởng"
                            value={totalGoldRewards}
                            valueStyle={{ color: '#d4af37' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <Card title="Xu Hướng Trận Chiến" size="small" variant="borderless">
                        <BattleTrendChart />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Phân Bố Loại Trận" size="small" variant="borderless">
                        <BattleTypeDistribution />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Tỷ Lệ Thắng" size="small" variant="borderless">
                        <WinRateChart />
                    </Card>
                </Col>
            </Row>

            {/* Detailed Table */}
            <Card
                title="Chi Tiết Trận Chiến"
                extra={
                    <Button type="primary" icon={<ExportOutlined />}>
                        Xuất Excel
                    </Button>
                }
                variant="borderless"
            >
                <Table
                    columns={columns}
                    dataSource={filteredBattles}
                    rowKey="id"
                    scroll={{ x: 1000 }}
                    pagination={{
                        total: filteredBattles.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} trận chiến`,
                    }}
                    size="middle"
                />
            </Card>
        </Space>
    );
}
