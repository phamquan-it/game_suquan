// app/admin/achievements/components/AchievementStats.tsx
import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
  TrophyOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeInvisibleOutlined,
  StarOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { AchievementStats } from '../types';

interface AchievementStatsProps {
  stats: AchievementStats | null;
}

export const AchievementStatsComponent: React.FC<AchievementStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Total Achievements"
            value={stats.total}
            prefix={<TrophyOutlined className="text-imperialRed" />}
            valueStyle={{ color: '#8B0000' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Active"
            value={stats.active}
            prefix={<CheckCircleOutlined className="text-green-600" />}
            valueStyle={{ color: '#2E8B57' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Inactive"
            value={stats.inactive}
            prefix={<StopOutlined className="text-gray-500" />}
            valueStyle={{ color: '#808080' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Hidden"
            value={stats.hidden}
            prefix={<EyeInvisibleOutlined className="text-orange-500" />}
            valueStyle={{ color: '#FF8C00' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Total Points"
            value={stats.totalPoints}
            prefix={<StarOutlined className="text-imperialGold" />}
            valueStyle={{ color: '#D4AF37' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={8}>
        <Card className="hover:shadow-lg transition-shadow">
          <Statistic
            title="Average Completion Rate"
            value={stats.avgCompletionRate.toFixed(2)}
            suffix="%"
            prefix={<LineChartOutlined className="text-royalNavy" />}
            valueStyle={{ color: '#003366' }}
          />
          <Progress
            percent={stats.avgCompletionRate}
            size="small"
            strokeColor="#003366"
            showInfo={false}
            className="mt-2"
          />
        </Card>
      </Col>

      <Col xs={24} sm={24} lg={8}>
        <Card className="hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500 mb-2">Distribution</div>
          <Row gutter={8}>
            <Col span={8}>
              <div className="text-center">
                <Progress
                  type="circle"
                  percent={(stats.active / stats.total) * 100}
                  size={60}
                  strokeColor="#2E8B57"
                  format={() => `${stats.active}`}
                />
                <div className="text-xs mt-1">Active</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center">
                <Progress
                  type="circle"
                  percent={(stats.inactive / stats.total) * 100}
                  size={60}
                  strokeColor="#808080"
                  format={() => `${stats.inactive}`}
                />
                <div className="text-xs mt-1">Inactive</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center">
                <Progress
                  type="circle"
                  percent={(stats.hidden / stats.total) * 100}
                  size={60}
                  strokeColor="#FF8C00"
                  format={() => `${stats.hidden}`}
                />
                <div className="text-xs mt-1">Hidden</div>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
