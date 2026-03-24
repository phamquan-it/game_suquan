'use client';

import { useState } from 'react';
import { Button, Space, Modal, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { BeautyStats } from './components/BeautyStats';
import { BeautyFilters } from './components/BeautyFilters';
import { BeautyTable } from './components/BeautyTable';
import { BeautyForm } from './components/BeautyForm';
import { BeautyDetailModal } from './components/BeautyDetailModal';
import { useBeauties } from './hooks/useBeauties';
import { useBeautyMutations } from './hooks/useBeautyMutations';
import { BeautyCharacter, BeautyCharacterWithRelations } from './types';
import { supabase } from '@/utils/supabase/client';

export default function BeautyPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedBeauty, setSelectedBeauty] = useState<BeautyCharacterWithRelations | null>(null);
  const [editingBeauty, setEditingBeauty] = useState<BeautyCharacter | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Sử dụng state riêng cho filters
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: 'acquisition_date', order: 'descend' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const {
    beauties,
    loading,
    total,
    refresh,
  } = useBeauties({ filters, sortConfig, pagination }); // Truyền vào hook

  const { createBeauty, updateBeauty, deleteBeauty } = useBeautyMutations();

  const handleView = async (record: BeautyCharacter) => {
    try {
      const { data, error } = await supabase
        .from('beauty_characters')
        .select(`
          *,
          skills:beauty_skills(*),
          jewelry:jewelry(*),
          costumes:costumes(*)
        `)
        .eq('id', record.id)
        .single();

      if (error) throw error;
      
      setSelectedBeauty(data);
      setDetailVisible(true);
    } catch (error: any) {
      message.error('Error fetching beauty details: ' + error.message);
    }
  };

  const handleEdit = (record: BeautyCharacter) => {
    setEditingBeauty(record);
    setFormVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Beauty',
      content: 'Are you sure you want to delete this beauty? This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteBeauty(id);
        refresh();
      },
    });
  };

  const handleFormSubmit = async (values: Partial<BeautyCharacter>) => {
    setFormLoading(true);
    try {
      if (editingBeauty) {
        await updateBeauty(editingBeauty.id, values);
      } else {
        await createBeauty(values);
      }
      setFormVisible(false);
      setEditingBeauty(null);
      refresh();
    } finally {
      setFormLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 }); // Reset về trang 1 khi filter
  };

  const handleSortChange = (newSortConfig: any) => {
    setSortConfig(newSortConfig);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#8B4513', fontSize: 28, margin: 0 }}>Beauty Management</h1>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refresh}
            style={{ borderColor: '#8B4513', color: '#8B4513' }}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBeauty(null);
              setFormVisible(true);
            }}
            style={{ background: '#8B0000' }}
          >
            Add New Beauty
          </Button>
        </Space>
      </div>

      <BeautyStats />

      <BeautyFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <BeautyTable
        data={beauties}
        loading={loading}
        total={total}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BeautyForm
        visible={formVisible}
        onCancel={() => {
          setFormVisible(false);
          setEditingBeauty(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingBeauty}
        loading={formLoading}
      />

      <BeautyDetailModal
        visible={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setSelectedBeauty(null);
        }}
        beauty={selectedBeauty}
      />
    </div>
  );
}
