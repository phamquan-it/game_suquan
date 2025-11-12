'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Typography, Space, Tabs, Tag } from 'antd';
import BattleMonitor from './components/BattleMonitor';
import BattleAnalytics from './components/BattleAnalytics';
import { Battle } from '@/lib/types/admin.types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

const { Title, Text } = Typography;

// Mock data - sẽ thay thế bằng API thực tế
const mockBattles: Battle[] = [
    {
        id: '1',
        player1: 'ThienMaHung',
        player2: 'LongThanKiem',
        winner: 'ThienMaHung',
        duration: 187,
        timestamp: '2024-01-15T14:30:00Z',
        type: 'pvp',
        status: 'completed',
        rewards: {
            gold: 12500,
            experience: 8500,
            items: ['Rương Báu Vật', 'Ngọc Hồn Lv.5'],
        },
    },
    {
        id: '2',
        player1: 'ThuyTienCung',
        player2: 'BOSS_CổLong',
        winner: 'ThuyTienCung',
        duration: 245,
        timestamp: '2024-01-15T14:15:00Z',
        type: 'pve',
        status: 'completed',
        rewards: {
            gold: 8500,
            experience: 12000,
            items: ['Xương Rồng Thần', 'Huyết Ngọc'],
        },
    },
    {
        id: '3',
        player1: 'KimLoaThanh',
        player2: 'DocDuocSu',
        winner: '',
        duration: 156,
        timestamp: '2024-01-15T14:05:00Z',
        type: 'pvp',
        status: 'ongoing',
        rewards: {
            gold: 0,
            experience: 0,
            items: [],
        },
    },
    {
        id: '4',
        player1: 'ThienKiemSu',
        player2: 'BOSS_ThiênMa',
        winner: '',
        duration: 189,
        timestamp: '2024-01-15T13:45:00Z',
        type: 'pve',
        status: 'ongoing',
        rewards: {
            gold: 0,
            experience: 0,
            items: [],
        },
    },
    {
        id: '5',
        player1: 'LongMonDeTu',
        player2: 'NguCoAmHung',
        winner: 'LongMonDeTu',
        duration: 134,
        timestamp: '2024-01-15T13:30:00Z',
        type: 'tournament',
        status: 'completed',
        rewards: {
            gold: 20000,
            experience: 15000,
            items: ['Võ Công Tâm Pháp', 'Thần Kiếm Lệnh'],
        },
    },
    {
        id: '6',
        player1: 'ThieuLamSu',
        player2: 'DuongMonNoNu',
        winner: '',
        duration: 0,
        timestamp: '2024-01-15T14:35:00Z',
        type: 'pvp',
        status: 'cancelled',
        rewards: {
            gold: 0,
            experience: 0,
            items: [],
        },
    },
];

const realTimeBattles = mockBattles.filter(battle => battle.status === 'ongoing');

export default function BattlesPage() {
    const { data, isFetching } = useQuery({
        queryKey: ["battles"], // cache key
        queryFn: async () => await supabase.from("battles").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });

    const [battles, setBattles] = useState<Battle[]>(mockBattles);
    const [activeTab, setActiveTab] = useState('monitor');

    const battleStats = {
        total: battles.length,
        ongoing: battles.filter(b => b.status === 'ongoing').length,
        completed: battles.filter(b => b.status === 'completed').length,
        cancelled: battles.filter(b => b.status === 'cancelled').length,
        pvp: battles.filter(b => b.type === 'pvp').length,
        pve: battles.filter(b => b.type === 'pve').length,
        tournament: battles.filter(b => b.type === 'tournament').length,
    };

    return (
        <div>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Quản Lý Chiến Trường
            </Title>

            {/* Stats Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8} lg={4}>
                    <Card size="small" variant={"borderless"}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#8B0000' }}>
                                {battleStats.total}
                            </Title>
                            <Text type="secondary">Tổng trận</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} lg={4}>
                    <Card
                        size="small"
                        variant="borderless"
                        style={{
                            background: battleStats.ongoing > 0 ? '#fff2f0' : 'transparent',
                            border: battleStats.ongoing > 0 ? '1px solid #ffccc7' : 'none'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#dc143c' }}>
                                {battleStats.ongoing}
                            </Title>
                            <Text type="secondary">Đang diễn ra</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} lg={4}>
                    <Card size="small" variant="borderless">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#2e8b57' }}>
                                {battleStats.completed}
                            </Title>
                            <Text type="secondary">Hoàn thành</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} lg={4}>
                    <Card size="small" variant="borderless">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#d4af37' }}>
                                {battleStats.pvp}
                            </Title>
                            <Text type="secondary">PVP</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} lg={4}>
                    <Card size="small" variant="borderless">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#1e90ff' }}>
                                {battleStats.pve}
                            </Title>
                            <Text type="secondary">PVE</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} lg={4}>
                    <Card size="small" variant="borderless">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#8b4513' }}>
                                {battleStats.tournament}
                            </Title>
                            <Text type="secondary">Giải đấu</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Real-time Alert */}
            {realTimeBattles.length > 0 && (
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
                            Đang có {realTimeBattles.length} trận chiến diễn ra thời gian thực
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
                            key: 'monitor',
                            label: (
                                <Space>
                                    <span>Giám Sát Thời Gian Thực</span>
                                    {realTimeBattles.length > 0 && (
                                        <Tag color="red">{realTimeBattles.length}</Tag>
                                    )}
                                </Space>
                            ),
                            children: <BattleMonitor battles={battles} />,
                        },
                        {
                            key: 'analytics',
                            label: 'Phân Tích & Báo Cáo',
                            children: <BattleAnalytics battles={data?.data ?? []} />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
