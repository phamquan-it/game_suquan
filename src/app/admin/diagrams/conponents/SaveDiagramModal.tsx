"use client";

import { Modal, Space, Typography, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SaveDiagramModalProps {
  open: boolean;
  name: string;
  description: string;
  tableCount: number;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function SaveDiagramModal({
  open,
  name,
  description,
  tableCount,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: SaveDiagramModalProps) {
  return (
    <Modal
      title={
        <Space>
          <SaveOutlined />
          <Text strong>Lưu diagram</Text>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={onSave}
      okText="Lưu"
      cancelText="Hủy"
      width={480}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          Tên diagram
        </Text>
        <Input
          placeholder="Nhập tên diagram..."
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onPressEnter={onSave}
          autoFocus
        />
      </div>
      <div>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          Mô tả (không bắt buộc)
        </Text>
        <Input.TextArea
          placeholder="Nhập mô tả..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>
      <div style={{ marginTop: 12, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Số bảng: {tableCount}
        </Text>
      </div>
    </Modal>
  );
}
