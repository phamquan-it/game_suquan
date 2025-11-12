import { Card, Typography, Collapse, Tag, Row, Col, Alert } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function APIIntegration() {
  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/items',
      description: 'Lấy danh sách items với filtering và pagination',
      parameters: [
        { name: 'type', type: 'string', required: false, description: 'Filter by item type' },
        { name: 'rarity', type: 'string', required: false, description: 'Filter by rarity' },
        { name: 'page', type: 'number', required: false, description: 'Page number' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page' },
      ],
      example: `// TypeScript interface
interface GetItemsParams {
  type?: ItemType;
  rarity?: ItemRarity;
  page?: number;
  limit?: number;
}

// Example request
const response = await fetch('/api/items?type=weapon&rarity=epic&page=1&limit=20');
const data = await response.json();`
    },
    {
      method: 'GET',
      path: '/api/items/{id}',
      description: 'Lấy chi tiết item cụ thể',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Item ID' },
      ],
      example: `// Example request
const response = await fetch('/api/items/sword_of_legends');
const item = await response.json();

// Response includes equipment data if applicable
console.log(item.equipment?.attack); // 150
console.log(item.equipment?.sockets); // [{gem: 'ruby', bonus: 'fire_damage'}]`
    },
    {
      method: 'POST',
      path: '/api/items',
      description: 'Tạo item mới (admin only)',
      parameters: [
        { name: 'item', type: 'BaseItem', required: true, description: 'Item data' },
      ],
      example: `// TypeScript interface
interface CreateItemRequest {
  item: Omit<BaseItem, 'id' | 'createdAt' | 'updatedAt'>;
}

// Example request
const newItem = {
  name: "Dragon Slayer Sword",
  type: "weapon",
  rarity: "legendary",
  // ... other properties
};

const response = await fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ item: newItem })
});`
    },
  ];

  const typeScriptInterfaces = `// Core Item Interfaces
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type ItemType = "weapon" | "armor" | "consumable" | "material" | "quest" | "special" | "currency";
export type ItemQuality = "broken" | "damaged" | "normal" | "good" | "excellent" | "perfect";

export interface BaseItem {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    quality: ItemQuality;
    levelRequirement: number;
    stackable: boolean;
    maxStack: number;
    baseValue: number;
    icon: string;
    isTradable: boolean;
    isSellable: boolean;
    isDestroyable: boolean;
    isQuestItem: boolean;
    createdAt: string;
    updatedAt: string;
    status: "active" | "inactive" | "testing";
}

export interface EquipmentItem extends BaseItem {
    type: "weapon" | "armor";
    slot: EquipmentSlot;
    durability: { current: number; max: number };
    attributes: {
        attack?: number;
        defense?: number;
        health?: number;
        // ... other attributes
    };
}`;

  return (
    <div>
      <Title level={2}>🔗 API Integration</Title>

      <Alert
        message="RESTful API Design"
        description="Tất cả endpoints đều tuân theo RESTful principles với proper HTTP methods và status codes"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* API Endpoints */}
      <Title level={3}>📡 API Endpoints</Title>
      <Collapse defaultActiveKey={['0']}>
        {apiEndpoints.map((endpoint, index) => (
          <Panel 
            header={
              <div>
                <Tag color={endpoint.method === 'GET' ? 'blue' : 'green'}>
                  {endpoint.method}
                </Tag>
                <Text strong>{endpoint.path}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {endpoint.description}
                </Text>
              </div>
            } 
            key={index}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>Parameters:</Text>
                <ul>
                  {endpoint.parameters.map((param, paramIndex) => (
                    <li key={paramIndex}>
                      <Text code>{param.name}</Text> 
                      <Tag color={param.required ? 'red' : 'default'} >
                        {param.required ? 'required' : 'optional'}
                      </Tag>
                      - {param.description} ({param.type})
                    </li>
                  ))}
                </ul>
              </Col>
              <Col span={24}>
                <Text strong>Example:</Text>
                <SyntaxHighlighter language="typescript" style={atomDark}>
                  {endpoint.example}
                </SyntaxHighlighter>
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>

      {/* TypeScript Integration */}
      <Title level={3} style={{ marginTop: 24 }}>📘 TypeScript Integration</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card size="small">
            <Paragraph>
              Full TypeScript support với auto-completion và type checking. 
              Tất cả interfaces đều available cho frontend và backend.
            </Paragraph>
            <SyntaxHighlighter language="typescript" style={atomDark}>
              {typeScriptInterfaces}
            </SyntaxHighlighter>
          </Card>
        </Col>
      </Row>

      {/* Response Examples */}
      <Title level={3} style={{ marginTop: 24 }}>📄 Response Examples</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="✅ Success Response" size="small">
            <SyntaxHighlighter language="json" style={atomDark}>
{`{
  "success": true,
  "data": {
    "id": "sword_of_legends",
    "name": "Sword of Legends",
    "type": "weapon",
    "rarity": "legendary",
    "equipment": {
      "attack": 150,
      "critical_chance": 0.15
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </SyntaxHighlighter>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="❌ Error Response" size="small">
            <SyntaxHighlighter language="json" style={atomDark}>
{`{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item with ID 'invalid_id' not found",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </SyntaxHighlighter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
