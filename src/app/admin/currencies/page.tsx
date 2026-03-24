// app/admin/currencies/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { WalletOutlined, SwapOutlined } from '@ant-design/icons';
import CurrencyStats from './components/CurrencyStats';
import CurrencyTable from './components/CurrencyTable';
import ExchangeRateTable from './components/ExchangeRateTable';
import CurrencyForm from './components/CurrencyForm';
import ExchangeRateForm from './components/ExchangeRateForm';
import { Currency } from './types';
import { CurrencyExchangeRateWithRelations } from './types';

const { Title } = Typography;

export default function CurrenciesPage() {
  const [activeTab, setActiveTab] = useState('1');
  const [currencyFormOpen, setCurrencyFormOpen] = useState(false);
  const [exchangeRateFormOpen, setExchangeRateFormOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedExchangeRate, setSelectedExchangeRate] = useState<CurrencyExchangeRateWithRelations | null>(null);

  const handleEditCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrencyFormOpen(true);
  };

  const handleAddCurrency = () => {
    setSelectedCurrency(null);
    setCurrencyFormOpen(true);
  };

  const handleEditExchangeRate = (rate: CurrencyExchangeRateWithRelations) => {
    setSelectedExchangeRate(rate);
    setExchangeRateFormOpen(true);
  };

  const handleAddExchangeRate = () => {
    setSelectedExchangeRate(null);
    setExchangeRateFormOpen(true);
  };

  const items = [
    {
      key: '1',
      label: (
        <span>
          <WalletOutlined /> Currencies
        </span>
      ),
      children: (
        <CurrencyTable 
          onEdit={handleEditCurrency}
          onAdd={handleAddCurrency}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <SwapOutlined /> Exchange Rates
        </span>
      ),
      children: (
        <ExchangeRateTable 
          onEdit={handleEditExchangeRate}
          onAdd={handleAddExchangeRate}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24, color: '#8B0000' }}>
        Currency Management
      </Title>

      <CurrencyStats />

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={items}
          type="card"
        />
      </Card>

      <CurrencyForm 
        open={currencyFormOpen}
        onClose={() => setCurrencyFormOpen(false)}
        currency={selectedCurrency}
      />

      <ExchangeRateForm 
        open={exchangeRateFormOpen}
        onClose={() => setExchangeRateFormOpen(false)}
        exchangeRate={selectedExchangeRate}
      />
    </div>
  );
}
