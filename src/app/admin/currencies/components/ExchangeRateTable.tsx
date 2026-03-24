// app/admin/currencies/components/ExchangeRateTable.tsx
'use client';

import { Table, Button, Tag, Space, Popconfirm, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { CurrencyExchangeRateWithRelations } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ExchangeRateTableProps {
  onEdit: (rate: CurrencyExchangeRateWithRelations) => void;
  onAdd: () => void;
}

export default function ExchangeRateTable({ onEdit, onAdd }: ExchangeRateTableProps) {
  const { exchangeRates, isLoading, deleteExchangeRate } = useExchangeRates();

  const columns = [
    {
      title: 'From Currency',
      dataIndex: ['from_currency_details', 'name'],
      key: 'from_currency',
      render: (_: string, record: CurrencyExchangeRateWithRelations) => (
        <span style={{ color: record.from_currency_details?.color || undefined }}>
          {record.from_currency_details?.name || record.from_currency}
          {record.from_currency_details?.icon && ` ${record.from_currency_details.icon}`}
        </span>
      ),
    },
    {
      title: '',
      key: 'arrow',
      render: () => <ArrowRightOutlined />,
      width: 50,
    },
    {
      title: 'To Currency',
      dataIndex: ['to_currency_details', 'name'],
      key: 'to_currency',
      render: (_: string, record: CurrencyExchangeRateWithRelations) => (
        <span style={{ color: record.to_currency_details?.color || undefined }}>
          {record.to_currency_details?.name || record.to_currency}
          {record.to_currency_details?.icon && ` ${record.to_currency_details.icon}`}
        </span>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Tag color="green">{formatCurrency(rate)}</Tag>
      ),
      sorter: (a: CurrencyExchangeRateWithRelations, b: CurrencyExchangeRateWithRelations) => a.rate - b.rate,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number | null) => fee ? formatPercentage(fee) : '-',
    },
    {
      title: 'Min Amount',
      dataIndex: 'min_amount',
      key: 'min_amount',
      render: (amount: number | null) => amount ? formatCurrency(amount) : 'No min',
    },
    {
      title: 'Max Amount',
      dataIndex: 'max_amount',
      key: 'max_amount',
      render: (amount: number | null) => amount === 999999 ? '∞' : formatCurrency(amount),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CurrencyExchangeRateWithRelations) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Exchange Rate"
            description="Are you sure you want to delete this exchange rate?"
            onConfirm={() => deleteExchangeRate.mutate(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger 
                loading={deleteExchangeRate.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAdd}
        >
          Add Exchange Rate
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={exchangeRates} 
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </>
  );
}
