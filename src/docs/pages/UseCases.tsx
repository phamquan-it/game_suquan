import React from 'react';
import { Typography, Card, Row, Col, Tag, Steps, Alert, Table, Timeline, Divider, Collapse } from 'antd';
import { 
  CrownOutlined, 
  GiftOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  RocketOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ShopOutlined,
  FireOutlined,
  StarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const UseCases: React.FC = () => {
  const playerProgressionCases = [
    {
      title: "New Player Onboarding",
      icon: "🎮",
      scenario: "Player joins the game for the first time",
      implementation: [
        "Starter loot box with guaranteed basic equipment",
        "Tutorial currency rewards (Gold: 1000, Silver: 5000)",
        "Progressive unlock of currency types as player levels up",
        "First-time bonus multipliers for initial purchases"
      ],
      sqlExample: `-- Grant starter rewards
SELECT game_economy.add_currency('new_player', 'gold', 1000, 'tutorial', 'Welcome to the Kingdom!');
SELECT game_economy.open_loot_box('new_player', 'starter_box_1');`,
      benefits: ["Smooth onboarding", "Immediate engagement", "Clear progression path"]
    },
    {
      title: "Daily Login Rewards",
      icon: "📅",
      scenario: "Player logs in consecutively",
      implementation: [
        "Streak-based reward scaling (Day 1: 100 gold, Day 7: 1000 gold + rare item)",
        "VIP players receive additional premium currency",
        "Monthly calendar with special rewards on 7th, 14th, 21st, 28th days",
        "Break streak protection after 3 days"
      ],
      sqlExample: `-- Check and reward daily login
SELECT game_economy.add_currency(
  player_id, 
  'gold', 
  CASE 
    WHEN current_streak = 7 THEN 1000 
    ELSE 100 * current_streak 
  END,
  'daily_login',
  'Daily login reward - Streak: ' || current_streak
);`,
      benefits: ["Player retention", "Consistent engagement", "Reward loyalty"]
    },
    {
      title: "Level Up Milestones",
      icon: "📈",
      scenario: "Player reaches significant level thresholds",
      implementation: [
        "Level 10: Unlock premium currency access",
        "Level 20: Special loot box with class-specific items",
        "Level 50: Legendary item selection chest",
        "VIP levels provide additional milestone rewards"
      ],
      sqlExample: `-- Level up reward system
CREATE TRIGGER level_up_rewards 
AFTER UPDATE OF player_level ON players
FOR EACH ROW 
WHEN (NEW.player_level > OLD.player_level)
EXECUTE FUNCTION grant_level_rewards();`,
      benefits: ["Progression satisfaction", "Clear goals", "Motivation to advance"]
    }
  ];

  const monetizationCases = [
    {
      title: "Premium Currency Purchase",
      icon: "💎",
      scenario: "Player buys diamonds with real money",
      implementation: [
        "Tiered packages with bonus diamonds at higher tiers",
        "First-purchase double diamonds bonus",
        "Limited-time discount packages",
        "VIP-exclusive currency bundles"
      ],
      sqlExample: `-- Process premium currency purchase
SELECT game_economy.add_currency(
  player_id, 
  'diamond', 
  base_amount + bonus_amount,
  'premium_purchase',
  'Purchased: ' || package_name
);`,
      revenueImpact: "High",
      playerSatisfaction: "High"
    },
    {
      title: "Limited-Time Event Boxes",
      icon: "🎪",
      scenario: "Seasonal event with exclusive items",
      implementation: [
        "Event-specific currency (snowflakes, pumpkins, etc.)",
        "Time-limited loot boxes with exclusive cosmetics",
        "Progressive event rewards for participation",
        "Event currency exchange after event ends"
      ],
      sqlExample: `-- Create event loot box
INSERT INTO game_economy.loot_boxes 
  (id, name, box_type, time_limited, available_from, available_until)
VALUES 
  ('winter_event_2024', 'Winter Mystery Box', 'event', true, 
   '2024-12-01 00:00:00', '2024-12-31 23:59:59');`,
      revenueImpact: "Very High",
      playerSatisfaction: "Very High"
    },
    {
      title: "Battle Pass System",
      icon: "🎯",
      scenario: "Tiered reward system over season",
      implementation: [
        "Free track with basic rewards",
        "Premium track with exclusive items and currency",
        "Accelerated progression for VIP players",
        "Last-chance purchases before season end"
      ],
      sqlExample: `-- Battle pass reward distribution
SELECT game_economy.add_currency(
  player_id,
  CASE 
    WHEN tier <= 20 THEN 'gold'
    WHEN tier <= 40 THEN 'diamond' 
    ELSE 'crystal'
  END,
  calculate_battle_pass_reward(tier, is_premium),
  'battle_pass',
  'Season 5 Tier ' || tier || ' Reward'
);`,
      revenueImpact: "Consistent",
      playerSatisfaction: "High"
    }
  ];

  const socialEconomyCases = [
    {
      title: "Guild Treasury Management",
      icon: "🏰",
      scenario: "Guild collects and manages shared resources",
      implementation: [
        "Guild currency earned through collective activities",
        "Tiered guild vault with withdrawal permissions",
        "Guild-specific loot boxes for member contributions",
        "Tax system for guild market transactions"
      ],
      sqlExample: `-- Guild currency distribution
UPDATE game_economy.player_wallets 
SET amount = amount + (guild_contribution * 0.1)
WHERE player_id IN (SELECT member_id FROM guild_members WHERE guild_id = ?);`,
      socialImpact: "Strengthens community bonds"
    },
    {
      title: "Player Trading System",
      icon: "🤝",
      scenario: "Players exchange items and currency",
      implementation: [
        "Secure trade window with confirmation",
        "Trade history and reputation system",
        "Anti-fraud measures and trade limits",
        "Taxation on high-value trades"
      ],
      sqlExample: `-- Process player trade
BEGIN TRANSACTION;
  UPDATE game_economy.player_wallets SET amount = amount - trade_amount WHERE player_id = 'player_a';
  UPDATE game_economy.player_wallets SET amount = amount + trade_amount WHERE player_id = 'player_b';
  INSERT INTO trade_logs (player_a, player_b, items, currency, timestamp) VALUES (...);
COMMIT;`,
      socialImpact: "Encourages player interaction"
    },
    {
      title: "Arena Reward Distribution",
      icon: "⚔️",
      scenario: "PvP season rewards based on ranking",
      implementation: [
        "Tier-based honor point rewards",
        "Season-end legendary rewards for top players",
        "Participation rewards for all competitors",
        "Special titles and cosmetics for rank achievements"
      ],
      sqlExample: `-- End of season rewards
SELECT game_economy.add_currency(
  player_id,
  'honor',
  base_honor + (ranking_bonus * 100),
  'arena_season',
  'Season ' || season_number || ' - Rank: ' || player_rank
);`,
      socialImpact: "Competitive engagement"
    }
  ];

  const technicalImplementationCases = [
    {
      title: "High-Frequency Microtransactions",
      icon: "⚡",
      challenge: "Processing thousands of small transactions simultaneously",
      solution: [
        "Batch processing for small currency additions",
        "Redis caching for wallet balances",
        "Asynchronous transaction logging",
        "Database connection pooling"
      ],
      codeExample: `-- Batch microtransactions
WITH batch_updates AS (
  SELECT player_id, SUM(amount) as total_amount 
  FROM microtransactions_batch 
  WHERE processed = false 
  GROUP BY player_id
)
UPDATE game_economy.player_wallets pw
SET amount = pw.amount + bu.total_amount
FROM batch_updates bu
WHERE pw.player_id = bu.player_id;`,
      performance: "Optimized for 10k+ TPS"
    },
    {
      title: "Economy-Wide Balance Adjustments",
      icon: "⚖️",
      challenge: "Adjusting exchange rates without disrupting economy",
      solution: [
        "Gradual rate changes over time",
        "Player notification system for major changes",
        "Compensation for affected transactions",
        "A/B testing for new economic policies"
      ],
      codeExample: `-- Gradual exchange rate adjustment
UPDATE game_economy.exchange_rates 
SET rate = rate * 0.95, 
    updated_at = NOW()
WHERE from_currency = 'gold' 
AND to_currency = 'diamond'
AND enabled = true;`,
      performance: "Controlled economic impact"
    },
    {
      title: "Real-Time Anti-Exploit Monitoring",
      icon: "🛡️",
      challenge: "Detecting and preventing currency exploits",
      solution: [
        "Anomaly detection in transaction patterns",
        "Rate limiting per player and IP",
        "Automated rollback for suspicious activities",
        "Real-time alert system for administrators"
      ],
      codeExample: `-- Detect anomalous transactions
SELECT player_id, COUNT(*) as transaction_count, SUM(amount) as total_amount
FROM game_economy.currency_transactions 
WHERE timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY player_id 
HAVING SUM(amount) > 1000000 OR COUNT(*) > 100;`,
      performance: "Sub-second detection"
    }
  ];

  const advancedScenarios = [
    {
      title: "Dynamic Pricing Strategy",
      description: "Adjust loot box prices based on demand and player engagement",
      steps: [
        "Monitor open rates for each loot box type",
        "Adjust prices using machine learning algorithms",
        "Implement limited-time discounts during low-engagement periods",
        "Personalize offers based on player spending history"
      ],
      outcome: "15-30% increase in conversion rates"
    },
    {
      title: "Cross-Promotion Economy",
      description: "Integrate currency systems across multiple games",
      steps: [
        "Create universal premium currency valid across game portfolio",
        "Implement cross-game reward systems",
        "Allow currency transfers between linked games",
        "Shared battle pass progression"
      ],
      outcome: "25% higher player retention across portfolio"
    },
    {
      title: "Player-Driven Economy",
      description: "Enable player-created content with economic value",
      steps: [
        "Player-to-player item trading with commission",
        "User-generated content marketplace",
        "Player-run shops with rental systems",
        "Community event funding pools"
      ],
      outcome: "Emergent gameplay and sustainable economy"
    }
  ];

  return (
    <div className="p-6">
      <div className="p-6 rounded-lg imperial-border parchment-bg">
        <Title level={1} className="text-imperial-red font-imperial text-center">🎯 Royal Use Cases & Decrees</Title>
        <Paragraph className="text-noble-brown text-center text-lg">
          Practical implementations of the imperial economy system across various gaming scenarios
        </Paragraph>

        <Alert
          message="Imperial Implementation Guide"
          description="Each use case includes detailed implementation steps, SQL examples, and expected outcomes for royal approval."
          type="info"
          showIcon
          icon={<CrownOutlined />}
          className="mb-6 bg-blue-50 border-blue-200"
        />

        {/* Player Progression Use Cases */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2 mt-8">
          <RocketOutlined className="mr-2" />
          Player Progression & Retention
        </Title>
        <Paragraph className="text-noble-brown mb-6">
          Strategic implementations to guide players through their imperial journey and maintain long-term engagement.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {playerProgressionCases.map((useCase, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card 
                className="h-full border-2 border-imperial-gold bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
                title={
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{useCase.icon}</span>
                    <Text strong className="text-imperial-red">{useCase.title}</Text>
                  </div>
                }
                extra={<Tag color="blue">Retention</Tag>}
              >
                <div className="mb-4">
                  <Text strong className="text-imperial-red">Scenario:</Text>
                  <Paragraph className="text-noble-brown m-0 mt-1">
                    {useCase.scenario}
                  </Paragraph>
                </div>

                <div className="mb-4">
                  <Text strong className="text-imperial-red">Implementation:</Text>
                  <ul className="text-noble-brown mt-1 ml-4">
                    {useCase.implementation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Collapse ghost size="small" className="bg-transparent">
                  <Panel header="SQL Implementation" key="sql">
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      {useCase.sqlExample}
                    </div>
                  </Panel>
                </Collapse>

                <div className="mt-4">
                  <Text strong className="text-imperial-red">Benefits:</Text>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {useCase.benefits.map((benefit, idx) => (
                      <Tag key={idx} color="green" className="text-xs">
                        {benefit}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Monetization Use Cases */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">
          <DollarOutlined className="mr-2" />
          Royal Revenue Generation
        </Title>
        <Paragraph className="text-noble-brown mb-6">
          Monetization strategies that provide value to players while supporting the kingdom&apos;s treasury.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {monetizationCases.map((useCase, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card 
                className="h-full border-2 border-imperial-gold bg-white"
                title={
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{useCase.icon}</span>
                    <Text strong className="text-imperial-red">{useCase.title}</Text>
                  </div>
                }
                extra={<Tag color="gold">Revenue</Tag>}
              >
                <Paragraph className="text-noble-brown mb-3">
                  {useCase.scenario}
                </Paragraph>

                <div className="mb-3">
                  <Text strong className="text-imperial-red">Features:</Text>
                  <ul className="text-noble-brown text-sm mt-1 ml-4">
                    {useCase.implementation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-green-50 rounded border">
                    <Text strong className="text-imperial-red">Revenue Impact</Text>
                    <br />
                    <Tag color={useCase.revenueImpact === 'Very High' ? 'red' : 'green'}>
                      {useCase.revenueImpact}
                    </Tag>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded border">
                    <Text strong className="text-imperial-red">Player Satisfaction</Text>
                    <br />
                    <Tag color={useCase.playerSatisfaction === 'Very High' ? 'gold' : 'blue'}>
                      {useCase.playerSatisfaction}
                    </Tag>
                  </div>
                </div>

                <Collapse ghost size="small">
                  <Panel header="View SQL Code" key="sql">
                    <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs overflow-x-auto">
                      {useCase.sqlExample}
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Social Economy Use Cases */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">
          <TeamOutlined className="mr-2" />
          Social & Community Economy
        </Title>
        <Paragraph className="text-noble-brown mb-6">
          Systems that encourage player interaction and build strong community bonds within the kingdom.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {socialEconomyCases.map((useCase, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card 
                className="h-full border-2 border-imperial-gold bg-white"
                title={
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{useCase.icon}</span>
                    <Text strong className="text-imperial-red">{useCase.title}</Text>
                  </div>
                }
                extra={<Tag color="purple">Social</Tag>}
              >
                <Paragraph className="text-noble-brown mb-3">
                  {useCase.scenario}
                </Paragraph>

                <div className="mb-3">
                  <Text strong className="text-imperial-red">Mechanics:</Text>
                  <ul className="text-noble-brown text-sm mt-1 ml-4">
                    {useCase.implementation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-center p-2 bg-purple-50 rounded border mt-3">
                  <Text strong className="text-imperial-red">Community Impact</Text>
                  <br />
                  <Text className="text-noble-brown">{useCase.socialImpact}</Text>
                </div>

                <Collapse ghost size="small" className="mt-2">
                  <Panel header="Technical Implementation" key="sql">
                    <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs overflow-x-auto">
                      {useCase.sqlExample}
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Technical Implementation Cases */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">
          <SafetyCertificateOutlined className="mr-2" />
          Technical Implementation Scenarios
        </Title>
        <Paragraph className="text-noble-brown mb-6">
          Advanced technical scenarios demonstrating the system&apos;s capability to handle complex requirements.
        </Paragraph>

        <Row gutter={[16, 16]} className="mb-8">
          {technicalImplementationCases.map((useCase, index) => (
            <Col xs={24} key={index}>
              <Card 
                className="border-2 border-imperial-gold bg-white"
                title={
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{useCase.icon}</span>
                    <Text strong className="text-imperial-red">{useCase.title}</Text>
                  </div>
                }
                extra={<Tag color="cyan">Technical</Tag>}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <Text strong className="text-imperial-red">Challenge:</Text>
                    <Paragraph className="text-noble-brown mt-1">
                      {useCase.challenge}
                    </Paragraph>
                  </div>
                  <div>
                    <Text strong className="text-imperial-red">Solution:</Text>
                    <ul className="text-noble-brown mt-1 ml-4">
                      {useCase.solution.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Text strong className="text-imperial-red">Performance:</Text>
                    <div className="text-center p-3 bg-cyan-50 rounded border mt-1">
                      <Text strong className="text-imperial-red text-lg">
                        {useCase.performance}
                      </Text>
                    </div>
                  </div>
                </div>

                <Collapse ghost className="mt-3">
                  <Panel header="View Implementation Code" key="code">
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      {useCase.codeExample}
                    </div>
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Advanced Scenarios */}
        <Title level={2} className="text-imperial-red font-imperial border-b border-imperial-gold pb-2">
          <TrophyOutlined className="mr-2" />
          Advanced Royal Strategies
        </Title>
        <Paragraph className="text-noble-brown mb-6">
          Cutting-edge economic strategies for maximizing engagement and revenue in competitive markets.
        </Paragraph>

        <Row gutter={[16, 16]}>
          {advancedScenarios.map((scenario, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card 
                className="h-full border-2 border-imperial-gold bg-gradient-to-br from-noble-parchment to-amber-50"
                title={
                  <Text strong className="text-imperial-red text-lg">
                    {scenario.title}
                  </Text>
                }
              >
                <Paragraph className="text-noble-brown mb-4">
                  {scenario.description}
                </Paragraph>

                <div className="mb-4">
                  <Text strong className="text-imperial-red">Implementation Steps:</Text>
                  <Timeline
                    size="small"
                    items={scenario.steps.map((step, idx) => ({
                      color: 'green',
                      children: <Text className="text-noble-brown text-sm">{step}</Text>
                    }))}
                  />
                </div>

                <div className="text-center p-2 bg-gradient-to-r from-imperial-gold to-yellow-400 rounded border">
                  <Text strong className="text-imperial-red text-lg">
                    Expected Outcome: {scenario.outcome}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Implementation Timeline */}
        <Card 
          title="🏛️ Royal Implementation Roadmap" 
          className="border-2 border-imperial-gold bg-white mt-8"
          extra={<Tag color="red">Strategic</Tag>}
        >
          <Timeline
            mode="alternate"
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <Text strong className="text-imperial-red">Phase 1: Foundation (Weeks 1-2)</Text>
                    <Paragraph className="text-noble-brown m-0">
                      Implement core currency system and basic loot boxes
                    </Paragraph>
                  </div>
                ),
              },
              {
                color: 'blue',
                children: (
                  <div>
                    <Text strong className="text-imperial-red">Phase 2: Engagement (Weeks 3-4)</Text>
                    <Paragraph className="text-noble-brown m-0">
                      Add daily rewards, progression systems, and social features
                    </Paragraph>
                  </div>
                ),
              },
              {
                color: 'orange',
                children: (
                  <div>
                    <Text strong className="text-imperial-red">Phase 3: Monetization (Weeks 5-6)</Text>
                    <Paragraph className="text-noble-brown m-0">
                      Implement premium currency, battle pass, and limited-time events
                    </Paragraph>
                  </div>
                ),
              },
              {
                color: 'red',
                children: (
                  <div>
                    <Text strong className="text-imperial-red">Phase 4: Optimization (Weeks 7-8)</Text>
                    <Paragraph className="text-noble-brown m-0">
                      Add analytics, A/B testing, and performance optimizations
                    </Paragraph>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Alert
          message="Royal Success Metrics"
          description="Monitor these key metrics: Daily Active Users, Average Revenue Per User, Player Retention Rates, and Economic Balance Indicators."
          type="success"
          showIcon
          icon={<CrownOutlined />}
          className="mt-6 bg-green-50 border-green-200"
        />
      </div>
    </div>
  );
};

export default UseCases;
