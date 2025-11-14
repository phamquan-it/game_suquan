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
    Statistic,
    Spin,
    Alert
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
    SafetyCertificateOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { SecuritySettings } from './components/SecuritySettings';
import { ProfileOverview } from './components/ProfileOverview';
import { ActivityLog } from './components/ActivityLog';
import { AdminActivity, SecuritySetting } from '@/types/admin';
import { useUserProfileWithPermissions } from '@/lib/hooks/useUserProfileWithPermissions';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for activities and security settings (since these might come from different endpoints)
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
    // Use the hook to fetch profile data
    //
    const userId = '8823fb30-5771-4d7a-a866-3769f7caf0ad';
    const {
        data: profile,
        isLoading,
        isError,
        error,
        refetch
    } = useUserProfileWithPermissions(userId);

    const [activities, setActivities] = useState<AdminActivity[]>(mockActivities);
    const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings);
    const [activeTab, setActiveTab] = useState('overview');

    const getRoleColor = (roleName: string) => {
        switch (roleName?.toLowerCase()) {
            case 'admin': return 'red';
            case 'super_admin': return 'red';
            case 'game_master': return 'gold';
            case 'moderator': return 'blue';
            case 'support': return 'green';
            case 'analyst': return 'purple';
            default: return 'default';
        }
    };

    const getRoleText = (roleName: string) => {
        switch (roleName?.toLowerCase()) {
            case 'admin': return 'Admin';
            case 'super_admin': return 'Super Admin';
            case 'game_master': return 'Game Master';
            case 'moderator': return 'Điều Hành';
            case 'support': return 'Hỗ Trợ';
            case 'analyst': return 'Phân Tích';
            default: return roleName || 'User';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'green' : 'red';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Đang hoạt động' : 'Không hoạt động';
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

    // Loading state
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" tip="Đang tải thông tin hồ sơ..." />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <Alert
                message="Lỗi tải hồ sơ"
                description={error?.message || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.'}
                type="error"
                showIcon
                action={
                    <Button size="small" onClick={() => refetch()} icon={<ReloadOutlined />}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    // No profile data
    if (!profile) {
        return (
            <Alert
                message="Không tìm thấy hồ sơ"
                description="Hồ sơ người dùng không tồn tại hoặc bạn không có quyền truy cập."
                type="warning"
                showIcon
            />
        );
    }

    // Get primary role (first role in the array, or default)
    const primaryRole = profile.roles[0]?.role_name || 'user';
    const displayName = profile.username;
    const joinDate = new Date(profile.join_date).toLocaleDateString('vi-VN');
    const lastLogin = profile.last_login
        ? new Date(profile.last_login).toLocaleDateString('vi-VN')
        : 'Chưa đăng nhập';

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
                Hồ Sơ {profile.is_admin ? 'Quản Trị Viên' : 'Người Dùng'}
            </Title>

            <Row gutter={[24, 24]}>
                {/* Profile Sidebar */}
                <Col xs={24} lg={8}>
                    <Card
                        variant="borderless"
                        extra={
                            <Button
                                type="text"
                                icon={<ReloadOutlined />}
                                onClick={() => refetch()}
                                loading={isLoading}
                            />
                        }
                    >
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar
                                size={100}
                                src={profile.avatar}
                                icon={!profile.avatar ? <UserOutlined /> : undefined}
                                style={{
                                    backgroundColor: '#8B0000',
                                    marginBottom: 16
                                }}
                            />
                            <Title level={3} style={{ margin: 0 }}>
                                {displayName}
                            </Title>
                            <Text type="secondary">{profile.email}</Text>

                            <div style={{ marginTop: 16 }}>
                                {/* Display all roles */}
                                {profile.roles.map((role) => (
                                    <Tag
                                        key={role.role_id}
                                        color={getRoleColor(role.role_name)}
                                        style={{ marginBottom: 4 }}
                                    >
                                        <CrownOutlined /> {getRoleText(role.role_name)}
                                    </Tag>
                                ))}
                                <Tag color={getStatusColor(profile.status)}>
                                    {getStatusText(profile.status)}
                                </Tag>
                                {profile.is_admin && (
                                    <Tag color="red" icon={<SafetyCertificateOutlined />}>
                                        Quản Trị Viên
                                    </Tag>
                                )}
                            </div>
                        </div>

                        <Divider />

                        {/* Contact Information */}
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <MailOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>{profile.email}</Text>
                            </div>

                            {profile.title && (
                                <div>
                                    <TeamOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                    <Text>{profile.title}</Text>
                                </div>
                            )}

                            {profile.location && (
                                <div>
                                    <EnvironmentOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                    <Text>{profile.location}</Text>
                                </div>
                            )}

                            {profile.specialization && (
                                <div>
                                    <SafetyCertificateOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                    <Text>{profile.specialization}</Text>
                                </div>
                            )}

                            <div>
                                <HistoryOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>Tham gia: {joinDate}</Text>
                            </div>

                            <div>
                                <BellOutlined style={{ marginRight: 8, color: '#8B0000' }} />
                                <Text>Đăng nhập cuối: {lastLogin}</Text>
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
                            <Col span={12}>
                                <Statistic
                                    title="Quyền hạn"
                                    value={profile.permissions.length}
                                    prefix={<SecurityScanOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Vai trò"
                                    value={profile.roles.length}
                                    prefix={<TeamOutlined />}
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
                                    children: (
                                        <ProfileOverview
                                            profile={{
                                                ...profile,

                                            }}
                                            activities={activities}
                                        />
                                    ),
                                },
                                {
                                    key: 'security',
                                    label: (
                                        <Space>
                                            <SecurityScanOutlined />
                                            Bảo Mật & Quyền Hạn
                                            <Badge
                                                count={
                                                    securitySettings.filter(s => !s.enabled).length +
                                                    (profile.permissions.length > 0 ? 0 : 1)
                                                }
                                            />
                                        </Space>
                                    ),
                                    children: (
                                        <SecuritySettings
                                            profile={profile}
                                            settings={securitySettings}
                                            onSettingToggle={handleSecuritySettingToggle}
                                        />
                                    ),
                                },
                                {
                                    key: 'activity',
                                    label: (
                                        <Space>
                                            <HistoryOutlined />
                                            Lịch Sử Hoạt Động
                                        </Space>
                                    ),
                                    children: <ActivityLog userId={userId} />,
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

// Helper function for severity color
export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'green';
        default: return 'default';
    }
};
