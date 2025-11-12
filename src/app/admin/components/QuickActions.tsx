import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import {
    UserAddOutlined,
    TeamOutlined,
    GiftOutlined,
    NotificationOutlined,
    SecurityScanOutlined,
    DatabaseOutlined
} from '@ant-design/icons';

const quickActions = [
    {
        title: 'Thêm Người Chơi',
        icon: <UserAddOutlined />,
        color: '#8B0000',
        onClick: () => console.log('Add player'),
    },
    {
        title: 'Quản Lý Liên Minh',
        icon: <TeamOutlined />,
        color: '#003366',
        onClick: () => console.log('Manage alliances'),
    },
    {
        title: 'Gửi Quà Tặng',
        icon: <GiftOutlined />,
        color: '#D4AF37',
        onClick: () => console.log('Send gifts'),
    },
    {
        title: 'Thông Báo',
        icon: <NotificationOutlined />,
        color: '#2E8B57',
        onClick: () => console.log('Send notification'),
    },
    {
        title: 'Kiểm Tra Bảo Mật',
        icon: <SecurityScanOutlined />,
        color: '#DC143C',
        onClick: () => console.log('Security check'),
    },
    {
        title: 'Sao Lưu Dữ Liệu',
        icon: <DatabaseOutlined />,
        color: '#8B4513',
        onClick: () => console.log('Backup data'),
    },
];

export default function QuickActions() {
    return (
        <Card title="Hành Động Nhanh" variant="borderless">
            <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                    <Col xs={12} sm={8} md={4} key={index}>
                        <Button
                            type="default"
                            icon={action.icon}
                            onClick={action.onClick}
                            style={{
                                width: '100%',
                                height: 80,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: action.color,
                                color: action.color,
                            }}
                        >
                            <div style={{ fontSize: 12, marginTop: 4 }}>{action.title}</div>
                        </Button>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}
