// app/admin/economy/shop-items/[id]/page.tsx
'use client'

import { Typography, Card, Descriptions, Tag, Space, Button, Row, Col } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { useParams, useRouter } from 'next/navigation'
import { ShopItemStats } from '../components/ShopItemStats'
import { ShopItemRarity, ShopItemType, ShopItemStatus } from '../types'
import { useShopItem } from '../hooks/useShopItem'

const { Title, Text } = Typography

const statusColors: Record<ShopItemStatus, string> = {
  active: 'success',
  inactive: 'default',
  archived: 'error',
}

const rarityColors: Record<ShopItemRarity, string> = {
  common: 'default',
  uncommon: 'cyan',
  rare: 'blue',
  epic: 'purple',
  legendary: 'gold',
}

const typeColors: Record<ShopItemType, string> = {
  hero: 'magenta',
  item: 'geekblue',
  resource: 'green',
  boost: 'orange',
  vip: 'gold',
  chest: 'purple',
  unit: 'cyan',
}

export default function ShopItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: item, isLoading } = useShopItem(params.id as string)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <div>Item not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/admin/economy/shop-items')}
          >
            Back
          </Button>
          <Title level={2} className="mb-0">{item.name}</Title>
        </Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/admin/economy/shop-items/${item.id}/edit`)}
        >
          Edit
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Basic Information" className="mb-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID" span={2}>
                <Text copyable>{item.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
              <Descriptions.Item label="Category">{item.category || '-'}</Descriptions.Item>
              <Descriptions.Item label="Type">
                {item.type && <Tag color={typeColors[item.type]}>{item.type}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Rarity">
                {item.rarity && <Tag color={rarityColors[item.rarity]}>{item.rarity}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {item.status && <Tag color={statusColors[item.status]}>{item.status}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {item.duration_days ? `${item.duration_days} days` : 'Permanent'}
              </Descriptions.Item>
              <Descriptions.Item label="VIP Required">
                Level {item.vip_level_required}
              </Descriptions.Item>
              <Descriptions.Item label="Icon" span={2}>
                {item.item_icon ? (
                  <img src={item.item_icon} alt={item.name} className="max-w-[100px] max-h-[100px]" />
                ) : (
                  'No icon'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {item.description || 'No description'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Components">
            {item.components?.length > 0 ? (
              <Descriptions bordered column={1}>
                {item.components.map((comp, index) => {
                  const componentName = 
                    comp.base_item?.name ||
                    comp.beauty?.name ||
                    comp.general?.name ||
                    comp.gift?.name ||
                    comp.loot_box?.name ||
                    comp.unit?.name ||
                    'Unknown'

                  const componentType = 
                    comp.base_item ? 'Base Item' :
                    comp.beauty ? 'Beauty' :
                    comp.general ? 'General' :
                    comp.gift ? 'Gift' :
                    comp.loot_box ? 'Loot Box' :
                    comp.unit ? 'Unit' : 'Unknown'

                  return (
                    <Descriptions.Item key={comp.id} label={`Component ${index + 1}`}>
                      <Space>
                        <Tag color="blue">{componentType}</Tag>
                        <Text strong>{componentName}</Text>
                        <Text>× {comp.quantity}</Text>
                      </Space>
                    </Descriptions.Item>
                  )
                })}
              </Descriptions>
            ) : (
              <Text type="secondary">No components</Text>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <ShopItemStats item={item} />
          
          <Card title="Timestamps" className="mt-4">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Created">
                {new Date(item.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {new Date(item.updated_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
