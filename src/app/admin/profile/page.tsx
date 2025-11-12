'use client';

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Avatar,
    Space,
    Tag,
    Button,
    Divider,
    Tabs,
    List,
    Badge,
    Statistic
} from 'antd';
import {
    EditOutlined,
    SettingOutlined,
    SecurityScanOutlined,
    HistoryOutlined,
    BellOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CrownOutlined,
    TeamOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { AdminProfile, AdminActivity, SecuritySetting } from '@/lib/types/admin.types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data
const mockAdminProfile: AdminProfile = {
    id: 'admin-001',
    username: 'admin_master',
    email: 'admin@12suquan.com',
    firstName: 'Nguyễn',
    lastName: 'Văn Quản Trị',
    role: 'super_admin',
    status: 'active',
    avatar: null,
    phone: '+84 912 345 678',
    department: 'Game Operations',
    location: 'Hà Nội, Vietnam',
    joinDate: '2023-01-15T00:00:00Z',
    lastLogin: '2024-01-15T14:30:00Z',
    permissions: [
        'players:read', 'players:write', 'players:delete',
        'alliances:read', 'alliances:write',
        'battles:read', 'battles:monitor',
        'economy:read', 'economy:write',
        'system:read', 'system:manage'
    ]
};

const mockActivities: AdminActivity[] = [
    {
        id: 'act-001',
        action: 'player_ban',
        description: 'Đã cấm người chơi "Cheater123"',
        target: 'player:cheater123',
        timestamp: '2024-01-15T14:30:00Z',
        ip: '192.168.1.100',
        severity: 'high'
    },
    {
        id: 'act-002',
        action: 'system_restart',
        description: 'Khởi động lại game server 02',
        target: 'server:game-server-02',
        timestamp: '2024-01-15T13:45:00Z',
        ip: '192.168.1.100',
        severity: 'medium'
    },
    {
        id: 'act-003',
        action: 'economy_adjust',
        description: 'Điều chỉnh tỷ giá kim cương',
        target: 'currency:diamond',
        timestamp: '2024-01-15T12:20:00Z',
        ip: '192.168.1.100',
        severity: 'low'
    },
    {
        id: 'act-004',
        action: 'alliance_management',
        description: 'Giải tán liên minh "BadAlliance"',
        target: 'alliance:badalliance',
        timestamp: '2024-01-15T11:15:00Z',
        ip: '192.168.1.100',
        severity: 'high'
    },
    {
        id: 'act-005',
        action: 'player_support',
        description: 'Hỗ trợ hoàn tiền cho người chơi',
        target: 'player:happyplayer',
        timestamp: '2024-01-15T10:30:00Z',
        ip: '192.168.1.100',
        severity: 'medium'
    }
];

const mockSecuritySettings: SecuritySetting[] = [
    {
        id: '2fa',
        name: 'Xác thực 2 yếu tố',
        enabled: true,
        description: 'Bảo vệ tài khoản với mã xác thực',
        lastUpdated: '2024-01-10T00:00:00Z'
    },
    {
        id: 'session_timeout',
        name: 'Tự động đăng xuất',
        enabled: true,
        description: 'Tự động đăng xuất sau 30 phút không hoạt động',
        lastUpdated: '2024-01-10T00:00:00Z'
    },
    {
        id: 'login_alerts',
        name: 'Cảnh báo đăng nhập',
        enabled: true,
        description: 'Gửi email khi có đăng nhập mới',
        lastUpdated: '2024-01-10T00:00:00Z'
    },
    {
        id: 'ip_whitelist',
        name: 'IP Whitelist',
        enabled: false,
        description: 'Chỉ cho phép đăng nhập từ IP nhất định',
        lastUpdated: '2024-01-10T00:00:00Z'
    }
];

export default function ProfilePage() {
    const [adminProfile, setAdminProfile] = useState<AdminProfile>(mockAdminProfile);
    const [activities, setActivities] = useState<AdminActivity[]>(mockActivities);
    const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings);
    const [activeTab, setActiveTab] = useState('overview');

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'red';
            case 'game_master': return 'gold';
            case 'moderator': return 'blue';
            case 'support': return 'green';
            case 'analyst': return 'purple';
            default: return 'default';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'super_admin': return 'Super Admin';
            case 'game_master': return 'Game Master';
            case 'moderator': return 'Điều Hành';
            case 'support': return 'Hỗ Trợ';
            case 'analyst': return 'Phân Tích';
            default: return role;
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'green' : 'red';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const handleSecuritySettingToggle = (settingId: string, enabled: boolean) => {
        const updated = securitySettings.map(setting =>
            setting.id === settingId ? { ...setting, enabled } : setting
        );
        setSecuritySettings(updated);
    };

    const activityStats = {
        today: activities.filter(a =>
            new Date(a.timestamp).toDateString() === new Date().toDateString()
        ).length,
        week: activities.filter(a => {
            const activityDate = new Date(a.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate >= weekAgo;
        }).length,
        highSeverity: activities.filter(a => a.severity === 'high').length
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Hồ Sơ Quản Trị Viên
            </Title>

            <Row gutter={[24, 24]}>
                {/* Profile Sidebar */}
                <Col xs={24} lg={8}>
                    <Card variant="borderless">
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#8B0000',
                                    marginBottom: 16
                                }}
                            />
                            <Title level={3} style={{ margin: 0 }}>
                                {adminProfile.firstName} {adminProfile.lastName}
                            </Title>
                            <Text type="secondary">@{adminProfile.username}</Text>

                            <div style={{ marginTop: 16 }}>
                                <Tag color={getRoleColor(adminProfile.role)}>
                                    <CrownOutlined /> {getRoleText(adminProfile.role)}
                                </Tag>
                                <Tag color={getStatusColor(adminProfile.status)}>
                                    {adminProfile.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                </Tag>
                            </div>
                        </div>

                        <Divider />

                        {/* Contact Information */}
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <MailOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>{adminProfile.email}</Text>
                            </div>

                            <div>
                                <PhoneOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>{adminProfile.phone}</Text>
                            </div>

                            <div>
                                <EnvironmentOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>{adminProfile.location}</Text>
                            </div>

                            <div>
                                <TeamOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>{adminProfile.department}</Text>
                            </div>
                        </Space>

                        <Divider />

                        {/* Quick Stats */}
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Hôm nay"
                                    value={activityStats.today}
                                    prefix={<HistoryOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Tuần này"
                                    value={activityStats.week}
                                    prefix={<BellOutlined />}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Button
                            type="primary"
                            block
                            icon={<EditOutlined />}
                            style={{ background: '#8B0000', borderColor: '#8B0000' }}
                        >
                            Chỉnh Sửa Hồ Sơ
                        </Button>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col xs={24} lg={16}>
                    <Card variant="borderless">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={[
                                {
                                    key: 'overview',
                                    label: (
                                        <Space>
                                            <UserOutlined />
                                            Tổng Quan
                                        </Space>
                                    ),
                                    children: <ProfileOverview profile={adminProfile} activities={activities} />,
                                },
                                {
                                    key: 'security',
                                    label: (
                                        <Space>
                                            <SecurityScanOutlined />
                                            Bảo Mật
                                            <Badge count={securitySettings.filter(s => !s.enabled).length} />
                                        </Space>
                                    ),
                                    children: <SecuritySettings
                                        settings={securitySettings}
                                        onSettingToggle={handleSecuritySettingToggle}
                                    />,
                                },
                                {
                                    key: 'activity',
                                    label: (
                                        <Space>
                                            <HistoryOutlined />
                                            Lịch Sử Hoạt Động
                                        </Space>
                                    ),
                                    children: <ActivityLog activities={activities} />,
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

// Profile Overview Component
const ProfileOverview: React.FC<{
    profile: AdminProfile;
    activities: AdminActivity[]
}> = ({ profile, activities }) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Account Information */}
            <Card title="Thông Tin Tài Khoản" size="small">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Text strong>ID Quản trị:</Text>
                        <br />
                        <Text type="secondary">{profile.id}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Ngày tham gia:</Text>
                        <br />
                        <Text>{new Date(profile.joinDate).toLocaleDateString('vi-VN')}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Đăng nhập cuối:</Text>
                        <br />
                        <Text>{new Date(profile.lastLogin).toLocaleString('vi-VN')}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Trạng thái:</Text>
                        <br />
                        <Tag color={profile.status === 'active' ? 'green' : 'red'}>
                            {profile.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                        </Tag>
                    </Col>
                </Row>
            </Card>

            {/* Permissions */}
            <Card title="Quyền Hạn" size="small">
                <Space wrap>
                    {profile.permissions.map((permission: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                        <Tag key={index} color="blue">
                            {permission}
                        </Tag>
                    ))}
                </Space>
            </Card>

            {/* Recent Activities */}
            <Card
                title="Hoạt Động Gần Đây"
                size="small"
                extra={<Button type="link">Xem tất cả</Button>}
            >
                <List
                    dataSource={activities.slice(0, 5)}
                    renderItem={activity => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                activity.severity === 'high' ? '#dc143c' :
                                                    activity.severity === 'medium' ? '#d4af37' : '#2e8b57'
                                        }}
                                        icon={<SafetyCertificateOutlined />}
                                    />
                                }
                                title={activity.description}
                                description={
                                    <Space>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                        </Text>
                                        <Tag color={getSeverityColor(activity.severity)}>
                                            {activity.severity}
                                        </Tag>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </Space>
    );
};

// Security Settings Component
const SecuritySettings: React.FC<{
    settings: SecuritySetting[];
    onSettingToggle: (id: string, enabled: boolean) => void;
}> = ({ settings, onSettingToggle }) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card title="Cài Đặt Bảo Mật" variant="borderless">
                <List
                    dataSource={settings}
                    renderItem={setting => (
                        <List.Item
                            actions={[
                                <Button
                                    key={1}
                                    type="link"
                                    onClick={() => onSettingToggle(setting.id, !setting.enabled)}
                                >
                                    {setting.enabled ? 'Tắt' : 'Bật'}
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            backgroundColor: setting.enabled ? '#2E8B57' : '#DC143C'
                                        }}
                                        icon={<SecurityScanOutlined />}
                                    />
                                }
                                title={
                                    <Space>
                                        <Text>{setting.name}</Text>
                                        <Tag color={setting.enabled ? 'green' : 'red'}>
                                            {setting.enabled ? 'Đã bật' : 'Đã tắt'}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">{setting.description}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Cập nhật: {new Date(setting.lastUpdated).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>

            {/* Security Recommendations */}
            <Card
                title="Đề Xuất Bảo Mật"
                
                variant="borderless"
                style={{ background: '#fff7e6', border: '1px solid #ffd591' }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Text strong>Để tăng cường bảo mật, chúng tôi khuyến nghị:</Text>
                    <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                        <li><Text>Bật xác thực 2 yếu tố (2FA)</Text></li>
                        <li><Text>Sử dụng mật khẩu mạnh và thay đổi định kỳ</Text></li>
                        <li><Text>Kích hoạt cảnh báo đăng nhập</Text></li>
                        <li><Text>Thiết lập IP whitelist nếu cần</Text></li>
                    </ul>
                </Space>
            </Card>
        </Space>
    );
};

// Activity Log Component
const ActivityLog: React.FC<{ activities: AdminActivity[] }> = ({ activities }) => {
    const getActionColor = (action: string) => {
        if (action.includes('ban') || action.includes('delete')) return 'red';
        if (action.includes('restart') || action.includes('adjust')) return 'orange';
        return 'blue';
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card
                title="Lịch Sử Hoạt Động"
                extra={
                    <Space>
                        <Button icon={<SettingOutlined />}>Cài Đặt</Button>
                        <Button type="primary">Xuất Log</Button>
                    </Space>
                }
                variant="borderless"
                
            >
                <List
                    dataSource={activities}
                    renderItem={activity => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Badge
                                        dot
                                        color={
                                            activity.severity === 'high' ? 'red' :
                                                activity.severity === 'medium' ? 'orange' : 'green'
                                        }
                                    >
                                        <Avatar
                                            style={{
                                                backgroundColor: getActionColor(activity.action)
                                            }}
                                            icon={<HistoryOutlined />}
                                        />
                                    </Badge>
                                }
                                title={
                                    <Space>
                                        <Text>{activity.description}</Text>
                                        <Tag color={getSeverityColor(activity.severity)} >
                                            {activity.severity}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">
                                            Hành động: <Tag color={getActionColor(activity.action)}>{activity.action}</Tag>
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {new Date(activity.timestamp).toLocaleString('vi-VN')} • IP: {activity.ip}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Target: {activity.target}
                                        </Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </Space>
    );
};

// Helper function for severity color (defined outside component)
const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'green';
        default: return 'default';
    }
};
