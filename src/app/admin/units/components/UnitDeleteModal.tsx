// app/admin/units/components/UnitDeleteModal.tsx
'use client';

import React from 'react';
import { Modal, Typography, Space, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import { Unit } from '../types';

const { Text, Title } = Typography;

interface UnitDeleteModalProps {
  visible: boolean;
  unit: Unit | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const UnitDeleteModal: React.FC<UnitDeleteModalProps> = ({
  visible,
  unit,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!unit) return null;

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: theme.token?.colorError }} />
          <span>Delete Unit</span>
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading }}
      width={500}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text>
          Are you sure you want to delete this unit? This action cannot be undone.
        </Text>

        <div style={{ 
          padding: 16, 
          background: '#F1E8D6', 
          borderRadius: theme.token?.borderRadius,
          border: `1px solid ${theme.token?.colorBorder}`,
        }}>
          <Space direction="vertical" size={2}>
            <Title level={5}>{unit.name}</Title>
            <Space>
              <Tag color="processing">{unit.type}</Tag>
              <Tag color="warning">Lv.{unit.level}</Tag>
              {unit.isVip && <Tag color="gold">VIP</Tag>}
            </Space>
            <Text type="secondary">ID: {unit.id}</Text>
          </Space>
        </div>

        <Text type="danger">
          This will also remove all associated skills and references.
        </Text>
      </Space>
    </Modal>
  );
};

export default UnitDeleteModal;
