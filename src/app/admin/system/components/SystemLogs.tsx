'use client';

import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  DatePicker, 
  Select, 
  Card,
  Typography,
  Tooltip,
  Switch,
  Alert,
  message,
  Row,
  Col,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  DownloadOutlined,
  ClearOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { SystemLog } from '@/lib/types/system.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

// Mock data - sẽ thay thế bằng API thực tế
const mockLogs: SystemLog[] = [
  {
    id: 'log-001',
    level: 'error',
    message: 'Database connection timeout',
    source: 'database-master-01',
    timestamp: '2024-01-15T14:30:00Z',
    details: {
      query: 'SELECT * FROM players WHERE id = ?',
      duration: 15000,
      error: 'Connection timeout after 15 seconds'
    }
  },
  {
    id: 'log-002',
    level: 'warning',
    message: 'High memory usage detected',
    source: 'game-server-01',
    timestamp: '2024-01-15T14:25:00Z',
    details: {
      memory_usage: '85%',
      process: 'game_server',
      recommendation: 'Consider restarting the service'
    }
  },
  {
    id: 'log-003',
    level: 'info',
    message: 'User authentication successful',
    source: 'auth-service',
    timestamp: '2024-01-15T14:20:00Z',
    details: {
      user_id: 'player_12345',
      ip: '192.168.1.100',
      method: 'oauth2'
    }
  },
  {
    id: 'log-004',
    level: 'debug',
    message: 'Cache miss for player data',
    source: 'cache-service',
    timestamp: '2024-01-15T14:15:00Z',
    details: {
      key: 'player:12345:data',
      action: 'fetch_from_database',
      duration: '45ms'
    }
  },
  {
    id: 'log-005',
    level: 'critical',
    message: 'Payment service unavailable',
    source: 'payment-gateway',
    timestamp: '2024-01-15T14:10:00Z',
    details: {
      service: 'stripe',
      error: '503 Service Unavailable',
      impact: 'Payment processing delayed'
    }
  }
];

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>(mockLogs);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Filter logs based on search and filters
  React.useEffect(() => {
    let filtered = logs;
    
    if (searchText) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchText.toLowerCase()) ||
        log.source.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchText, levelFilter, sourceFilter]);

  const getLogLevelColor = (level: SystemLog['level']) => {
    switch (level) {
      case 'error': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      case 'debug': return 'green';
      case 'critical': return 'purple';
      default: return 'default';
    }
  };

  const getLogLevelText = (level: SystemLog['level']) => {
    switch (level) {
      case 'error': return 'Lỗi';
      case 'warning': return 'Cảnh báo';
      case 'info': return 'Thông tin';
      case 'debug': return 'Debug';
      case 'critical': return 'Nghiêm trọng';
      default: return level;
    }
  };

  const handleViewDetails = (log: SystemLog) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  const handleClearLogs = () => {
    Modal.confirm({
      title: 'Xác nhận xóa nhật ký',
      content: 'Bạn có chắc chắn muốn xóa tất cả nhật ký hệ thống?',
      onOk: () => {
        setLogs([]);
        setFilteredLogs([]);
        message.success('Đã xóa tất cả nhật ký hệ thống');
      }
    });
  };

  const handleRefresh = () => {
    // In real app, this would fetch fresh logs from API
    message.success('Đã làm mới nhật ký hệ thống');
  };

  const handleExport = () => {
    // In real app, this would export logs to file
    message.success('Đã xuất nhật ký hệ thống');
  };

  const columns: ColumnsType<SystemLog> = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (timestamp: string) => (
        <Text style={{ fontSize: 12 }}>
          {new Date(timestamp).toLocaleString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      filters: [
        { text: 'Critical', value: 'critical' },
        { text: 'Error', value: 'error' },
        { text: 'Warning', value: 'warning' },
        { text: 'Info', value: 'info' },
        { text: 'Debug', value: 'debug' },
      ],
      onFilter: (value, record) => record.level === value,
      render: (level: SystemLog['level']) => (
        <Tag color={getLogLevelColor(level)}>
          {getLogLevelText(level)}
        </Tag>
      ),
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (source: string) => (
        <Text style={{ fontFamily: 'monospace' }}>{source}</Text>
      ),
    },
    {
      title: 'Thông điệp',
      dataIndex: 'message',
      key: 'message',
      render: (message: string, record: SystemLog) => (
        <div>
          <div style={{ marginBottom: 4 }}>{message}</div>
          {record.details && (
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            >
              Xem chi tiết
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const errorCount = logs.filter(log => log.level === 'error' || log.level === 'critical').length;
  const warningCount = logs.filter(log => log.level === 'warning').length;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Alerts */}
      {(errorCount > 0 || warningCount > 0) && (
        <Row gutter={[16, 16]}>
          {errorCount > 0 && (
            <Col xs={24} sm={12}>
              <Alert
                message={`Có ${errorCount} lỗi nghiêm trọng trong hệ thống`}
                type="error"
                showIcon
              />
            </Col>
          )}
          {warningCount > 0 && (
            <Col xs={24} sm={12}>
              <Alert
                message={`Có ${warningCount} cảnh báo trong hệ thống`}
                type="warning"
                showIcon
              />
            </Col>
          )}
        </Row>
      )}

      {/* Filters */}
      <Card size="small" variant="borderless">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Tìm kiếm nhật ký..."
              allowClear
              style={{ width: '100%' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Mức độ"
              value={levelFilter}
              onChange={setLevelFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="critical">Critical</Option>
              <Option value="error">Error</Option>
              <Option value="warning">Warning</Option>
              <Option value="info">Info</Option>
              <Option value="debug">Debug</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Nguồn"
              value={sourceFilter}
              onChange={setSourceFilter}
            >
              <Option value="all">Tất cả</Option>
              {Array.from(new Set(logs.map(log => log.source))).map(source => (
                <Option key={source} value={source}>{source}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Tooltip title="Tự động làm mới">
                <Switch
                  size="small"
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                />
              </Tooltip>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Làm mới
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                Xuất
              </Button>
              <Button 
                icon={<ClearOutlined />} 
                danger 
                onClick={handleClearLogs}
              >
                Xóa
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Logs Table */}
      <Card variant="borderless">
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredLogs.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          size="middle"
        />
      </Card>

      {/* Log Detail Modal */}
      <Modal
        title={`Chi Tiết Nhật Ký - ${selectedLog?.id}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedLog && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Thời gian:</Text>
                <br />
                <Text>{new Date(selectedLog.timestamp).toLocaleString('vi-VN')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Mức độ:</Text>
                <br />
                <Tag color={getLogLevelColor(selectedLog.level)}>
                  {getLogLevelText(selectedLog.level)}
                </Tag>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Nguồn:</Text>
                <br />
                <Text style={{ fontFamily: 'monospace' }}>{selectedLog.source}</Text>
              </Col>
              <Col span={12}>
                <Text strong>ID:</Text>
                <br />
                <Text style={{ fontFamily: 'monospace' }}>{selectedLog.id}</Text>
              </Col>
            </Row>

            <div>
              <Text strong>Thông điệp:</Text>
              <br />
              <Text>{selectedLog.message}</Text>
            </div>

            {selectedLog.details && (
              <div>
                <Text strong>Chi tiết:</Text>
                <br />
                <TextArea
                  value={JSON.stringify(selectedLog.details, null, 2)}
                  rows={8}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
              </div>
            )}
          </Space>
        )}
      </Modal>
    </Space>
  );
}
