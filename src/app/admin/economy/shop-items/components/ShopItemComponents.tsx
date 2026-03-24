// app/admin/economy/shop-items/components/ShopItemComponents.tsx
'use client'

import { Button, Select, InputNumber, Space, Card, Typography, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { ComponentType } from '../types'
import { ComponentSelector } from './ComponentSelector'

const { Text } = Typography

interface ComponentField {
  id?: string
  base_item_id: string | null
  beauty_id: string | null
  general_id: string | null
  gift_id: string | null
  loot_box_id: string | null
  unit_id: string | null
  quantity: number
}

export const ShopItemComponents = () => {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  })

  const addComponent = () => {
    append({
      base_item_id: null,
      beauty_id: null,
      general_id: null,
      gift_id: null,
      loot_box_id: null,
      unit_id: null,
      quantity: 1,
    })
  }

  const handleComponentSelect = (index: number, type: ComponentType, id: string) => {
    // Clear all other IDs
    const update: Partial<ComponentField> = {
      base_item_id: null,
      beauty_id: null,
      general_id: null,
      gift_id: null,
      loot_box_id: null,
      unit_id: null,
    }

    // Set the selected ID
    switch (type) {
      case 'base_item':
        update.base_item_id = id
        break
      case 'beauty':
        update.beauty_id = id
        break
      case 'general':
        update.general_id = id
        break
      case 'gift':
        update.gift_id = id
        break
      case 'loot_box':
        update.loot_box_id = id
        break
      case 'unit':
        update.unit_id = id
        break
    }

    // Update the field
    const currentField = watch(`components.${index}`)
    setValue(`components.${index}`, { ...currentField, ...update })
  }

  const getComponentType = (field: ComponentField): ComponentType | null => {
    if (field.base_item_id) return 'base_item'
    if (field.beauty_id) return 'beauty'
    if (field.general_id) return 'general'
    if (field.gift_id) return 'gift'
    if (field.loot_box_id) return 'loot_box'
    if (field.unit_id) return 'unit'
    return null
  }

  const getComponentId = (field: ComponentField): string | null => {
    return field.base_item_id || 
           field.beauty_id || 
           field.general_id || 
           field.gift_id || 
           field.loot_box_id || 
           field.unit_id
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <Empty description="No components added" />
      ) : (
        fields.map((field, index) => {
          const componentType = getComponentType(field as ComponentField)
          const componentId = getComponentId(field as ComponentField)

          return (
            <Card
              key={field.id}
              size="small"
              className="relative"
              extra={
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                />
              }
            >
              <Space direction="vertical" className="w-full">
                <Controller
                  control={control}
                  name={`components.${index}.quantity`}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={1}
                      className="w-full"
                      placeholder="Quantity"
                    />
                  )}
                />

                <ComponentSelector
                  value={componentId}
                  type={componentType || undefined}
                  onSelect={(type, id) => handleComponentSelect(index, type, id)}
                />
              </Space>
            </Card>
          )
        })
      )}

      <Button 
        type="dashed" 
        block 
        icon={<PlusOutlined />}
        onClick={addComponent}
      >
        Add Component
      </Button>
    </div>
  )
}
