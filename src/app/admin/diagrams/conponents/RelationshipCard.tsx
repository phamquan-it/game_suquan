"use client"
import { Badge, Button, Card, Space, Tag, Typography } from "antd";
import styles from "../styles";
import { CloseCircleOutlined, LinkOutlined } from "@ant-design/icons";
const { Text } = Typography;

// Component hiển thị thông tin quan hệ
const RelationshipCard = ({ relationship, onClose }: any) => {
  if (!relationship) return null;

  const isRelated = relationship.relationship_exists;

  return (
    <Card
      style={styles.relationshipCard(isRelated)}
      title={
        <Space>
          <LinkOutlined style={{ color: isRelated ? '#2E8B57' : '#DC143C' }} />
          <Text strong>Chi tiết quan hệ</Text>
        </Space>
      }
      extra={
        <Button
          type="text"
          size="small"
          onClick={onClose}
          icon={<CloseCircleOutlined />}
        />
      }
    >
      {isRelated ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 0',
            background: '#F5F5DC',
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              {relationship.source_table}
            </Tag>
            <Text strong style={{ fontSize: 18, color: '#D4AF37' }}>→</Text>
            <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
              {relationship.target_table}
            </Tag>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12
          }}>
            <Badge color="blue" text={
              <code style={{
                background: '#F0F0F0',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 12
              }}>
                {relationship.source_column}
              </code>
            } />
            <Text type="secondary">⟷</Text>
            <Badge color="green" text={
              <code style={{
                background: '#F0F0F0',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 12
              }}>
                {relationship.target_column}
              </code>
            } />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag color={relationship.on_delete_action === 'CASCADE' ? 'red' : 'default'}>
              DELETE: {relationship.on_delete_action}
            </Tag>
            <Tag color={relationship.on_update_action === 'CASCADE' ? 'blue' : 'default'}>
              UPDATE: {relationship.on_update_action}
            </Tag>
          </div>

          {relationship.constraint_name && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Ràng buộc: {relationship.constraint_name}
              </Text>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CloseCircleOutlined style={{ fontSize: 40, color: '#DC143C', marginBottom: 8 }} />
          <Text type="secondary">Không có quan hệ giữa 2 bảng</Text>
        </div>
      )}
    </Card>
  );
};

export default RelationshipCard;
