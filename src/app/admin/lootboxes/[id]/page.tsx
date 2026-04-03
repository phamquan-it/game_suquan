// app/admin/lootboxes/[id]/page.tsx (Refactored)
'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  Spin,
  Empty,
  message,
  Modal,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../services/lootbox.service';
import { LootBoxRewardsTab } from './components/tabs/LootBoxRewardsTab';
import { LootBoxPityTab } from './components/tabs/LootBoxPityTab';
import { LootBoxGuaranteedTab } from './components/tabs/LootBoxGuaranteedTab';
import { LootBoxStreakTab } from './components/tabs/LootBoxStreakTab';
import { LootBoxFirstTimeTab } from './components/tabs/LootBoxFirstTimeTab';
import { LootBoxAnalyticsTab } from './components/tabs/LootBoxAnalyticsTab';
import { LootBoxOverviewTab } from './components/tabs/LootBoxOverviewTab';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface LootBoxDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LootBoxDetailPage({ params }: LootBoxDetailPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Fetch loot box details
  const { data: lootBox, isLoading, error } = useQuery({
    queryKey: ['lootBox', id],
    queryFn: () => lootBoxService.getLootBoxById(id),
  });

  // Fetch reward tables
  const { data: rewardTables } = useQuery({
    queryKey: ['rewardTables', id],
    queryFn: () => lootBoxService.getRewardTables(id),
    enabled: !!id,
  });

  // Fetch pity system
  const { data: pitySystem } = useQuery({
    queryKey: ['pitySystem', id],
    queryFn: () => lootBoxService.getPitySystem(id),
    enabled: !!id,
  });

  // Fetch guaranteed drops
  const { data: guaranteedDrops } = useQuery({
    queryKey: ['guaranteedDrops', id],
    queryFn: () => lootBoxService.getGuaranteedDrops(id),
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => lootBoxService.deleteLootBox(id),
    onSuccess: () => {
      message.success('Xóa hòm quà thành công');
      router.push('/admin/lootboxes');
    },
    onError: (error: any) => {
      message.error(error.message || 'Xóa hòm quà thất bại');
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async () => {
      if (!lootBox) throw new Error('Không tìm thấy hòm quà');
      const { id: _, ...rest } = lootBox;
      return lootBoxService.createLootBox({
        ...rest,
        name: `${rest.name} (Bản sao)`,
        id: `${rest.name}_copy_${Date.now()}`,
      });
    },
    onSuccess: (newLootBox) => {
      message.success('Nhân bản hòm quà thành công');
      router.push(`/admin/lootboxes/${newLootBox.id}`);
    },
    onError: (error: any) => {
      message.error(error.message || 'Nhân bản hòm quà thất bại');
    },
  });

  const handleDelete = () => {
    confirm({
      title: 'Xóa Hòm Quà',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa hòm quà này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        return deleteMutation.mutateAsync();
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate();
  };

  const handleEditRewards = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=rewards`);
  };

  const handleEditPity = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=pity`);
  };

  const handleEditGuaranteed = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=guaranteed`);
  };

  const handleEditStreak = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=streak`);
  };

  const handleEditFirstTime = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=firsttime`);
  };

  const handleAddRewardTable = () => {
    router.push(`/admin/lootboxes/${id}/edit?tab=rewards&action=add`);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !lootBox) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không tìm thấy hòm quà"
        >
          <Button type="primary" onClick={() => router.push('/admin/lootboxes')}>
            Quay lại danh sách
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/admin/lootboxes')}
            >
              Quay lại
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {lootBox.name}
              </Title>
              <Text type="secondary">ID: {lootBox.id}</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={handleDuplicate}
              loading={duplicateMutation.isPending}
            >
              Nhân bản
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${id}/edit`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Xóa
            </Button>
          </Space>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: 'overview',
            label: 'Tổng quan',
            children: (
              <LootBoxOverviewTab
                lootBox={lootBox}
                rewardTablesCount={rewardTables?.length || 0}
                pitySystemEnabled={pitySystem?.enabled || false}
                guaranteedDropsCount={guaranteedDrops?.length || 0}
                onEditRewards={handleEditRewards}
                onEditPity={handleEditPity}
                onEditGuaranteed={handleEditGuaranteed}
              />
            ),
          },
          {
            key: 'rewards',
            label: 'Bảng thưởng',
            children: (
              <LootBoxRewardsTab
                rewardTables={rewardTables ?? []}
                lootBoxId={id}
                onAddRewardTable={handleAddRewardTable}
              />
            ),
          },
          {
            key: 'pity',
            label: 'Hệ thống tích lũy',
            children: <LootBoxPityTab lootBoxId={id} />,
          },
          {
            key: 'guaranteed',
            label: 'Phần thưởng đảm bảo',
            children: <LootBoxGuaranteedTab lootBoxId={id} />,
          },
          {
            key: 'streak',
            label: 'Thưởng chuỗi',
            children: (
              <LootBoxStreakTab
                rewardTables={rewardTables ?? []}
                lootBoxId={id}
                onEditStreak={handleEditStreak}
              />
            ),
          },
          {
            key: 'firsttime',
            label: 'Thưởng lần đầu',
            children: (
              <LootBoxFirstTimeTab
                rewardTables={rewardTables ?? []}
                lootBoxId={id}
                onEditFirstTime={handleEditFirstTime}
              />
            ),
          },
          {
            key: 'analytics',
            label: 'Phân tích',
            children: <LootBoxAnalyticsTab lootBoxId={id} />,
          },
        ]}
      />
    </div>
  );
}
