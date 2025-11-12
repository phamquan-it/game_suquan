'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Space, Tabs, Tag, Statistic } from 'antd';
import TransactionLog from './components/TransactionLog';
import { EconomyStats, Currency, Transaction } from '@/lib/types/economy.types';
import CurrencyManager from './components/CurrencyManager';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

const { Title, Text } = Typography;



const mockTransactions: Transaction[] = [
    {
        id: '1',
        playerId: 'player1',
        playerName: 'ThienMaHung',
        type: 'purchase',
        amount: 5000,
        currency: 'diamond',
        description: 'Mua Rương Báu Vật',
        itemId: 'chest_001',
        itemName: 'Rương Báu Vật Thần',
        status: 'completed',
        timestamp: '2024-01-15T14:30:00Z',
        server: 'Server_01',
        ipAddress: '192.168.1.100'
    },
    {
        id: '2',
        playerId: 'player2',
        playerName: 'LongThanKiem',
        type: 'refund',
        amount: -2500,
        currency: 'diamond',
        description: 'Hoàn tiền Rương Báu Vật',
        itemId: 'chest_001',
        itemName: 'Rương Báu Vật Thần',
        status: 'completed',
        timestamp: '2024-01-15T14:25:00Z',
        server: 'Server_01',
        ipAddress: '192.168.1.101',
        reason: 'Sản phẩm lỗi'
    },
    {
        id: '3',
        playerId: 'player3',
        playerName: 'ThuyTienCung',
        type: 'purchase',
        amount: 10000,
        currency: 'diamond',
        description: 'Mua Gói Ưu Đãi VIP',
        itemId: 'vip_package',
        itemName: 'Gói VIP 30 Ngày',
        status: 'completed',
        timestamp: '2024-01-15T14:20:00Z',
        server: 'Server_01',
        ipAddress: '192.168.1.102'
    },
    {
        id: '4',
        playerId: 'player4',
        playerName: 'KimLoaThanh',
        type: 'reward',
        amount: 50000,
        currency: 'gold',
        description: 'Thưởng sự kiện',
        status: 'completed',
        timestamp: '2024-01-15T14:15:00Z',
        server: 'Server_01',
        ipAddress: '192.168.1.103'
    },
    {
        id: '5',
        playerId: 'player5',
        playerName: 'DocDuocSu',
        type: 'purchase',
        amount: 1500,
        currency: 'diamond',
        description: 'Mua Ngọc Hồn Lv.5',
        itemId: 'soul_stone',
        itemName: 'Ngọc Hồn Cấp 5',
        status: 'failed',
        timestamp: '2024-01-15T14:10:00Z',
        server: 'Server_01',
        ipAddress: '192.168.1.104',
        reason: 'Thẻ tín dụng bị từ chối'
    }
];

export default function EconomyPage() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const { data: transactions } = useQuery({
        queryKey: ["economy_transactions"], // cache key duy nhất
        queryFn: async (): Promise<Transaction[]> => {
            const { data, error } = await supabase
                .from("v_economy_transaction_full") // view đã tạo
                .select("*")
                .order("timestamp", { ascending: false });

            if (error) throw error;
            return data as Transaction[];
        },
        staleTime: 1000 * 60, // cache 1 phút
        refetchOnWindowFocus: false, // không refetch khi đổi tab
    });

    const { data } = useQuery({
        queryKey: ["economy_stats_full"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("v_economy_stats_full")
                .select("*")
                .single(); // vì view chỉ trả 1 bản ghi (LIMIT 1)

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60, // cache 1 phút
    });
    const { data: currenciesData } = useQuery({
        queryKey: ["economy_currency"],
        queryFn: async (): Promise<Currency[]> => {
            const { data, error } = await supabase
                .from("v_economy_currency_full")
                .select("*")
                .order("lastUpdated", { ascending: false });

            if (error) throw error;
            return data as Currency[];
        },
        staleTime: 1000 * 60, // cache 1 phút
    });
    useEffect(() => {
        setCurrencies(currenciesData ?? [])
    }, [currenciesData])

    return (
        <div>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Quản Lý Kinh Tế
            </Title>

            {/* Economy Overview Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" variant={"borderless"}>
                        <Statistic
                            title="Doanh Thu Hôm Nay"
                            value={data?.dailyRevenue}
                            precision={0}
                            prefix="₫"
                            valueStyle={{ color: '#2E8B57' }}
                            suffix={
                                <Tag color="green" style={{ marginLeft: 8 }}>
                                    +12.5%
                                </Tag>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Tổng Doanh Thu"
                            value={data?.totalRevenue}
                            precision={0}
                            prefix="₫"
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Giao Dịch Thành Công"
                            value={data?.successfulTransactions}
                            valueStyle={{ color: '#D4AF37' }}
                            suffix={`/ ${data?.totalTransactions}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Chi Tiêu Trung Bình"
                            value={data?.averageSpend}
                            precision={0}
                            prefix="₫"
                            valueStyle={{ color: '#003366' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Warning Alert for Fraud Attempts */}
            {data?.fraudAttempts > 0 && (
                <Card
                    style={{
                        marginBottom: 16,
                        background: 'linear-gradient(135deg, #fff2f0, #ffccc7)',
                        border: '1px solid #ffa39e'
                    }}
                >
                    <Space>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#dc143c',
                            animation: 'pulse 1.5s infinite'
                        }} />
                        <Text strong style={{ color: '#dc143c' }}>
                            Cảnh báo: {data?.fraudAttempts} giao dịch gian lận đã bị phát hiện
                        </Text>
                    </Space>
                </Card>
            )}

            <Card variant="borderless">

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'overview',
                            label: 'Tổng Quan Kinh Tế',
                            children: <EconomyOverview stats={data} currencies={currencies ?? []} />,
                        },
                        {
                            key: 'currency',
                            label: 'Quản Lý Tiền Tệ',
                            children: <CurrencyManager currencies={currencies ?? []} onCurrenciesChange={setCurrencies} />,
                        },
                        {
                            key: 'transactions',
                            label: 'Lịch Sử Giao Dịch',
                            children: <TransactionLog transactions={transactions??  []} />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

// Component for Economy Overview Tab
const EconomyOverview: React.FC<{ stats: EconomyStats; currencies: Currency[] }> = ({
    stats,
    currencies
}) => {
    return (
        <Row gutter={[16, 16]}>
            {/* Currency Status */}
            <Col xs={24} lg={12}>
                <Card title="Trạng Thái Tiền Tệ" variant="borderless">
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {currencies.map(currency => (
                            <Card key={currency.id} size="small">
                                <Row gutter={16} align="middle">
                                    <Col span={8}>
                                        <Text strong>{currency.name}</Text>
                                        <br />
                                        <Tag color={currency.type === 'premium' ? 'gold' : 'blue'}>
                                            {currency.code}
                                        </Tag>
                                    </Col>
                                    <Col span={8}>
                                        <Text type="secondary">Lưu thông</Text>
                                        <br />
                                        <Text strong>{(currency.inCirculation / 1000000).toFixed(1)}M</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text type="secondary">Lạm phát</Text>
                                        <br />
                                        <Text strong style={{
                                            color: currency.inflationRate > 3 ? '#dc143c' :
                                                currency.inflationRate > 1.5 ? '#d4af37' : '#2e8b57'
                                        }}>
                                            {currency.inflationRate}%
                                        </Text>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Space>
                </Card>
            </Col>

            {/* Popular Items */}
            <Col xs={24} lg={12}>
                <Card title="Vật Phẩm Bán Chạy" variant="borderless">
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {stats?.popularItems.map((item, index) => (
                            <div key={index} style={{
                                padding: '12px 16px',
                                border: '1px solid #d4af37',
                                borderRadius: 8,
                                background: '#fffdf6'
                            }}>
                                <Row gutter={16} align="middle">
                                    <Col span={12}>
                                        <Text strong>{item.name}</Text>
                                        <br />
                                        <Text type="secondary">{item.sales.toLocaleString()} lượt bán</Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text strong style={{ color: '#2e8b57' }}>
                                            ₫{(item.revenue / 1000000).toFixed(1)}M
                                        </Text>
                                        <br />
                                        <Text type="secondary">Doanh thu</Text>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Space>
                </Card>
            </Col>

            {/* Additional Metrics */}
            <Col xs={24}>
                <Card title="Chỉ Số Kinh Tế" variant="borderless">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="Tiền Đang Lưu Thông"
                                value={stats?.currencyInCirculation}
                                precision={0}
                                prefix="₫"
                                valueStyle={{ color: '#D4AF37' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="Tỷ Lệ Gian Lận"
                                value={(stats?.fraudAttempts / stats?.totalTransactions * 100).toFixed(2)}
                                suffix="%"
                                valueStyle={{ color: '#DC143C' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="Tăng Trưởng Doanh Thu"
                                value={stats?.revenueGrowth}
                                suffix="%"
                                valueStyle={{ color: '#2E8B57' }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};
