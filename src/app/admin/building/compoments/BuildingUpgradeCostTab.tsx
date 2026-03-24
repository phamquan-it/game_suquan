"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  InputNumber,
  Form,
  Select,
  Card,
  Popconfirm,
} from "antd";
import { PlusOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { useBuilding } from "../hooks/useBuildings";
import { useResources } from "../hooks/useResources";
import {
  useUpsertUpgradeCost,
  useDeleteUpgradeCost,
} from "../hooks/useBuildingMutations";

interface BuildingUpgradeCostTabProps {
  buildingType: string;
}

const BuildingUpgradeCostTab: React.FC<BuildingUpgradeCostTabProps> = ({
  buildingType,
}) => {
  const { data: building } = useBuilding(buildingType);
  const { data: resources } = useResources();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const upsertCost = useUpsertUpgradeCost();
  const deleteCost = useDeleteUpgradeCost();

  const handleAdd = () => {
    setEditingId(0);
    form.resetFields();
    form.setFieldsValue({
      current_level: 1,
      target_level: 2,
      resource_amount: 0,
    });
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id: number) => {
    await deleteCost.mutateAsync(id);
  };

  const handleSave = async (values: any) => {
    await upsertCost.mutateAsync({
      building_type: buildingType,
      data: values,
    });
    setEditingId(null);
  };

  const columns = [
    {
      title: "Từ cấp",
      dataIndex: "current_level",
      key: "current_level",
    },
    {
      title: "Đến cấp",
      dataIndex: "target_level",
      key: "target_level",
    },
    {
      title: "Tài nguyên",
      dataIndex: "resource_code",
      key: "resource_code",
      render: (code: string) => {
        const resource = resources?.find((r) => r.resource_code === code);
        return resource?.name || code;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "resource_amount",
      key: "resource_amount",
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chi phí"
            description="Bạn có chắc muốn xóa chi phí này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const levels = Array.from(
    { length: building?.max_level || 1 },
    (_, i) => i + 1
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Card>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm chi phí nâng cấp
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={building?.upgrade_costs || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      {editingId !== null && (
        <Card
          title={editingId === 0 ? "Thêm chi phí mới" : "Chỉnh sửa chi phí"}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="id" hidden>
              <InputNumber />
            </Form.Item>

            <Space wrap size="large">
              <Form.Item
                label="Từ cấp"
                name="current_level"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 100 }}>
                  {levels.map((level) => (
                    <Select.Option key={level} value={level}>
                      Cấp {level}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Đến cấp"
                name="target_level"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 100 }}>
                  {levels.map((level) => (
                    <Select.Option key={level} value={level}>
                      Cấp {level}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Tài nguyên"
                name="resource_code"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 150 }}>
                  {resources?.map((resource) => (
                    <Select.Option
                      key={resource.resource_code}
                      value={resource.resource_code}
                    >
                      {resource.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng"
                name="resource_amount"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={100} style={{ width: 150 }} />
              </Form.Item>
            </Space>

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const current = getFieldValue("current_level");
                const target = getFieldValue("target_level");
                if (current && target && current >= target) {
                  return (
                    <div style={{ color: "#DC143C", marginBottom: 16 }}>
                      Cấp độ đến phải lớn hơn cấp độ hiện tại
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Space
              style={{
                marginTop: 20,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button onClick={() => setEditingId(null)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                disabled={
                  form.getFieldValue("current_level") >=
                  form.getFieldValue("target_level")
                }
              >
                Lưu
              </Button>
            </Space>
          </Form>
        </Card>
      )}
    </Space>
  );
};

export default BuildingUpgradeCostTab;
