'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  InputNumber,
  Form,
  Popconfirm,
  Switch,
  Card,
} from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBuilding } from '../hooks/useBuildings';
import { useUpsertBuildingAttribute } from '../hooks/useBuildingMutations';

interface BuildingAttributesTabProps {
  buildingType: string;
}

const BuildingAttributesTab: React.FC<BuildingAttributesTabProps> = ({
  buildingType,
}) => {
  const { data: building } = useBuilding(buildingType);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [form] = Form.useForm();

  const upsertAttribute = useUpsertBuildingAttribute();

  const handleAdd = () => {
    const maxLevel = building?.max_level || 1;
    const existingLevels = building?.attribute_details?.map(a => a.level) || [];
    const nextLevel = Math.max(...existingLevels, 0) + 1;
    
    if (nextLevel <= maxLevel) {
      setEditingLevel(nextLevel);
      form.resetFields();
      form.setFieldsValue({
        level: nextLevel,
        hit_points: 100,
        build_time_seconds: 0,
        power_score: 0,
        troop_capacity: 0,
        training_speed_percent: 0,
        defense_bonus_percent: 0,
        attack_bonus_percent: 0,
        healing_speed_percent: 0,
        population_capacity: 0,
        population_growth_per_hour: 0,
        is_destructible: true,
        is_relocatable: false,
      });
    }
  };

  const handleEdit = (level: number) => {
    const attribute = building?.attribute_details?.find(a => a.level === level);
    if (attribute) {
      setEditingLevel(level);
      form.setFieldsValue(attribute);
    }
  };

  const handleSave = async (values: any) => {
    await upsertAttribute.mutateAsync({
      building_type: buildingType,
      data: values,
    });
    setEditingLevel(null);
  };

  const columns = [
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Máu',
      dataIndex: 'hit_points',
      key: 'hit_points',
      render: (val: number) => val?.toLocaleString() || 0,
    },
    {
      title: 'Thời gian xây (giây)',
      dataIndex: 'build_time_seconds',
      key: 'build_time_seconds',
    },
    {
      title: 'Sức mạnh',
      dataIndex: 'power_score',
      key: 'power_score',
    },
    {
      title: 'Sức chứa quân',
      dataIndex: 'troop_capacity',
      key: 'troop_capacity',
    },
    {
      title: 'Tốc độ HL',
      dataIndex: 'training_speed_percent',
      key: 'training_speed_percent',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Phòng thủ',
      dataIndex: 'defense_bonus_percent',
      key: 'defense_bonus_percent',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Tấn công',
      dataIndex: 'attack_bonus_percent',
      key: 'attack_bonus_percent',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Hồi phục',
      dataIndex: 'healing_speed_percent',
      key: 'healing_speed_percent',
      render: (val: number) => `${val}%`,
    },
    {
      title: 'Dân số',
      dataIndex: 'population_capacity',
      key: 'population_capacity',
    },
    {
      title: 'Có thể phá',
      dataIndex: 'is_destructible',
      key: 'is_destructible',
      render: (val: boolean) => val ? 'Có' : 'Không',
    },
    {
      title: 'Có thể di dời',
      dataIndex: 'is_relocatable',
      key: 'is_relocatable',
      render: (val: boolean) => val ? 'Có' : 'Không',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEdit(record.level)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm chỉ số cấp {building?.attribute_details?.length ? building.attribute_details.length + 1 : 1}
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={building?.attribute_details || []}
        rowKey="level"
        pagination={false}
        size="small"
      />

      {editingLevel && (
        <Card title={`Chỉnh sửa chỉ số cấp ${editingLevel}`}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="level" hidden>
              <InputNumber />
            </Form.Item>

            <Space wrap size="large">
              <Form.Item label="Máu" name="hit_points">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item label="Thời gian xây (giây)" name="build_time_seconds">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item label="Sức mạnh" name="power_score">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item label="Sức chứa quân" name="troop_capacity">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item label="Tốc độ huấn luyện %" name="training_speed_percent">
                <InputNumber min={0} max={100} />
              </Form.Item>

              <Form.Item label="Phòng thủ %" name="defense_bonus_percent">
                <InputNumber min={0} max={100} />
              </Form.Item>

              <Form.Item label="Tấn công %" name="attack_bonus_percent">
                <InputNumber min={0} max={100} />
              </Form.Item>

              <Form.Item label="Hồi phục %" name="healing_speed_percent">
                <InputNumber min={0} max={100} />
              </Form.Item>

              <Form.Item label="Sức chứa dân số" name="population_capacity">
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item label="Có thể phá hủy" name="is_destructible" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="Có thể di dời" name="is_relocatable" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Space>

            <Space style={{ marginTop: 20, justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setEditingLevel(null)}>Hủy</Button>
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

export default BuildingAttributesTab;
