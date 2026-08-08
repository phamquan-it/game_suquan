// app/admin/currencies/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Statistic,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  Popconfirm,
  Drawer,
  Divider,
  Empty,
  Spin,
  Alert,
  Switch,
  InputNumber,
  ColorPicker,
  Upload,
  Slider,
  Progress,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  DollarOutlined,
  GoldOutlined,
  SwapOutlined,
  DeleteOutlined as DeleteIcon,
  CopyOutlined,
  ExportOutlined,
  ImportOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  TagOutlined,
  WalletOutlined,
  CrownOutlined,
  FireOutlined,
  TeamOutlined,
  StarOutlined,
  GiftOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { 
  useCurrencies, 
  Currency, 
  CATEGORY_OPTIONS,
  getCategoryLabel,
  getCategoryColor,
  formatCurrencyAmount 
} from '../hooks/useCurrencies';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ============================================================
// Currency Statistics Component
// ============================================================
const CurrencyStatistics: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Tổng số tiền tệ',
      value: stats.total,
      icon: <WalletOutlined />,
      color: '#8B0000',
      bgColor: '#FFF0F0',
    },
    {
      title: 'Có thể giao dịch',
      value: stats.tradable,
      icon: <SwapOutlined />,
      color: '#2E8B57',
      bgColor: '#F0FFF4',
      suffix: `/${stats.total}`,
    },
    {
      title: 'Có thể hủy',
      value: stats.destroyable,
      icon: <DeleteIcon />,
      color: '#DC143C',
      bgColor: '#FFF0F0',
      suffix: `/${stats.total}`,
    },
    {
      title: 'Tỷ giá trung bình',
      value: stats.averageExchangeRate?.toFixed(2) || 0,
      icon: <GoldOutlined />,
      color: '#D4AF37',
      bgColor: '#FFFDF0',
      suffix: '',
    },
  ];

  return (
    <Card style={{ marginBottom: 16, borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <DollarOutlined style={{ color: '#8B0000', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>Tổng quan tiền tệ</Title>
        </Space>
        <Row gutter={[16, 16]}>
          {statItems.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <div
                style={{
                  background: item.bgColor,
                  padding: '16px 20px',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Statistic
                  title={
                    <Space>
                      {item.icon}
                      <span style={{ fontSize: 14 }}>{item.title}</span>
                    </Space>
                  }
                  value={item.value}
                  valueStyle={{ color: item.color, fontSize: 28, fontWeight: 600 }}
                  suffix={item.suffix}
                  loading={loading}
                />
              </div>
            </Col>
          ))}
        </Row>

        {/* Category Distribution */}
        {stats.byCategory && stats.byCategory.length > 0 && (
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Phân bố theo danh mục</Text>
                  <Space wrap>
                    {stats.byCategory.map((item: any) => {
                      const color = getCategoryColor(item.category);
                      return (
                        <Tag 
                          key={item.category} 
                          color={color}
                          style={{ padding: '4px 12px', fontSize: 13 }}
                        >
                          {getCategoryLabel(item.category)}: {item.count}
                        </Tag>
                      );
                    })}
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </Space>
    </Card>
  );
};

// ============================================================
// Currency Filters Component
// ============================================================
const CurrencyFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  onBulkDelete,
  selectedRowKeys,
}) => {
  return (
    <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={5}>
          <Input
            placeholder="Tìm kiếm tiền tệ..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Danh mục"
            style={{ width: '100%' }}
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
            allowClear
            size="middle"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>
                <Space>
                  <span style={{ color: opt.color }}>●</span>
                  {opt.label}
                </Space>
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={2}>
          <Select
            placeholder="Giao dịch"
            style={{ width: '100%' }}
            value={filters.tradable}
            onChange={(value) => setFilters({ ...filters, tradable: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Có thể giao dịch</Option>
            <Option value={false}>Không thể giao dịch</Option>
          </Select>
        </Col>
        <Col xs={12} md={2}>
          <Select
            placeholder="Hủy"
            style={{ width: '100%' }}
            value={filters.destroyable}
            onChange={(value) => setFilters({ ...filters, destroyable: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Có thể hủy</Option>
            <Option value={false}>Không thể hủy</Option>
          </Select>
        </Col>
        <Col xs={24} md={12}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Tooltip title="Làm mới">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Xóa tiền tệ đã chọn"
                description={`Bạn có chắc muốn xóa ${selectedRowKeys.length} tiền tệ?`}
                onConfirm={onBulkDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteIcon />}>
                  Xóa ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Thêm tiền tệ
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

// ============================================================
// Currency Table Component
// ============================================================
const CurrencyTable: React.FC<{
  currencies: Currency[];
  loading: boolean;
  onView: (currency: Currency) => void;
  onEdit: (currency: Currency) => void;
  onDelete: (currencyType: string) => void;
  onDuplicate: (currencyType: string) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: Currency[]) => void;
}> = ({
  currencies,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  selectedRowKeys,
  onSelectChange,
}) => {
  const columns: ColumnsType<Currency> = [
    {
      title: 'Loại',
      dataIndex: 'currency_type',
      key: 'currency_type',
      width: 120,
      render: (type: string) => (
        <Text code copyable={{ text: type }}>
          {type}
        </Text>
      ),
    },
    {
      title: 'Tên & Biểu tượng',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: Currency) => (
        <Space>
          {record.icon ? (
            <span style={{ fontSize: 24 }}>{record.icon}</span>
          ) : (
            <DollarOutlined style={{ fontSize: 20, color: record.color || '#666' }} />
          )}
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag 
          color={getCategoryColor(category)} 
          style={{ padding: '4px 12px', fontSize: 13 }}
        >
          {getCategoryLabel(category)}
        </Tag>
      ),
    },
    {
      title: 'Tỷ giá',
      dataIndex: 'exchange_rate',
      key: 'exchange_rate',
      width: 120,
      render: (rate: number) => (
        <Text strong style={{ color: '#D4AF37' }}>
          {formatCurrencyAmount(rate)}
        </Text>
      ),
      sorter: (a, b) => a.exchange_rate - b.exchange_rate,
    },
    {
      title: 'Stack tối đa',
      dataIndex: 'max_stack',
      key: 'max_stack',
      width: 120,
      render: (stack: number) => (
        <Badge 
          count={stack} 
          showZero 
          color="#1E90FF"
          style={{ backgroundColor: '#1E90FF' }}
        />
      ),
      sorter: (a, b) => a.max_stack - b.max_stack,
    },
    {
      title: 'Giao dịch',
      dataIndex: 'tradable',
      key: 'tradable',
      width: 100,
      render: (tradable: boolean) => (
        <Tag 
          icon={tradable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={tradable ? 'success' : 'error'}
        >
          {tradable ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Hủy',
      dataIndex: 'destroyable',
      key: 'destroyable',
      width: 100,
      render: (destroyable: boolean) => (
        <Tag 
          icon={destroyable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={destroyable ? 'warning' : 'default'}
        >
          {destroyable ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_: any, record: Currency) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#8B0000' }}
            />
          </Tooltip>
          <Tooltip title="Nhân bản">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => onDuplicate(record.currency_type)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa tiền tệ"
              description="Bạn có chắc muốn xóa tiền tệ này?"
              onConfirm={() => onDelete(record.currency_type)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteIcon />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={currencies}
      rowKey="currency_type"
      loading={loading}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
        ],
      }}
      pagination={{
        pageSize: 15,
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} loại tiền tệ`,
        pageSizeOptions: ['10', '15', '20', '50', '100'],
        locale: { items_per_page: 'tiền tệ/trang' },
      }}
      scroll={{ x: 1200 }}
      locale={{
        emptyText: <Empty description="Không tìm thấy tiền tệ nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
      }}
    />
  );
};

// ============================================================
// Currency Detail Drawer
// ============================================================
const CurrencyDetailDrawer: React.FC<{
  visible: boolean;
  currency: Currency | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (currency: Currency) => void;
}> = ({ visible, currency, loading, onClose, onEdit }) => {
  if (!currency) return null;

  return (
    <Drawer
      title={
        <Space>
          {currency.icon ? (
            <span style={{ fontSize: 28 }}>{currency.icon}</span>
          ) : (
            <DollarOutlined style={{ fontSize: 28, color: currency.color || '#666' }} />
          )}
          <span style={{ fontSize: 20, fontWeight: 600 }}>{currency.name}</span>
        </Space>
      }
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(currency)}>
          Sửa tiền tệ
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Loại" span={2}>
            <Text code copyable>{currency.currency_type}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tên" span={2}>
            <Text strong style={{ fontSize: 16 }}>{currency.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            <Tag color={getCategoryColor(currency.category)} style={{ padding: '4px 12px' }}>
              {getCategoryLabel(currency.category)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Màu sắc">
            <Space>
              <div
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: currency.color || '#666',
                  borderRadius: '50%',
                  border: '2px solid #ddd',
                }}
              />
              <Text>{currency.color || 'Mặc định'}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Biểu tượng">
            {currency.icon ? (
              <span style={{ fontSize: 32 }}>{currency.icon}</span>
            ) : (
              <Text type="secondary">Không có</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ giá">
            <Text strong style={{ color: '#D4AF37', fontSize: 16 }}>
              {formatCurrencyAmount(currency.exchange_rate)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Stack tối đa">
            <Badge 
              count={currency.max_stack} 
              color="#1E90FF"
              style={{ fontSize: 16 }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Có thể giao dịch">
            <Tag 
              icon={currency.tradable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              color={currency.tradable ? 'success' : 'error'}
            >
              {currency.tradable ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Có thể hủy">
            <Tag 
              icon={currency.destroyable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              color={currency.destroyable ? 'warning' : 'default'}
            >
              {currency.destroyable ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            {currency.description || <Text type="secondary">Không có mô tả</Text>}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Alert
          message="Thông tin"
          description={
            <div>
              <p style={{ margin: 0 }}>
                <WalletOutlined /> Loại tiền tệ này được sử dụng trong hệ thống kinh tế của game.
              </p>
              {currency.tradable && (
                <p style={{ margin: '4px 0 0 0' }}>
                  <SwapOutlined /> Có thể được giao dịch giữa người chơi.
                </p>
              )}
              {currency.destroyable && (
                <p style={{ margin: '4px 0 0 0' }}>
                  <DeleteIcon /> Có thể bị hủy bỏ hoặc tiêu hủy.
                </p>
              )}
            </div>
          }
          type="info"
          showIcon
        />
      </Spin>
    </Drawer>
  );
};

// ============================================================
// Currency Form Modal
// ============================================================
const CurrencyFormModal: React.FC<{
  visible: boolean;
  editingCurrency: Currency | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ visible, editingCurrency, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState<string>(editingCurrency?.color || '#8B0000');

  React.useEffect(() => {
    if (editingCurrency) {
      form.setFieldsValue({
        ...editingCurrency,
        exchange_rate: editingCurrency.exchange_rate || 1,
        max_stack: editingCurrency.max_stack || 999999,
        tradable: editingCurrency.tradable !== undefined ? editingCurrency.tradable : true,
        destroyable: editingCurrency.destroyable !== undefined ? editingCurrency.destroyable : false,
      });
      setColor(editingCurrency.color || '#8B0000');
    } else {
      form.resetFields();
      form.setFieldsValue({
        exchange_rate: 1,
        max_stack: 999999,
        tradable: true,
        destroyable: false,
        category: 'basic',
      });
      setColor('#8B0000');
    }
  }, [editingCurrency, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, color });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {editingCurrency ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingCurrency ? 'Sửa tiền tệ' : 'Thêm tiền tệ mới'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      okText={editingCurrency ? 'Cập nhật' : 'Tạo mới'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {!editingCurrency && (
          <Form.Item
            name="currency_type"
            label="Loại tiền tệ"
            rules={[
              { required: true, message: 'Vui lòng nhập loại tiền tệ' },
              { pattern: /^[a-zA-Z0-9_.-]+$/, message: 'Chỉ được chứa chữ cái, số, dấu gạch dưới, gạch ngang và dấu chấm' },
              { min: 2, message: 'Tối thiểu 2 ký tự' },
              { max: 50, message: 'Tối đa 50 ký tự' },
            ]}
            tooltip="Mã định danh duy nhất cho loại tiền tệ (ví dụ: gold, gem, token)"
          >
            <Input 
              placeholder="Nhập loại tiền tệ (ví dụ: gold, gem, token)" 
              size="large"
            />
          </Form.Item>
        )}

        {editingCurrency && (
          <Form.Item name="currency_type" label="Loại tiền tệ">
            <Input disabled size="large" />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label="Tên tiền tệ"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tiền tệ' },
            { min: 2, message: 'Tối thiểu 2 ký tự' },
            { max: 100, message: 'Tối đa 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên tiền tệ" size="large" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục" size="large">
                {CATEGORY_OPTIONS.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    <Space>
                      <span style={{ color: opt.color }}>●</span>
                      {opt.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="icon"
              label="Biểu tượng (Emoji)"
              tooltip="Chọn một emoji làm biểu tượng cho tiền tệ"
            >
              <Input placeholder="Ví dụ: 💰, 👑, ⭐" size="large" maxLength={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="color"
              label="Màu sắc"
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: 50, height: 40, padding: 2, cursor: 'pointer' }}
                />
                <Input 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#8B0000"
                  style={{ flex: 1 }}
                />
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="exchange_rate"
              label="Tỷ giá"
              rules={[
                { required: true, message: 'Vui lòng nhập tỷ giá' },
                { type: 'number', min: 0, message: 'Tỷ giá phải >= 0' },
              ]}
              tooltip="Tỷ giá quy đổi so với tiền tệ cơ bản"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="1.0" 
                min={0}
                step={0.01}
                size="large"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="max_stack"
              label="Stack tối đa"
              rules={[
                { required: true, message: 'Vui lòng nhập stack tối đa' },
                { type: 'number', min: 1, message: 'Stack tối đa phải >= 1' },
              ]}
              tooltip="Số lượng tối đa có thể xếp chồng trong một ô"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="999999" 
                min={1}
                size="large"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea
                placeholder="Nhập mô tả về tiền tệ"
                rows={2}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="tradable"
              label="Có thể giao dịch"
              valuePropName="checked"
              tooltip="Người chơi có thể trao đổi tiền tệ này không?"
            >
              <Switch 
                checkedChildren="Có" 
                unCheckedChildren="Không"
                size="default"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="destroyable"
              label="Có thể hủy"
              valuePropName="checked"
              tooltip="Người chơi có thể hủy bỏ tiền tệ này không?"
            >
              <Switch 
                checkedChildren="Có" 
                unCheckedChildren="Không"
                size="default"
              />
            </Form.Item>
          </Col>
        </Row>

        <Alert
          message="Lưu ý"
          description="Loại tiền tệ là mã định danh duy nhất và không thể thay đổi sau khi tạo. Hãy đảm bảo nhập đúng."
          type="warning"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};

// ============================================================
// Main Page Component
// ============================================================
const CurrencyManagementPage: React.FC = () => {
  const {
    currencies,
    loading,
    filters,
    setFilters,
    stats,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    deleteCurrencies,
    duplicateCurrency,
    fetchCurrencyDetails,
    refresh,
  } = useCurrencies();

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Handlers
  const handleAddNew = () => {
    setEditingCurrency(null);
    setFormModalVisible(true);
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormModalVisible(true);
  };

  const handleView = async (currency: Currency) => {
    const details = await fetchCurrencyDetails(currency.currency_type);
    setSelectedCurrency(details || currency);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (currencyType: string) => {
    await deleteCurrency(currencyType);
  };

  const handleDuplicate = async (currencyType: string) => {
    await duplicateCurrency(currencyType);
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteCurrencies(ids);
    setSelectedRowKeys([]);
  };

  const handleCurrencySubmit = async (data: any) => {
    if (editingCurrency) {
      await updateCurrency(editingCurrency.currency_type, data);
    } else {
      await createCurrency(data);
    }
    setFormModalVisible(false);
    setEditingCurrency(null);
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedCurrency(null);
  };

  const handleExport = () => {
    message.success('Chức năng xuất dữ liệu đang được phát triển');
  };

  // Table selection
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div style={{ padding: 24, background: '#F5F5DC', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Row align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space>
                <DollarOutlined style={{ fontSize: 28, color: '#8B0000' }} />
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    Quản lý tiền tệ
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Quản lý các loại tiền tệ trong game
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Tooltip title="Xuất dữ liệu">
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    Xuất
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics */}
        <CurrencyStatistics stats={stats} loading={loading} />

        {/* Filters */}
        <CurrencyFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onAddNew={handleAddNew}
          onBulkDelete={handleBulkDelete}
          selectedRowKeys={selectedRowKeys}
        />

        {/* Currency Table */}
        <CurrencyTable
          currencies={currencies}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={onSelectChange}
        />
      </Card>

      {/* Currency Form Modal */}
      <CurrencyFormModal
        visible={formModalVisible}
        editingCurrency={editingCurrency}
        loading={loading}
        onClose={() => {
          setFormModalVisible(false);
          setEditingCurrency(null);
        }}
        onSubmit={handleCurrencySubmit}
      />

      {/* Currency Detail Drawer */}
      <CurrencyDetailDrawer
        visible={viewDrawerVisible}
        currency={selectedCurrency}
        loading={loading}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default CurrencyManagementPage;
