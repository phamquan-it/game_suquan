'use client';

import React from 'react';
import { Button, Card } from 'antd';
import { useAllianceMutation } from '@/lib/hooks/admin/useAllianceMutation';

export default function AllianceTestButton() {
    const { createAlliance } = useAllianceMutation();

    const handleCreate = () => {
        createAlliance.mutate({
            name: 'Test Alliance',
            tag: 'TEST',
            max_members: 50,
            leader: '60696b26-74c0-45f6-b4da-6f2e49197097', // <- valid UUID for test
            requirements: { minLevel: 1, minPower: 0, approvalRequired: false },
        });
    };

    return (
        <Card style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
            <Button
                type="primary"
                onClick={handleCreate}
                loading={createAlliance.isPending}
            >
                Create Test Alliance
            </Button>
        </Card>
    );
}

