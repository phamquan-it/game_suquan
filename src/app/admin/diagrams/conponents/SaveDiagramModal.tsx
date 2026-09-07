"use client";

import { Modal, Space, Typography, Input, AutoComplete, Tag } from 'antd';
import { SaveOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

/** Giá trị group = '' → "Chưa phân loại" (được hiển thị như 1 group ảo) */
const UNGROUPED = 'Chưa phân loại';

interface SaveDiagramModalProps {
  open: boolean;
  name: string;
  description: string;
  tableCount: number;
  group: string; // group raw; '' = chưa phân loại
  groupLabels: string[]; // tên group đang dùng (đã có trong DB)
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGroupChange: (value: string) => void; // nhận raw value (có thể rỗng)
  onSave: () => void;
  onCancel: () => void;
}

export function SaveDiagramModal({
  open,
  name,
  description,
  tableCount,
  group,
  groupLabels,
  onNameChange,
  onDescriptionChange,
  onGroupChange,
  onSave,
  onCancel,
}: SaveDiagramModalProps) {
  // Hiển thị: group rỗng → nhãn "Chưa phân loại"; ngược lại là chính tên group.
  const shownValue = group === '' ? UNGROUPED : group;

  const suggestions = [
    UNGROUPED,
    ...groupLabels.filter((g) => g !== UNGROUPED),
  ].map((g) => ({ value: g }));

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

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          Group
        </Text>
        <AutoComplete
          style={{ width: '100%' }}
          value={shownValue}
          onChange={(val) => {
            // Nếu nhập lại "Chưa phân loại" → lưu ''; còn lại lưu tên group raw.
            onGroupChange(val.trim() === UNGROUPED ? '' : val.trim());
          }}
          options={suggestions}
          placeholder="Chọn group có sẵn hoặc gõ tên mới..."
          allowClear
          notFoundContent={
            <Space>
              <FolderOpenOutlined /> Nhập tên để tạo group mới
            </Space>
          }
          filterOption={(input, option) =>
            (option?.value as string).toLowerCase().includes(input.toLowerCase())
          }
        />
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
          {group === '' ? (
            'Để là "Chưa phân loại" hoặc gõ tên mới để tạo 1 group riêng.'
          ) : (
            <Space size={4}>
              <FolderOutlined />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Lưu vào group:
              </Text>
              <Tag color="geekblue" style={{ marginRight: 0 }}>
                {group}
              </Tag>
            </Space>
          )}
        </Text>
      </div>

      <div>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          Mô tả (không bắt buộc)
        </Text>
        <TextArea
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
