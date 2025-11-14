'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Typography, notification, Spin, Alert } from 'antd';
import AllianceTable from './components/AllianceTable';
import AllianceMetrics from './components/AllianceMetrics';
import { Alliance } from '@/types/alliance'; // Updated import path
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allianceService } from '@/lib/hooks/useAlliances';
import { useAllianceMetrics } from '@/lib/hooks/useAllianceAnalysis';
import AllianceFormModal from '@/components/AllianceFormModal';

const { Title } = Typography;

export default function AlliancesPage() {
    const [selectedAlliances, setSelectedAlliances] = useState<Alliance[]>([]);
    const queryClient = useQueryClient();

    // Fetch alliances with proper service
    const {
        data: alliancesData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['alliances'],
        queryFn: () => allianceService.getAlliances(0, 100), // Get first 100 alliances
    });

    // Mutation for bulk actions
    const bulkActionMutation = useMutation({
        mutationFn: async ({ action, allianceIds }: { action: string; allianceIds: string[] }) => {
            switch (action) {
                case 'suspend':
                    // Update each alliance to suspended status
                    await Promise.all(
                        allianceIds.map(id =>
                            allianceService.updateAllianceStatus(id, 'suspended')
                        )
                    );
                    break;
                case 'activate':
                    // Update each alliance to active status
                    await Promise.all(
                        allianceIds.map(id =>
                            allianceService.updateAllianceStatus(id, 'active')
                        )
                    );
                    break;
                case 'disband':
                    // Soft delete by setting to inactive
                    await Promise.all(
                        allianceIds.map(id =>
                            allianceService.deleteAlliance(id)
                        )
                    );
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['alliances'] });

            notification.success({
                message: 'Thành công',
                description: `Đã thực hiện hành động ${getActionText(variables.action)} cho ${variables.allianceIds.length} liên minh`,
            });

            setSelectedAlliances([]);
        },
        onError: (error: Error) => {
            notification.error({
                message: 'Lỗi',
                description: `Không thể thực hiện hành động: ${error.message}`,
            });
        }
    });

    const handleBulkAction = async (action: string, allianceIds: string[]) => {
        bulkActionMutation.mutate({ action, allianceIds });
    };

    // Calculate metrics from the actual data
    const calculateMetrics = () => {
        const alliances = alliancesData?.data || [];

        if (alliances.length === 0) {
            return {
                totalAlliances: 0,
                activeAlliances: 0,
                totalMembers: 0,
                totalPower: 0,
                avgWinRate: 0,
            };
        }

        const totalAlliances = alliances.length;
        const activeAlliances = 0;
        const totalMembers = 0;
        const totalPower = 0;
        const avgWinRate = 0;

        return {
            totalAlliances,
            activeAlliances,
            totalMembers,
            totalPower,
            avgWinRate,
        };
    };

    const getActionText = (action: string): string => {
        switch (action) {
            case 'suspend': return 'tạm đình chỉ';
            case 'activate': return 'kích hoạt';
            case 'disband': return 'giải tán';
            default: return action;
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Typography.Text type="secondary">
                        Đang tải dữ liệu liên minh...
                    </Typography.Text>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={`Không thể tải danh sách liên minh: ${error?.message || 'Unknown error'}`}
                type="error"
                showIcon
            />
        );
    }

    const alliances: any = alliancesData?.data || [];

    return (
        <div>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Quản Lý Liên Minh
            </Title>
            <AllianceFormModal />
            <Row gutter={[16, 16]}>
                {/* Metrics Overview */}
                <Col xs={24}>
                    <AllianceMetrics metrics={{
                        activeAlliances: 1,
                        avgWinRate: 1,
                        totalAlliances: 1,
                        totalMembers: 1,
                        totalPower: 1
                    }} />
                </Col>

                {/* Main Content */}
                <Col xs={24}>
                    <Card
                        variant="borderless"
                        styles={{ body: { padding: 0 } }}
                    >
                        <AllianceTable
                            alliances={alliances}
                            selectedAlliances={selectedAlliances}
                            onSelectionChange={setSelectedAlliances}
                            onBulkAction={handleBulkAction}
                            loading={isLoading || bulkActionMutation.isPending}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Debug information - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
                    <Title level={5}>Debug Info</Title>
                    <Typography.Text type="secondary">
                        Total alliances: {alliances.length} |
                        Selected: {selectedAlliances.length} |
                        Data source: Supabase
                    </Typography.Text>
                </div>
            )}
        </div>
    );
}
