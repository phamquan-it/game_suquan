"use client"

// pages/dashboard/game-actions.tsx
import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useCreateGameAction, useDeleteGameAction, useGameActions, useUpdateGameAction } from './useGameAction';
import { CreateGameActionInput, GameAction, UpdateGameActionInput } from './types';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Tùy chọn danh mục với nhãn và màu sắc
const CATEGORY_OPTIONS = [
  { value: 'combat', label: 'Chiến đấu', color: '#DC143C' },
  { value: 'exploration', label: 'Khám phá', color: '#2E8B57' },
  { value: 'social', label: 'Xã hội', color: '#1E90FF' },
  { value: 'crafting', label: 'Chế tạo', color: '#FF8C00' },
  { value: 'quest', label: 'Nhiệm vụ', color: '#D4AF37' },
  { value: 'economy', label: 'Kinh tế', color: '#8B4513' },
  { value: 'magic', label: 'Phép thuật', color: '#9370DB' },
  { value: 'stealth', label: 'Tàng hình', color: '#708090' },
];

// FIX: Cho phép dấu chấm (.) trong ID
// Hàm kiểm tra ID hợp lệ (chứa chữ cái, số, dấu gạch dưới, dấu gạch ngang, dấu chấm)
const isValidId = (id: string): boolean => {
  // SỬA: Thêm dấu chấm vào regex
  const idRegex = /^[a-zA-Z0-9_.-]+$/;
  return idRegex.test(id);
};

// FIX: Giữ nguyên dấu chấm, không chuyển đổi thành dấu gạch dưới
// Hàm chuyển đổi chuỗi thành ID không dấu
const convertToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    // SỬA: Cho phép dấu chấm và dấu gạch ngang
    .replace(/[^a-z0-9\s_.-]/g, '') 
    .replace(/\s+/g, '_') // Thay khoảng trắng bằng gạch dưới
    .replace(/_+/g, '_') // Xóa gạch dưới trùng lặp
    // KHÔNG chuyển đổi dấu chấm thành dấu gạch dưới
    .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở đầu và cuối
};

const GameActionsDashboard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAction, setEditingAction] = useState<GameAction | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Truy vấn và mutations
  const { data: actions = [], isLoading, refetch } = useGameActions();
  const createMutation = useCreateGameAction();
  const updateMutation = useUpdateGameAction();
  const deleteMutation = useDeleteGameAction();

  // Lọc hành động theo danh mục
  const filteredActions = filterCategory
    ? actions.filter((action) => action.category === filterCategory)
    : actions;

  // Xử lý tạo/cập nhật
  const handleSubmit = async (values: any) => {
    try {
      if (editingAction) {
        const updateData: UpdateGameActionInput = {
          id: editingAction.id,
          description: values.description,
          category: values.category,
          repeatable: values.repeatable,
          metadata: values.metadata ? JSON.parse(values.metadata) : {},
        };
        await updateMutation.mutateAsync(updateData);
        message.success('Cập nhật hành động thành công!');
      } else {
        // Sử dụng ID do người dùng nhập hoặc tự động sinh từ description
        let actionId = values.id?.trim();

        if (!actionId) {
          // Nếu không nhập ID, tự động sinh từ description
          actionId = convertToSlug(values.description);
        } else if (!isValidId(actionId)) {
          // FIX: Thông báo lỗi cho phép dấu chấm
          message.error('ID chỉ được chứa chữ cái (a-z, A-Z), số (0-9), dấu gạch dưới (_), dấu gạch ngang (-) và dấu chấm (.)');
          return;
        }

        // Kiểm tra ID đã tồn tại chưa
        const existingAction = actions.find(action => action.id === actionId);
        if (existingAction) {
          message.error(`ID "${actionId}" đã tồn tại. Vui lòng sử dụng ID khác.`);
          return;
        }

        const createData: CreateGameActionInput = {
          id: actionId,
          description: values.description,
          category: values.category,
          repeatable: values.repeatable,
          metadata: values.metadata ? JSON.parse(values.metadata) : {},
        };
        await createMutation.mutateAsync(createData);
        message.success('Tạo hành động mới thành công!');
      }
      handleCloseModal();
    } catch (error) {
      message.error('Không thể lưu hành động');
      console.error(error);
    }
  };

  const handleEdit = (action: GameAction) => {
    setEditingAction(action);
    form.setFieldsValue({
      id: action.id,
      description: action.description,
      category: action.category,
      repeatable: action.repeatable,
      metadata: JSON.stringify(action.metadata, null, 2),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Xóa hành động thành công!');
    } catch (error) {
      message.error('Không thể xóa hành động');
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingAction(null);
    form.resetFields();
  };

  const handleCreateNew = () => {
    setEditingAction(null);
    form.resetFields();
    form.setFieldsValue({
      repeatable: true,
      metadata: '{}',
    });
    setModalVisible(true);
  };

  const handleDuplicate = (action: GameAction) => {
    setEditingAction(null);
    const newId = `${action.id}_copy`;
    form.setFieldsValue({
      id: newId,
      description: `${action.description} (Sao chép)`,
      category: action.category,
      repeatable: action.repeatable,
      metadata: JSON.stringify(action.metadata, null, 2),
    });
    setModalVisible(true);
  };

  // Tự động sinh ID từ mô tả
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const currentId = form.getFieldValue('id');

    // Chỉ tự động điền ID nếu chưa có ID hoặc ID đang là rỗng
    if (!currentId || currentId === '') {
      const generatedId = convertToSlug(description);
      form.setFieldsValue({ id: generatedId });
    }
  };

  const getCategoryTag = (category: string) => {
    const categoryOption = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return (
      <Tag color={categoryOption?.color} style={{ fontSize: '12px', padding: '2px 8px' }}>
        {categoryOption?.label || category}
      </Tag>
    );
  };

  // Cột của bảng
  const columns: ColumnsType<GameAction> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
      fixed: 'left',
      render: (id: string) => (
        <Text code copyable={{ text: id }}>
          {id}
        </Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      render: (text: string) => (
        <div>
          <Text strong>{text.substring(0, 100)}</Text>
          {text.length > 100 && <Text type="secondary">...</Text>}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (category: string) => getCategoryTag(category),
      filters: CATEGORY_OPTIONS.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value: React.Key | boolean, record: GameAction) => record.category === String(value),
    },
    {
      title: 'Lặp lại',
      dataIndex: 'repeatable',
      key: 'repeatable',
      width: '8%',
      render: (repeatable: boolean) => (
        <Badge
          status={repeatable ? 'success' : 'default'}
          text={repeatable ? 'Có' : 'Không'}
          color={repeatable ? '#2E8B57' : undefined}
        />
      ),
    },
    {
      title: 'Siêu dữ liệu',
      dataIndex: 'metadata',
      key: 'metadata',
      width: '20%',
      render: (metadata: any) => (
        <Tooltip title={JSON.stringify(metadata, null, 2)}>
          <Text code style={{ fontSize: '12px' }}>
            {Object.keys(metadata).length} trường
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '12%',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      sorter: (a: GameAction, b: GameAction) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '10%',
      fixed: 'right',
      render: (_: any, record: GameAction) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#8B0000' }}
            />
          </Tooltip>
          <Tooltip title="Sao chép">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hành động"
            description="Bạn có chắc chắn muốn xóa hành động này? Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Thống kê
  const stats = {
    total: actions.length,
    combat: actions.filter(a => a.category === 'combat').length,
    repeatable: actions.filter(a => a.repeatable).length,
    categories: new Set(actions.map(a => a.category)).size,
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
          marginBottom: 24,
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#8B0000' }}>
              Quản lý hành động game
            </Title>
            <Paragraph style={{ marginTop: 8, color: '#8B4513' }}>
              Quản lý tất cả hành động trong game, danh mục và thuộc tính
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                loading={isLoading}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateNew}
                size="large"
              >
                Tạo hành động mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ textAlign: 'center' }}>
            <Text type="secondary">Tổng số hành động</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#8B0000' }}>
              {stats.total}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ textAlign: 'center' }}>
            <Text type="secondary">Hành động chiến đấu</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#DC143C' }}>
              {stats.combat}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ textAlign: 'center' }}>
            <Text type="secondary">Hành động lặp lại</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#2E8B57' }}>
              {stats.repeatable}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ textAlign: 'center' }}>
            <Text type="secondary">Danh mục</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#D4AF37' }}>
              {stats.categories}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Bảng chính */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredActions}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng số ${total} hành động`,
          }}
          scroll={{ x: 1200 }}
          style={{ background: 'transparent' }}
        />
      </Card>

      {/* Modal tạo/chỉnh sửa */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editingAction ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingAction ? 'Chỉnh sửa hành động' : 'Tạo hành động mới'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        style={{ top: 20 }}
        styles={{
          body: { padding: '20px 24px' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            repeatable: true,
            metadata: '{}',
          }}
        >
          {!editingAction && (
            <Form.Item
              name="id"
              label="ID"
              tooltip="ID chỉ được chứa chữ cái (a-z, A-Z), số (0-9), dấu gạch dưới (_), dấu gạch ngang (-) và dấu chấm (.). Để trống để tự động sinh từ mô tả."
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value.trim() === '') {
                      return Promise.resolve();
                    }
                    // FIX: Sử dụng hàm isValidId đã được cập nhật
                    if (!isValidId(value)) {
                      return Promise.reject('ID chỉ được chứa chữ cái (a-z, A-Z), số (0-9), dấu gạch dưới (_), dấu gạch ngang (-) và dấu chấm (.)');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="Ví dụ: attack.enemy, move.forward, quest.01 (để trống để tự động sinh)"
                autoComplete="off"
              />
            </Form.Item>
          )}

          {editingAction && (
            <Form.Item
              name="id"
              label="ID"
            >
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              { min: 5, message: 'Mô tả phải có ít nhất 5 ký tự' },
              { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về hành động trong game..."
              showCount
              maxLength={500}
              onChange={handleDescriptionChange}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {CATEGORY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: option.color,
                      }}
                    />
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="repeatable"
            label="Có thể lặp lại"
            valuePropName="checked"
            tooltip="Hành động này có thể được thực hiện nhiều lần không?"
          >
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
            />
          </Form.Item>

          <Form.Item
            name="metadata"
            label="Siêu dữ liệu (JSON)"
            tooltip="Dữ liệu bổ sung cho hành động dưới dạng JSON"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.trim() === '') {
                    return Promise.resolve();
                  }
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (e) {
                    return Promise.reject('Định dạng JSON không hợp lệ');
                  }
                },
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder={`{
  "xp_reward": 100,
  "gold_reward": 50,
  "required_level": 5
}`}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingAction ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GameActionsDashboard;
