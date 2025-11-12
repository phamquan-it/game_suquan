import React from 'react';
import { Menu } from 'antd';
import {
    BookOutlined,
    AppstoreOutlined,
    DollarOutlined,
    GiftOutlined,
    ApiOutlined,
    CodeOutlined,
    CrownOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
    const menuItems = [
        {
            key: 'introduction',
            icon: <BookOutlined className="text-imperial-gold" />,
            label: 'Royal Proclamation',
        },
        {
            key: 'core-concepts',
            icon: <CrownOutlined className="text-imperial-gold" />,
            label: 'Imperial Concepts',
        },
        {
            key: 'lootbox-system',
            icon: <GiftOutlined className="text-imperial-gold" />,
            label: 'Treasure Chests',
        },
        {
            key: 'currency-system',
            icon: <DollarOutlined className="text-imperial-gold" />,
            label: 'Royal Treasury',
        },
        {
            key: 'use-cases',
            icon: <SafetyCertificateOutlined className="text-imperial-gold" />,
            label: 'Royal Decrees',
        },
        {
            key: 'api-reference',
            icon: <ApiOutlined className="text-imperial-gold" />,
            label: 'Imperial Scrolls',
        },
        {
            key: 'examples',
            icon: <CodeOutlined className="text-imperial-gold" />,
            label: 'Royal Demonstrations',
        },
    ];

    return (
        <Menu
            theme="dark"
            selectedKeys={[currentPage]}
            mode="inline"
            items={menuItems}
            onClick={({ key }) => onPageChange(key)}
            className="bg-imperial-navy border-none py-2"
            style={{ background: '#003366' }}
        />
    );
};

export default Sidebar;
