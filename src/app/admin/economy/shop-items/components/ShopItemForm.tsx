// app/admin/economy/shop-items/components/ShopItemForm.tsx
'use client'

import { Form, Input, Select, InputNumber, Button } from 'antd'
import {
  ShopItemFormData,
  SHOP_ITEM_TYPES,
  SHOP_ITEM_RARITIES,
  SHOP_ITEM_STATUSES,
  type ShopItemType,
  type ShopItemRarity,
  type ShopItemStatus,
} from '../types'
import { ShopItemComponents } from './ShopItemComponents'

const { TextArea } = Input

interface ShopItemFormProps {
  initialValues?: Partial<ShopItemFormData>
  onSubmit: (values: ShopItemFormData) => void
  loading?: boolean
}

export const ShopItemForm = ({
  initialValues,
  onSubmit,
  loading,
}: ShopItemFormProps) => {
  const [form] = Form.useForm<ShopItemFormData>()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      onSubmit(values)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Form<ShopItemFormData>
      form={form}
      layout="vertical"
      initialValues={{
        stock: 0,
        vip_level_required: 0,
        status: 'active',
        components: [],
        ...initialValues,
      }}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter item description" />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Input placeholder="Enter category" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="type" label="Type">
              <Select<ShopItemType>
                placeholder="Select type"
                allowClear
                options={SHOP_ITEM_TYPES.map(type => ({
                  value: type,
                  label: type.toUpperCase(),
                }))}
              />
            </Form.Item>

            <Form.Item name="rarity" label="Rarity">
              <Select<ShopItemRarity>
                placeholder="Select rarity"
                allowClear
                options={SHOP_ITEM_RARITIES.map(rarity => ({
                  value: rarity,
                  label: rarity.toUpperCase(),
                }))}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration_days" label="Duration (days)">
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Duration in days"
              />
            </Form.Item>

            <Form.Item
              name="vip_level_required"
              label="VIP Level Required"
              rules={[{ required: true, message: 'Please enter VIP level' }]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="stock" label="Stock">
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select<ShopItemStatus>
                options={SHOP_ITEM_STATUSES.map(status => ({
                  value: status,
                  label: status.toUpperCase(),
                }))}
              />
            </Form.Item>
          </div>

          <Form.Item name="item_icon" label="Icon URL">
            <Input placeholder="Enter icon URL" />
          </Form.Item>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Form.Item name="components" label="Item Components">
            <ShopItemComponents />
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={() => form.resetFields()}>
          Reset
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Save Item
        </Button>
      </div>
    </Form>
  )
}
