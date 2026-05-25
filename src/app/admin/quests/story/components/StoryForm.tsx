// components/admin/StoryForm.tsx
'use client';

import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { Story, StoryInsert, useStoryCrud } from '../hooks/useStoriesCrud';

interface StoryFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Story | null;
}

const { TextArea } = Input;

export default function StoryForm({ open, onClose, initialData }: StoryFormProps) {
  const [form] = Form.useForm();
  const { createStory, updateStory } = useStoryCrud();

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        entry_scene_id: initialData.entry_scene_id,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (initialData) {
        await updateStory.mutateAsync({
          id: initialData.id,
          payload: values,
        });
        message.success('Cập nhật truyện thành công');
      } else {
        await createStory.mutateAsync(values as StoryInsert);
        message.success('Tạo truyện mới thành công');
      }
      onClose();
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Modal
      title={initialData ? 'Sửa truyện' : 'Thêm truyện mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createStory.isPending || updateStory.isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề truyện" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả truyện"
          />
        </Form.Item>

        <Form.Item
          name="entry_scene_id"
          label="Cảnh bắt đầu"
          help="Có thể để trống và cập nhật sau"
        >
          <Input placeholder="ID của cảnh bắt đầu" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
