// app/admin/currencies/components/CurrencyStats.tsx
'use client';

import { Card, Row, Col, Statistic, Spin } from 'antd';
import { 
  WalletOutlined, 
  SwapOutlined, 
  TrophyOutlined,
  FolderOutlined 
} from '@ant-design/icons';
import { useCurrencyStats } from '../hooks/useCurrencyStats';
import { CATEGORY_COLORS, CURRENCY_CATEGORIES } from '../types';
import { getCategoryLabel } from '../utils/formatters';

export default function CurrencyStats() {
  const { data: stats, isLoading } = useCurrencyStats();

  if (isLoading) return <Spin size="large" />;

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Currencies"
              value={stats?.totalCurrencies || 0}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#8B0000' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Exchange Rates"
              value={stats?.totalExchangeRates || 0}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#2E8B57' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              value={CURRENCY_CATEGORIES.length}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#1E90FF' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Most Traded"
              value={stats?.mostTradedCurrency || 'N/A'}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#D4AF37' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {CURRENCY_CATEGORIES.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category}>
            <Card size="small">
              <Statistic
                title={getCategoryLabel(category)}
                value={stats?.categoriesCount[category] || 0}
                valueStyle={{ color: CATEGORY_COLORS[category] }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
