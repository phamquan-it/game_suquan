'use client';

import { Card, Col, Row, Statistic } from 'antd';
import { 
  UserOutlined, 
  StarOutlined, 
  RiseOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export function BeautyStats() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    onMission: 0,
    legendary: 0,
    averageLevel: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [total, available, mission, legendary, avgLevel] = await Promise.all([
      supabase.from('beauty_characters').select('*', { count: 'exact', head: true }),
      supabase.from('beauty_characters').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('beauty_characters').select('*', { count: 'exact', head: true }).eq('status', 'mission'),
      supabase.from('beauty_characters').select('*', { count: 'exact', head: true }).eq('rarity', 'legendary'),
      supabase.from('beauty_characters').select('level'),
    ]);

    const avg = avgLevel.data?.reduce((acc, curr) => acc + curr.level, 0) || 0;
    const avgValue = avgLevel.data?.length ? Math.round(avg / avgLevel.data.length) : 0;

    setStats({
      total: total.count || 0,
      available: available.count || 0,
      onMission: mission.count || 0,
      legendary: legendary.count || 0,
      averageLevel: avgValue,
    });
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)' }}>
          <Statistic
            title={<span style={{ color: '#F5F5DC' }}>Total Beauties</span>}
            value={stats.total}
            prefix={<UserOutlined style={{ color: '#D4AF37' }} />}
            valueStyle={{ color: '#D4AF37', fontSize: 32 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)' }}>
          <Statistic
            title={<span style={{ color: '#F5F5DC' }}>Available</span>}
            value={stats.available}
            prefix={<TeamOutlined style={{ color: '#D4AF37' }} />}
            valueStyle={{ color: '#D4AF37', fontSize: 32 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)' }}>
          <Statistic
            title={<span style={{ color: '#F5F5DC' }}>On Mission</span>}
            value={stats.onMission}
            prefix={<RiseOutlined style={{ color: '#D4AF37' }} />}
            valueStyle={{ color: '#D4AF37', fontSize: 32 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}>
          <Statistic
            title={<span style={{ color: '#F5F5DC' }}>Legendary</span>}
            value={stats.legendary}
            prefix={<StarOutlined style={{ color: '#D4AF37' }} />}
            valueStyle={{ color: '#D4AF37', fontSize: 32 }}
          />
        </Card>
      </Col>
    </Row>
  );
}
