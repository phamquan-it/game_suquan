// components/admin/SceneForm.tsx
'use client';

import { Modal, Form, Input, Select, InputNumber, message, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { StoryScene, StorySceneInsert, useStoryCharacters, useStorySceneCrud } from '../hooks/useStoriesCrud';

const { TextArea } = Input;
const { Option } = Select;

interface SceneFormProps {
  open: boolean;
  onClose: () => void;
  storyId: string;
  initialData?: StoryScene | null;
  sceneOrder?: number;
}

export default function SceneForm({ open, onClose, storyId, initialData, sceneOrder = 0 }: SceneFormProps) {
  const [form] = Form.useForm();
  const { createScene, updateScene } = useStorySceneCrud(storyId);
  const { data: characters } = useStoryCharacters();

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        scene_order: initialData.scene_order,
        background: initialData.background,
        speaker_id: initialData.speaker_id,
        dialog_text: initialData.dialog_text,
        sound_effect: initialData.sound_effect,
      });
    } else if (open) {
      form.setFieldsValue({
        scene_order: sceneOrder + 1,
      });
      form.resetFields();
    }
  }, [open, initialData, form, sceneOrder]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        story_id: storyId,
      };

      if (initialData) {
        await updateScene.mutateAsync({
          id: initialData.id,
          payload: values,
        });
        message.success('Cập nhật cảnh thành công');
      } else {
        await createScene.mutateAsync(payload as StorySceneInsert);
        message.success('Tạo cảnh mới thành công');
      }
      onClose();
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleUpload = async (file: File) => {
    // Implement your image upload logic here
    // Example: Upload to Supabase storage
    return false;
  };

  return (
    <Modal
      title={initialData ? 'Sửa cảnh' : 'Thêm cảnh mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createScene.isPending || updateScene.isPending}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="scene_order"
          label="Thứ tự cảnh"
          rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="speaker_id"
          label="Nhân vật nói"
          rules={[{ required: true, message: 'Vui lòng chọn nhân vật' }]}
        >
          <Select placeholder="Chọn nhân vật" showSearch>
            {characters?.map(char => (
              <Option key={char.id} value={char.id}>
                {char.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dialog_text"
          label="Lời thoại"
          rules={[{ required: true, message: 'Vui lòng nhập lời thoại' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập lời thoại cho nhân vật"
          />
        </Form.Item>

        <Form.Item
          name="background"
          label="URL Background"
        >
          <Input placeholder="https://example.com/background.jpg" />
        </Form.Item>

        <Form.Item
          name="sound_effect"
          label="Hiệu ứng âm thanh"
        >
          <Input placeholder="URL âm thanh hoặc tên hiệu ứng" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
