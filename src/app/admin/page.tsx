// src/app/admin/page.tsx
'use client';

import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Spin, 
  Alert, 
  Space, 
  Tag, 
  Progress,
  Skeleton 
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FireOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useDashboardStats, formatCurrency, formatNumber } from '@/app/admin/hooks/useDashboardStats';

const SystemHealth = dynamic(() => import('./components/SystemHealth'), {
  ssr: false,
  loading: () => (
    <Card style={{ height: '100%', minHeight: 300 }}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </Card>
  ),
});

import QuickActions from './components/QuickActions';
import RealTimeChart from '@/components/admin/charts/RealTimeChart';
import OverviewStats from './components/OverviewStats';

const { Title, Text } = Typography;

// Skeleton cho Stats Card
const StatsCardSkeleton = () => (
  <Card style={{ borderRadius: 12, height: '100%' }}>
    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
  </Card>
);

// Skeleton cho Battle Stats
const BattleStatsSkeleton = () => (
  <Card style={{ height: '100%' }}>
    <Skeleton active paragraph={{ rows: 4 }} />
  </Card>
);

// Skeleton cho Chart
const ChartSkeleton = () => (
  <Card style={{ height: '100%', minHeight: 350 }}>
    <Skeleton active paragraph={{ rows: 8 }} />
  </Card>
);

export default function DashboardPage() {
  const { stats, loading, error, refresh } = useDashboardStats();

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <button 
              onClick={refresh} 
              style={{ 
                padding: '4px 12px', 
                cursor: 'pointer', 
                borderRadius: 4, 
                border: '1px solid #d9d9d9', 
                background: 'white' 
              }}
            >
              Thử lại
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <Title level={2} style={{ color: '#8B0000', margin: 0 }}>
          Tổng Quan Hệ Thống
        </Title>
        {!loading && stats && (
          <Space>
            <Tag color="green" icon={<RiseOutlined />}>
              Cập nhật: {new Date().toLocaleString('vi-VN')}
            </Tag>
            <button 
              onClick={refresh} 
              style={{ 
                padding: '4px 16px', 
                cursor: 'pointer', 
                borderRadius: 4, 
                border: '1px solid #d9d9d9', 
                background: 'white',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Làm mới
            </button>
          </Space>
        )}
      </div>

      {/* Thống kê tổng quan - 4 cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {loading ? (
          // Hiển thị skeleton khi loading
          <>
            <Col xs={24} sm={12} lg={6}>
              <StatsCardSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCardSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCardSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCardSkeleton />
            </Col>
          </>
        ) : stats ? (
          // Hiển thị dữ liệu thực tế
          <>
            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Tổng Người Chơi"
                value={formatNumber(stats.totalPlayers)}
                icon={<UserOutlined />}
                color="#8B0000"
                trend={{
                  value: stats.totalPlayers > 0 ? (stats.newPlayersToday / stats.totalPlayers) * 100 : 0,
                  isPositive: true
                }}
                subtitle={`+${stats.newPlayersToday} hôm nay`}
                extra={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tuần này: +{stats.newPlayersThisWeek}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Active: {formatNumber(stats.activePlayersToday)} người
                    </Text>
                  </div>
                }
                progress={{
                  percent: stats.totalPlayers > 0 ? Math.round((stats.activePlayersToday / stats.totalPlayers) * 100) : 0,
                  status: stats.activePlayersToday > stats.totalPlayers * 0.2 ? 'success' : 'normal'
                }}
                tooltip="Tổng số người chơi đã đăng ký"
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Người Chơi Active"
                value={formatNumber(stats.activePlayersToday)}
                icon={<ThunderboltOutlined />}
                color="#1E90FF"
                trend={{
                  value: stats.activePlayersToday > 0 ? (stats.activePlayersToday / stats.totalPlayers) * 100 : 0,
                  isPositive: true
                }}
                subtitle={`${stats.activePlayersThisWeek} active trong tuần`}
                extra={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tỷ lệ active: {stats.totalPlayers > 0 ? Math.round((stats.activePlayersToday / stats.totalPlayers) * 100) : 0}%
                    </Text>
                  </div>
                }
                progress={{
                  percent: stats.totalPlayers > 0 ? Math.round((stats.activePlayersToday / stats.totalPlayers) * 100) : 0,
                  status: stats.activePlayersToday > stats.totalPlayers * 0.2 ? 'success' : 'normal'
                }}
                tooltip="Người chơi có hoạt động trong ngày hôm nay"
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Liên Minh"
                value={formatNumber(stats.totalAlliances)}
                icon={<TeamOutlined />}
                color="#003366"
                trend={{
                  value: stats.totalAlliances > 0 ? (stats.newAlliancesToday / stats.totalAlliances) * 100 : 0,
                  isPositive: true
                }}
                subtitle={`+${stats.newAlliancesToday} liên minh mới`}
                extra={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatNumber(stats.totalAllianceMembers)} thành viên
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      TB {stats.avgAllianceSize} thành viên/liên minh
                    </Text>
                  </div>
                }
                tooltip="Tổng số liên minh đã thành lập"
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Doanh Thu"
                value={formatCurrency(stats.totalRevenue)}
                icon={<DollarOutlined />}
                color="#2E8B57"
                trend={{
                  value: stats.revenueGrowth,
                  isPositive: stats.revenueGrowth > 0
                }}
                subtitle={`Hôm nay: ${formatCurrency(stats.revenueToday)}`}
                extra={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tuần này: {formatCurrency(stats.revenueThisWeek)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tăng trưởng: {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
                    </Text>
                  </div>
                }
                tooltip="Tổng doanh thu từ tất cả nguồn"
              />
            </Col>
          </>
        ) : null}
      </Row>

      {/* Thống kê trận đấu */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {loading ? (
          <>
            <Col xs={24} sm={12} lg={6}>
              <BattleStatsSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <BattleStatsSkeleton />
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <BattleStatsSkeleton />
            </Col>
          </>
        ) : stats ? (
          <>
            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Tổng Trận Đấu"
                value={formatNumber(stats.totalBattles)}
                icon={<FireOutlined />}
                color="#DC143C"
                subtitle={`Hôm nay: ${formatNumber(stats.battlesToday)}`}
                extra={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tuần này: {formatNumber(stats.battlesThisWeek)}
                    </Text>
                  </div>
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <OverviewStats
                title="Tỷ Lệ Hoàn Thành"
                value={`${stats.battleCompletionRate}%`}
                icon={<CrownOutlined />}
                color={stats.battleCompletionRate > 70 ? '#2E8B57' : '#DC143C'}
                progress={{
                  percent: stats.battleCompletionRate,
                  status: stats.battleCompletionRate > 70 ? 'success' : 'exception'
                }}
                tooltip="Tỷ lệ trận đấu hoàn thành so với tổng số"
              />
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Card title="Phân Bố Trận Đấu" style={{ height: '100%' }}>
                <Row gutter={[8, 8]}>
                  {stats.battlesByStatus.map((item) => (
                    <Col span={6} key={item.status}>
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: 8
                      }}>
                        <Tag color={
                          item.status === 'completed' ? 'green' :
                          item.status === 'in_progress' ? 'blue' :
                          item.status === 'matchmaking' ? 'orange' :
                          'default'
                        }>
                          {item.status}
                        </Tag>
                        <div style={{ fontSize: 20, fontWeight: 600 }}>{item.count}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {stats.totalBattles > 0 ? Math.round((item.count / stats.totalBattles) * 100) : 0}%
                        </Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </>
        ) : null}
      </Row>

      {/* Biểu đồ và System Health */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card
              title="Hoạt Động Theo Ngày"
              variant="borderless"
              style={{ height: '100%' }}
            >
              <RealTimeChart  />
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <SystemHealth />
        </Col>
      </Row>

      {/* Hành động nhanh */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          {loading ? (
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ) : (
            <QuickActions />
          )}
        </Col>
      </Row>
    </div>
  );
}
