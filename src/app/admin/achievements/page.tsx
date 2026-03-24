// app/admin/achievements/page.tsx
'use client';

import React, { useState } from 'react';
import {
    Layout,
    Typography,
    Button,
    Space,
    Modal,
    message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AchievementList } from './components/AchievementList';
import { AchievementStatsComponent } from './components/AchievementStats';
import { AchievementFiltersComponent } from './components/AchievementFilters';
import { AchievementForm } from './components/AchievementForm';
import { useAchievements } from './hooks/useAchievements';
import { useAchievement } from './hooks/useAchievement';
import { Achievement, AchievementFormData } from './types';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function AchievementsPage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>();

    const {
        achievements,
        loading,
        filters,
        setFilters,
        stats,
        deleteAchievement,
        updateStatus,
        refresh,
    } = useAchievements();

    const {
        saving,
        createAchievement,
        updateAchievement,
    } = useAchievement();

    const handleEdit = (id: string) => {
        const achievement = achievements.find(a => a.id === id);
        setEditingAchievement(achievement);
        setModalVisible(true);
    };

    const handleCreate = () => {
        setEditingAchievement(undefined);
        setModalVisible(true);
    };

    const handleDuplicate = (achievement: Achievement) => {
        const { id, created_at, updated_at, completion_rate, average_time, first_completion, total_completions, ...duplicateData } = achievement;
        setEditingAchievement({
            ...duplicateData,
            id: `${achievement.id}_copy`,
            name: `${achievement.name} (Copy)`,
        } as Achievement);
        setModalVisible(true);
    };

    const handleSave = async (values: AchievementFormData) => {
        try {
            if (editingAchievement) {
                await updateAchievement(editingAchievement.id, values);
            } else {
                await createAchievement(values);
            }
            setModalVisible(false);
            refresh();
        } catch (error) {
            message.error('Failed to save achievement');
        }
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            type: [],
            category: [],
            tier: [],
            rarity: [],
            difficulty: [],
            status: [],
            repeatable: null,
        });
    };

    return (
        <Layout className="min-h-screen bg-ivory">
            <Header className="bg-imperialRed text-white flex items-center px-6">
                <Title level={3} className="text-white !mb-0 !text-white">
                    Achievement Management
                </Title>
            </Header>

            <Content className="p-6">
                <Space direction="vertical" size="large" className="w-full">
                    {/* Stats Section */}
                    <AchievementStatsComponent stats={stats} />

                    {/* Filters Section */}
                    <AchievementFiltersComponent
                        filters={filters}
                        onFilterChange={setFilters}
                        onReset={resetFilters}
                    />

                    {/* Actions Section */}
                    <div className="flex justify-between items-center">
                        <Title level={4} className="!mb-0">
                            Achievements List ({achievements.length})
                        </Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            size="large"
                        >
                            Create Achievement
                        </Button>
                    </div>

                    {/* Achievements Table */}
                    <AchievementList
                        achievements={achievements}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={deleteAchievement}
                        onStatusChange={updateStatus}
                        onDuplicate={handleDuplicate}
                    />
                </Space>
            </Content>
            {/* Create/Edit Modal */}
            <Modal
                title={editingAchievement ? 'Edit Achievement' : 'Create Achievement'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {/* CREATE */}
                {!editingAchievement && (
                    <AchievementForm
                        onSave={handleSave}
                        onCancel={() => setModalVisible(false)}
                        saving={saving}
                    />
                )}

                {/* EDIT */}
                {editingAchievement && (
                    <AchievementForm
                        key={editingAchievement.id} // 🔑 cực kỳ quan trọng
                        initialValues={editingAchievement}
                        onSave={handleSave}
                        onCancel={() => setModalVisible(false)}
                        saving={saving}
                    />
                )}
            </Modal>
        </Layout>
    );
}
