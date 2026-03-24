'use client';

import React, { useState } from 'react';
import { Modal, Table, Button, Space, InputNumber, Select, Form, Tag, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Region } from '../types/region.types';
import { 
  useResourceTypes, 
  useAddExpansionCost, 
  useUpdateExpansionCost, 
  useRemoveExpansionCost 
} from '../hooks/useRegionExpansion';

interface RegionExpansionProps {
  visible: boolean;
  onClose: () => void;
  region: Region | null;
  expansionCosts?: any[];
}

const RegionExpansion: React.FC<RegionExpansionProps> = ({ visible, onClose, region, expansionCosts = [] }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [addingNew, setAddingNew] = useState(false);

  const { data: resourceTypes } = useResourceTypes();
  const addCost = useAddExpansionCost();
  const updateCost = useUpdateExpansionCost();
  const removeCost = useRemoveExpansionCost();

  const isEditing = (key: string) => editingKey === key;

  const handleAdd = () => {
    setAddingNew(true);
    form.resetFields();
  };

  const getKey = (record: any) => `${record.slot_index}-${record.cost_type}`;

  const handleSave = async (record: any) => {
    try {
      const values = await form.validateFields();
      
      await updateCost.mutateAsync({
        region_id: region!.id,
        slot_index: record.slot_index,
        cost_type: record.cost_type,
        updates: values
      });
      
      setEditingKey('');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleAddNew = async () => {
    try {
      const values = await form.validateFields();
      
      await addCost.mutateAsync({
        region_id: region!.id,
        ...values
      });
      
      setAddingNew(false);
      form.resetFields();
    } catch (error) {
      console.error('Add failed:', error);
    }
  };

  const handleDelete = async (record: any) => {
    await removeCost.mutateAsync({
      region_id: region!.id,
      slot_index: record.slot_index,
      cost_type: record.cost_type
    });
  };

  const columns = [
    {
      title: 'Slot Index',
      dataIndex: 'slot_index',
      key: 'slot_index',
      render: (index: number) => (
        <Tag color="bronze">Slot {index}</Tag>
      ),
    },
    {
      title: 'Resource Type',
      dataIndex: 'cost_type',
      key: 'cost_type',
      render: (type: string) => (
        <Tag color="imperialGold">{type}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'cost_amount',
      key: 'cost_amount',
      render: (amount: number, record: any) => {
        if (isEditing(getKey(record))) {
          return (
            <Form.Item
              name="cost_amount"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          );
        }
        return amount.toLocaleString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        const key = getKey(record);
        if (isEditing(key)) {
          return (
            <Space>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={() => handleSave(record)}
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
                  setEditingKey(key);
                }}
                style={{ color: '#003366' }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const newRowColumns = [
    {
      title: 'Slot Index',
      dataIndex: 'slot_index',
      key: 'slot_index',
      render: () => (
        <Form.Item
          name="slot_index"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber min={0} max={20} />
        </Form.Item>
      ),
    },
    {
      title: 'Resource Type',
      dataIndex: 'cost_type',
      key: 'cost_type',
      render: () => (
        <Form.Item
          name="cost_type"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <Select style={{ width: 150 }}>
            {resourceTypes?.map((type: any) => (
              <Select.Option key={type.resource_code} value={type.resource_code}>
                {type.resource_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'cost_amount',
      key: 'cost_amount',
      render: () => (
        <Form.Item
          name="cost_amount"
          style={{ margin: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber min={1} />
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
          Expansion Costs - {region.lord_name}s Region
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
            Add Expansion Cost
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={expansionCosts}
          rowKey={(record) => `${record.slot_index}-${record.cost_type}`}
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

export default RegionExpansion;
