'use client';

import React, { useState } from 'react';
import { Modal, Table, Button, Space, InputNumber, Select, Form, Tag, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Region } from '../types/region.types';
import { 
  useBuildingTypes, 
  useAddRegionBuilding, 
  useUpdateRegionBuilding, 
  useRemoveRegionBuilding 
} from '../hooks/useRegionBuildings';

interface RegionBuildingsProps {
  visible: boolean;
  onClose: () => void;
  region: Region | null;
  buildings?: any[];
}

const RegionBuildings: React.FC<RegionBuildingsProps> = ({ visible, onClose, region, buildings = [] }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [addingNew, setAddingNew] = useState(false);

  const { data: buildingTypes } = useBuildingTypes();
  const addBuilding = useAddRegionBuilding();
  const updateBuilding = useUpdateRegionBuilding();
  const removeBuilding = useRemoveRegionBuilding();

  const isEditing = (buildingType: string) => editingKey === buildingType;

  const handleAdd = () => {
    setAddingNew(true);
    form.resetFields();
  };

  const handleSave = async (buildingType: string) => {
    try {
      const values = await form.validateFields();
      
      if (editingKey) {
        // Update existing
        await updateBuilding.mutateAsync({
          region_id: region!.id,
          building_type: buildingType,
          updates: values
        });
        setEditingKey('');
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleAddNew = async () => {
    try {
      const values = await form.validateFields();
      
      await addBuilding.mutateAsync({
        region_id: region!.id,
        ...values
      });
      
      setAddingNew(false);
      form.resetFields();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleDelete = async (buildingType: string) => {
    await removeBuilding.mutateAsync({
      region_id: region!.id,
      building_type: buildingType
    });
  };

  const columns = [
    {
      title: 'Building Type',
      dataIndex: 'building_type',
      key: 'building_type',
      render: (type: string) => (
        <Tag color="royalNavy" style={{ color: '#FFFFFF' }}>{type}</Tag>
      ),
    },
    {
      title: 'Max Count',
      dataIndex: 'max_count',
      key: 'max_count',
      render: (count: number, record: any) => {
        if (isEditing(record.building_type)) {
          return (
            <Form.Item
              name="max_count"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={1} max={100} />
            </Form.Item>
          );
        }
        return count;
      },
    },
    {
      title: 'Min Region Level',
      dataIndex: 'min_region_level',
      key: 'min_region_level',
      render: (level: number, record: any) => {
        if (isEditing(record.building_type)) {
          return (
            <Form.Item
              name="min_region_level"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={0} max={100} />
            </Form.Item>
          );
        }
        return level;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        if (isEditing(record.building_type)) {
          return (
            <Space>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={() => handleSave(record.building_type)}
                style={{ color: '#2E8B57' }}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setEditingKey('')}
                style={{ color: '#DC143C' }}
              />
            </Space>
          );
        }
        return (
          <Space>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue(record);
                  setEditingKey(record.building_type);
                }}
                style={{ color: '#003366' }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.building_type)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const newRowColumns = [
    {
      title: 'Building Type',
      dataIndex: 'building_type',
      key: 'building_type',
      render: () => (
        <Form.Item
          name="building_type"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <Select style={{ width: 150 }}>
            {buildingTypes?.map((type: any) => (
              <Select.Option key={type.type} value={type.type}>
                {type.type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Max Count',
      dataIndex: 'max_count',
      key: 'max_count',
      render: () => (
        <Form.Item
          name="max_count"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber min={1} max={100} />
        </Form.Item>
      ),
    },
    {
      title: 'Min Region Level',
      dataIndex: 'min_region_level',
      key: 'min_region_level',
      render: () => (
        <Form.Item
          name="min_region_level"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<SaveOutlined />}
            onClick={handleAddNew}
            style={{ color: '#2E8B57' }}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setAddingNew(false)}
            style={{ color: '#DC143C' }}
          />
        </Space>
      ),
    },
  ];

  if (!region) return null;

  return (
    <Modal
      title={
        <span style={{ color: '#8B0000', fontSize: 20 }}>
          Manage Buildings - {region.lord_name}&apos;s Region
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} component={false}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={addingNew}
            style={{ backgroundColor: '#8B0000' }}
          >
            Add Building
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={buildings}
          rowKey="building_type"
          pagination={false}
          bordered
          style={{ marginBottom: 16 }}
        />

        {addingNew && (
          <Table
            columns={newRowColumns}
            dataSource={[{ key: 'new' }]}
            rowKey="key"
            pagination={false}
            bordered
            showHeader={false}
          />
        )}
      </Form>
    </Modal>
  );
};

export default RegionBuildings;
