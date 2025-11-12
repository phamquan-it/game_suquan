'use client';

import { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Progress, Steps, Alert, Statistic, List } from 'antd';
import { ToolOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface CraftingRecipe {
  id: string;
  name: string;
  resultItem: string;
  resultQuantity: number;
  ingredients: { itemId: string; quantity: number; name: string; available: boolean }[];
  requiredLevel: number;
  craftingTime: number;
  successRate: number;
  experience: number;
}

export default function CraftingExamples() {
  const [selectedRecipe, setSelectedRecipe] = useState<string>('dragon_sword');
  const [craftingProgress, setCraftingProgress] = useState<number>(0);
  const [craftingResult, setCraftingResult] = useState<'success' | 'failure' | null>(null);
  const [isCrafting, setIsCrafting] = useState<boolean>(false);

  const mockRecipes: { [key: string]: CraftingRecipe } = {
    dragon_sword: {
      id: 'dragon_sword',
      name: 'Dragon Slayer Sword',
      resultItem: 'Dragon Slayer Greatsword',
      resultQuantity: 1,
      ingredients: [
        { itemId: 'dragon_scale', quantity: 5, name: 'Dragon Scale', available: true },
        { itemId: 'mithril_bar', quantity: 10, name: 'Mithril Bar', available: true },
        { itemId: 'ancient_wood', quantity: 3, name: 'Ancient Wood', available: false },
        { itemId: 'fire_crystal', quantity: 2, name: 'Fire Crystal', available: true },
      ],
      requiredLevel: 75,
      craftingTime: 300, // 5 minutes
      successRate: 0.65,
      experience: 2500,
    },
    phoenix_armor: {
      id: 'phoenix_armor',
      name: 'Phoenix Plate Armor',
      resultItem: 'Phoenix Plate Armor',
      resultQuantity: 1,
      ingredients: [
        { itemId: 'phoenix_feather', quantity: 3, name: 'Phoenix Feather', available: true },
        { itemId: 'adamantite_bar', quantity: 8, name: 'Adamantite Bar', available: true },
        { itemId: 'sun_crystal', quantity: 1, name: 'Sun Crystal', available: true },
      ],
      requiredLevel: 68,
      craftingTime: 240, // 4 minutes
      successRate: 0.75,
      experience: 1800,
    },
    healing_potion: {
      id: 'healing_potion',
      name: 'Greater Healing Potion',
      resultItem: 'Greater Healing Potion',
      resultQuantity: 5,
      ingredients: [
        { itemId: 'herb_heal', quantity: 3, name: 'Healing Herb', available: true },
        { itemId: 'crystal_water', quantity: 2, name: 'Crystal Water', available: true },
        { itemId: 'empty_vial', quantity: 5, name: 'Empty Vial', available: true },
      ],
      requiredLevel: 25,
      craftingTime: 60, // 1 minute
      successRate: 0.90,
      experience: 150,
    },
  };

  const startCrafting = () => {
    setIsCrafting(true);
    setCraftingProgress(0);
    setCraftingResult(null);

    const interval = setInterval(() => {
      setCraftingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate success/failure based on success rate
          const success = Math.random() < mockRecipes[selectedRecipe].successRate;
          setCraftingResult(success ? 'success' : 'failure');
          setIsCrafting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const currentRecipe = mockRecipes[selectedRecipe];

  return (
    <div>
      <Title level={2}>🔨 Crafting System Examples</Title>

      <Row gutter={[24, 24]}>
        {/* Recipe Selection */}
        <Col xs={24} lg={12}>
          <Card title="📋 Available Recipes">
            <List
              dataSource={Object.values(mockRecipes)}
              renderItem={recipe => (
                <List.Item
                  actions={[
                    <Button 
                        key={1}
                      type={selectedRecipe === recipe.id ? 'primary' : 'default'}
                      onClick={() => setSelectedRecipe(recipe.id)}
                    >
                      Select
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <Text strong>{recipe.name}</Text>
                        <Tag color="blue" style={{ marginLeft: 8 }}>Lv. {recipe.requiredLevel}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>Creates: {recipe.resultItem} ×{recipe.resultQuantity}</div>
                        <div>Success: {(recipe.successRate * 100).toFixed(0)}%</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recipe Details */}
        <Col xs={24} lg={12}>
          <Card title="📖 Recipe Details">
            <div style={{ marginBottom: 16 }}>
              <Text strong>Result: </Text>
              <Text>{currentRecipe.resultItem} ×{currentRecipe.resultQuantity}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Requirements: </Text>
              <div>
                <Tag color="blue">Crafting Level {currentRecipe.requiredLevel}+</Tag>
                <Tag color="orange">{currentRecipe.craftingTime}s crafting time</Tag>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Ingredients:</Text>
              <List
                size="small"
                dataSource={currentRecipe.ingredients}
                renderItem={ingredient => (
                  <List.Item>
                    <span style={{ color: ingredient.available ? 'inherit' : '#ff4d4f' }}>
                      {ingredient.name} ×{ingredient.quantity}
                    </span>
                    {ingredient.available ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    )}
                  </List.Item>
                )}
              />
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Success Rate"
                  value={currentRecipe.successRate * 100}
                  suffix="%"
                  valueStyle={{ color: currentRecipe.successRate > 0.7 ? '#3f8600' : '#cf1322' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Experience"
                  value={currentRecipe.experience}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Crafting Process */}
      <Card title="⚙️ Crafting Process" style={{ marginTop: 24 }}>
        <Steps current={isCrafting ? 1 : craftingResult ? 2 : 0} style={{ marginBottom: 24 }}>
          <Step title="Preparation" description="Gather ingredients" />
          <Step title="Crafting" description="In progress..." />
          <Step title="Completion" description="Get results" />
        </Steps>

        {isCrafting && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Progress 
              percent={craftingProgress} 
              status="active"
              style={{ maxWidth: 400, margin: '0 auto' }}
            />
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              Crafting in progress... {craftingProgress}%
            </Paragraph>
          </div>
        )}

        {craftingResult && (
          <Alert
            message={craftingResult === 'success' ? 'Crafting Successful!' : 'Crafting Failed'}
            description={
              craftingResult === 'success' 
                ? `You successfully crafted ${currentRecipe.resultItem} and gained ${currentRecipe.experience} experience!`
                : 'The crafting attempt failed. Some materials may be lost.'
            }
            type={craftingResult === 'success' ? 'success' : 'error'}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            icon={<ToolOutlined />} 
            size="large"
            onClick={startCrafting}
            loading={isCrafting}
            disabled={isCrafting || !currentRecipe.ingredients.every(i => i.available)}
          >
            Start Crafting
          </Button>
        </div>
      </Card>

      {/* SQL Query Examples */}
      <Card title="💡 Crafting SQL Queries" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Get Recipe Ingredients:</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              marginTop: 8
            }}>
{`SELECT 
  ri.item_id,
  ri.quantity,
  bi.name as ingredient_name
FROM items.recipe_ingredients ri
JOIN items.base_items bi ON ri.item_id = bi.id
WHERE ri.recipe_id = 'dragon_sword'
ORDER BY ri.ingredient_order;`}
            </pre>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Player Crafting Recipes:</Text>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              marginTop: 8
            }}>
{`SELECT 
  cr.*,
  bi.name as result_item_name
FROM items.crafting_recipes cr
JOIN items.base_items bi ON cr.result_item_id = bi.id
WHERE cr.required_level <= 75  -- Player's crafting level
  AND cr.is_active = true
ORDER BY cr.required_level DESC, cr.success_rate DESC;`}
            </pre>
          </Col>
        </Row>
      </Card>

      {/* Material Sources */}
      <Card title="📦 Material Sources" style={{ marginTop: 24 }}>
        <Table
          dataSource={[
            { material: 'Dragon Scale', source: 'Dragon Lair', dropRate: '2%', bestLocation: 'Volcanic Cave' },
            { material: 'Mithril Bar', source: 'Mining/Smelting', dropRate: '15%', bestLocation: 'Mithril Mine' },
            { material: 'Ancient Wood', source: 'Woodcutting', dropRate: '8%', bestLocation: 'Elder Forest' },
            { material: 'Fire Crystal', source: 'Mining/Crafting', dropRate: '5%', bestLocation: 'Crystal Cavern' },
          ]}
          pagination={false}
          size="small"
          columns={[
            { title: 'Material', dataIndex: 'material', key: 'material' },
            { title: 'Source', dataIndex: 'source', key: 'source' },
            { 
              title: 'Drop Rate', 
              dataIndex: 'dropRate', 
              key: 'dropRate',
              render: (rate: string) => <Tag color="blue">{rate}</Tag>
            },
            { title: 'Best Location', dataIndex: 'bestLocation', key: 'bestLocation' },
          ]}
        />
      </Card>
    </div>
  );
}
