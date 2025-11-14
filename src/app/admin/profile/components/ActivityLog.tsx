import { useActivities } from "@/lib/hooks/useActivities";
import { AdminActivity } from "@/lib/types/admin.types";
import { HistoryOutlined, SettingOutlined, ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, List, Space, Tag, Typography, Spin, Alert, Tooltip } from "antd";

const { Text, Title } = Typography;

interface ActivityLogProps {
    userId: string;
    showFilters?: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
    userId,
    showFilters = false
}) => {
    const {
        data: activities = [],
        isLoading,
        isError,
        error,
        refetch
    } = useActivities(userId, { limit: 20 });

    console.log(activities)

    const getActionColor = (action: string) => {
        if (action.includes('ban') || action.includes('delete')) return 'red';
        if (action.includes('restart') || action.includes('adjust')) return 'orange';
        if (action.includes('support') || action.includes('help')) return 'green';
        return 'blue';
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

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'player_ban': return '🔨';
            case 'system_restart': return '🔄';
            case 'economy_adjust': return '💰';
            case 'alliance_management': return '👥';
            case 'player_support': return '💝';
            default: return '📝';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <Card title="Lịch Sử Hoạt Động">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">Đang tải hoạt động...</Text>
                    </div>
                </div>
            </Card>
        );
    }

    // Error state
    if (isError) {
        return (
            <Card title="Lịch Sử Hoạt Động">
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error?.message || 'Không thể tải lịch sử hoạt động'}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => refetch()} icon={<ReloadOutlined />}>
                            Thử lại
                        </Button>
                    }
                />
            </Card>
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card
                title={
                    <Space>
                        <HistoryOutlined />
                        Lịch Sử Hoạt Động
                        <Tag color="blue">{activities.length} hoạt động</Tag>
                    </Space>
                }
                extra={
                    <Space>
                        <Tooltip title="Làm mới">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => refetch()}
                                loading={isLoading}
                            />
                        </Tooltip>
                        <Button icon={<SettingOutlined />}>Cài Đặt</Button>
                        <Button type="primary" icon={<ExportOutlined />}>
                            Xuất Log
                        </Button>
                    </Space>
                }
            >
                {/* Activity Statistics */}
                {activities.length > 0 && (
                    <div style={{ marginBottom: 16, padding: '8px 0' }}>
                        <Space size="large">
                            <Text>
                                <Tag color="red">{activities.filter(a => a.severity === 'high').length} Cao</Tag>
                            </Text>
                            <Text>
                                <Tag color="orange">{activities.filter(a => a.severity === 'medium').length} Trung bình</Tag>
                            </Text>
                            <Text>
                                <Tag color="green">{activities.filter(a => a.severity === 'low').length} Thấp</Tag>
                            </Text>
                        </Space>
                    </div>
                )}

                <List
                    dataSource={activities}
                    locale={{
                        emptyText: (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <HistoryOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                                <div>
                                    <Text type="secondary">Không có hoạt động nào</Text>
                                </div>
                                <Button
                                    type="link"
                                    onClick={() => refetch()}
                                    style={{ marginTop: 8 }}
                                >
                                    Làm mới
                                </Button>
                            </div>
                        )
                    }}
                    renderItem={activity => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Badge
                                        dot
                                        color={getSeverityColor(activity.severity)}
                                        offset={[-5, 5]}
                                    >
                                        <Avatar
                                            style={{
                                                backgroundColor: getActionColor(activity.action)
                                            }}
                                        >
                                            {getActionIcon(activity.action)}
                                        </Avatar>
                                    </Badge>
                                }
                                title={
                                    <Space>
                                        <Text>{activity.description}</Text>
                                        <Tag color={getSeverityColor(activity.severity)}>
                                            {getSeverityText(activity.severity)}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Space size="small" style={{ marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Hành động:
                                            </Text>
                                            <Tag
                                                color={getActionColor(activity.action)}
                                                style={{ fontSize: 11, margin: 0 }}
                                            >
                                                {activity.action}
                                            </Tag>
                                        </Space>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {formatDate(activity.timestamp)} • IP: {activity.ip}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Mục tiêu: {activity.target}
                                        </Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                    pagination={
                        activities.length > 10 ? {
                            pageSize: 10,
                            showSizeChanger: false,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} hoạt động`,
                        } : false
                    }
                />
            </Card>
        </Space>
    );
};
