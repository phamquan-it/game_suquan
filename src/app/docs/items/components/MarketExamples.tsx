'use client';

import { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Select, Statistic, Alert } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {  ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { TrendingUp } from 'lucide-react';

const { Title,Text } = Typography;
const { Option } = Select;

interface PriceHistory {
  date: string;
  price: number;
  volume: number;
  minPrice: number;
  maxPrice: number;
}

interface MarketItem {
  id: string;
  name: string;
  rarity: string;
  currentPrice: number;
  volume24h: number;
  priceChange: number;
  trend: 'up' | 'down' | 'stable';
}

export default function MarketExamples() {
  const [selectedItem, setSelectedItem] = useState<string>('dragon_scale');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const mockPriceHistory: { [key: string]: PriceHistory[] } = {
    dragon_scale: [
      { date: '2024-01-01', price: 1250, volume: 45, minPrice: 1200, maxPrice: 1300 },
      { date: '2024-01-02', price: 1320, volume: 52, minPrice: 1280, maxPrice: 1350 },
      { date: '2024-01-03', price: 1280, volume: 38, minPrice: 1250, maxPrice: 1320 },
      { date: '2024-01-04', price: 1400, volume: 67, minPrice: 1350, maxPrice: 1450 },
      { date: '2024-01-05', price: 1450, volume: 72, minPrice: 1400, maxPrice: 1500 },
      { date: '2024-01-06', price: 1380, volume: 55, minPrice: 1350, maxPrice: 1420 },
      { date: '2024-01-07', price: 1420, volume: 61, minPrice: 1380, maxPrice: 1450 },
    ],
    mithril_bar: [
      { date: '2024-01-01', price: 450, volume: 120, minPrice: 430, maxPrice: 470 },
      { date: '2024-01-02', price: 470, volume: 135, minPrice: 450, maxPrice: 480 },
      { date: '2024-01-03', price: 460, volume: 110, minPrice: 440, maxPrice: 470 },
      { date: '2024-01-04', price: 480, volume: 140, minPrice: 460, maxPrice: 490 },
      { date: '2024-01-05', price: 490, volume: 150, minPrice: 470, maxPrice: 500 },
      { date: '2024-01-06', price: 475, volume: 125, minPrice: 460, maxPrice: 480 },
      { date: '2024-01-07', price: 485, volume: 130, minPrice: 470, maxPrice: 490 },
    ],
    healing_potion: [
      { date: '2024-01-01', price: 25, volume: 300, minPrice: 20, maxPrice: 30 },
      { date: '2024-01-02', price: 28, volume: 280, minPrice: 22, maxPrice: 32 },
      { date: '2024-01-03', price: 26, volume: 320, minPrice: 21, maxPrice: 29 },
      { date: '2024-01-04', price: 30, volume: 250, minPrice: 25, maxPrice: 35 },
      { date: '2024-01-05', price: 32, volume: 230, minPrice: 28, maxPrice: 35 },
      { date: '2024-01-06', price: 29, volume: 270, minPrice: 24, maxPrice: 32 },
      { date: '2024-01-07', price: 31, volume: 260, minPrice: 26, maxPrice: 34 },
    ],
  };

  const marketItems: MarketItem[] = [
    {
      id: 'dragon_scale',
      name: 'Dragon Scale',
      rarity: 'epic',
      currentPrice: 1420,
      volume24h: 61,
      priceChange: 2.8,
      trend: 'up'
    },
    {
      id: 'mithril_bar',
      name: 'Mithril Bar',
      rarity: 'rare',
      currentPrice: 485,
      volume24h: 130,
      priceChange: 1.0,
      trend: 'up'
    },
    {
      id: 'healing_potion',
      name: 'Healing Potion',
      rarity: 'common',
      currentPrice: 31,
      volume24h: 260,
      priceChange: -3.1,
      trend: 'down'
    },
    {
      id: 'ancient_wood',
      name: 'Ancient Wood',
      rarity: 'rare',
      currentPrice: 320,
      volume24h: 85,
      priceChange: 0.0,
      trend: 'stable'
    },
    {
      id: 'phoenix_feather',
      name: 'Phoenix Feather',
      rarity: 'legendary',
      currentPrice: 2500,
      volume24h: 12,
      priceChange: 5.2,
      trend: 'up'
    },
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? '#3f8600' : trend === 'down' ? '#cf1322' : '#d4b106';
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: 'gray',
      uncommon: 'green',
      rare: 'blue',
      epic: 'purple',
      legendary: 'orange',
      mythic: 'red'
    };
    return colors[rarity] || 'default';
  };

  return (
    <div>
      <Title level={2}>💰 Market Economy Examples</Title>

      {/* Market Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Market Volume (24h)"
              value={11245}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Listings"
              value={892}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Price Change (24h)"
              value={2.4}
              precision={2}
              suffix="%"
              prefix={<TrendingUp/>}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Price Charts */}
      <Card 
        title="📈 Price History Analysis" 
        style={{ marginTop: 24 }}
        extra={
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
            <Option value="24h">24 Hours</Option>
            <Option value="7d">7 Days</Option>
            <Option value="30d">30 Days</Option>
            <Option value="90d">90 Days</Option>
          </Select>
        }
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPriceHistory[selectedItem]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#1890ff" 
                  name="Average Price"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="minPrice" 
                  stroke="#52c41a" 
                  name="Min Price"
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="maxPrice" 
                  stroke="#ff4d4f" 
                  name="Max Price"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} lg={8}>
            <Text strong>Trading Volume</Text>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockPriceHistory[selectedItem]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#8884d8" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>

      {/* Market Items Table */}
      <Card title="🏪 Market Items" style={{ marginTop: 24 }}>
        <Table
          dataSource={marketItems}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Item Name',
              dataIndex: 'name',
              key: 'name',
              render: (text: string, record: MarketItem) => (
                <div>
                  <Text strong>{text}</Text>
                  <br />
                  <Tag color={getRarityColor(record.rarity)}>{record.rarity}</Tag>
                </div>
              ),
            },
            {
              title: 'Current Price',
              dataIndex: 'currentPrice',
              key: 'currentPrice',
              render: (price: number) => (
                <Text strong>{price.toLocaleString()}g</Text>
              ),
            },
            {
              title: '24h Change',
              dataIndex: 'priceChange',
              key: 'priceChange',
              render: (change: number, record: MarketItem) => (
                <Text style={{ color: getTrendColor(record.trend) }}>
                  {change > 0 ? '+' : ''}{change}%
                </Text>
              ),
            },
            {
              title: '24h Volume',
              dataIndex: 'volume24h',
              key: 'volume24h',
              render: (volume: number) => volume.toLocaleString(),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (record: MarketItem) => (
                <Button 
                  size="small" 
                  type="primary"
                  onClick={() => setSelectedItem(record.id)}
                >
                  Analyze
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* Trading Strategies */}
      <Card title="💡 Trading Strategies" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Alert
              message="Arbitrage Opportunity"
              description="Dragon Scales are trading 15% lower on Server B compared to Server A. Consider cross-server trading."
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} md={12}>
            <Alert
              message="Market Trend"
              description="Healing Potion prices are declining due to increased supply from the new dungeon. Consider selling existing stock."
              type="warning"
              showIcon
            />
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Text strong>Recommended Actions:</Text>
          <ul>
            <li>Buy Dragon Scale - Price expected to rise with upcoming raid</li>
            <li>Sell Healing Potion - Oversupply situation developing</li>
            <li>Hold Mithril Bar - Stable demand from crafting community</li>
          </ul>
        </div>
      </Card>

      {/* SQL Query Examples */}
      <Card title="💻 Market Analysis SQL Queries" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Price History Query:</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              marginTop: 8
            }}>
{`SELECT 
  DATE(timestamp) as date,
  ROUND(AVG(average_price), 2) as price,
  MIN(min_price) as min_price,
  MAX(max_price) as max_price,
  SUM(volume) as volume
FROM items.price_history
WHERE item_id = 'dragon_scale'
  AND timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date ASC;`}
            </pre>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Market Trends Query:</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              marginTop: 8
            }}>
{`SELECT 
  bi.name,
  ph.average_price as current_price,
  LAG(ph.average_price) OVER (PARTITION BY ph.item_id ORDER BY ph.timestamp) as previous_price,
  ROUND(
    ((ph.average_price - LAG(ph.average_price) OVER (PARTITION BY ph.item_id ORDER BY ph.timestamp)) 
    / LAG(ph.average_price) OVER (PARTITION BY ph.item_id ORDER BY ph.timestamp)) * 100, 2
  ) as price_change_percent
FROM items.price_history ph
JOIN items.base_items bi ON ph.item_id = bi.id
WHERE ph.timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY price_change_percent DESC;`}
            </pre>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
