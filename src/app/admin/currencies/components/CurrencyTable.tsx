// app/admin/currencies/components/CurrencyTable.tsx
"use client";

import { Table, Button, Tag, Space, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useCurrencies } from "../hooks/useCurrencies";
import { Currency, CATEGORY_COLORS } from "../types";
import { formatCurrency, getCategoryLabel } from "../utils/formatters";
import { ColumnsType } from "antd/es/table";

interface CurrencyTableProps {
  onEdit: (currency: Currency) => void;
  onAdd: () => void;
}

export default function CurrencyTable({ onEdit, onAdd }: CurrencyTableProps) {
  const { currencies, isLoading, deleteCurrency } = useCurrencies();

  const columns: ColumnsType<Currency> = [
    {
      title: "Currency Type",
      dataIndex: "currency_type",
      key: "currency_type",
      sorter: (a: Currency, b: Currency) =>
        a.currency_type.localeCompare(b.currency_type),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Currency) => (
        <span style={{ color: record.color || undefined, fontWeight: 600 }}>
          {text}
          {record.icon && ` ${record.icon}`}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag color={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}>
          {getCategoryLabel(category)}
        </Tag>
      ),
      filters: Object.entries(CATEGORY_COLORS).map(([key, value]) => ({
        text: getCategoryLabel(key),
        value: key,
      })),
    },
    {
      title: "Exchange Rate",
      dataIndex: "exchange_rate",
      key: "exchange_rate",
      render: (rate: number | null) => formatCurrency(rate),
      sorter: (a: Currency, b: Currency) =>
        (a.exchange_rate || 0) - (b.exchange_rate || 0),
    },
    {
      title: "Max Stack",
      dataIndex: "max_stack",
      key: "max_stack",
      render: (stack: number | null) => stack?.toLocaleString() || "∞",
    },
    {
      title: "Tradable",
      dataIndex: "tradable",
      key: "tradable",
      render: (tradable: boolean | null) =>
        tradable ? (
          <CheckOutlined style={{ color: "#2E8B57" }} />
        ) : (
          <CloseOutlined style={{ color: "#DC143C" }} />
        ),
      filters: [
        { text: "Tradable", value: true },
        { text: "Non-tradable", value: false },
      ],
    },
    {
      title: "Destroyable",
      dataIndex: "destroyable",
      key: "destroyable",
      render: (destroyable: boolean | null) =>
        destroyable ? (
          <CheckOutlined style={{ color: "#2E8B57" }} />
        ) : (
          <CloseOutlined style={{ color: "#DC143C" }} />
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string | null) => text || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Currency) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Currency"
            description="Are you sure you want to delete this currency?"
            onConfirm={() => deleteCurrency.mutate(record.currency_type)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                loading={deleteCurrency.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add Currency
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={currencies}
        loading={isLoading}
        rowKey="currency_type"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </>
  );
}
