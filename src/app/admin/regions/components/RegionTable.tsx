'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  BankOutlined,
  ExpandOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Region } from '../types/region.types';
import { useRegions, useDeleteRegion } from '../hooks/useRegions';
import RegionModal from './RegionModal';
import dayjs from 'dayjs';

interface RegionTableProps {
  onViewBuildings: (region: Region) => void;
  onViewExpansion: (region: Region) => void;
}

const RegionTable: React.FC<RegionTableProps> = ({ onViewBuildings, onViewExpansion }) => {
  const { data: regions, isLoading } = useRegions();
  const deleteRegion = useDeleteRegion();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRegion.mutateAsync(id);
  };

  const columns: ColumnsType<Region> = [
    {
      title: 'Region ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Tag color="royalNavy" style={{ fontFamily: 'monospace' }}>
          {id}
        </Tag>
      ),
    },
    {
      title: 'Lord Name',
      dataIndex: 'lord_name',
      key: 'lord_name',
      render: (name: string) => (
        <span style={{ color: '#8B4513', fontWeight: 'bold' }}>{name}</span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Manage Buildings">
            <Button 
              type="text" 
              icon={<BankOutlined />} 
              onClick={() => onViewBuildings(record)}
              style={{ color: '#003366' }}
            />
          </Tooltip>
          <Tooltip title="Expansion Costs">
            <Button 
              type="text" 
              icon={<ExpandOutlined />} 
              onClick={() => onViewExpansion(record)}
              style={{ color: '#D4AF37' }}
            />
          </Tooltip>
          <Tooltip title="Edit Region">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              style={{ color: '#8B0000' }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Region"
            description="Are you sure you want to delete this region? This will also delete all associated buildings and expansion costs."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Region">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#8B0000', margin: 0 }}>Region Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRegion(null);
            setModalVisible(true);
          }}
          style={{ backgroundColor: '#8B0000' }}
        >
          Create Region
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={regions}
        loading={isLoading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        style={{ background: '#FFFFFF', borderRadius: 12 }}
      />

      <RegionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={editingRegion}
      />
    </>
  );
};

export default RegionTable;
