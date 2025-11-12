import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Alert, Divider, Progress, Statistic, Timeline } from 'antd';
import { CrownOutlined, ArrowUpOutlined, ArrowDownOutlined, SwapOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const CurrencySystem: React.FC = () => {
  const currencyTypes = [
    {
      type: 'Gold Coins',
      currency_type: 'gold',
      category: 'basic',
      icon: '💰',
      exchangeRate: '1.0',
      maxStack: '999,999,999',
      tradable: true,
      destroyable: false,
      color: '#FFD700',
      usage: ['Common purchases', 'Basic upgrades', 'Crafting'],
      description: 'The foundation of the imperial economy'
    },
    {
      type: 'Silver Pieces',
      currency_type: 'silver',
      category: 'basic',
      icon: '🪙',
      exchangeRate: '0.1',
      maxStack: '999,999,999',
      tradable: true,
      destroyable: false,
      color: '#C0C0C0',
      usage: ['Regular items', 'Common services'],
      description: 'Standard currency for everyday transactions'
    },
    {
      type: 'Imperial Diamonds',
      currency_type: 'diamond',
      category: 'premium',
      icon: '💎',
      exchangeRate: '100.0',
      maxStack: '999,999',
      tradable: true,
      destroyable: false,
      color: '#B9F2FF',
      usage: ['Rare items', 'Premium chests', 'Exclusive content'],
      description: 'Premium currency for royal offerings'
    },
    {
      type: 'Royal Crystals',
      currency_type: 'crystal',
      category: 'special',
      icon: '🔮',
      exchangeRate: '50.0',
      maxStack: '999,999',
      tradable: false,
      destroyable: false,
      color: '#00FF7F',
      usage: ['Advanced crafting', 'Special upgrades', 'Magic items'],
      description: 'Magical crystals for extraordinary purposes'
    },
    {
      type: 'Honor Points',
      currency_type: 'honor',
      category: 'pvp',
      icon: '⚔️',
      exchangeRate: '5.0',
      maxStack: '99,999',
      tradable: false,
      destroyable: false,
      color: '#FF4500',
      usage: ['PvP gear', 'Combat skills', 'Arena rewards'],
      description: 'Earned through glorious combat'
    },
    {
      type: 'Alliance Points',
      currency_type: 'alliance_point',
      category: 'social',
      icon: '🤝',
      exchangeRate: '3.0',
      maxStack: '999,999',
      tradable: false,
      destroyable: false,
      color: '#4B0082',
      usage: ['Guild items', 'Cooperative content', 'Alliance rewards'],
      description: 'Rewards for loyal alliance members'
    },
    {
      type: 'VIP Points',
      currency_type: 'vip_point',
      category: 'premium',
      icon: '👑',
      exchangeRate: '200.0',
      maxStack: '999,999',
      tradable: false,
      destroyable: false,
      color: '#FF69B4',
      usage: ['VIP benefits', 'Exclusive access', 'Royal treatment'],
      description: 'For the most esteemed imperial subjects'
    }
  ];

  const exchangeRates = [
    {
      from: 'Gold Coins',
      to: 'Imperial Diamonds',
      rate: '0.01',
      fee: '0.1%',
      minAmount: '100',
      maxAmount: '100,000',
      enabled: true
    },
    {
      from: 'Imperial Diamonds',
      to: 'Gold Coins',
      rate: '100.0',
      fee: '2.0%',
      minAmount: '1',
      maxAmount: '1,000',
      enabled: true
    },
    {
      from: 'Silver Pieces',
      to: 'Gold Coins',
      rate: '10.0',
      fee: '5.0%',
      minAmount: '100',
      maxAmount: '1,000,000',
      enabled: true
    },
    {
      from: 'Honor Points',
      to: 'Gold Coins',
      rate: '0.2',
      fee: '15.0%',
      minAmount: '100',
      maxAmount: '10,000',
      enabled: false
    }
  ];

  const transactionTypes = [
    {
      type: 'earn',
      icon: '📈',
      description: 'Currency acquisition',
      examples: ['Quest rewards', 'Monster drops', 'Trading', 'Daily login']
    },
    {
      type: 'spend',
      icon: '📉',
      description: 'Currency expenditure',
      examples: ['Item purchases', 'Service fees', 'Crafting costs', 'Upgrades']
    },
    {
      type: 'exchange',
      icon: '🔄',
      description: 'Currency conversion',
      examples: ['Market exchange', 'Currency trading', 'Conversion fees']
    },
    {
      type: 'reward',
      icon: '🎁',
      description: 'Special rewards',
      examples: ['Event rewards', 'Achievement bonuses', 'Compensation']
    },
    {
      type: 'penalty',
      icon: '⚖️',
      description: 'Currency deductions',
      examples: ['Repair costs', 'Death penalties', 'Market taxes']
    }
  ];

  return (
    <div className="p-6">
      <div className="p-6 rounded-lg imperial-border parchment-bg">
        <Title level={1} className="text-imperial-red font-imperial text-center">💰 Royal Treasury System</Title>
        <Paragraph className="text-noble-brown text-center text-lg">
          Comprehensive management of the imperial economy&apos;s monetary foundation
        </Paragraph>

        <Alert
          message="Imperial Economic Policy"
          description="All currency transactions are recorded in the royal ledger for transparency and audit purposes."
          type="info"
          showIcon
          icon={<CrownOutlined />}
          className="mb-6 bg-blue-50 border-blue-200"
        />

        {/* Currency Types Section */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🏦 Imperial Currency Types</Title>
        <Paragraph className="text-noble-brown mb-6">
          The kingdom supports multiple currency types, each with specific purposes and exchange rates.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {currencyTypes.map((currency, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card 
                className="h-full border-2 border-imperial-gold bg-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                styles={{ body: { padding: '16px' } }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{currency.icon}</span>
                    <div>
                      <Title level={4} className="text-imperial-red font-imperial m-0">
                        {currency.type}
                      </Title>
                      <Tag color={currency.category === 'premium' ? 'gold' : 'blue'} className="mt-1">
                        {currency.category.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text strong className="text-noble-brown">Rate: {currency.exchangeRate}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      Max: {currency.maxStack}
                    </Text>
                  </div>
                </div>
                
                <Paragraph className="text-noble-brown text-sm mb-3">
                  {currency.description}
                </Paragraph>

                <div className="mb-3">
                  <Text strong className="text-imperial-red">Royal Usage:</Text>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currency.usage.map((use, idx) => (
                      <Tag key={idx} color="default" className="text-xs">
                        {use}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    {currency.tradable ? (
                      <Tag color="green" icon={<SwapOutlined />}>Tradable</Tag>
                    ) : (
                      <Tag color="red" icon={<SafetyCertificateOutlined />}>Non-Tradable</Tag>
                    )}
                  </div>
                  <Text type="secondary" className="text-xs">
                    {currency.currency_type}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Exchange Rates Section */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🔄 Royal Exchange Rates</Title>
        <Paragraph className="text-noble-brown mb-6">
          Controlled currency exchange with imperial fees and limits to maintain economic stability.
        </Paragraph>

        <Table
          dataSource={exchangeRates}
          pagination={false}
          className="mb-8 border border-imperial-gold"
          scroll={{ x: 800 }}
          columns={[
            {
              title: 'From Currency',
              dataIndex: 'from',
              key: 'from',
              render: (from) => (
                <div className="flex items-center">
                  <Text strong className="text-imperial-red">{from}</Text>
                </div>
              )
            },
            {
              title: 'To Currency',
              dataIndex: 'to',
              key: 'to',
              render: (to) => (
                <div className="flex items-center">
                  <ArrowDownOutlined className="text-imperial-red mr-2" />
                  <Text strong className="text-imperial-red">{to}</Text>
                </div>
              )
            },
            {
              title: 'Exchange Rate',
              dataIndex: 'rate',
              key: 'rate',
              render: (rate) => <Text strong className="text-noble-brown">{rate}</Text>
            },
            {
              title: 'Imperial Fee',
              dataIndex: 'fee',
              key: 'fee',
              render: (fee) => <Tag color="orange">{fee}</Tag>
            },
            {
              title: 'Min Amount',
              dataIndex: 'minAmount',
              key: 'minAmount'
            },
            {
              title: 'Max Amount',
              dataIndex: 'maxAmount',
              key: 'maxAmount'
            },
            {
              title: 'Status',
              dataIndex: 'enabled',
              key: 'enabled',
              render: (enabled) => 
                enabled ? 
                  <Tag color="green" icon={<SwapOutlined />}>Active</Tag> : 
                  <Tag color="red">Disabled</Tag>
            }
          ]}
        />

        {/* Transaction Types */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">📊 Royal Transaction Types</Title>
        <Paragraph className="text-noble-brown mb-6">
          Every financial movement in the kingdom is categorized and tracked for economic analysis.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {transactionTypes.map((transaction, index) => (
            <Col xs={24} md={12} key={index}>
              <Card className="border-2 border-imperial-gold bg-white h-full">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{transaction.icon}</span>
                  <Title level={4} className="text-imperial-red font-imperial m-0 capitalize">
                    {transaction.type}
                  </Title>
                </div>
                <Paragraph className="text-noble-brown mb-3">
                  {transaction.description}
                </Paragraph>
                <div>
                  <Text strong className="text-imperial-red">Examples:</Text>
                  <ul className="mt-1 ml-4 text-noble-brown">
                    {transaction.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Wallet Management */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">💼 Imperial Wallet Management</Title>
        
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={8}>
            <Statistic
              title="Total Currency Types"
              value={currencyTypes.length}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#8B0000' }}
              className="text-center"
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Active Exchanges"
              value={exchangeRates.filter(rate => rate.enabled).length}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#8B0000' }}
              className="text-center"
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Max Stack Size"
              value="999M"
              suffix="coins"
              valueStyle={{ color: '#8B0000' }}
              className="text-center"
            />
          </Col>
        </Row>

        {/* Implementation Example */}
        <Card 
          title="🏛️ Royal Implementation Example" 
          className="border-2 border-imperial-gold bg-noble-parchment mb-6"
          extra={<Tag color="red">SQL</Tag>}
        >
          <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            {`-- Create player wallet with multiple currencies
INSERT INTO game_economy.player_wallets (player_id, currency_type, amount) VALUES
  ('player_001', 'gold', 15000),
  ('player_001', 'diamond', 250),
  ('player_001', 'honor', 5000);

-- Record currency transaction
SELECT game_economy.add_currency(
  'player_001', 
  'gold', 
  1000, 
  'quest_reward', 
  'Completed Royal Quest: Dragon Slayer'
);

-- Exchange currency with imperial fees
SELECT game_economy.exchange_currency(
  'player_001',
  'gold',
  'diamond',
  1000
);`}
          </div>
        </Card>

        {/* Security Features */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">🛡️ Imperial Security Measures</Title>
        
        <Timeline
          className="mt-6"
          items={[
            {
              color: 'green',
              children: (
                <div>
                  <Text strong className="text-imperial-red">Transaction Integrity</Text>
                  <Paragraph className="text-noble-brown m-0">
                    All currency operations are wrapped in database transactions to prevent data corruption
                  </Paragraph>
                </div>
              ),
            },
            {
              color: 'blue',
              children: (
                <div>
                  <Text strong className="text-imperial-red">Audit Trail</Text>
                  <Paragraph className="text-noble-brown m-0">
                    Complete history of all currency movements with timestamps and sources
                  </Paragraph>
                </div>
              ),
            },
            {
              color: 'orange',
              children: (
                <div>
                  <Text strong className="text-imperial-red">Stack Limits</Text>
                  <Paragraph className="text-noble-brown m-0">
                    Maximum stack sizes prevent economic inflation and server overload
                  </Paragraph>
                </div>
              ),
            },
            {
              color: 'red',
              children: (
                <div>
                  <Text strong className="text-imperial-red">Anti-Exploit Checks</Text>
                  <Paragraph className="text-noble-brown m-0">
                    Real-time validation of currency amounts and exchange rates
                  </Paragraph>
                </div>
              ),
            },
          ]}
        />

        <Alert
          message="Royal Economic Advisory"
          description="Regular monitoring of currency flow and exchange rates is essential for maintaining a healthy imperial economy. Adjust fees and limits as needed to control inflation."
          type="warning"
          showIcon
          icon={<CrownOutlined />}
          className="mt-6 bg-yellow-50 border-yellow-200"
        />
      </div>
    </div>
  );
};

export default CurrencySystem;
