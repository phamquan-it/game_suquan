// app/admin/units/UnitManagementPage.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Layout, Button, Space, Typography, Tabs, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import theme from '@/theme/themeConfig';
import { CreateUnitDTO, UnitFilterParams, UnitWithSkills, UpdateUnitDTO } from '../types';
import UnitStats from './UnitStats';
import UnitFilters from './UnitFilters';
import UnitTable from './UnitTable';
import UnitForm from './UnitForm';
import UnitDeleteModal from './UnitDeleteModal';
import UnitSkillsManager from './UnitSkillsManager';
import { useAssignSkill, useCreateUnit, useDeleteUnit, useRemoveSkill, useUpdateUnit } from '../hooks/useUnitMutations';
import { useUnitsQuery } from '../hooks/useUnitsQuery';

const { Header, Content } = Layout;
const { Title } = Typography;

const UnitManagementPage: React.FC = () => {
  const [filters, setFilters] = useState<UnitFilterParams>({});
  const [selectedUnit, setSelectedUnit] = useState<UnitWithSkills | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [skillsManagerVisible, setSkillsManagerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Queries
  const { 
    data, 
    isLoading, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useUnitsQuery(filters);

  // Mutations
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const assignSkill = useAssignSkill();
  const removeSkill = useRemoveSkill();

  // Flatten paginated data
  const units = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = units.length;
    const vipUnits = units.filter(u => u.isVip).length;
    const specialUnits = units.filter(u => u.isSpecial).length;
    const avgLevel = units.reduce((acc, u) => acc + u.level, 0) / total || 0;
    
    const unitsByType = units.reduce((acc, u) => {
      acc[u.type] = (acc[u.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, vipUnits, specialUnits, avgLevel, unitsByType };
  }, [units]);

  const handleCreate = () => {
    setSelectedUnit(null);
    setFormVisible(true);
  };

  const handleEdit = (unit: UnitWithSkills) => {
    setSelectedUnit(unit);
    setFormVisible(true);
  };

  const handleView = (unit: UnitWithSkills) => {
    message.info(`Viewing ${unit.name} - Feature coming soon`);
  };

  const handleManageSkills = (unit: UnitWithSkills) => {
    setSelectedUnit(unit);
    setSkillsManagerVisible(true);
  };

  const handleDelete = (id: string) => {
    const unit = units.find(u => u.id === id);
    if (unit) {
      setSelectedUnit(unit as UnitWithSkills);
      setDeleteModalVisible(true);
    }
  };

  const handleFormSubmit = async (values: CreateUnitDTO) => {
    if (selectedUnit) {
      await updateUnit.mutateAsync({ ...values, id: selectedUnit.id } as UpdateUnitDTO);
    } else {
      await createUnit.mutateAsync(values);
    }
    setFormVisible(false);
    setSelectedUnit(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUnit) {
      await deleteUnit.mutateAsync(selectedUnit.id);
      setDeleteModalVisible(false);
      setSelectedUnit(null);
    }
  };

  const handleAssignSkill = async (skillId: string) => {
    if (selectedUnit) {
      await assignSkill.mutateAsync({ unitId: selectedUnit.id, skillId });
      setSkillsManagerVisible(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (selectedUnit) {
      await removeSkill.mutateAsync({ unitId: selectedUnit.id, skillId });
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: theme.token?.colorBgBase }}>
      <Header style={{ 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Unit Management - 12 Warlords
        </Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => refetch()}
            style={{ background: 'white' }}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            style={{ background: theme.token?.colorPrimary }}
          >
            Create Unit
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24 }}>
        <UnitStats 
          totalUnits={stats.total}
          totalVipUnits={stats.vipUnits}
          totalSpecialUnits={stats.specialUnits}
          averageLevel={stats.avgLevel}
          unitsByType={stats.unitsByType}
        />

        <Tabs
          defaultActiveKey="all"
          items={[
            { key: 'all', label: 'All Units' },
            { key: 'infantry', label: 'Infantry' },
            { key: 'cavalry', label: 'Cavalry' },
            { key: 'archer', label: 'Archer' },
            { key: 'siege', label: 'Siege' },
            { key: 'mythical', label: 'Mythical' },
            { key: 'legendary', label: 'Legendary' },
          ]}
          onChange={(key) => setFilters({ ...filters, type: key as any })}
          style={{ marginBottom: 16 }}
        />

        <UnitFilters 
          filters={filters}
          onFilterChange={setFilters}
        />

        <UnitTable 
          data={units}
          loading={isLoading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onManageSkills={handleManageSkills}
        />

        {hasNextPage && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button 
              onClick={handleLoadMore} 
              loading={isFetchingNextPage}
            >
              Load More
            </Button>
          </div>
        )}
      </Content>

      <UnitForm
        visible={formVisible}
        unit={selectedUnit}
        onCancel={() => {
          setFormVisible(false);
          setSelectedUnit(null);
        }}
        onSubmit={handleFormSubmit}
        loading={createUnit.isPending || updateUnit.isPending}
      />

      <UnitSkillsManager
        visible={skillsManagerVisible}
        unit={selectedUnit}
        onClose={() => {
          setSkillsManagerVisible(false);
          setSelectedUnit(null);
        }}
        onAssignSkill={handleAssignSkill}
        onRemoveSkill={handleRemoveSkill}
        loading={assignSkill.isPending || removeSkill.isPending}
      />

      <UnitDeleteModal
        visible={deleteModalVisible}
        unit={selectedUnit}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedUnit(null);
        }}
        loading={deleteUnit.isPending}
      />
    </Layout>
  );
};

export default UnitManagementPage;
