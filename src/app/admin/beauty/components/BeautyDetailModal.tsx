'use client';

import { Modal, Descriptions, Image, Tabs, List, Tag, Space, Progress, Card, Row, Col } from 'antd';
import { BeautyCharacterWithRelations } from '../types';
import { BeautySkills } from './BeautySkills';
import { BeautyJewelry } from './BeautyJewelry';
import { BeautyCostumes } from './BeautyCostumes';

const { TabPane } = Tabs;

interface BeautyDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  beauty: BeautyCharacterWithRelations | null;
}

export function BeautyDetailModal({ visible, onCancel, beauty }: BeautyDetailModalProps) {
  if (!beauty) return null;

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#CD7F32',
      rare: '#1E90FF',
      epic: '#800080',
      legendary: '#D4AF37',
    };
    return colors[rarity as keyof typeof colors] || '#CD7F32';
  };

  return (
    <Modal
      title={`${beauty.name} - ${beauty.title}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Card style={{ textAlign: 'center' }}>
                <Image
                  src={beauty.full_image}
                  alt={beauty.name}
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
                <Tag 
                  color={getRarityColor(beauty.rarity)}
                  style={{ marginTop: 16, fontSize: 16, padding: '4px 12px' }}
                >
                  {beauty.rarity.toUpperCase()}
                </Tag>
              </Card>
            </Col>
            <Col span={16}>
              <Card>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Level" span={2}>
                    <Progress 
                      percent={Math.round((beauty.level / beauty.max_level) * 100)} 
                      format={() => `${beauty.level}/${beauty.max_level}`}
                      strokeColor="#8B0000"
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Experience">{beauty.experience}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={beauty.status === 'available' ? '#2E8B57' : '#FF8C00'}>
                      {beauty.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Charm">{beauty.charm}</Descriptions.Item>
                  <Descriptions.Item label="Intelligence">{beauty.intelligence}</Descriptions.Item>
                  <Descriptions.Item label="Diplomacy">{beauty.diplomacy}</Descriptions.Item>
                  <Descriptions.Item label="Intrigue">{beauty.intrigue}</Descriptions.Item>
                  <Descriptions.Item label="Loyalty">{beauty.loyalty}</Descriptions.Item>
                  <Descriptions.Item label="Mission Success Rate" span={2}>
                    {beauty.mission_success_rate ? `${beauty.mission_success_rate}%` : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Acquired" span={2}>
                    {new Date(beauty.acquisition_date).toLocaleDateString()}
                  </Descriptions.Item>
                  {beauty.last_used && (
                    <Descriptions.Item label="Last Used" span={2}>
                      {new Date(beauty.last_used).toLocaleDateString()}
                    </Descriptions.Item>
                  )}
                  {beauty.description && (
                    <Descriptions.Item label="Description" span={2}>
                      {beauty.description}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Skills" key="2">
          <BeautySkills characterId={beauty.id} skills={beauty.skills || []} />
        </TabPane>

        <TabPane tab="Jewelry" key="3">
          <BeautyJewelry characterId={beauty.id} jewelry={beauty.jewelry || []} />
        </TabPane>

        <TabPane tab="Costumes" key="4">
          <BeautyCostumes characterId={beauty.id} costumes={beauty.costumes || []} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
