// app/(admin)/achievements/page.tsx
'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { AchievementList } from '@/components/admin/achievements/AchievementList';
import { AchievementDetail } from '@/components/admin/achievements/AchievementDetail';
import { CreateAchievementForm } from '@/components/admin/achievements/CreateAchievementForm';
import { Achievement } from '@/lib/types/achievements/achievement';
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AchievementsPage: React.FC = () => {
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const { data } = useQuery({
        queryKey: ["v_achievements_full"],
        queryFn: async (): Promise<Achievement[]> => {
            const { data, error } = await supabase
                .from("v_achievements_full") // ← view name
                .select("*");

            if (error) throw new Error(error.message);
            return data as Achievement[];
        },
        staleTime: 1000 * 60,
    });
    const handleView = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setDetailVisible(true);
    };

    const handleEdit = (achievement: Achievement) => {
        // Navigate to edit page or open edit modal
        console.log('Edit achievement:', achievement);
    };

    const handleCreate = () => {
        setCreateVisible(true);
    };

    return (
        <Layout.Content style={{ padding: '24px' }}>
            <AchievementList
                achievements={data ?? []}
                onView={handleView}
                onEdit={handleEdit}
                onCreate={handleCreate}
            />

            {/* Achievement Detail Modal */}
            {selectedAchievement && (
                <AchievementDetail
                    achievement={selectedAchievement}
                    visible={detailVisible}
                    onClose={() => setDetailVisible(false)}
                />
            )}

            {/* Create Achievement Modal */}
            <CreateAchievementForm
                visible={createVisible}
                onClose={() => setCreateVisible(false)}
                onSave={(achievement: any) => {
                    console.log('Save achievement:', achievement);
                    setCreateVisible(false);
                }}
            />
        </Layout.Content>
    );
};

export default AchievementsPage;
