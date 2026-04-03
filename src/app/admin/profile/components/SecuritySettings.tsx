import { SecuritySetting } from "@/lib/types/admin.types";
import { SecurityScanOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, List, Space, Tag, Typography } from "antd";
const { Text } = Typography

// Security Settings Component
export const SecuritySettings: React.FC<{
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


