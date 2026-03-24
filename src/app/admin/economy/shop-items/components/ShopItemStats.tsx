// app/admin/economy/shop-items/components/ShopItemStats.tsx
'use client'

import { Card, Row, Col, Statistic, Progress } from 'antd'
import { 
  ShoppingOutlined, 
  DollarOutlined, 
  RiseOutlined,
  StockOutlined 
} from '@ant-design/icons'
import { ShopItemWithComponents } from '../types'

interface ShopItemStatsProps {
  item: ShopItemWithComponents
}

export const ShopItemStats = ({ item }: ShopItemStatsProps) => {
  const totalStock = item.stock || 0
  const totalSales = item.sales || 0
  const totalRevenue = item.revenue || 0
  const stockPercentage = totalStock > 0 
    ? Math.min(Math.round((totalSales / totalStock) * 100), 100) 
    : 0

  return (
    <Card title="Statistics" size="small">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic
            title="Stock"
            value={totalStock}
            prefix={<StockOutlined />}
            suffix={`units`}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Sales"
            value={totalSales}
            prefix={<ShoppingOutlined />}
            suffix={`units`}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Revenue"
            value={totalRevenue}
            prefix={<DollarOutlined />}
            precision={2}
            suffix="coins"
          />
        </Col>
      </Row>
      
      <div className="mt-4">
        <Statistic
          title="Sales Rate"
          value={stockPercentage}
          prefix={<RiseOutlined />}
          suffix="%"
        />
        <Progress 
          percent={stockPercentage} 
          status={stockPercentage > 80 ? 'success' : 'active'}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      </div>
    </Card>
  )
}
