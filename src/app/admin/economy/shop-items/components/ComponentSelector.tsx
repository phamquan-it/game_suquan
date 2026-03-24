// app/admin/economy/shop-items/components/ComponentSelector.tsx
'use client'

import { useState } from 'react'
import { Select, Space, Typography, Modal, Table, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { ComponentType, ComponentOption } from '../types'
import { supabase } from '@/utils/supabase/client'

const { Text } = Typography
const { Option } = Select

interface ComponentSelectorProps {
  value?: string | null
  type?: ComponentType
  onSelect: (type: ComponentType, id: string) => void
}

export const ComponentSelector = ({ value, type, onSelect }: ComponentSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<ComponentType | null>(type || null)
  const [searchText, setSearchText] = useState('')

  // Fetch components based on type
  const { data: options, isLoading } = useQuery({
    queryKey: ['component-options', selectedType, searchText],
    queryFn: async () => {
      if (!selectedType) return []

      let query = supabase
        .from(selectedType === 'base_item' ? 'base_items' :
              selectedType === 'beauty' ? 'beauty_characters' :
              selectedType === 'general' ? 'generals' :
              selectedType === 'gift' ? 'gift_beauty' :
              selectedType === 'loot_box' ? 'loot_boxes' : 'units')
        .select('id, name, icon, image, thumbnail')

      if (searchText) {
        query = query.ilike('name', `%${searchText}%`)
      }

      const { data, error } = await query.limit(20)

      if (error) throw error
      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: selectedType,
        icon: item.icon || item.image || item.thumbnail,
      })) as ComponentOption[]
    },
    enabled: !!selectedType,
  })

  const handleTypeChange = (newType: ComponentType) => {
    setSelectedType(newType)
    setSearchText('')
  }

  const handleSelect = (component: ComponentOption) => {
    onSelect(component.type, component.id)
    setIsModalOpen(false)
    setSelectedType(null)
    setSearchText('')
  }

  // Find selected component details
  const selectedComponent = options?.find(opt => opt.id === value)

  return (
    <>
      <div 
        className="border rounded p-2 cursor-pointer hover:border-blue-500"
        onClick={() => setIsModalOpen(true)}
      >
        {value && selectedComponent ? (
          <Space>
            {selectedComponent.icon && (
              <img src={selectedComponent.icon} alt="" className="w-6 h-6 object-contain" />
            )}
            <Text>{selectedComponent.name}</Text>
            <Text type="secondary">({selectedComponent.type})</Text>
          </Space>
        ) : (
          <Text type="secondary">Select a component...</Text>
        )}
      </div>

      <Modal
        title="Select Component"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Space direction="vertical" className="w-full">
          <Select
            className="w-full"
            placeholder="Select component type"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <Option value="base_item">Base Item</Option>
            <Option value="beauty">Beauty Character</Option>
            <Option value="general">General</Option>
            <Option value="gift">Gift</Option>
            <Option value="loot_box">Loot Box</Option>
            <Option value="unit">Unit</Option>
          </Select>

          {selectedType && (
            <>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />

              <Table
                dataSource={options}
                loading={isLoading}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: '',
                    dataIndex: 'icon',
                    key: 'icon',
                    width: 50,
                    render: (icon: string) => icon ? (
                      <img src={icon} alt="" className="w-8 h-8 object-contain" />
                    ) : null,
                  },
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    width: 80,
                    render: (_: any, record: ComponentOption) => (
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => handleSelect(record)}
                      >
                        Select
                      </Button>
                    ),
                  },
                ]}
              />
            </>
          )}
        </Space>
      </Modal>
    </>
  )
}
