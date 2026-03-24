// app/admin/currencies/components/ExchangeRateForm.tsx
'use client';

import { Modal, Form, Select, InputNumber, Space } from 'antd';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencies } from '../hooks/useCurrencies';
import { CurrencyExchangeRateWithRelations, CreateExchangeRateInput } from '../types';
import { useEffect } from 'react';

interface ExchangeRateFormProps {
  open: boolean;
  onClose: () => void;
  exchangeRate?: CurrencyExchangeRateWithRelations | null;
}

export default function ExchangeRateForm({ open, onClose, exchangeRate }: ExchangeRateFormProps) {
  const [form] = Form.useForm();
  const { createExchangeRate, updateExchangeRate } = useExchangeRates();
  const { currencies } = useCurrencies();
  const isEditing = !!exchangeRate;

  useEffect(() => {
    if (open && exchangeRate) {
      form.setFieldsValue({
        from_currency: exchangeRate.from_currency,
        to_currency: exchangeRate.to_currency,
        rate: exchangeRate.rate,
        fee: exchangeRate.fee,
        min_amount: exchangeRate.min_amount,
        max_amount: exchangeRate.max_amount,
      });
    } else {
      form.resetFields();
    }
  }, [open, exchangeRate, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateExchangeRate.mutateAsync({
          id: exchangeRate!.id,
          ...values,
        });
      } else {
        await createExchangeRate.mutateAsync(values as CreateExchangeRateInput);
      }
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Exchange Rate' : 'Create Exchange Rate'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createExchangeRate.isPending || updateExchangeRate.isPending}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          fee: 0,
          min_amount: 0,
          max_amount: 999999,
        }}
      >
        <Form.Item
          name="from_currency"
          label="From Currency"
          rules={[{ required: true, message: 'Please select source currency' }]}
        >
          <Select 
            placeholder="Select source currency"
            disabled={isEditing}
            showSearch
            optionFilterProp="children"
          >
            {currencies?.map(currency => (
              <Select.Option key={currency.currency_type} value={currency.currency_type}>
                {currency.icon} {currency.name} ({currency.currency_type})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="to_currency"
          label="To Currency"
          rules={[{ required: true, message: 'Please select target currency' }]}
        >
          <Select 
            placeholder="Select target currency"
            disabled={isEditing}
            showSearch
            optionFilterProp="children"
          >
            {currencies?.map(currency => (
              <Select.Option key={currency.currency_type} value={currency.currency_type}>
                {currency.icon} {currency.name} ({currency.currency_type})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="rate"
          label="Exchange Rate"
          rules={[{ required: true, message: 'Please enter exchange rate' }]}
        >
          <InputNumber 
            min={0.0001} 
            step={0.0001} 
            style={{ width: '100%' }} 
            placeholder="e.g., 1.5"
          />
        </Form.Item>

        <Form.Item
          name="fee"
          label="Fee (%)"
        >
          <InputNumber 
            min={0} 
            max={100} 
            step={0.1} 
            style={{ width: '100%' }} 
            placeholder="Transaction fee percentage"
          />
        </Form.Item>

        <Space style={{ display: 'flex', gap: 16, width: '100%' }} size={16}>
          <Form.Item
            name="min_amount"
            label="Min Amount"
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={0} 
              step={1} 
              style={{ width: '100%' }} 
              placeholder="Minimum amount"
            />
          </Form.Item>

          <Form.Item
            name="max_amount"
            label="Max Amount"
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={0} 
              max={999999} 
              step={1} 
              style={{ width: '100%' }} 
              placeholder="Maximum amount"
            />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
}
