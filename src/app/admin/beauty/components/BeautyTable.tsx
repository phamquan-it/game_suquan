'use client';

import { Table, Avatar, Tag, Space, Button, Tooltip, Progress } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import { BeautyCharacter } from '../types';

interface BeautyTableProps {
  data: BeautyCharacter[];
  loading: boolean;
  total: number;
  pagination: { current: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortChange: (sortConfig: any) => void;
  onView: (record: BeautyCharacter) => void;
  onEdit: (record: BeautyCharacter) => void;
  onDelete: (id: string) => void;
}

export function BeautyTable({
  data,
  loading,
  total,
  pagination,
  onPaginationChange,
  onSortChange,
  onView,
  onEdit,
  onDelete,
}: BeautyTableProps) {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: '#CD7F32',
      rare: '#1E90FF',
      epic: '#800080',
      legendary: '#D4AF37',
    };
    return colors[rarity] || '#CD7F32';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: '#2E8B57',
      mission: '#FF8C00',
      training: '#1E90FF',
      resting: '#8B4513',
    };
    return colors[status] || '#CD7F32';
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: BeautyCharacter) => (
        <Avatar 
          src={avatar} 
          size={50} 
          style={{ border: `2px solid ${getRarityColor(record.rarity)}` }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: BeautyCharacter) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{text}</span>
          <small style={{ color: '#666' }}>{record.title}</small>
        </Space>
      ),
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      sorter: true,
      render: (rarity: string) => (
        <Tag color={getRarityColor(rarity)} style={{ textTransform: 'uppercase' }}>
          {rarity}
        </Tag>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      sorter: true,
      render: (level: number, record: BeautyCharacter) => (
        <Tooltip title={`${level}/${record.max_level}`}>
          <Progress 
            percent={Math.round((level / record.max_level) * 100)} 
            size="small" 
            showInfo={false}
            strokeColor="#8B0000"
          />
          <span style={{ marginLeft: 8 }}>{level}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Attributes',
      key: 'attributes',
      render: (_: any, record: BeautyCharacter) => (
        <Space size="small" wrap>
          <Tag icon={<StarOutlined />} color="#8B4513">
            C:{record.charm}
          </Tag>
          <Tag color="#003366">
            I:{record.intelligence}
          </Tag>
          <Tag color="#2E8B57">
            D:{record.diplomacy}
          </Tag>
          <Tag color="#DC143C">
            In:{record.intrigue}
          </Tag>
          <Tag color="#D4AF37">
            L:{record.loyalty}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Success Rate',
      dataIndex: 'mission_success_rate',
      key: 'mission_success_rate',
      sorter: true,
      render: (rate: number) => rate ? `${rate}%` : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: BeautyCharacter) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => onView(record)}
            style={{ borderColor: '#8B4513', color: '#8B4513' }}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => onEdit(record)}
            style={{ borderColor: '#003366', color: '#003366' }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    onPaginationChange(pagination.current, pagination.pageSize);
    
    if (sorter.field) {
      onSortChange({
        field: sorter.field,
        order: sorter.order,
      });
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} beauties`,
      }}
      onChange={handleTableChange}
      style={{ background: '#FFFFFF' }}
    />
  );
}
