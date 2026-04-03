'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  InputNumber,
  Select,
  Form,
  Tag,
  Tooltip
} from 'antd';

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';

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

const RegionBuildings: React.FC<RegionBuildingsProps> = ({
  visible,
  onClose,
  region,
  buildings = []
}) => {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [editingKey, setEditingKey] = useState<string>('');
  const [addingNew, setAddingNew] = useState(false);

  const { data: buildingTypes } = useBuildingTypes();
  const addBuilding = useAddRegionBuilding();
  const updateBuilding = useUpdateRegionBuilding();
  const removeBuilding = useRemoveRegionBuilding();

  const isEditing = useCallback(
    (type: string) => editingKey === type,
    [editingKey]
  );

  const handleAdd = useCallback(() => {
    setAddingNew(true);
    addForm.resetFields();
  }, [addForm]);

  const handleSave = useCallback(
    async (buildingType: string) => {
      try {
        const values = await editForm.validateFields();

        await updateBuilding.mutateAsync({
          region_id: region!.id,
          building_type: buildingType,
          updates: values
        });

        setEditingKey('');
      } catch (err) {
        console.error(err);
      }
    },
    [editForm, updateBuilding, region]
  );

  const handleAddNew = useCallback(async () => {
    try {
      const values = await addForm.validateFields();

      await addBuilding.mutateAsync({
        region_id: region!.id,
        ...values
      });

      setAddingNew(false);
      addForm.resetFields();
    } catch (err) {
      console.error(err);
    }
  }, [addForm, addBuilding, region]);

  const handleDelete = useCallback(
    async (buildingType: string) => {
      await removeBuilding.mutateAsync({
        region_id: region!.id,
        building_type: buildingType
      });
    },
    [removeBuilding, region]
  );

  const columns = useMemo(
    () => [
      {
        title: 'Building Type',
        dataIndex: 'building_type',
        key: 'building_type',
        render: (type: string) => (
          <Tag color="blue">{type}</Tag>
        )
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
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={100} />
              </Form.Item>
            );
          }
          return count;
        }
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
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            );
          }
          return level;
        }
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
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setEditingKey('')}
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
                    editForm.setFieldsValue(record);
                    setEditingKey(record.building_type);
                  }}
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
        }
      }
    ],
    [isEditing, handleSave, handleDelete, editForm]
  );

  const newRowColumns = useMemo(
    () => [
      {
        title: 'Building Type',
        render: () => (
          <Form.Item name="building_type" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Select style={{ width: 150 }}>
              {buildingTypes?.map((t: any) => (
                <Select.Option key={t.type} value={t.type}>
                  {t.type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
      },
      {
        title: 'Max Count',
        render: () => (
          <Form.Item name="max_count" style={{ margin: 0 }} rules={[{ required: true }]}>
            <InputNumber min={1} max={100} />
          </Form.Item>
        )
      },
      {
        title: 'Min Region Level',
        render: () => (
          <Form.Item name="min_region_level" style={{ margin: 0 }} rules={[{ required: true }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
        )
      },
      {
        title: 'Actions',
        render: () => (
          <Space>
            <Button type="text" icon={<SaveOutlined />} onClick={handleAddNew} />
            <Button type="text" icon={<CloseOutlined />} onClick={() => setAddingNew(false)} />
          </Space>
        )
      }
    ],
    [buildingTypes, handleAddNew]
  );

  if (!region) return null;

  return (
    <Modal
      title={`Manage Buildings - ${region.lord_name}'s Region`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form form={editForm} component={false}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={addingNew}
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
        />
      </Form>

      {addingNew && (
        <Form form={addForm} component={false}>
          <Table
            columns={newRowColumns}
            dataSource={[{ key: 'new' }]}
            rowKey="key"
            pagination={false}
            bordered
            showHeader={false}
            style={{ marginTop: 16 }}
          />
        </Form>
      )}
    </Modal>
  );
};

export default React.memo(RegionBuildings);
