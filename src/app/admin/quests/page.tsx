'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Pagination, Modal, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QuestList } from './components/QuestList';
import { QuestFilters } from './components/QuestFilters';
import { QuestStats } from './components/QuestStats';
import { QuestForm } from './components/QuestForm';
import { useQuests } from './hooks/useQuests';
import { useCreateQuest, useUpdateQuest } from './hooks/useQuestMutations';
import { QuestFilters as FiltersType, DEFAULT_QUEST_FORM } from './types/quest.types';
import { Quest } from './types';

export default function QuestsPage() {
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    pageSize: 10,
    search: '',
    category: 'all',
    difficulty: 'all',
    status: 'all',
    type: 'all',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | undefined>();

  const { data, isLoading } = useQuests(filters);
  const createQuest = useCreateQuest();
  const updateQuest = useUpdateQuest();

  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      search: '',
      category: 'all',
      difficulty: 'all',
      status: 'all',
      type: 'all',
    });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters(prev => ({ ...prev, page, pageSize: pageSize || prev.pageSize }));
  };

  const handleCreateQuest = () => {
    setSelectedQuest(undefined);
    setModalVisible(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setModalVisible(true);
  };

  const handleViewQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setDrawerVisible(true);
  };

  const handleSubmitQuest = (values: any) => {
    if (selectedQuest) {
      updateQuest.mutate({ id: selectedQuest.id, ...values });
    } else {
      createQuest.mutate(values);
    }
    setModalVisible(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-imperialRed font-cinzel">
          Quản lý nhiệm vụ
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateQuest}
          className="bg-imperialRed hover:bg-imperialRed-dark"
          size="large"
        >
          Tạo nhiệm vụ mới
        </Button>
      </div>

      {data?.data && <QuestStats quests={data.data} />}

      <Card className="shadow-lg">
        <QuestFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <QuestList
          quests={data?.data || []}
          loading={isLoading}
          onEdit={handleEditQuest}
          onView={handleViewQuest}
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={filters.page}
            pageSize={filters.pageSize}
            total={data?.total || 0}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng số ${total} nhiệm vụ`}
          />
        </div>
      </Card>

      <Modal
        title={selectedQuest ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <QuestForm
          initialData={selectedQuest}
          onSubmit={handleSubmitQuest}
          onCancel={() => setModalVisible(false)}
          loading={createQuest.isPending || updateQuest.isPending}
        />
      </Modal>

      <Drawer
        title="Chi tiết nhiệm vụ"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
        destroyOnClose
      >
        {selectedQuest && (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedQuest.name}</h2>
            {/* Add detailed view here */}
          </div>
        )}
      </Drawer>
    </div>
  );
}
