import { AdminActivity, UserProfileWithPermissions } from "@/types/admin";
import { SafetyCertificateOutlined, EyeOutlined } from "@ant-design/icons";
import { Card, Typography, Col, List, Row, Space, Tag, Button, Avatar } from "antd";

const { Text, Title } = Typography;

// Profile Overview Component
export const ProfileOverview: React.FC<{
    profile: UserProfileWithPermissions;
    activities: AdminActivity[];
}> = ({ profile, activities }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Chưa có dữ liệu';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'green' : 'red';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Đang hoạt động' : 'Không hoạt động';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const getSeverityText = (severity: string) => {
        switch (severity) {
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return severity;
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Account Information */}
            <Card title="Thông Tin Tài Khoản" size="small">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Text strong>ID Người chơi:</Text>
                        <br />
                        <Text type="secondary" copyable>
                            {profile.player_id}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>ID Người dùng:</Text>
                        <br />
                        <Text type="secondary" copyable>
                            {profile.user_id}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Ngày tham gia:</Text>
                        <br />
                        <Text>{formatDate(profile.join_date)}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Đăng nhập cuối:</Text>
                        <br />
                        <Text>{formatDate(profile.last_login)}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Trạng thái:</Text>
                        <br />
                        <Tag color={getStatusColor(profile.status)}>
                            {getStatusText(profile.status)}
                        </Tag>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Text strong>Vai trò liên minh:</Text>
                        <br />
                        <Tag color={profile.alliance_role ? 'blue' : 'default'}>
                            {profile.alliance_role || 'Không có'}
                        </Tag>
                    </Col>
                    {profile.title && (
                        <Col xs={24} sm={12}>
                            <Text strong>Chức danh:</Text>
                            <br />
                            <Text>{profile.title}</Text>
                        </Col>
                    )}
                    {profile.specialization && (
                        <Col xs={24} sm={12}>
                            <Text strong>Chuyên môn:</Text>
                            <br />
                            <Text>{profile.specialization}</Text>
                        </Col>
                    )}
                    {profile.location && (
                        <Col xs={24} sm={12}>
                            <Text strong>Vị trí:</Text>
                            <br />
                            <Text>{profile.location}</Text>
                        </Col>
                    )}
                    {profile.ip_address && (
                        <Col xs={24} sm={12}>
                            <Text strong>Địa chỉ IP:</Text>
                            <br />
                            <Text type="secondary">{profile.ip_address}</Text>
                        </Col>
                    )}
                </Row>
            </Card>

            {/* Roles Information */}
            <Card title="Vai Trò Hệ Thống" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Text type="secondary">
                        Người dùng có {profile.roles.length} vai trò trong hệ thống
                    </Text>
                    <Row gutter={[8, 8]}>
                        {profile.roles.map((role) => (
                            <Col key={role.role_id}>
                                <Tag
                                    color={role.role_name === 'admin' ? 'red' : 'blue'}
                                    style={{ padding: '4px 8px', fontSize: '13px' }}
                                >
                                    <SafetyCertificateOutlined /> {role.role_name}
                                </Tag>
                            </Col>
                        ))}
                    </Row>
                    {profile.is_admin && (
                        <Tag color="red" icon={<SafetyCertificateOutlined />}>
                            Quyền Quản Trị Viên
                        </Tag>
                    )}
                </Space>
            </Card>

            {/* Permissions */}
            <Card
                title={
                    <Space>
                        Quyền Hạn Hệ Thống
                        <Tag>{profile.permissions.length} quyền</Tag>
                    </Space>
                }
                size="small"
            >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Text type="secondary">
                        Các quyền hạn được gán thông qua vai trò
                    </Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {profile.permissions.map((permission, index) => (
                            <Tag
                                key={index}
                                color={
                                    permission.includes(':write') ||
                                        permission.includes(':delete') ||
                                        permission.includes(':manage') ? 'red' :
                                        permission.includes(':read') ? 'blue' : 'green'
                                }
                                style={{ margin: 0, fontSize: '12px' }}
                            >
                                {permission}
                            </Tag>
                        ))}
                    </div>
                </Space>
            </Card>

            {/* Permission Statistics */}
            <Card title="Thống Kê Quyền Hạn" size="small">
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                {profile.permissions.filter(p => p.includes(':read')).length}
                            </Title>
                            <Text type="secondary">Quyền đọc</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                                {profile.permissions.filter(p => p.includes(':write')).length}
                            </Title>
                            <Text type="secondary">Quyền ghi</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                                {profile.permissions.filter(p => p.includes(':delete')).length}
                            </Title>
                            <Text type="secondary">Quyền xóa</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#f5222d' }}>
                                {profile.permissions.filter(p => p.includes(':manage')).length}
                            </Title>
                            <Text type="secondary">Quyền quản lý</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Recent Activities */}
            <Card
                title={
                    <Space>
                        Hoạt Động Gần Đây
                        <Tag>{activities.length} hoạt động</Tag>
                    </Space>
                }
                size="small"
                extra={<Button type="link" icon={<EyeOutlined />}>Xem tất cả</Button>}
            >
                <List
                    dataSource={activities.slice(0, 5)}
                    renderItem={(activity) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size="small"
                                        style={{
                                            backgroundColor: getSeverityColor(activity.severity)
                                        }}
                                        icon={<SafetyCertificateOutlined />}
                                    />
                                }
                                title={
                                    <Text style={{ fontSize: '14px' }}>
                                        {activity.description}
                                    </Text>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Space size="small">
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {formatDate(activity.timestamp)}
                                            </Text>
                                            <Tag
                                                color={getSeverityColor(activity.severity)}
                                                style={{ fontSize: '11px', margin: 0 }}
                                            >
                                                {getSeverityText(activity.severity)}
                                            </Tag>
                                        </Space>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            IP: {activity.ip} • Hành động: {activity.action}
                                        </Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: 'Không có hoạt động nào gần đây' }}
                />
            </Card>
        </Space>
    );
};
