'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  InputNumber,
  Form,
  Select,
  Card,
} from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useBuilding } from '../hooks/useBuildings';
import { useUnits } from '../hooks/useUnits';
import { useUpsertBuildingTraining } from '../hooks/useBuildingMutations';

interface BuildingTrainingTabProps {
  buildingType: string;
}

const BuildingTrainingTab: React.FC<BuildingTrainingTabProps> = ({
  buildingType,
}) => {
  const { data: building } = useBuilding(buildingType);
  const { data: units } = useUnits();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const upsertTraining = useUpsertBuildingTraining();

  const handleAdd = () => {
    setEditingId(0);
    form.resetFields();
    form.setFieldsValue({
      level: 1,
      training_rate_per_hour: 0,
      training_capacity: 0,
      efficiency_percent: 100,
    });
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
  };

  const handleSave = async (values: any) => {
    await upsertTraining.mutateAsync({
      building_type: buildingType,
      data: values,
    });
    setEditingId(null);
  };

  const columns = [
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit_type',
      key: 'unit_type',
      render: (type: string) => {
        const unit = units?.find(u => u.id === type);
        return unit?.name || type;
      },
    },
    {
      title: 'Tốc độ/giờ',
      dataIndex: 'training_rate_per_hour',
      key: 'training_rate_per_hour',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'training_capacity',
      key: 'training_capacity',
    },
    {
      title: 'Hiệu suất %',
      dataIndex: 'efficiency_percent',
      key: 'efficiency_percent',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm huấn luyện
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={building?.unit_training || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      {editingId !== null && (
        <Card title={editingId === 0 ? 'Thêm huấn luyện mới' : 'Chỉnh sửa huấn luyện'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="id" hidden>
              <InputNumber />
            </Form.Item>

            <Space wrap size="large">
              <Form.Item
                label="Cấp độ"
                name="level"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={building?.max_level ?? 1} />
              </Form.Item>

              <Form.Item
                label="Đơn vị"
                name="unit_type"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 200 }}>
                  {units?.map(unit => (
                    <Select.Option key={unit.id} value={unit.id}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Tốc độ/giờ"
                name="training_rate_per_hour"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={1} />
              </Form.Item>

              <Form.Item
                label="Sức chứa"
                name="training_capacity"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item
                label="Hiệu suất %"
                name="efficiency_percent"
                initialValue={100}
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            </Space>

            <Space style={{ marginTop: 20, justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setEditingId(null)}>Hủy</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Lưu
              </Button>
            </Space>
          </Form>
        </Card>
      )}
    </Space>
  );
};

export default BuildingTrainingTab;
