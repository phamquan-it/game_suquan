// app/(admin)/loot-boxes/create/page.tsx
'use client';

import React, { useState } from 'react';
import { Layout, notification } from 'antd';
import { useRouter } from 'next/navigation';
import CreateLootBoxForm from '@/components/admin/loot-box/CreateLootBoxForm';
import { LootBox } from '@/lib/types/loot-box';

const CreateLootBoxPage: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSave = async (lootBoxData: Partial<LootBox>) => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            console.log('Saving loot box:', lootBoxData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            notification.success({
                message: 'Thành công',
                description: 'Đã tạo rương quà mới thành công',
            });

            router.push('/loot-boxes');
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tạo rương quà. Vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/loot-boxes');
    };

    return (
        <Layout.Content style={{ background: '#f0f2f5', minHeight: '100vh' }}>
            <CreateLootBoxForm
                onSave={handleSave}
                onCancel={handleCancel}
                loading={loading}
            />
        </Layout.Content>
    );
};

export default CreateLootBoxPage;
