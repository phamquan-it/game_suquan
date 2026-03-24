'use client';

import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Tabs,
  Space,
  Button,
  Typography,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { BuildingWithRelations } from '../types/building.types';
import { useCreateBuilding, useUpdateBuilding } from '../hooks/useBuildingMutations';
import BuildingAttributesTab from './BuildingAttributesTab';
import BuildingProductionTab from './BuildingProductionTab';
import BuildingTrainingTab from './BuildingTrainingTab';
import BuildingUnlockRulesTab from './BuildingUnlockRulesTab';
import BuildingUpgradeCostTab from './BuildingUpgradeCostTab';

const { Text } = Typography;

interface BuildingFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: BuildingWithRelations | null;
  mode: 'create' | 'edit';
}

const BuildingForm: React.FC<BuildingFormProps> = ({
  open,
  onClose,
  initialData,
  mode,
}) => {
  const [form] = Form.useForm();
  const createBuilding = useCreateBuilding();
  const updateBuilding = useUpdateBuilding();

  useEffect(() => {
    if (initialData && mode === 'edit') {
      form.setFieldsValue({
        type: initialData.type,
        name: initialData.name,
        description: initialData.description,
        max_level: initialData.max_level,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await createBuilding.mutateAsync(values);
      } else if (initialData) {
        await updateBuilding.mutateAsync({
          type: initialData.type,
          data: values,
        });
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const items = [
    {
      key: 'basic',
      label: 'Thông tin cơ bản',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Form.Item
            name="type"
            label="Loại công trình"
            rules={[{ required: true, message: 'Vui lòng nhập loại công trình' }]}
          >
            <Input
              placeholder="Nhập loại công trình"
              disabled={mode === 'edit'}
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên công trình"
            rules={[{ required: true, message: 'Vui lòng nhập tên công trình' }]}
          >
            <Input placeholder="Nhập tên công trình" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea
              placeholder="Nhập mô tả công trình"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="max_level"
            label="Cấp độ tối đa"
            initialValue={1}
            rules={[{ required: true, message: 'Vui lòng nhập cấp độ tối đa' }]}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>
      ),
    },
    {
      key: 'attributes',
      label: 'Chỉ số',
      children: initialData && <BuildingAttributesTab buildingType={initialData.type} />,
      disabled: !initialData || mode === 'create',
    },
    {
      key: 'production',
      label: 'Sản xuất',
      children: initialData && <BuildingProductionTab buildingType={initialData.type} />,
      disabled: !initialData || mode === 'create',
    },
    {
      key: 'training',
      label: 'Huấn luyện',
      children: initialData && <BuildingTrainingTab buildingType={initialData.type} />,
      disabled: !initialData || mode === 'create',
    },
    {
      key: 'unlock',
      label: 'Mở khóa đơn vị',
      children: initialData && <BuildingUnlockRulesTab buildingType={initialData.type} />,
      disabled: !initialData || mode === 'create',
    },
    {
      key: 'upgrade',
      label: 'Chi phí nâng cấp',
      children: initialData && <BuildingUpgradeCostTab buildingType={initialData.type} />,
      disabled: !initialData || mode === 'create',
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <Text strong style={{ color: '#8B4513', fontSize: 18 }}>
            {mode === 'create' ? 'Thêm công trình mới' : 'Chỉnh sửa công trình'}
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '20px 0',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          max_level: 1,
        }}
      >
        <Tabs
          items={items}
          type="card"
          style={{ marginBottom: 20 }}
        />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={createBuilding.isPending || updateBuilding.isPending}
            style={{
              background: '#8B0000',
            }}
          >
            {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default BuildingForm;
