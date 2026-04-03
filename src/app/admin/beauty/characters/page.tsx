'use client';

import { Tabs } from 'antd';
import BeautyPage from '../page';
import { useState } from 'react';

export default function CharactersPage() {
  const [activeTab, setActiveTab] = useState('1');

  // Cấu hình các tab items
  const tabItems = [
    {
      key: '1',
      label: 'Tất cả nhân vật',
      children: <BeautyPage />
    },
    {
      key: '2',
      label: 'Có sẵn',
      children: <BeautyPage />
    },
    {
      key: '3',
      label: 'Đang làm nhiệm vụ',
      children: <BeautyPage />
    },
    {
      key: '4',
      label: 'Đang huấn luyện',
      children: <BeautyPage />
    },
    {
      key: '5',
      label: 'Đang nghỉ ngơi',
      children: <BeautyPage />
    }
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 24 }}
      />
    </div>
  );
}
