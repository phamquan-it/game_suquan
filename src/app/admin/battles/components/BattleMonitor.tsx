'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Progress, 
  List,
  Avatar,
  Tooltip,
  Badge,
  Empty
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  StopOutlined,
  EyeOutlined,
  CrownOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Battle } from '@/lib/types/admin.types';
import { Sword } from 'lucide-react';

const { Title, Text } = Typography;

interface BattleMonitorProps {
  battles: Battle[];
}

export default function BattleMonitor({ battles }: BattleMonitorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [simulatedBattles, setSimulatedBattles] = useState<Battle[]>(battles);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate battle progress for ongoing battles
      setSimulatedBattles(prev => 
        prev.map(battle => {
          if (battle.status === 'ongoing') {
            const battleStart = new Date(battle.timestamp).getTime();
            const now = new Date().getTime();
            const newDuration = Math.floor((now - battleStart) / 1000);
            return { ...battle, duration: newDuration };
          }
          return battle;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBattleTypeColor = (type: Battle['type']) => {
    switch (type) {
      case 'pvp': return 'red';
      case 'pve': return 'blue';
      case 'tournament': return 'gold';
      default: return 'default';
    }
  };

  const getBattleTypeIcon = (type: Battle['type']) => {
    switch (type) {
      case 'pvp': return <Sword/>;
      case 'pve': return <TeamOutlined />;
      case 'tournament': return <TrophyOutlined />;
      default: return <Sword />;
    }
  };

  const getBattleStatusColor = (status: Battle['status']) => {
    switch (status) {
      case 'ongoing': return 'red';
      case 'completed': return 'green';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getBattleStatusText = (status: Battle['status']) => {
    switch (status) {
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã kết thúc';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleControlBattle = (battleId: string, action: 'pause' | 'resume' | 'cancel') => {
    // Simulate API call for battle control
    console.log(`${action} battle ${battleId}`);
  };

  const ongoingBattles = simulatedBattles.filter(b => b.status === 'ongoing');
  const recentBattles = simulatedBattles
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBattleProgress = (battle: Battle) => {
    if (battle.status !== 'ongoing') return 100;
    // Simulate progress based on duration
    const maxDuration = 300; // 5 minutes max
    return Math.min((battle.duration / maxDuration) * 100, 95);
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Ongoing Battles */}
      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <PlayCircleOutlined />
              Trận Đang Diễn Ra
              {ongoingBattles.length > 0 && (
                <Badge count={ongoingBattles.length} showZero={false} />
              )}
            </Space>
          }

         variant="borderless"
        >
          {ongoingBattles.length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có trận chiến nào đang diễn ra"
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {ongoingBattles.map(battle => (
                <Card 
                  key={battle.id}
                  size="small"
                  style={{ 
                    border: '1px solid #ffccc7',
                    background: '#fff2f0'
                  }}
                >
                  <Row gutter={[8, 8]} align="middle">
                    <Col span={16}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                          <Tag color={getBattleTypeColor(battle.type)} icon={getBattleTypeIcon(battle.type)}>
                            {battle.type.toUpperCase()}
                          </Tag>
                          <Tag color="red">
                            <ClockCircleOutlined /> {formatDuration(battle.duration)}
                          </Tag>
                        </Space>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong style={{ color: '#8B0000' }}>{battle.player1}</Text>
                          <Text type="secondary">VS</Text>
                          <Text strong>{battle.player2}</Text>
                        </div>

                        <Progress 
                          percent={getBattleProgress(battle)}
                          strokeColor={{
                            '0%': '#dc143c',
                            '100%': '#8b0000',
                          }}
                          showInfo={false}
                        />
                      </Space>
                    </Col>
                    
                    <Col span={8}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button 
                          type="primary" 
                          size="small" 
                          icon={<EyeOutlined />}
                          block
                        >
                          Theo dõi
                        </Button>
                        <Button 
                          danger 
                          size="small" 
                          icon={<StopOutlined />}
                          block
                          onClick={() => handleControlBattle(battle.id, 'cancel')}
                        >
                          Hủy trận
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      </Col>

      {/* Recent Completed Battles */}
      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <TrophyOutlined />
              Trận Đã Kết Thúc Gần Đây
            </Space>
          }
          variant="borderless"
        >
          <List
            dataSource={recentBattles}
            renderItem={battle => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      style={{ 
                        backgroundColor: battle.winner === battle.player1 ? '#2e8b57' : '#dc143c'
                      }}
                      icon={<CrownOutlined />}
                    />
                  }
                  title={
                    <Space>
                      <Text strong>{battle.player1}</Text>
                      <Text type="secondary">VS</Text>
                      <Text strong>{battle.player2}</Text>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Space>
                        <Tag color={getBattleTypeColor(battle.type)}>
                          {battle.type.toUpperCase()}
                        </Tag>
                        <Tag color="green">
                          {formatDuration(battle.duration)}
                        </Tag>
                        <Text type="secondary">
                          {new Date(battle.timestamp).toLocaleTimeString('vi-VN')}
                        </Text>
                      </Space>
                      <div>
                        <Text strong>Người thắng: </Text>
                        <Text style={{ 
                          color: battle.winner === battle.player1 ? '#2e8b57' : '#dc143c',
                          fontWeight: 'bold'
                        }}>
                          {battle.winner}
                        </Text>
                      </div>
                      {battle.rewards.gold > 0 && (
                        <div>
                          <Text type="secondary">Phần thưởng: </Text>
                          <Tag color="gold">{battle.rewards.gold.toLocaleString()} vàng</Tag>
                          {battle.rewards.items.map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                            <Tag key={index} color="blue">{item}</Tag>
                          ))}
                        </div>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
