'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
  Typography,
  Avatar,
  Rate,
  Badge,
  Progress,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  StarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { GeneralWithRelations, RARITY_COLORS, ELEMENT_COLORS, STATUS_COLORS } from '../types/general.types';
import GeneralForm from './GeneralForm';
import GeneralDetailModal from './GeneralDetailModal';
import GeneralFilterBar from './GeneralFilterBar';
import { useGenerals } from '../hooks/useGenerals';
import { useDeleteGeneral } from '../hooks/useGeneralMutations';

const { Title, Text } = Typography;

const GeneralTable: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openShards, setOpenShards] = useState(false);
  const [selectedGeneral, setSelectedGeneral] = useState<GeneralWithRelations | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [filters, setFilters] = useState({});

  const { data: generals, isLoading } = useGenerals(filters);
  const deleteGeneral = useDeleteGeneral();

  const handleEdit = (general: GeneralWithRelations) => {
    setSelectedGeneral(general);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleView = (general: GeneralWithRelations) => {
    setSelectedGeneral(general);
    setOpenDetail(true);
  };

  const handleDelete = async (id: string) => {
    await deleteGeneral.mutateAsync(id);
  };

  const calculatePower = (general: GeneralWithRelations) => {
    return Math.round(
      general.current_attack * 2.5 +
      general.current_defense * 2 +
      general.current_health * 1.5 +
      general.current_speed * 3 +
      general.current_intelligence * 2 +
      general.current_leadership * 2
    );
  };

  const columns: ColumnsType<GeneralWithRelations> = [
    {
      title: 'Tướng',
      key: 'general',
      width: 300,
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            src={record.thumbnail || record.image}
            size={50}
            shape="square"
            style={{
              border: `2px solid ${RARITY_COLORS[record.rarity]}`,
            }}
          >
            {record.name[0]}
          </Avatar>
          <Space direction="vertical" size="small">
            <Space>
              <Text strong style={{ fontSize: 16 }}>{record.name}</Text>
              {record.title && (
                <Text type="secondary" style={{ fontSize: 12 }}>{record.title}</Text>
              )}
            </Space>
            <Space size="small" wrap>
              <Tag color={RARITY_COLORS[record.rarity]} style={{ color: '#fff' }}>
                {record.rarity.toUpperCase()}
              </Tag>
              <Tag color={ELEMENT_COLORS[record.element]} style={{ color: '#fff' }}>
                {record.element}
              </Tag>
              <Tag color="blue">{record.type}</Tag>
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Cấp/Sao',
      key: 'level',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            <Text strong>{record.level}/{record.max_level}</Text>
          </Space>
          <Space>
            <StarOutlined style={{ color: '#fadb14' }} />
            <Rate disabled defaultValue={record.star_level} count={record.max_star_level} style={{ fontSize: 12 }} />
          </Space>
        </Space>
      ),
    },
    {
      title: 'Chỉ số',
      key: 'stats',
      width: 200,
      render: (_, record) => {
        const power = calculatePower(record);
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Badge 
              status="processing" 
              text={
                <Text type="secondary">
                  ATK: {record.current_attack} | DEF: {record.current_defense}
                </Text>
              } 
            />
            <Progress 
              percent={Math.round((record.experience / record.required_exp) * 100)} 
              size="small"
              format={(percent) => `${percent}% EXP`}
            />
            <Tag color="gold">Sức mạnh: {power.toLocaleString()}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical">
          <Tag color={STATUS_COLORS[record.status]}>
            {record.status === 'active' && 'Sẵn sàng'}
            {record.status === 'inactive' && 'Không hoạt động'}
            {record.status === 'training' && 'Đang huấn luyện'}
            {record.status === 'deployed' && 'Đang triển khai'}
          </Tag>
          {record.favorite && <Tag color="red">Yêu thích</Tag>}
          {record.is_vip && <Tag color="gold">VIP</Tag>}
        </Space>
      ),
    },
    {
      title: 'Kỹ năng',
      key: 'skills',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.skills?.slice(0, 2).map(skill => (
            <Tooltip key={skill.id} title={skill.description}>
              <Tag color="purple">{skill.name}</Tag>
            </Tooltip>
          ))}
          {(record.skills?.length || 0) > 2 && (
            <Text type="secondary">+{record.skills!.length - 2} kỹ năng</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Lần cuối sử dụng',
      dataIndex: 'last_used',
      key: 'last_used',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa sử dụng',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tướng"
            description="Bạn có chắc chắn muốn xóa tướng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            background: '#F1E8D6',
            padding: '16px 24px',
            borderRadius: 12,
            border: '1px solid #D4AF37',
          }}
        >
          <Space>
            <TrophyOutlined style={{ fontSize: 24, color: '#8B0000' }} />
            <Title level={3} style={{ margin: 0, color: '#8B4513' }}>
              Quản lý tướng
            </Title>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedGeneral(null);
              setFormMode('create');
              setOpenForm(true);
            }}
            style={{
              background: '#8B0000',
              borderColor: '#D4AF37',
            }}
          >
            Thêm tướng
          </Button>
        </Space>

        <GeneralFilterBar onFilterChange={setFilters} />

        <Table
          columns={columns}
          dataSource={generals}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1500 }}
          pagination={{
            total: generals?.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} tướng`,
          }}
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #F1E8D6',
          }}
        />
      </Space>

      <GeneralForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={selectedGeneral}
        mode={formMode}
      />

      <GeneralDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        general={selectedGeneral}
      />
    </>
  );
};

export default GeneralTable;
