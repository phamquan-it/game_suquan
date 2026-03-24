'use client';

import { Tabs } from 'antd';
import BeautyPage from '../page';
import { useState } from 'react';

const { TabPane } = Tabs;

export default function CharactersPage() {
  const [activeTab, setActiveTab] = useState('1');

  // Không dùng params, chỉ dùng state để quản lý tab
  return (
    <div>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="All Characters" key="1">
          <BeautyPage />
        </TabPane>
        <TabPane tab="Available" key="2">
          {/* Có thể truyền filter qua props nếu cần */}
          <BeautyPage />
        </TabPane>
        <TabPane tab="On Mission" key="3">
          <BeautyPage />
        </TabPane>
        <TabPane tab="Training" key="4">
          <BeautyPage />
        </TabPane>
        <TabPane tab="Resting" key="5">
          <BeautyPage />
        </TabPane>
      </Tabs>
    </div>
  );
}
