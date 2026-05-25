// components/admin/CharacterForm.tsx
'use client';

import { Modal, Form, Input, Select, ColorPicker, message, Switch } from 'antd';
import { useEffect } from 'react';
import { StoryCharacter, useStoryCharacterCrud } from '../../hooks/useStoriesCrud';

const { Option } = Select;
const { TextArea } = Input;

interface CharacterFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: StoryCharacter | null;
}

export default function CharacterForm({ open, onClose, initialData }: CharacterFormProps) {
  const [form] = Form.useForm();
  const { createCharacter, updateCharacter } = useStoryCharacterCrud();

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        name: initialData.name,
        avatar: initialData.avatar,
        color: initialData.color,
        default_position: initialData.default_position,
        faction_id: initialData.faction_id,
        is_su_quan: initialData.is_su_quan,
        emotion_states: initialData.emotion_states ? JSON.stringify(initialData.emotion_states, null, 2) : null,
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        default_position: 'center',
        is_su_quan: false,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      // Parse emotion_states if it's a string
      if (values.emotion_states && typeof values.emotion_states === 'string') {
        try {
          values.emotion_states = JSON.parse(values.emotion_states);
        } catch {
          message.error('Emotion states không phải JSON hợp lệ');
          return;
        }
      }

      if (initialData) {
        await updateCharacter.mutateAsync({
          id: initialData.id,
          payload: values,
        });
        message.success('Cập nhật nhân vật thành công');
      } else {
        await createCharacter.mutateAsync(values);
        message.success('Tạo nhân vật mới thành công');
      }
      onClose();
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Modal
      title={initialData ? 'Sửa nhân vật' : 'Thêm nhân vật mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createCharacter.isPending || updateCharacter.isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên nhân vật"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân vật' }]}
        >
          <Input placeholder="Nhập tên nhân vật" />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="URL Avatar"
          rules={[{ required: true, message: 'Vui lòng nhập URL avatar' }]}
        >
          <Input placeholder="https://example.com/avatar.jpg" />
        </Form.Item>

        <Form.Item
          name="color"
          label="Màu sắc đại diện"
          rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
        >
          <ColorPicker format="hex" showText />
        </Form.Item>

        <Form.Item
          name="default_position"
          label="Vị trí mặc định"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
        >
          <Select>
            <Option value="left">Trái</Option>
            <Option value="center">Giữa</Option>
            <Option value="right">Phải</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="faction_id"
          label="ID Phe phái"
        >
          <Input placeholder="Nhập ID phe phái (tùy chọn)" />
        </Form.Item>

        <Form.Item
          name="is_su_quan"
          label="Là Tư quan"
          valuePropName="checked"
        >
          <Switch checkedChildren="Có" unCheckedChildren="Không" />
        </Form.Item>

        <Form.Item
          name="emotion_states"
          label="Trạng thái cảm xúc (JSON)"
          help='Ví dụ: {"vui": "happy.png", "buon": "sad.png"}'
        >
          <TextArea
            rows={4}
            placeholder='{"vui": "happy.png", "buon": "sad.png"}'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
