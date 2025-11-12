'use client';

import React, { useState, useCallback } from 'react';
import { Row, Col, Card, Typography, Space, notification, Spin, Alert, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PlayerTable from './components/PlayerTable';
import PlayerFilters from './components/PlayerFilters';
import PlayerActions from './components/PlayerActions';
import { Player, PlayerFilters as PlayerFiltersType } from '@/types/player';
import { usePlayers, useDeletePlayer, useBanPlayer, useSuspendPlayer, useUpdatePlayer, useCreatePlayer } from '@/lib/hooks/usePlayers';
import CreatePlayerModal from '@/components/admin/players/CreatePlayerModal';

const { Title } = Typography;

export default function PlayersPage() {
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
    const [filters, setFilters] = useState<PlayerFiltersType>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // React Query hooks
    const {
        data: playersData,
        isLoading,
        isFetching,
        error,
        refetch
    } = usePlayers(page, pageSize, filters);

    // Mutation hooks
    const deletePlayerMutation = useDeletePlayer();
    const banPlayerMutation = useBanPlayer();
    const suspendPlayerMutation = useSuspendPlayer();
    const updatePlayerMutation = useUpdatePlayer();
    const createPlayerMutation = useCreatePlayer();

    // Filter handler
    const handleFilterChange = useCallback((newFilters: PlayerFiltersType) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    }, []);

    // Pagination handler
    const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    // Player action handlers
    const handleViewDetails = useCallback((player: Player) => {
        notification.info({
            message: 'Xem chi tiết',
            description: `Đang mở chi tiết người chơi: ${player.username}`,
        });
        // Open in new tab or modal
        window.open(`/admin/players/${player.id}`, '_blank');
    }, []);

    const handleEditPlayer = useCallback((player: Player) => {
        notification.info({
            message: 'Chỉnh sửa người chơi',
            description: `Đang mở chỉnh sửa: ${player.username}`,
        });
        // Implement edit modal logic here
    }, []);

    // Bulk actions handler
    const handleBulkAction = useCallback(async (action: string) => {
        if (selectedPlayers.length === 0) {
            notification.warning({
                message: 'Cảnh báo',
                description: 'Vui lòng chọn ít nhất một người chơi',
            });
            return;
        }

        try {
            switch (action) {
                case 'delete':
                    for (const player of selectedPlayers) {
                        await deletePlayerMutation.mutateAsync(player.id);
                    }
                    notification.success({
                        message: 'Thành công',
                        description: `Đã xóa ${selectedPlayers.length} người chơi`,
                    });
                    break;

                case 'ban':
                    for (const player of selectedPlayers) {
                        await banPlayerMutation.mutateAsync(player.id);
                    }
                    notification.success({
                        message: 'Thành công',
                        description: `Đã cấm ${selectedPlayers.length} người chơi`,
                    });
                    break;

                case 'suspend':
                    for (const player of selectedPlayers) {
                        await suspendPlayerMutation.mutateAsync(player.id);
                    }
                    notification.success({
                        message: 'Thành công',
                        description: `Đã tạm ngưng ${selectedPlayers.length} người chơi`,
                    });
                    break;

                case 'activate':
                    for (const player of selectedPlayers) {
                        await updatePlayerMutation.mutateAsync({
                            id: player.id,
                            data: { status: 'online' }
                        });
                    }
                    notification.success({
                        message: 'Thành công',
                        description: `Đã kích hoạt ${selectedPlayers.length} người chơi`,
                    });
                    break;

                default:
                    notification.warning({
                        message: 'Hành động không hợp lệ',
                        description: `Hành động "${action}" không được hỗ trợ`,
                    });
                    return;
            }

            // Clear selection after successful action
            setSelectedPlayers([]);

            // Refresh data
            refetch();

        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: `Không thể thực hiện hành động: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    }, [selectedPlayers, deletePlayerMutation, banPlayerMutation, suspendPlayerMutation, updatePlayerMutation, refetch]);

    // Create player handlers
    const handleOpenCreateModal = useCallback(() => {
        setCreateModalOpen(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setCreateModalOpen(false);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        handleCloseCreateModal();
        refetch();
        notification.success({
            message: 'Thành công',
            description: 'Người chơi mới đã được tạo thành công!',
        });
    }, [handleCloseCreateModal, refetch]);

    // Refresh data
    const handleRefresh = useCallback(() => {
        refetch();
        notification.info({
            message: 'Đang làm mới dữ liệu',
            description: 'Dữ liệu người chơi đang được cập nhật...',
        });
    }, [refetch]);

    // Clear selection
    const handleClearSelection = useCallback(() => {
        setSelectedPlayers([]);
        notification.info({
            message: 'Đã xóa lựa chọn',
            description: 'Tất cả người chơi đã được bỏ chọn',
        });
    }, []);

    // Loading state
    const isTableLoading = isLoading || isFetching;
    const isMutationLoading = deletePlayerMutation.isPending ||
        banPlayerMutation.isPending ||
        suspendPlayerMutation.isPending ||
        createPlayerMutation.isPending;

    // Error state
    if (error) {
        return (
            <div>
                <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                    Quản Lý Người Chơi
                </Title>
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'}
                    type="error"
                    showIcon
                    action={
                        <Space>
                            <Button onClick={() => refetch()} type="primary">
                                Thử lại
                            </Button>
                        </Space>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Quản Lý Người Chơi
            </Title>

            <Row gutter={[16, 16]}>
                {/* Bộ lọc */}

                {/* Nội dung chính */}
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Hành động */}
                    <PlayerActions
                        handelModalOpen={handleOpenCreateModal}
                        onBulkAction={handleBulkAction}
                        loading={isTableLoading || isMutationLoading}
                    />

                    {/* Bảng dữ liệu */}
                    <Card
                        variant="borderless"
                        style={{
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                            borderRadius: 8
                        }}
                    >
                        <PlayerTable
                            players={playersData?.players || []}
                            selectedPlayers={selectedPlayers}
                            onSelectionChange={setSelectedPlayers}
                            currentPage={page}
                            totalCount={playersData?.totalCount || 0}
                            pageSize={pageSize}
                            onEditPlayer={handleEditPlayer}
                            onPageChange={handlePageChange}
                            onViewDetails={handleViewDetails}
                            loading={isTableLoading}
                        />
                    </Card>

                    {/* Loading states for mutations */}
                    {isMutationLoading && (
                        <Alert
                            message="Đang xử lý..."
                            description="Vui lòng chờ trong khi các thao tác đang được thực hiện"
                            type="info"
                            showIcon
                        />
                    )}
                </Space>
            </Row>

            {/* Create Player Modal */}
            <CreatePlayerModal
                open={createModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
