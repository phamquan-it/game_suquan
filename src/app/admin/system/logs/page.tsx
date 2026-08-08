// app/admin/system/logs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Timeline,
  Descriptions,
  Switch,
  Progress,
  Tabs,
  List,
  Avatar,
  Collapse,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined,
  FilterOutlined,
  EyeOutlined,
  ClearOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BugOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CodeOutlined,
  CopyOutlined,
  CalendarOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  useSystemLogs,
  SystemLog,
  LogLevel,
  LOG_LEVELS,
  formatLogTimestamp,
  getRelativeTime,
  truncateMessage,
} from '../hooks/useSystemLogs';
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// ============================================================
// Log Statistics Component
// ============================================================
const LogStatistics: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Tổng số logs',
      value: stats.total,
      icon: <DatabaseOutlined />,
      color: '#8B0000',
      bgColor: '#FFF0F0',
    },
    {
      title: 'Tỷ lệ lỗi',
      value: `${stats.errorRate?.toFixed(1) || 0}%`,
      icon: <WarningOutlined />,
      color: '#DC143C',
      bgColor: '#FFF0F0',
    },
    {
      title: 'Sources',
      value: stats.bySource?.length || 0,
      icon: <TagOutlined />,
      color: '#1E90FF',
      bgColor: '#F0F8FF',
    },
    {
      title: 'Khoảng thời gian',
      value: stats.timeRange ? 
        `${dayjs(stats.timeRange.start).format('DD/MM')} - ${dayjs(stats.timeRange.end).format('DD/MM')}` :
        'N/A',
      icon: <CalendarOutlined />,
      color: '#D4AF37',
      bgColor: '#FFFDF0',
    },
  ];

  return (
    <Card style={{ marginBottom: 16, borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <BarChartOutlined style={{ color: '#8B0000', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>Tổng quan nhật ký</Title>
          <Badge 
            count={stats.total} 
            showZero 
            color="#8B0000"
            style={{ backgroundColor: '#8B0000' }}
          />
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
                  loading={loading}
                />
              </div>
            </Col>
          ))}
        </Row>

        {/* Level Distribution */}
        {stats.byLevel && stats.byLevel.length > 0 && (
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Phân bố theo mức độ</Text>
                  <Space wrap>
                    {stats.byLevel.map((item: any) => {
                      const config = LOG_LEVELS.find(l => l.value === item.level);
                      return (
                        <Tooltip key={item.level} title={`${item.count} logs (${item.percentage.toFixed(1)}%)`}>
                          <Tag 
                            color={config?.color || '#666'}
                            style={{ padding: '4px 12px', fontSize: 13 }}
                          >
                            {config?.icon} {config?.label}: {item.count}
                          </Tag>
                        </Tooltip>
                      );
                    })}
                  </Space>
                  <Progress
                    percent={100}
                    strokeColor={LOG_LEVELS.map(l => l.color)}
                    format={() => ''}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        )}

        {/* Top Sources */}
        {stats.bySource && stats.bySource.length > 0 && (
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Nguồn phổ biến nhất</Text>
                  <Space wrap>
                    {stats.bySource.slice(0, 5).map((item: any) => (
                      <Tag 
                        key={item.source} 
                        color="blue"
                        style={{ padding: '4px 12px', fontSize: 13 }}
                      >
                        {item.source}: {item.count} ({item.percentage.toFixed(1)}%)
                      </Tag>
                    ))}
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
// Log Filters Component
// ============================================================
const LogFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onClearAll: () => void;
  onExport: () => void;
  availableSources: string[];
  selectedRowKeys: React.Key[];
  onBulkDelete: () => void;
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onClearAll,
  onExport,
  availableSources,
  selectedRowKeys,
  onBulkDelete,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      setFilters({
        ...filters,
        dateFrom: dateStrings[0] || null,
        dateTo: dateStrings[1] || null,
      });
    } else {
      setFilters({
        ...filters,
        dateFrom: null,
        dateTo: null,
      });
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={5}>
          <Input
            placeholder="Tìm kiếm logs..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Mức độ"
            style={{ width: '100%' }}
            value={filters.level}
            onChange={(value) => setFilters({ ...filters, level: value })}
            allowClear
            size="middle"
          >
            {LOG_LEVELS.map(level => (
              <Option key={level.value} value={level.value}>
                <Space>
                  <span>{level.icon}</span>
                  <span style={{ color: level.color }}>{level.label}</span>
                </Space>
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Nguồn"
            style={{ width: '100%' }}
            value={filters.source}
            onChange={(value) => setFilters({ ...filters, source: value })}
            allowClear
            size="middle"
          >
            {availableSources.map(source => (
              <Option key={source} value={source}>{source}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Chi tiết"
            style={{ width: '100%' }}
            value={filters.hasDetails}
            onChange={(value) => setFilters({ ...filters, hasDetails: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Có chi tiết</Option>
            <Option value={false}>Không chi tiết</Option>
          </Select>
        </Col>
        <Col xs={24} md={10}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Tooltip title="Làm mới">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
            </Tooltip>
            <Tooltip title="Xuất logs">
              <Button icon={<ExportOutlined />} onClick={onExport}>
                Xuất
              </Button>
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Xóa logs đã chọn"
                description={`Bạn có chắc muốn xóa ${selectedRowKeys.length} logs?`}
                onConfirm={onBulkDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Popconfirm
              title="Xóa tất cả logs"
              description="Bạn có chắc chắn muốn xóa tất cả logs? Hành động này không thể hoàn tác."
              onConfirm={onClearAll}
              okText="Xóa tất cả"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<ClearOutlined />}>
                Xóa tất cả
              </Button>
            </Popconfirm>
            <Button 
              type="primary" 
              icon={<FilterOutlined />} 
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ẩn nâng cao' : 'Nâng cao'}
            </Button>
          </Space>
        </Col>
      </Row>

      {showAdvanced && (
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col xs={24} md={12}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={handleDateRangeChange}
              value={filters.dateFrom && filters.dateTo ? [
                dayjs(filters.dateFrom),
                dayjs(filters.dateTo),
              ] : undefined}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space>
              <Button 
                size="small" 
                onClick={() => {
                  setFilters({
                    ...filters,
                    dateFrom: null,
                    dateTo: null,
                  });
                }}
              >
                Xóa bộ lọc ngày
              </Button>
              <Button 
                size="small"
                onClick={() => {
                  const now = dayjs();
                  setFilters({
                    ...filters,
                    dateFrom: now.subtract(1, 'hour').toISOString(),
                    dateTo: now.toISOString(),
                  });
                }}
              >
                1 giờ qua
              </Button>
              <Button 
                size="small"
                onClick={() => {
                  const now = dayjs();
                  setFilters({
                    ...filters,
                    dateFrom: now.subtract(24, 'hours').toISOString(),
                    dateTo: now.toISOString(),
                  });
                }}
              >
                24 giờ qua
              </Button>
              <Button 
                size="small"
                onClick={() => {
                  const now = dayjs();
                  setFilters({
                    ...filters,
                    dateFrom: now.subtract(7, 'days').toISOString(),
                    dateTo: now.toISOString(),
                  });
                }}
              >
                7 ngày qua
              </Button>
            </Space>
          </Col>
        </Row>
      )}
    </Card>
  );
};

// ============================================================
// Log Table Component
// ============================================================
const LogTable: React.FC<{
  logs: SystemLog[];
  loading: boolean;
  onView: (log: SystemLog) => void;
  onDelete: (id: string) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: SystemLog[]) => void;
}> = ({
  logs,
  loading,
  onView,
  onDelete,
  selectedRowKeys,
  onSelectChange,
}) => {
  const columns: ColumnsType<SystemLog> = [
    {
      title: 'Mức độ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: LogLevel) => {
        const config = LOG_LEVELS.find(l => l.value === level);
        return (
          <Tag 
            color={config?.color || '#666'}
            icon={<span>{config?.icon}</span>}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            {config?.label || level}
          </Tag>
        );
      },
      filters: LOG_LEVELS.map(l => ({ text: l.label, value: l.value })),
      onFilter: (value, record) => record.level === value,
    },
    {
      title: 'Thông điệp',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message: string, record: SystemLog) => (
        <Tooltip title={message}>
          <Space>
            <Text 
              style={{ 
                color: LOG_LEVELS.find(l => l.value === record.level)?.color || '#666',
                fontWeight: record.level === 'error' || record.level === 'fatal' ? 600 : 400,
              }}
            >
              {truncateMessage(message, 150)}
            </Text>
            {record.details && (
              <Tooltip title="Có chi tiết bổ sung">
                <Tag color="blue" >📋</Tag>
              </Tooltip>
            )}
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (source: string) => (
        <Tag color="cyan">{source}</Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <Tooltip title={formatLogTimestamp(timestamp)}>
          <Space>
            <ClockCircleOutlined style={{ fontSize: 12, color: '#999' }} />
            <Text>{getRelativeTime(timestamp)}</Text>
          </Space>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: any, record: SystemLog) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa log"
              description="Bạn có chắc muốn xóa log này?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={logs}
      rowKey="id"
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
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} logs`,
        pageSizeOptions: ['10', '20', '50', '100'],
        locale: { items_per_page: 'logs/trang' },
      }}
      scroll={{ x: 1200 }}
      locale={{
        emptyText: <Empty description="Không tìm thấy logs" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
      }}
      rowClassName={(record) => {
        const level = record.level;
        if (level === 'fatal') return 'log-row-fatal';
        if (level === 'error') return 'log-row-error';
        if (level === 'warn') return 'log-row-warn';
        return '';
      }}
    />
  );
};

// ============================================================
// Log Detail Drawer
// ============================================================
const LogDetailDrawer: React.FC<{
  visible: boolean;
  log: SystemLog | null;
  loading: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}> = ({ visible, log, loading, onClose, onDelete }) => {
  if (!log) return null;

  const config = LOG_LEVELS.find(l => l.value === log.level);

  return (
    <Drawer
      title={
        <Space>
          <span style={{ fontSize: 24 }}>{config?.icon}</span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Chi tiết log</span>
          <Tag color={config?.color} style={{ fontSize: 14 }}>
            {config?.label}
          </Tag>
        </Space>
      }
      placement="right"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Popconfirm
          title="Xóa log"
          description="Bạn có chắc muốn xóa log này?"
          onConfirm={() => {
            onDelete(log.id);
            onClose();
          }}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa log
          </Button>
        </Popconfirm>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="ID" span={2}>
            <Text code copyable>{log.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mức độ">
            <Tag 
              color={config?.color} 
              icon={<span>{config?.icon}</span>}
              style={{ padding: '4px 12px', fontSize: 14 }}
            >
              {config?.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Nguồn">
            <Tag color="cyan">{log.source}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian" span={2}>
            <Space>
              <ClockCircleOutlined />
              <Text>{formatLogTimestamp(log.timestamp)}</Text>
              <Text type="secondary">({getRelativeTime(log.timestamp)})</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Thông điệp" span={2}>
            <Paragraph style={{ margin: 0, fontSize: 15, whiteSpace: 'pre-wrap' }}>
              {log.message}
            </Paragraph>
          </Descriptions.Item>
          {log.details && (
            <Descriptions.Item label="Chi tiết" span={2}>
              <Card size="small" style={{ background: '#f5f5f5' }}>
                <pre style={{ margin: 0, fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </Card>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <Alert
          message="Thông tin log"
          description={
            <div>
              <p style={{ margin: 0 }}>
                <DatabaseOutlined /> Log này được tạo từ nguồn <strong>{log.source}</strong>
              </p>
              {log.details && (
                <p style={{ margin: '4px 0 0 0' }}>
                  <CodeOutlined /> Có dữ liệu chi tiết bổ sung
                </p>
              )}
            </div>
          }
          type={log.level === 'error' || log.level === 'fatal' ? 'error' : 'info'}
          showIcon
        />

        <Divider />

        <Space>
          <Button 
            icon={<CopyOutlined />} 
            onClick={() => {
              const text = JSON.stringify(log, null, 2);
              navigator.clipboard.writeText(text);
              message.success('Đã sao chép log');
            }}
          >
            Sao chép
          </Button>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={() => {
              const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `log_${log.id}_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              message.success('Đã tải xuống log');
            }}
          >
            Tải xuống
          </Button>
        </Space>
      </Spin>
    </Drawer>
  );
};

// ============================================================
// Main Page Component
// ============================================================
const SystemLogManagementPage: React.FC = () => {
  const {
    logs,
    loading,
    filters,
    setFilters,
    stats,
    availableSources,
    deleteLog,
    deleteLogs,
    clearAllLogs,
    exportLogs,
    fetchLogDetail,
    refresh,
  } = useSystemLogs();

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refresh();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [autoRefresh, refresh]);

  // Handlers
  const handleView = async (log: SystemLog) => {
    const details = await fetchLogDetail(log.id);
    setSelectedLog(details || log);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteLog(id);
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteLogs(ids);
    setSelectedRowKeys([]);
  };

  const handleClearAll = async () => {
    await clearAllLogs();
    setSelectedRowKeys([]);
  };

  const handleExport = async () => {
    await exportLogs('json');
  };

  const handleExportCSV = async () => {
    await exportLogs('csv');
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedLog(null);
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
                <DatabaseOutlined style={{ fontSize: 28, color: '#8B0000' }} />
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    Nhật ký hệ thống
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Theo dõi và quản lý tất cả logs của hệ thống
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Switch
                  checkedChildren="Tự động làm mới"
                  unCheckedChildren="Dừng làm mới"
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                />
                <Tooltip title="Xuất CSV">
                  <Button icon={<FileTextOutlined />} onClick={handleExportCSV}>
                    CSV
                  </Button>
                </Tooltip>
                <Tooltip title="Xuất JSON">
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    JSON
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics */}
        <LogStatistics stats={stats} loading={loading} />

        {/* Filters */}
        <LogFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onClearAll={handleClearAll}
          onExport={handleExport}
          availableSources={availableSources}
          selectedRowKeys={selectedRowKeys}
          onBulkDelete={handleBulkDelete}
        />

        {/* Log Table */}
        <LogTable
          logs={logs}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={onSelectChange}
        />

        {/* Recent Activity */}
        {stats?.logsByHour && stats.logsByHour.length > 0 && (
          <Card size="small" style={{ marginTop: 16, borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <LineChartOutlined style={{ color: '#8B0000' }} />
                <Text strong>Hoạt động 24 giờ qua</Text>
              </Space>
              <Row gutter={[4, 4]}>
                {stats.logsByHour.map((item: any) => (
                  <Col key={item.hour} span={1}>
                    <Tooltip title={`${item.hour}: ${item.count} logs`}>
                      <div
                        style={{
                          height: Math.max(4, (item.count / Math.max(1, Math.max(...stats.logsByHour.map((h: any) => h.count)))) * 60),
                          backgroundColor: item.count > 10 ? '#DC143C' : item.count > 5 ? '#FF8C00' : '#1E90FF',
                          borderRadius: 4,
                          minHeight: 4,
                          transition: 'height 0.5s',
                        }}
                      />
                    </Tooltip>
                  </Col>
                ))}
              </Row>
            </Space>
          </Card>
        )}
      </Card>

      {/* Log Detail Drawer */}
      <LogDetailDrawer
        visible={viewDrawerVisible}
        log={selectedLog}
        loading={loading}
        onClose={handleCloseView}
        onDelete={handleDelete}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .log-row-fatal {
          background-color: #FFE8E8 !important;
        }
        .log-row-fatal:hover {
          background-color: #FFD8D8 !important;
        }
        .log-row-error {
          background-color: #FFF0F0 !important;
        }
        .log-row-error:hover {
          background-color: #FFE8E8 !important;
        }
        .log-row-warn {
          background-color: #FFF8F0 !important;
        }
        .log-row-warn:hover {
          background-color: #FFF0E0 !important;
        }
      `}</style>
    </div>
  );
};

export default SystemLogManagementPage;
