'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Space, Tabs, Tag, Alert, Statistic } from 'antd';
import {
    DashboardOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import ServerStatus from './components/ServerStatus';
import SystemLogs from './components/SystemLogs';
import { SystemStats, Server, SystemAlert } from '@/lib/types/system.types';
import Card from 'antd/es/card/Card';
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const { Title, Text } = Typography;

// Mock data - sẽ thay thế bằng API thực tế
const mockSystemStats: SystemStats = {
    serverUptime: '15 days 8:45:32',
    cpuUsage: 45.2,
    memoryUsage: 68.7,
    storageUsage: 32.1,
    networkTraffic: 1250,
    activeConnections: 12457,
    responseTime: 45,
    errorRate: 0.12,
    databaseConnections: 245,
    cacheHitRate: 92.5,
    queueLength: 12,
    playerCapacity: 85.3
};

const mockServers: Server[] = [
    {
        id: 'game-server-01',
        name: 'Game Server 01',
        type: 'game',
        status: 'online',
        ip: '192.168.1.101',
        port: 8080,
        region: 'Vietnam',
        playerCount: 4521,
        maxPlayers: 5000,
        cpu: 42.5,
        memory: 65.8,
        uptime: '15 days 8:45:32',
        version: '1.5.2',
        lastUpdate: '2024-01-15T14:30:00Z'
    },
    {
        id: 'game-server-02',
        name: 'Game Server 02',
        type: 'game',
        status: 'online',
        ip: '192.168.1.102',
        port: 8080,
        region: 'Singapore',
        playerCount: 3895,
        maxPlayers: 5000,
        cpu: 38.2,
        memory: 61.3,
        uptime: '12 days 16:20:15',
        version: '1.5.2',
        lastUpdate: '2024-01-15T14:30:00Z'
    },
    {
        id: 'db-master-01',
        name: 'Database Master',
        type: 'database',
        status: 'online',
        ip: '192.168.1.201',
        port: 5432,
        region: 'Vietnam',
        cpu: 28.7,
        memory: 45.2,
        storage: 32.1,
        uptime: '30 days 12:15:45',
        version: 'PostgreSQL 14.5',
        lastUpdate: '2024-01-15T14:30:00Z'
    },
    {
        id: 'cache-01',
        name: 'Redis Cache',
        type: 'cache',
        status: 'online',
        ip: '192.168.1.202',
        port: 6379,
        region: 'Vietnam',
        cpu: 15.3,
        memory: 72.8,
        uptime: '25 days 8:30:12',
        version: 'Redis 6.2',
        lastUpdate: '2024-01-15T14:30:00Z'
    },
    {
        id: 'api-gateway-01',
        name: 'API Gateway',
        type: 'api',
        status: 'degraded',
        ip: '192.168.1.103',
        port: 443,
        region: 'Global',
        cpu: 78.9,
        memory: 85.2,
        uptime: '2 days 4:15:30',
        version: '1.5.2',
        lastUpdate: '2024-01-15T14:30:00Z',
        issues: ['High response time', 'Memory leak detected']
    },
    {
        id: 'backup-server-01',
        name: 'Backup Server',
        type: 'backup',
        status: 'offline',
        ip: '192.168.1.203',
        port: 22,
        region: 'Vietnam',
        cpu: 0,
        memory: 0,
        uptime: '0',
        version: '1.5.1',
        lastUpdate: '2024-01-14T18:30:00Z',
        issues: ['Scheduled maintenance']
    }
];

const mockAlerts: SystemAlert[] = [
    {
        id: 'alert-001',
        level: 'warning',
        title: 'High Memory Usage',
        message: 'API Gateway memory usage is above 85%',
        server: 'api-gateway-01',
        timestamp: '2024-01-15T14:25:00Z',
        acknowledged: false
    },
    {
        id: 'alert-002',
        level: 'critical',
        title: 'Backup Server Offline',
        message: 'Backup server has been offline for 2 hours',
        server: 'backup-server-01',
        timestamp: '2024-01-15T13:30:00Z',
        acknowledged: true
    },
    {
        id: 'alert-003',
        level: 'info',
        title: 'Scheduled Maintenance',
        message: 'Database maintenance scheduled for tonight',
        server: 'db-master-01',
        timestamp: '2024-01-15T10:00:00Z',
        acknowledged: true
    }
];

export default function SystemPage() {
    const [servers, setServers] = useState<Server[]>(mockServers);
    const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts);
    const [activeTab, setActiveTab] = useState('overview');
    const [lastUpdate, setLastUpdate] = useState(new Date());


    const { data: systemStats } = useQuery({
        queryKey: ["v_system_stats_latest"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("v_system_stats_latest")
                .select("*")
                .single(); // lấy đúng 1 bản ghi duy nhất
            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60,
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
            // In real app, this would fetch fresh data from API
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const criticalAlerts = alerts.filter(alert =>
        !alert.acknowledged && (alert.level === 'critical' || alert.level === 'error')
    );

    const totalPlayers = servers
        .filter(server => server.type === 'game')
        .reduce((sum, server) => sum + (server.playerCount || 0), 0);

    const onlineServers = servers.filter(server => server.status === 'online').length;
    const offlineServers = servers.filter(server => server.status === 'offline').length;
    const degradedServers = servers.filter(server => server.status === 'degraded').length;

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ color: '#8B0000', margin: 0 }}>
                    Quản Lý Hệ Thống
                </Title>
                <Space>
                    <SyncOutlined spin />
                    <Text type="secondary">
                        Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}
                    </Text>
                </Space>
            </Space>

            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
                <Alert
                    message={
                        <Space>
                            <WarningOutlined />
                            <Text strong>Có {criticalAlerts.length} cảnh báo quan trọng cần xử lý</Text>
                        </Space>
                    }
                    description="Hệ thống đang gặp một số vấn đề cần được chú ý ngay lập tức"
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* System Overview Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Máy chủ Online"
                            value={onlineServers}
                            suffix={`/ ${servers.length}`}
                            valueStyle={{ color: '#2E8B57' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Người chơi Online"
                            value={totalPlayers}
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="CPU Usage"
                            value={systemStats?.cpuUsage}
                            precision={1}
                            suffix="%"
                            valueStyle={{
                                color: systemStats?.cpuUsage > 80 ? '#DC143C' :
                                    systemStats?.cpuUsage > 60 ? '#D4AF37' : '#2E8B57'
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Memory Usage"
                            value={systemStats?.memoryUsage}
                            precision={1}
                            suffix="%"
                            valueStyle={{
                                color: systemStats?.memoryUsage > 80 ? '#DC143C' :
                                    systemStats?.memoryUsage > 60 ? '#D4AF37' : '#2E8B57'
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Response Time"
                            value={systemStats?.responseTime}
                            suffix="ms"
                            valueStyle={{
                                color: systemStats?.responseTime > 100 ? '#DC143C' :
                                    systemStats?.responseTime > 50 ? '#D4AF37' : '#2E8B57'
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card size="small" variant="borderless">
                        <Statistic
                            title="Error Rate"
                            value={systemStats?.errorRate}
                            precision={2}
                            suffix="%"
                            valueStyle={{
                                color: systemStats?.errorRate > 1 ? '#DC143C' :
                                    systemStats?.errorRate > 0.5 ? '#D4AF37' : '#2E8B57'
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card variant="borderless">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'overview',
                            label: (
                                <Space>
                                    <DashboardOutlined />
                                    Tổng Quan Hệ Thống
                                </Space>
                            ),
                            children: <SystemOverview stats={systemStats} servers={servers} alerts={alerts} />,
                        },
                        {
                            key: 'servers',
                            label: `Trạng Thái Máy Chủ (${servers.length})`,
                            children: <ServerStatus servers={servers} onServersChange={setServers} />,
                        },
                        {
                            key: 'logs',
                            label: 'Nhật Ký Hệ Thống',
                            children: <SystemLogs />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

// Component for System Overview Tab
const SystemOverview: React.FC<{
    stats: SystemStats;
    servers: Server[];
    alerts: SystemAlert[]
}> = ({ stats, servers, alerts }) => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

    return (
        <Row gutter={[16, 16]}>
            {/* System Health */}
            <Col xs={24} lg={12}>
                <Card title="Tình Trạng Hệ Thống" variant="borderless">
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong>Thời gian hoạt động: </Text>
                            <Tag color="green">{stats?.serverUptime}</Tag>
                        </div>

                        <div>
                            <Text strong>Kết nối database: </Text>
                            <Text style={{
                                color: stats?.databaseConnections > 200 ? '#D4AF37' : '#2E8B57'
                            }}>
                                {stats?.databaseConnections} connections
                            </Text>
                        </div>

                        <div>
                            <Text strong>Cache hit rate: </Text>
                            <Text style={{
                                color: stats?.cacheHitRate > 90 ? '#2E8B57' :
                                    stats?.cacheHitRate > 80 ? '#D4AF37' : '#DC143C'
                            }}>
                                {stats?.cacheHitRate}%
                            </Text>
                        </div>

                        <div>
                            <Text strong>Hàng đợi: </Text>
                            <Text style={{
                                color: stats?.queueLength > 20 ? '#DC143C' :
                                    stats?.queueLength > 10 ? '#D4AF37' : '#2E8B57'
                            }}>
                                {stats?.queueLength} tasks
                            </Text>
                        </div>

                        <div>
                            <Text strong>Lưu lượng mạng: </Text>
                            <Text>{stats?.networkTraffic} MB/s</Text>
                        </div>
                    </Space>
                </Card>
            </Col>

            {/* Active Alerts */}
            <Col xs={24} lg={12}>
                <Card
                    title={
                        <Space>
                            <WarningOutlined />
                            Cảnh Báo Đang Hoạt Động
                            {unacknowledgedAlerts.length > 0 && (
                                <Tag color="red">{unacknowledgedAlerts.length}</Tag>
                            )}
                        </Space>
                    }
                    variant="borderless"
                >
                    {unacknowledgedAlerts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <CheckCircleOutlined style={{ fontSize: 48, color: '#2E8B57' }} />
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">Không có cảnh báo nào</Text>
                            </div>
                        </div>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {unacknowledgedAlerts.map(alert => (
                                <Alert
                                    key={alert.id}
                                    message={alert.title}
                                    description={alert.message}
                                    type={
                                        alert.level === 'critical' ? 'error' :
                                            alert.level === 'warning' ? 'warning' : 'info'
                                    }
                                    showIcon
                                    style={{ width: '100%' }}
                                />
                            ))}
                        </Space>
                    )}
                </Card>
            </Col>

            {/* Server Distribution */}
            <Col xs={24} lg={12}>
                <Card title="Phân Bố Máy Chủ" variant="borderless">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2E8B57' }}>
                                    {servers.filter(s => s.status === 'online').length}
                                </div>
                                <Text type="secondary">Online</Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#D4AF37' }}>
                                    {servers.filter(s => s.status === 'degraded').length}
                                </div>
                                <Text type="secondary">Degraded</Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#DC143C' }}>
                                    {servers.filter(s => s.status === 'offline').length}
                                </div>
                                <Text type="secondary">Offline</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Performance Metrics */}
            <Col xs={24} lg={12}>
                <Card title="Hiệu Suất Hệ Thống" >
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <Text strong>Dung lượng người chơi: </Text>
                            <Text style={{
                                color: stats?.playerCapacity > 90 ? '#DC143C' :
                                    stats?.playerCapacity > 80 ? '#D4AF37' : '#2E8B57'
                            }}>
                                {stats?.playerCapacity}%
                            </Text>
                        </div>

                        <div>
                            <Text strong>Kết nối đang hoạt động: </Text>
                            <Text>{stats?.activeConnections.toLocaleString()}</Text>
                        </div>

                        <div>
                            <Text strong>Sử dụng storage: </Text>
                            <Text style={{
                                color: stats?.storageUsage > 80 ? '#DC143C' :
                                    stats?.storageUsage > 60 ? '#D4AF37' : '#2E8B57'
                            }}>
                                {stats?.storageUsage}%
                            </Text>
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};
