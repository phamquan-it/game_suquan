'use client';

import { Modal, Form, Input, Select, InputNumber, Space, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BeautyCharacter } from '../types';
import { useEffect, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface BeautyFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<BeautyCharacter>) => void;
  initialValues?: BeautyCharacter | null;
  loading?: boolean;
}

export function BeautyForm({ visible, onCancel, onSubmit, initialValues, loading }: BeautyFormProps) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullImageFile, setFullImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Here you would typically upload the images to Supabase Storage first
      // and then submit the form with the URLs
      
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAvatarUpload = (file: File) => {
    setAvatarFile(file);
    return false; // Prevent auto upload
  };

  const handleFullImageUpload = (file: File) => {
    setFullImageFile(file);
    return false;
  };

  return (
    <Modal
      title={initialValues ? 'Edit Beauty' : 'Add New Beauty'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          level: 1,
          max_level: 100,
          experience: 0,
          status: 'available',
          charm: 0,
          intelligence: 0,
          diplomacy: 0,
          intrigue: 0,
          loyalty: 0,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter beauty name" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Enter title (e.g., 'The Enchantress')" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="rarity"
              label="Rarity"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="common">Common</Option>
                <Option value="rare">Rare</Option>
                <Option value="epic">Epic</Option>
                <Option value="legendary">Legendary</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="available">Available</Option>
                <Option value="mission">On Mission</Option>
                <Option value="training">Training</Option>
                <Option value="resting">Resting</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label="Level"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            <Form.Item
              name="charm"
              label="Charm"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="intelligence"
              label="Intelligence"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="diplomacy"
              label="Diplomacy"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="intrigue"
              label="Intrigue"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="loyalty"
              label="Loyalty"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Enter description..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="avatar"
              label="Avatar Image"
              rules={[{ required: true }]}
            >
              <Upload
                beforeUpload={handleAvatarUpload}
                maxCount={1}
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="full_image"
              label="Full Image"
              rules={[{ required: true }]}
            >
              <Upload
                beforeUpload={handleFullImageUpload}
                maxCount={1}
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </Space>
      </Form>
    </Modal>
  );
}
