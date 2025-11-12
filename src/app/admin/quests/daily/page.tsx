'use client';

import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Space,
    Button,
    Statistic,
    Tabs,
    Alert
} from 'antd';
import {
    PlusOutlined,
    SyncOutlined,
    TrophyOutlined,
    UserOutlined,
    CalendarOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import DailyQuestManager from './components/DailyQuestManager';
import QuestAnalytics from './components/QuestAnalytics';
import QuestTemplates from './components/QuestTemplates';
import { DailyQuest, QuestStats, QuestTemplate } from '@/lib/types/quest.types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

const { Title, Text } = Typography;

// Mock data
const mockQuestStats: QuestStats = {
    totalQuests: 15,
    activeQuests: 8,
    completedToday: 12547,
    completionRate: 68.5,
    totalRewards: 4580000,
    popularQuests: [
        { questId: 'login', name: 'Đăng nhập hàng ngày', completions: 15247 },
        { questId: 'battle', name: 'Tham chiến 3 trận', completions: 9850 },
        { questId: 'alliance', name: 'Tương tác liên minh', completions: 7450 }
    ],
    playerEngagement: 72.3
};

const mockDailyQuests: DailyQuest[] = [
    {
        id: 'quest-001',
        name: 'Đăng nhập hàng ngày',
        description: 'Đăng nhập vào game để nhận quà mỗi ngày',
        type: 'login',
        difficulty: 'easy',
        status: 'active',
        requirements: {
            type: 'login',
            target: 1
        },
        rewards: {
            gold: 1000,
            experience: 500,
            items: ['Rương Báu Vật Nhỏ']
        },
        schedule: {
            startTime: '00:00',
            endTime: '23:59',
            resetDaily: true
        },
        completionLimit: 1,
        currentCompletions: 15247,
        maxCompletions: 20000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'quest-002',
        name: 'Chiến binh dũng cảm',
        description: 'Tham gia 3 trận chiến PvP',
        type: 'pvp_battle',
        difficulty: 'medium',
        status: 'active',
        requirements: {
            type: 'pvp_battle',
            target: 3
        },
        rewards: {
            gold: 5000,
            experience: 2000,
            items: ['Ngọc Hồn Lv.3', 'Thuốc Hồi Phục']
        },
        schedule: {
            startTime: '00:00',
            endTime: '23:59',
            resetDaily: true
        },
        completionLimit: 1,
        currentCompletions: 9850,
        maxCompletions: 15000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'quest-003',
        name: 'Nhà thám hiểm',
        description: 'Khám phá 5 vùng đất mới',
        type: 'exploration',
        difficulty: 'hard',
        status: 'active',
        requirements: {
            type: 'exploration',
            target: 5
        },
        rewards: {
            gold: 8000,
            experience: 3500,
            items: ['Bản Đồ Kho Báu', 'Rương Báu Vật Lớn'],
            diamonds: 10
        },
        schedule: {
            startTime: '00:00',
            endTime: '23:59',
            resetDaily: true
        },
        completionLimit: 1,
        currentCompletions: 6200,
        maxCompletions: 10000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'quest-004',
        name: 'Thợ săn huyền thoại',
        description: 'Tiêu diệt 1 boss thế giới',
        type: 'boss_hunt',
        difficulty: 'expert',
        status: 'inactive',
        requirements: {
            type: 'boss_hunt',
            target: 1,
            bossLevel: 50
        },
        rewards: {
            gold: 15000,
            experience: 5000,
            items: ['Vũ Khí Hiếm', 'Áo Giác Huyền Thoại'],
            diamonds: 50
        },
        schedule: {
            startTime: '18:00',
            endTime: '22:00',
            resetDaily: true
        },
        completionLimit: 1,
        currentCompletions: 0,
        maxCompletions: 5000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    }
];

const mockTemplates: QuestTemplate[] = [
    {
        id: 'template-login',
        name: 'Đăng nhập hàng ngày',
        type: 'login',
        difficulty: 'easy',
        baseRewards: {
            gold: 1000,
            experience: 500,
            items: ['Rương Báu Vật Nhỏ']
        },
        requirements: {
            type: 'login',
            target: 1
        },
        description: 'Mẫu nhiệm vụ đăng nhập hàng ngày'
    },
    {
        id: 'template-battle',
        name: 'Tham chiến PvP',
        type: 'pvp_battle',
        difficulty: 'medium',
        baseRewards: {
            gold: 5000,
            experience: 2000,
            items: ['Ngọc Hồn Lv.3']
        },
        requirements: {
            type: 'pvp_battle',
            target: 3
        },
        description: 'Mẫu nhiệm vụ tham chiến PvP'
    }
];

export default function DailyQuestsPage() {
    const [quests, setQuests] = useState<DailyQuest[]>(mockDailyQuests);
    const [templates, setTemplates] = useState<QuestTemplate[]>(mockTemplates);
    const [stats, setStats] = useState<QuestStats>(mockQuestStats);
    const [activeTab, setActiveTab] = useState('management');
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const activeQuests = quests.filter(q => q.status === 'active');
    const inactiveQuests = quests.filter(q => q.status === 'inactive');
    const { data, isFetching } = useQuery({
        queryKey: ["daily_quests"], // cache key
        queryFn: async () => await supabase.from("daily_quests").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });

    const { data: quest_stats, isFetching: isFetchingQuest_stats } = useQuery({
        queryKey: ["daily_quests"], // cache key
        queryFn: async () => await supabase.from("daily_quests").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });


    const { data:questTemplates , isFetching: isFetchingQuestTemplates } = useQuery({
        queryKey: ["quest_templates"], // cache key
        queryFn: async () => await supabase.from("quest_templates").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });

    useEffect(() => {
        console.log("Template: ", questTemplates)
    }, [questTemplates])
    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ color: '#8B0000', margin: 0 }}>
                    Nhiệm Vụ Hằng Ngày
                </Title>
                <Space>
                    <Button
                        icon={<SyncOutlined />}
                        loading={loading}
                        onClick={handleRefresh}
                    >
                        Làm Mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ background: '#8B0000', borderColor: '#8B0000' }}
                    >
                        Tạo Nhiệm Vụ
                    </Button>
                </Space>
            </Space>

            {/* Stats Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Tổng Nhiệm Vụ"
                            value={stats.totalQuests}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Đang Hoạt Động"
                            value={stats.activeQuests}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#2E8B57' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Hoàn Thành Hôm Nay"
                            value={stats.completedToday}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#D4AF37' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Tỷ Lệ Hoàn Thành"
                            value={stats.completionRate}
                            suffix="%"
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#2E8B57' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Tổng Thưởng"
                            value={stats.totalRewards}
                            prefix="₫"
                            valueStyle={{ color: '#D4AF37' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Tương Tác Người Chơi"
                            value={stats.playerEngagement}
                            suffix="%"
                            valueStyle={{ color: '#003366' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Active Quests Alert */}
            {activeQuests.length === 0 && (
                <Alert
                    message="Không có nhiệm vụ nào đang hoạt động"
                    description="Hãy kích hoạt hoặc tạo mới các nhiệm vụ để người chơi có thể tham gia."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Card variant="borderless">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'management',
                            label: `Quản Lý Nhiệm Vụ (${quests.length})`,
                            children: (
                                <DailyQuestManager
                                    quests={data?.data ?? []}
                                    onQuestsChange={setQuests}
                                    loading={isFetching}
                                />
                            ),
                        },
                        {
                            key: 'analytics',
                            label: 'Phân Tích & Thống Kê',
                            children: <QuestAnalytics stats={quest_stats?.data ?? []} quests={data?.data ?? []}  />,
                        },
                        {
                            key: 'templates',
                            label: `Mẫu Nhiệm Vụ (${templates.length})`,
                            children: (
                                <QuestTemplates
                                    templates={questTemplates?.data?? []}
                                    onTemplatesChange={setTemplates}
                                />
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
