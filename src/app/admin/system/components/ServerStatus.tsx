'use client';

import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Card, 
  Typography, 
  Progress, 
  Tooltip,
  Modal,
  message,
  Switch,
  Badge,
  Row,
  Col
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  WarningOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Server } from '@/lib/types/system.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface ServerStatusProps {
  servers: Server[];
  onServersChange: (servers: Server[]) => void;
}

export default function ServerStatus({ servers, onServersChange }: ServerStatusProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [restartingServers, setRestartingServers] = useState<Set<string>>(new Set());

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'degraded': return 'orange';
      case 'maintenance': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'degraded': return 'Degraded';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  const getServerTypeColor = (type: Server['type']) => {
    switch (type) {
      case 'game': return 'purple';
      case 'database': return 'blue';
      case 'cache': return 'orange';
      case 'api': return 'green';
      case 'backup': return 'cyan';
      default: return 'default';
    }
  };

  const getServerTypeText = (type: Server['type']) => {
    switch (type) {
      case 'game': return 'Game Server';
      case 'database': return 'Database';
      case 'cache': return 'Cache';
      case 'api': return 'API';
      case 'backup': return 'Backup';
      default: return type;
    }
  };

  const handleRestart = (serverId: string) => {
    setRestartingServers(prev => new Set(prev).add(serverId));
    
    // Simulate restart process
    setTimeout(() => {
      const updated = servers.map(server => 
        server.id === serverId 
          ? { ...server, status: 'online' as const, issues: [] }
          : server
      );
      onServersChange(updated);
      setRestartingServers(prev => {
        const newSet = new Set(prev);
        newSet.delete(serverId);
        return newSet;
      });
      message.success(`Đã khởi động lại máy chủ ${serverId}`);
    }, 3000);
  };

  const handleMaintenance = (serverId: string, maintenance: boolean) => {
    const updated = servers.map(server => 
      server.id === serverId 
        ? { 
            ...server, 
            status: maintenance ? 'maintenance' as const : 'online' as const 
          }
        : server
    );
    onServersChange(updated);
    message.success(
      maintenance 
        ? `Đã đưa máy chủ vào chế độ bảo trì` 
        : `Đã đưa máy chủ ra khỏi chế độ bảo trì`
    );
  };

  const handleViewDetails = (server: Server) => {
    setSelectedServer(server);
    setIsDetailModalVisible(true);
  };

  const columns: ColumnsType<Server> = [
    {
      title: 'Máy chủ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Server) => (
        <Space>
          <DashboardOutlined style={{ color: '#8B0000' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.ip}:{record.port}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: 'Game Server', value: 'game' },
        { text: 'Database', value: 'database' },
        { text: 'Cache', value: 'cache' },
        { text: 'API', value: 'api' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: Server['type']) => (
        <Tag color={getServerTypeColor(type)}>
          {getServerTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Khu vực',
      dataIndex: 'region',
      key: 'region',
      width: 120,
      render: (region: string) => <Text>{region}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Online', value: 'online' },
        { text: 'Offline', value: 'offline' },
        { text: 'Degraded', value: 'degraded' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Server['status'], record: Server) => (
        <Space>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.issues && record.issues.length > 0 && (
            <Badge count={record.issues.length} size="small" />
          )}
        </Space>
      ),
    },
    {
      title: 'Người chơi',
      key: 'players',
      width: 150,
      render: (_, record: Server) => (
        record.type === 'game' ? (
          <div>
            <Text strong>{record.playerCount?.toLocaleString()}</Text>
            <Text type="secondary"> / {record.maxPlayers?.toLocaleString()}</Text>
            <Progress 
              percent={record.playerCount && record.maxPlayers ? 
                Math.round((record.playerCount / record.maxPlayers) * 100) : 0}
              size="small" 
              showInfo={false}
              strokeColor={
                (record.playerCount! / record.maxPlayers!) > 0.9 ? '#DC143C' :
                (record.playerCount! / record.maxPlayers!) > 0.7 ? '#D4AF37' : '#2E8B57'
              }
            />
          </div>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      width: 100,
      sorter: (a, b) => (a.cpu || 0) - (b.cpu || 0),
      render: (cpu: number) => (
        <Text style={{ 
          color: cpu > 80 ? '#DC143C' : 
                 cpu > 60 ? '#D4AF37' : '#2E8B57',
          fontWeight: 'bold'
        }}>
          {cpu}%
        </Text>
      ),
    },
    {
      title: 'Memory',
      dataIndex: 'memory',
      key: 'memory',
      width: 100,
      sorter: (a, b) => (a.memory || 0) - (b.memory || 0),
      render: (memory: number) => (
        <Text style={{ 
          color: memory > 80 ? '#DC143C' : 
                 memory > 60 ? '#D4AF37' : '#2E8B57',
          fontWeight: 'bold'
        }}>
          {memory}%
        </Text>
      ),
    },
    {
      title: 'Thời gian hoạt động',
      dataIndex: 'uptime',
      key: 'uptime',
      width: 140,
      render: (uptime: string) => (
        <Text style={{ fontSize: 12 }}>{uptime}</Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record: Server) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>

          <Tooltip title="Bật/tắt bảo trì">
            <Switch
              size="small"
              checked={record.status === 'maintenance'}
              onChange={(checked) => handleMaintenance(record.id, checked)}
            />
          </Tooltip>

          {record.status !== 'offline' && (
            <Tooltip title="Khởi động lại">
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                size="small"
                loading={restartingServers.has(record.id)}
                onClick={() => handleRestart(record.id)}
              />
            </Tooltip>
          )}

          {record.status === 'offline' && (
            <Tooltip title="Khởi động">
              <Button 
                type="text" 
                icon={<PlayCircleOutlined />} 
                size="small"
                onClick={() => handleRestart(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const totalPlayers = servers
    .filter(s => s.type === 'game')
    .reduce((sum, s) => sum + (s.playerCount || 0), 0);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Summary Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#8B0000' }}>
                {servers.length}
              </Title>
              <Text type="secondary">Tổng máy chủ</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#2E8B57' }}>
                {onlineServers}
              </Title>
              <Text type="secondary">Máy chủ online</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#D4AF37' }}>
                {totalPlayers.toLocaleString()}
              </Title>
              <Text type="secondary">Người chơi online</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Servers Table */}
      <Card variant="borderless">
        <Table
          columns={columns}
          dataSource={servers}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} máy chủ`,
          }}
          size="middle"
        />
      </Card>

      {/* Server Detail Modal */}
      <Modal
        title={`Chi Tiết Máy Chủ - ${selectedServer?.name}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedServer?.status !== 'offline' && (
            <Button 
              key="restart" 
              type="primary" 
              icon={<ReloadOutlined />}
              loading={restartingServers.has(selectedServer?.id || '')}
              onClick={() => selectedServer && handleRestart(selectedServer.id)}
            >
              Khởi Động Lại
            </Button>
          )
        ]}
        width={700}
      >
        {selectedServer && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Tên máy chủ:</Text>
                <br />
                <Text>{selectedServer.name}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Địa chỉ:</Text>
                <br />
                <Text>{selectedServer.ip}:{selectedServer.port}</Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Loại:</Text>
                <br />
                <Tag color={getServerTypeColor(selectedServer.type)}>
                  {getServerTypeText(selectedServer.type)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Trạng thái:</Text>
                <br />
                <Tag color={getStatusColor(selectedServer.status)}>
                  {getStatusText(selectedServer.status)}
                </Tag>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Khu vực:</Text>
                <br />
                <Text>{selectedServer.region}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Phiên bản:</Text>
                <br />
                <Text>{selectedServer.version}</Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Thời gian hoạt động:</Text>
                <br />
                <Text>{selectedServer.uptime}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Cập nhật cuối:</Text>
                <br />
                <Text>{new Date(selectedServer.lastUpdate).toLocaleString('vi-VN')}</Text>
              </Col>
            </Row>

            {selectedServer.type === 'game' && (
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Người chơi:</Text>
                  <br />
                  <Text>
                    {selectedServer.playerCount?.toLocaleString()} / {selectedServer.maxPlayers?.toLocaleString()}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Tỷ lệ fill:</Text>
                  <br />
                  <Text>
                    {selectedServer.playerCount && selectedServer.maxPlayers ? 
                      Math.round((selectedServer.playerCount / selectedServer.maxPlayers) * 100) : 0}%
                  </Text>
                </Col>
              </Row>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>CPU Usage:</Text>
                <br />
                <Text style={{ 
                  color: selectedServer.cpu > 80 ? '#DC143C' : 
                         selectedServer.cpu > 60 ? '#D4AF37' : '#2E8B57'
                }}>
                  {selectedServer.cpu}%
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Memory Usage:</Text>
                <br />
                <Text style={{ 
                  color: selectedServer.memory > 80 ? '#DC143C' : 
                         selectedServer.memory > 60 ? '#D4AF37' : '#2E8B57'
                }}>
                  {selectedServer.memory}%
                </Text>
              </Col>
            </Row>

            {selectedServer.storage && (
              <div>
                <Text strong>Storage Usage:</Text>
                <br />
                <Text style={{ 
                  color: selectedServer.storage > 80 ? '#DC143C' : 
                         selectedServer.storage > 60 ? '#D4AF37' : '#2E8B57'
                }}>
                  {selectedServer.storage}%
                </Text>
              </div>
            )}

            {selectedServer.issues && selectedServer.issues.length > 0 && (
              <div>
                <Text strong>
                  <WarningOutlined style={{ color: '#D4AF37', marginRight: 8 }} />
                  Vấn đề:
                </Text>
                <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                  {selectedServer.issues.map((issue: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                    <li key={index}>
                      <Text type="secondary">{issue}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </Space>
  );
}
