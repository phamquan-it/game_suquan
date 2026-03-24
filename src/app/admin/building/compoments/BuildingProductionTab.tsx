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
import { useResources } from '../hooks/useResources';
import { useUpsertBuildingProduction } from '../hooks/useBuildingMutations';

interface BuildingProductionTabProps {
  buildingType: string;
}

const BuildingProductionTab: React.FC<BuildingProductionTabProps> = ({
  buildingType,
}) => {
  const { data: building } = useBuilding(buildingType);
  const { data: resources } = useResources();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const upsertProduction = useUpsertBuildingProduction();

  const handleAdd = () => {
    setEditingId(0);
    form.resetFields();
    form.setFieldsValue({
      level: 1,
      production_rate_per_hour: 0,
      production_capacity: 0,
      efficiency_percent: 100,
    });
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
  };

  const handleSave = async (values: any) => {
    await upsertProduction.mutateAsync({
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
      title: 'Tài nguyên',
      dataIndex: 'resource_code',
      key: 'resource_code',
      render: (code: string) => {
        const resource = resources?.find(r => r.resource_code === code);
        return resource?.name || code;
      },
    },
    {
      title: 'Tốc độ/giờ',
      dataIndex: 'production_rate_per_hour',
      key: 'production_rate_per_hour',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'production_capacity',
      key: 'production_capacity',
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
          Thêm sản xuất
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={building?.production || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      {editingId !== null && (
        <Card title={editingId === 0 ? 'Thêm sản xuất mới' : 'Chỉnh sửa sản xuất'}>
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
                label="Tài nguyên"
                name="resource_code"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 200 }}>
                  {resources?.map(resource => (
                    <Select.Option key={resource.resource_code} value={resource.resource_code}>
                      {resource.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Tốc độ/giờ"
                name="production_rate_per_hour"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={100} />
              </Form.Item>

              <Form.Item
                label="Sức chứa"
                name="production_capacity"
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

export default BuildingProductionTab;
