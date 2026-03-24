'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { Region } from '../types/region.types';
import { useCreateRegion, useUpdateRegion } from '../hooks/useRegions';

interface RegionModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: Region | null;
}

const RegionModal: React.FC<RegionModalProps> = ({ visible, onClose, initialData }) => {
  const [form] = Form.useForm();
  const createRegion = useCreateRegion();
  const updateRegion = useUpdateRegion();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (initialData) {
        await updateRegion.mutateAsync({ id: initialData.id, ...values });
      } else {
        await createRegion.mutateAsync(values);
      }
      
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <span style={{ color: '#8B0000', fontSize: 20 }}>
          {initialData ? 'Edit Region' : 'Create New Region'}
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Space key="footer" size="middle">
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={createRegion.isPending || updateRegion.isPending}
            style={{ backgroundColor: '#8B0000' }}
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </Space>,
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="id"
          label="Region ID"
          rules={[
            { required: true, message: 'Please enter region ID' },
            { pattern: /^[a-z0-9_]+$/, message: 'Only lowercase letters, numbers, and underscores allowed' }
          ]}
        >
          <Input 
            placeholder="e.g., northern_territory" 
            disabled={!!initialData}
            style={{ borderColor: '#CD7F32' }}
          />
        </Form.Item>

        <Form.Item
          name="lord_name"
          label="Lord Name"
          rules={[{ required: true, message: 'Please enter lord name' }]}
        >
          <Input 
            placeholder="Enter lord's name" 
            style={{ borderColor: '#CD7F32' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegionModal;
