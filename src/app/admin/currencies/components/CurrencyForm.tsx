// app/admin/currencies/components/CurrencyForm.tsx
'use client';

import { Modal, Form, Input, InputNumber, Select, Switch, Space } from 'antd';
import { useCurrencies } from '../hooks/useCurrencies';
import { Currency, CURRENCY_CATEGORIES, CreateCurrencyInput, UpdateCurrencyInput } from '../types';
import { useEffect } from 'react';

interface CurrencyFormProps {
  open: boolean;
  onClose: () => void;
  currency?: Currency | null;
}

export default function CurrencyForm({ open, onClose, currency }: CurrencyFormProps) {
  const [form] = Form.useForm();
  const { createCurrency, updateCurrency } = useCurrencies();
  const isEditing = !!currency;

  useEffect(() => {
    if (open && currency) {
      form.setFieldsValue(currency);
    } else {
      form.resetFields();
    }
  }, [open, currency, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateCurrency.mutateAsync({
          currency_type: currency!.currency_type,
          ...values,
        });
      } else {
        await createCurrency.mutateAsync(values as CreateCurrencyInput);
      }
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Currency' : 'Create New Currency'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createCurrency.isPending || updateCurrency.isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          exchange_rate: 1,
          max_stack: 999999,
          tradable: true,
          destroyable: false,
        }}
      >
        <Form.Item
          name="currency_type"
          label="Currency Type"
          rules={[{ required: true, message: 'Please enter currency type' }]}
        >
          <Input disabled={isEditing} placeholder="e.g., gold_coins, honor_points" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter currency name' }]}
        >
          <Input placeholder="e.g., Gold Coins" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select>
            {CURRENCY_CATEGORIES.map(cat => (
              <Select.Option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Space style={{ display: 'flex', gap: 16, width: '100%' }} size={16}>
          <Form.Item
            name="icon"
            label="Icon"
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g., ⚔️" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            style={{ flex: 1 }}
          >
            <Input type="color" />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex', gap: 16, width: '100%' }} size={16}>
          <Form.Item
            name="exchange_rate"
            label="Exchange Rate"
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={0} 
              step={0.0001} 
              style={{ width: '100%' }} 
              placeholder="Base exchange rate"
            />
          </Form.Item>

          <Form.Item
            name="max_stack"
            label="Max Stack"
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={1} 
              max={999999} 
              style={{ width: '100%' }} 
              placeholder="Maximum stack size"
            />
          </Form.Item>
        </Space>

        <Space style={{ display: 'flex', gap: 16, width: '100%' }} size={16}>
          <Form.Item
            name="tradable"
            label="Tradable"
            valuePropName="checked"
            style={{ flex: 1 }}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="destroyable"
            label="Destroyable"
            valuePropName="checked"
            style={{ flex: 1 }}
          >
            <Switch />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
}
