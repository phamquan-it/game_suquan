'use client';

import React, { useEffect, useState } from 'react';
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
  ToolOutlined,
  ClusterOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/** Bọc label trong next/link để mục menu là thẻ <a> thật (mở tab mới, prefetch). */
const linkLabel = (href: string, label: string) => (
  <Link href={href} style={{ color: 'inherit' }}>
    {label}
  </Link>
);

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: linkLabel('/admin', 'Tổng Quan'),
  },
  {
    key: '/admin/players',
    icon: <UserOutlined />,
    label: linkLabel('/admin/players', 'Quản Lý Người Chơi'),
  },
  {
    key: '/admin/profile',
    icon: <IdcardOutlined />,
    label: linkLabel('/admin/profile', 'Hồ Sơ'),
  },
  {
    key: '/admin/alliances',
    icon: <TeamOutlined />,
    label: linkLabel('/admin/alliances', 'Liên Minh'),
  },
  {
    key: '/admin/generals',
    icon: <CrownOutlined />,
    label: linkLabel('/admin/generals', 'Danh Tướng'),
  },
  {
    key: '/admin/beauty',
    icon: <SmileOutlined />,
    label: linkLabel('/admin/beauty', 'Mỹ Nhân'),
  },
  {
    key: '/admin/units',
    icon: <FireOutlined />,
    label: linkLabel('/admin/units', 'Quân Đội'),
  },
  {
    key: '/admin/battles',
    icon: <FireOutlined />,
    label: linkLabel('/admin/battles', 'Chiến Trường'),
  },
  {
    key: '/admin/quests',
    icon: <FileTextOutlined />,
    label: linkLabel('/admin/quests', 'Nhiệm Vụ'),
  },
  {
    key: '/admin/lootboxes',
    icon: <GiftOutlined />,
    label: linkLabel('/admin/lootboxes', 'Rương & Vật Phẩm'),
  },
  {
    key: '/admin/base_items',
    icon: <SkinOutlined />,
    label: linkLabel('/admin/base_items', 'Vật Phẩm Cơ Bản'),
  },
  {
    key: '/admin/economy',
    icon: <DollarOutlined />,
    label: 'Kinh Tế',
    children: [
      {
        key: '/admin/economy/shop-items',
        icon: <ShopOutlined />,
        label: linkLabel('/admin/economy/shop-items', 'Cửa Hàng'),
      },
      {
        key: '/admin/economy/currencies',
        icon: <AccountBookOutlined />,
        label: linkLabel('/admin/economy/currencies', 'Tiền Tệ'),
      },

      {
        key: '/admin/economy/transactions',
        icon: <BarChartOutlined />,
        label: linkLabel('/admin/economy/transactions', 'Giao Dịch'),
      },
    ],
  },
  {
    key: '/admin/achievements',
    icon: <TrophyOutlined />,
    label: linkLabel('/admin/achievements', 'Thành Tựu'),
  },
  {
    key: '/admin/building',
    icon: <BuildOutlined />,
    label: linkLabel('/admin/building', 'Xây Dựng'),
  },
  {
    key: '/admin/chat',
    icon: <CommentOutlined />,
    label: linkLabel('/admin/chat', 'Chat & Tin Nhắn'),
  },
    {
    key: '/admin/stories/story',
    icon: <BookOutlined />,
    label: 'Quản Lý Truyện',
    children: [
      {
        key: '/admin/stories',
        icon: <SnippetsOutlined />,
        label: linkLabel('/admin/stories', 'Danh Sách Truyện'),
      },
      {
        key: '/admin/stories/characters',
        icon: <UserSwitchOutlined />,
        label: linkLabel('/admin/stories/characters', 'Nhân Vật'),
      },
       ],
  },
  {
    key: '/admin/regions',
    icon: <TagOutlined />,
    label: linkLabel('/admin/regions', 'Khu Vực'),
  },
  {
    key: '/admin/system/sys',
    icon: <SettingOutlined />,
    label: 'Hệ Thống',
    children: [
      {
        key: '/admin/system',
        icon: <ControlOutlined />,
        label: linkLabel('/admin/system', 'Cài Đặt Chung'),
      },
      {
        key: '/admin/quests/game_actions',
        icon: <ApiOutlined />,
        label: linkLabel('/admin/quests/game_actions', 'Game Actions'),
      },
      {
        key: '/admin/tblview',
        icon: <TableOutlined />,
        label: linkLabel('/admin/tblview', 'Table Views'),
      },
      {
        key: '/admin/tbl_systems',
        icon: <DatabaseOutlined />,
        label: linkLabel('/admin/tbl_systems', 'Table Systems'),
      },
      {
        key: '/admin/b2/upload-url',
        icon: <CloudUploadOutlined />,
        label: linkLabel('/admin/b2/upload-url', 'Phát Hành Bản Build'),
      },
       {
        key: '/admin/diagrams',
        icon: <ClusterOutlined />,
        label: linkLabel('/admin/diagrams', 'Diagrams'),
      },
      {
        key: '/admin/func',
        icon: <FunctionOutlined />,
        label: linkLabel('/admin/func', 'Functions'),
      },
      {
        key: '/admin/system/tools',
        icon: <ToolOutlined />,
        label: linkLabel('/admin/system/tools', 'Công Cụ'),
      },
      {
        key: '/admin/system/logs',
        icon: <HistoryOutlined />,
        label: linkLabel('/admin/system/logs', 'Nhật Ký'),
      }]
  },




];

interface AdminSidebarProps {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  // Nhóm cha của route hiện tại (nếu route nằm trong một submenu)
  const getParentKey = () =>
    menuItems.find(item =>
      item.children?.some(child => child.key === pathname)
    )?.key;

  // Tô sáng chính mục đang mở, không phải nhóm cha.
  // Route con khớp chính xác -> trả về key của chính nó.
  // Route không có trong menu (vd /admin/players/[id]) -> lùi dần về tổ tiên
  // gần nhất để vẫn giữ được highlight.
  const getSelectedKeys = () => {
    const parentKey = getParentKey();

    if (parentKey) return [pathname];

    const ancestor = menuItems
      .flatMap(item => [item, ...(item.children ?? [])])
      .map(item => item.key)
      .filter(key => pathname === key || pathname.startsWith(`${key}/`))
      .sort((a, b) => b.length - a.length)[0];

    return ancestor ? [ancestor] : [pathname];
  };

  const getOpenKeys = () => {
    const parentKey = getParentKey();
    return parentKey ? [parentKey] : [];
  };

  // openKeys phải là state có kiểm soát: `defaultOpenKeys` chỉ được antd đọc
  // một lần lúc mount, nên điều hướng sang route khác sẽ không tự mở nhóm mới.
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys);

  // Mở nhóm chứa route hiện tại mỗi khi đổi trang, nhưng giữ nguyên các nhóm
  // người dùng tự mở.
  useEffect(() => {
    const parentKey = getParentKey();
    if (parentKey) {
      setOpenKeys(prev =>
        prev.includes(parentKey) ? prev : [...prev, parentKey]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        mode="inline"
        items={menuItems}
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
