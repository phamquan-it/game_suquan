'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  InputNumber,
  Form,
  Select,
  Card,
  Popconfirm,
  Tag,
  Tooltip,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useGeneralSkills } from '../hooks/useGeneralSkills';
import { useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/useGeneralMutations';
const { Text } = Typography;

interface GeneralSkillsTabProps {
  generalId: string;
}

const GeneralSkillsTab: React.FC<GeneralSkillsTabProps> = ({ generalId }) => {
  const { data: skills, refetch } = useGeneralSkills(generalId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const handleAdd = () => {
    setEditingId('new');
    form.resetFields();
    form.setFieldsValue({
      level: 1,
      max_level: 10,
      cooldown: 0,
      mana_cost: 0,
    });
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
  };

  const handleDelete = async (skillId: string) => {
    await deleteSkill.mutateAsync({ skillId, generalId });
    refetch();
  };

  const handleSave = async (values: any) => {
    if (editingId === 'new') {
      await createSkill.mutateAsync({ generalId, data: values });
    } else {
      await updateSkill.mutateAsync({ skillId: editingId!, data: values, generalId });
    }
    setEditingId(null);
    refetch();
  };

  const getSkillTypeColor = (type: string) => {
    switch (type) {
      case 'active': return 'blue';
      case 'passive': return 'green';
      case 'ultimate': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Tên kỹ năng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Tag color={getSkillTypeColor(record.type)}>
            {record.type === 'active' && 'Chủ động'}
            {record.type === 'passive' && 'Bị động'}
            {record.type === 'ultimate' && 'Tuyệt kỹ'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Cấp độ',
      key: 'level',
      render: (_: any, record: any) => (
        <Text>{record.level}/{record.max_level}</Text>
      ),
    },
    {
      title: 'Hồi chiêu',
      dataIndex: 'cooldown',
      key: 'cooldown',
      render: (val: number) => val ? `${val} giây` : '-',
    },
    {
      title: 'Năng lượng',
      dataIndex: 'mana_cost',
      key: 'mana_cost',
      render: (val: number) => val || '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa kỹ năng"
            description="Bạn có chắc muốn xóa kỹ năng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm kỹ năng
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={skills || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      {editingId !== null && (
        <Card
          title={editingId === 'new' ? 'Thêm kỹ năng mới' : 'Chỉnh sửa kỹ năng'}
          style={{ marginTop: 16 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên kỹ năng"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Loại kỹ năng"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Select.Option value="active">Chủ động</Select.Option>
                      <Select.Option value="passive">Bị động</Select.Option>
                      <Select.Option value="ultimate">Tuyệt kỹ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả"
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="level"
                    label="Cấp độ"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="max_level"
                    label="Cấp tối đa"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="icon"
                    label="Icon"
                  >
                    <Input placeholder="URL icon" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="cooldown"
                    label="Thời gian hồi (giây)"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="mana_cost"
                    label="Năng lượng tiêu hao"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Space>

            <Space style={{ marginTop: 20, justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={() => setEditingId(null)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={createSkill.isPending || updateSkill.isPending}
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

export default GeneralSkillsTab;
