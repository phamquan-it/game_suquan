'use client';

import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FireOutlined,
  DollarOutlined,
  SettingOutlined,
  CrownOutlined,
  TrophyOutlined,
  GiftOutlined,
  SmileOutlined,
  IdcardOutlined,
  BuildOutlined,
  ShoppingOutlined,
  SkinOutlined,
  FileTextOutlined,
  HistoryOutlined,
  TagOutlined,
  ShopOutlined,
  AccountBookOutlined,
  BarChartOutlined,
  CommentOutlined,
  BookOutlined,
  SnippetsOutlined,
  UserSwitchOutlined,
  ControlOutlined,
  ApiOutlined,
  TableOutlined,
  DatabaseOutlined,
  FunctionOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Tổng Quan',
  },
  {
    key: '/admin/players',
    icon: <UserOutlined />,
    label: 'Quản Lý Người Chơi',
  },
  {
    key: '/admin/profile',
    icon: <IdcardOutlined />,
    label: 'Hồ Sơ',
  },
  {
    key: '/admin/alliances',
    icon: <TeamOutlined />,
    label: 'Liên Minh',
  },
  {
    key: '/admin/generals',
    icon: <CrownOutlined />,
    label: 'Danh Tướng',
  },
  {
    key: '/admin/beauty',
    icon: <SmileOutlined />,
    label: 'Mỹ Nhân',
  },
  {
    key: '/admin/units',
    icon: <FireOutlined />,
    label: 'Quân Đội',
  },
  {
    key: '/admin/battles',
    icon: <FireOutlined />,
    label: 'Chiến Trường',
  },
  {
    key: '/admin/quests',
    icon: <FileTextOutlined />,
    label: 'Nhiệm Vụ',
  },
  {
    key: '/admin/lootboxes',
    icon: <GiftOutlined />,
    label: 'Rương & Vật Phẩm',
  },
  {
    key: '/admin/base_items',
    icon: <SkinOutlined />,
    label: 'Vật Phẩm Cơ Bản',
  },
  {
    key: '/admin/economy',
    icon: <DollarOutlined />,
    label: 'Kinh Tế',
    children: [
      {
        key: '/admin/economy/shop-items',
        icon: <ShopOutlined />,
        label: 'Cửa Hàng',
      },
      {
        key: '/admin/economy/currencies',
        icon: <AccountBookOutlined />,
        label: 'Tiền Tệ',
      },
     
      {
        key: '/admin/economy/transactions',
        icon: <BarChartOutlined />,
        label: 'Giao Dịch',
      },
    ],
  },
  {
    key: '/admin/achievements',
    icon: <TrophyOutlined />,
    label: 'Thành Tựu',
  },
  {
    key: '/admin/building',
    icon: <BuildOutlined />,
    label: 'Xây Dựng',
  },
  {
    key: '/admin/chat',
    icon: <CommentOutlined />,
    label: 'Chat & Tin Nhắn',
  },
    {
    key: '/admin/stories/story',
    icon: <BookOutlined />,
    label: 'Quản Lý Truyện',
    children: [
      {
        key: '/admin/stories',
        icon: <SnippetsOutlined />,
        label: 'Danh Sách Truyện',
      },
      {
        key: '/admin/stories/characters',
        icon: <UserSwitchOutlined />,
        label: 'Nhân Vật',
      },
       ],
  },
  {
    key: '/admin/regions',
    icon: <TagOutlined />,
    label: 'Khu Vực',
  },
  {
    key: '/admin/system/sys',
    icon: <SettingOutlined />,
    label: 'Hệ Thống',
    children: [
      {
        key: '/admin/system',
        icon: <ControlOutlined />,
        label: 'Cài Đặt Chung',
      },
      {
        key: '/admin/quests/game_actions',
        icon: <ApiOutlined />,
        label: 'Game Actions',
      },
      {
        key: '/admin/tblview',
        icon: <TableOutlined />,
        label: 'Table Views',
      },
      {
        key: '/admin/tbl_systems',
        icon: <DatabaseOutlined />,
        label: 'Table Systems',
      },
      {
        key: '/admin/func',
        icon: <FunctionOutlined />,
        label: 'Functions',
      },
      {
        key: '/admin/system/tools',
        icon: <ToolOutlined />,
        label: 'Công Cụ',
      },
      {
        key: '/admin/system/logs',
        icon: <HistoryOutlined />,
        label: 'Nhật Ký',
      }]
  },
 



];

interface AdminSidebarProps {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Find the parent key for nested routes to highlight the correct menu item
  const getSelectedKeys = () => {
    const parentKey = menuItems.find(item =>
      item.children?.some(child => child.key === pathname)
    )?.key;
    return parentKey ? [parentKey] : [pathname];
  };

  const getOpenKeys = () => {
    const parentKey = menuItems.find(item =>
      item.children?.some(child => child.key === pathname)
    )?.key;
    return parentKey ? [parentKey] : [];
  };

  return (
    <div style={{ padding: '16px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{
        padding: '16px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        marginBottom: 16,
        background: 'linear-gradient(135deg, #8B0000 0%, #660000 100%)',
        borderRadius: '8px',
        margin: '0 16px 16px 16px',
        boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)'
      }}>
        <CrownOutlined style={{ fontSize: 32, color: '#D4AF37' }} />
        {!collapsed && (
          <div style={{
            color: '#F5F5DC',
            marginTop: 8,
            fontWeight: 'bold',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            12 SỨ QUÂN
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        mode="inline"
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{
          background: 'transparent',
          border: 'none',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      />

      {/* Version info */}
      {!collapsed && (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          color: '#CD7F32',
          fontSize: 12,
          marginTop: 'auto'
        }}>
          <div>Admin Panel v1.0.0</div>
          <div style={{ color: '#D4AF37', marginTop: 4 }}>Imperial Edition</div>
        </div>
      )}
    </div>
  );
}
