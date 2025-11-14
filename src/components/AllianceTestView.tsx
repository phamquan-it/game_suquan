'use client';

import React, { useState } from 'react';
import { Card, Input, InputNumber, Button, Space, Typography } from 'antd';
import { useAllianceMutation } from '@/lib/hooks/admin/useAllianceMutation';

const { Title } = Typography;

export default function AllianceTestView() {
    const { createAlliance, updateAlliance, deleteAlliance } = useAllianceMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState<number>(50);
    const [updateId, setUpdateId] = useState('');
    const [deleteId, setDeleteId] = useState('');

    return (
        <Card title="Alliance Mutation Test" style={{ maxWidth: 600, margin: '40px auto' }}>
            <Title level={5}>Create Alliance</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Alliance name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <InputNumber
                    placeholder="Max members"
                    value={maxMembers}
                    onChange={(val) => setMaxMembers(val || 50)}
                    style={{ width: '100%' }}
                />
                <Button
                    type="primary"
                    loading={createAlliance.isPending}
                    onClick={() => {
                        createAlliance.mutate({
                            leader: '',
                            requirements: [],
                            tag: [],
                            name,
                            description,
                            max_members: maxMembers,
                        });
                    }}
                >
                    Create Alliance
                </Button>
            </Space>

            <br /><br />
            <Title level={5}>Update Alliance</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Alliance ID to update"
                    value={updateId}
                    onChange={(e) => setUpdateId(e.target.value)}
                />
                <Input
                    placeholder="New Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    type="default"
                    loading={updateAlliance.isPending}
                    onClick={() => {
                        updateAlliance.mutate({
                            id: updateId,
                            data: { description },
                        });
                    }}
                >
                    Update Alliance
                </Button>
            </Space>

            <br /><br />
            <Title level={5}>Delete Alliance</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Alliance ID to delete"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                />
                <Button
                    danger
                    loading={deleteAlliance.isPending}
                    onClick={() => deleteAlliance.mutate(deleteId)}
                >
                    Delete Alliance
                </Button>
            </Space>
        </Card>
    );
}

