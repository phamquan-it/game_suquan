'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, Descriptions, Tag, Spin, Tabs } from 'antd';
import { useQuest } from '../hooks/useQuests';
import { getCategoryColor, getDifficultyColor } from '../utils/questHelpers';
import { QuestRequirements } from '../components/QuestRequirements';
import { QuestRewards } from '../components/QuestRewards';

const { TabPane } = Tabs;

export default function QuestDetailPage() {
  const params = useParams();
  const questId = params.id as string;
  const { data: quest, isLoading } = useQuest(questId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!quest) {
    return <div>Không tìm thấy nhiệm vụ</div>;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg mb-4">
        <Descriptions 
          title="Thông tin nhiệm vụ" 
          bordered 
          column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1 }}
        >
          <Descriptions.Item label="Tên nhiệm vụ">
            <span className="font-semibold text-lg">{quest.name}</span>
          </Descriptions.Item>
          
          <Descriptions.Item label="Loại">{quest.type}</Descriptions.Item>
          
          <Descriptions.Item label="Danh mục">
            <Tag color={getCategoryColor(quest.category)}>
              {quest.category}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Độ khó">
            <Tag color={getDifficultyColor(quest.difficulty)}>
              {quest.difficulty}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái">
            <Tag color={quest.status === 'active' ? 'success' : 'error'}>
              {quest.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Cấp độ">
            {quest.min_level} - {quest.max_level}
          </Descriptions.Item>
          
          <Descriptions.Item label="Giới hạn hoàn thành" span={2}>
            {quest.completion_limit || 'Không giới hạn'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Mô tả" span={3}>
            {quest.description || 'Không có mô tả'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="shadow-lg">
        <Tabs defaultActiveKey="requirements">
          <TabPane tab="Yêu cầu nhiệm vụ" key="requirements">
            <QuestRequirements questId={questId} />
          </TabPane>
          
          <TabPane tab="Phần thưởng" key="rewards">
            <QuestRewards questId={questId} />
          </TabPane>
          
          <TabPane tab="Thống kê hoàn thành" key="stats">
            {/* Add completion statistics here */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
