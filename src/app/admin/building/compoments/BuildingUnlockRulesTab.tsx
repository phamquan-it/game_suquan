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
  Popconfirm,
} from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBuilding } from '../hooks/useBuildings';
import { useUnits } from '../hooks/useUnits';
import { useUpsertUnlockRule } from '../hooks/useBuildingMutations';
import { supabase } from '@/utils/supabase/client';

interface BuildingUnlockRulesTabProps {
  buildingType: string;
}

const BuildingUnlockRulesTab: React.FC<BuildingUnlockRulesTabProps> = ({
  buildingType,
}) => {
  const { data: building, refetch } = useBuilding(buildingType);
  const { data: units } = useUnits();
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [form] = Form.useForm();

  const upsertRule = useUpsertUnlockRule();

  const handleAdd = () => {
    setEditingUnit('new');
    form.resetFields();
    form.setFieldsValue({
      required_building_level: 1,
    });
  };

  const handleEdit = (unitType: string) => {
    const rule = building?.unlock_rules?.find(r => r.unit_type === unitType);
    if (rule) {
      setEditingUnit(unitType);
      form.setFieldsValue(rule);
    }
  };

  const handleDelete = async (unitType: string) => {
    try {
      const { error } = await supabase
        .from('building_unit_unlock_rules')
        .delete()
        .eq('building_type', buildingType)
        .eq('unit_type', unitType);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSave = async (values: any) => {
    await upsertRule.mutateAsync({
      building_type: buildingType,
      data: values,
    });
    setEditingUnit(null);
  };

  const columns = [
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
      title: 'Cấp độ yêu cầu',
      dataIndex: 'required_building_level',
      key: 'required_building_level',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record.unit_type)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa quy tắc"
            description="Bạn có chắc muốn xóa quy tắc này?"
            onConfirm={() => handleDelete(record.unit_type)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const availableUnits = units?.filter(unit =>
    !building?.unlock_rules?.some(rule => rule.unit_type === unit.id) ||
    unit.id === editingUnit
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm quy tắc mở khóa
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={building?.unlock_rules || []}
        rowKey="unit_type"
        pagination={false}
        size="small"
      />

      {editingUnit !== null && (
        <Card title={editingUnit === 'new' ? 'Thêm quy tắc mới' : 'Chỉnh sửa quy tắc'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Space wrap size="large">
              <Form.Item
                label="Đơn vị"
                name="unit_type"
                rules={[{ required: true }]}
              >
                <Select
                  style={{ width: 200 }}
                  disabled={editingUnit !== 'new'}
                >
                  {availableUnits?.map(unit => (
                    <Select.Option key={unit.id} value={unit.id}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Cấp độ yêu cầu"
                name="required_building_level"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={building?.max_level ?? 1} />
              </Form.Item>
            </Space>

            <Space style={{ marginTop: 20, justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setEditingUnit(null)}>Hủy</Button>
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

export default BuildingUnlockRulesTab;
