import { Alert, Avatar, Badge, Button, Card, Col, Descriptions, Divider, Drawer, Empty, Row, Space, Spin, Tag, Timeline, Tooltip, Typography } from "antd";
import { StoryScene, TYPING_STYLES } from "../../../hooks/useStoryScenes";
import { BranchesOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FileTextOutlined, FlagOutlined, FontSizeOutlined, LinkOutlined, PictureOutlined, SoundOutlined, TagOutlined, WarningOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import dayjs from 'dayjs';
const { Text, Title } = Typography;
// Scene Detail Drawer
export const SceneDetailDrawer: React.FC<{
  visible: boolean;
  scene: StoryScene | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (scene: StoryScene) => void;
}> = ({ visible, scene, loading, onClose, onEdit }) => {
  if (!scene) return null;

  const typingStyleInfo = TYPING_STYLES.find(s => s.value === scene.typing_style);

  return (
    <Drawer
      title={
        <Space>
          <FileTextOutlined style={{ color: '#8B0000' }} />
          <span>Scene #{scene.scene_order} Details</span>
        </Space>
      }
      placement="right"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(scene)}>
          Edit Scene
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Scene Order" span={2}>
            <Tag color="blue">{scene.scene_order}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Speaker" span={2}>
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: scene.speaker?.color || '#ccc' }}
              >
                {scene.speaker?.name?.[0] || '?'}
              </Avatar>
              <Text style={{ color: scene.speaker?.color }}>
                {scene.speaker?.name || 'Unknown'}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Dialog" span={2}>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {scene.dialog_text}
            </Paragraph>
          </Descriptions.Item>

          {/* New Fields */}
          <Descriptions.Item label="End Story" span={1}>
            {scene.is_end_story ? (
              <Tag icon={<FlagOutlined />} color="orange">Yes</Tag>
            ) : (
              <Tag color="default">No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Failed Story" span={1}>
            {scene.is_failed_story ? (
              <Tag icon={<WarningOutlined />} color="red">Yes</Tag>
            ) : (
              <Tag color="default">No</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Active Scene Name" span={2}>
            {scene.active_scene_name ? (
              <Tag icon={<TagOutlined />} color="green">
                {scene.active_scene_name}
              </Tag>
            ) : (
              <Tag color="default">Not set</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Failure Scene Name" span={2}>
            {scene.failure_scene_name ? (
              <Tag icon={<WarningOutlined />} color="red">
                {scene.failure_scene_name}
              </Tag>
            ) : (
              <Tag color="default">Not set</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Typing Style" span={2}>
            {scene.typing_style ? (
              <Tooltip title={typingStyleInfo?.description}>
                <Tag icon={<FontSizeOutlined />} color="cyan">
                  {typingStyleInfo?.label || scene.typing_style}
                </Tag>
              </Tooltip>
            ) : (
              <Tag color="default">Default</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Background" span={1}>
            {scene.background ? (
              <Tag icon={<PictureOutlined />} color="purple">
                {scene.background}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Sound Effect" span={1}>
            {scene.sound_effect ? (
              <Tag icon={<SoundOutlined />} color="cyan">
                {scene.sound_effect}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={2}>
            {dayjs(scene.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="Story" span={2}>
            <LinkOutlined /> {scene.story?.title || 'Unknown'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div>
          <Space style={{ marginBottom: 16 }}>
            <BranchesOutlined style={{ color: '#8B0000' }} />
            <Title level={5} style={{ margin: 0 }}>Choices</Title>
            <Badge count={scene.choices?.length || 0} showZero color="#2E8B57" />
          </Space>

          {scene.choices && scene.choices.length > 0 ? (
            <Timeline
              items={scene.choices.map((choice) => ({
                color: choice.next_scene_id ? '#2E8B57' : '#DC143C',
                dot: choice.next_scene_id ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                ),
                children: (
                  <Card size="small" style={{ marginBottom: 8 }}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Space>
                          <Tag color="purple">Choice {choice.choice_order}</Tag>
                          <Tag color={choice.next_scene_id ? 'green' : 'red'}>
                            {choice.next_scene_id ? 'Has Next Scene' : 'End Branch'}
                          </Tag>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Text strong>Text: </Text>
                        <Text>{choice.choice_text}</Text>
                      </Col>
                      <Col span={24}>
                        <Text strong>Effect: </Text>
                        <Text>{choice.effect_text}</Text>
                      </Col>
                      {choice.stats_change && Object.keys(choice.stats_change).length > 0 && (
                        <Col span={24}>
                          <Text strong>Stats Change: </Text>
                          <pre style={{ margin: 0, fontSize: 12 }}>
                            {JSON.stringify(choice.stats_change, null, 2)}
                          </pre>
                        </Col>
                      )}
                      {choice.next_scene && (
                        <Col span={24}>
                          <Alert
                            message="Next Scene"
                            description={`Scene #${choice.next_scene.scene_order}: ${choice.next_scene.dialog_text}`}
                            type="info"
                            icon={<LinkOutlined />}
                            showIcon
                          />
                        </Col>
                      )}
                    </Row>
                  </Card>
                ),
              }))}
            />
          ) : (
            <Empty description="No choices for this scene" />
          )}
        </div>
      </Spin>
    </Drawer>
  );
};


