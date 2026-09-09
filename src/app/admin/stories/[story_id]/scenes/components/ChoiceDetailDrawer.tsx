import React from 'react';
import {
  Drawer,
  Space,
  Button,
  Spin,
  Descriptions,
  Tag,
  Divider,
  Alert,
} from 'antd';
import {
  BranchesOutlined,
  LinkOutlined,
  EditOutlined,
  TrophyOutlined,
  FlagOutlined,
  PictureOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ACTIVE_SCENE_OPTIONS } from '../../../hooks/useStoryChoices';
import { ChoiceDetailDrawerProps } from './types';
import { Typography } from 'antd';

const { Paragraph, Text } = Typography;

export const ChoiceDetailDrawer: React.FC<ChoiceDetailDrawerProps> = ({
  visible,
  choice,
  loading,
  onClose,
  onEdit,
}) => {
  if (!choice) return null;

  const activeSceneOption = ACTIVE_SCENE_OPTIONS.find(o => o.value === choice.active_scene);

  return (
    <Drawer
      title={
        <Space>
          <BranchesOutlined style={{ color: '#8B0000' }} />
          <span>Choice #{choice.choice_order} Details</span>
        </Space>
      }
      placement="right"
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(choice)}>
          Edit Choice
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Order" span={2}>
            <Tag color="purple" style={{ fontSize: 16 }}>{choice.choice_order}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Choice Text" span={2}>
            <Paragraph style={{ margin: 0, fontSize: 16 }}>{choice.choice_text}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Effect" span={2}>
            <Paragraph style={{ margin: 0 }}>{choice.effect_text}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Next Scene">
            {choice.next_scene ? (
              <Tag icon={<LinkOutlined />} color="green" style={{ fontSize: 14 }}>
                Scene #{choice.next_scene.scene_order}
              </Tag>
            ) : (
              <Tag color="default">End of Branch</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Active Scene">
            <Tag color="cyan" style={{ fontSize: 14 }}>
              {activeSceneOption?.label || choice.active_scene || 'main'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Boss">
            {choice.boss ? (
              <Tag icon={<TrophyOutlined />} color="red" style={{ fontSize: 14 }}>
                {choice.boss.name}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Stats Change" span={2}>
            {choice.stats_change && Object.keys(choice.stats_change).length > 0 ? (
              <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                <pre style={{ margin: 0, fontSize: 12 }}>
                  {JSON.stringify(choice.stats_change, null, 2)}
                </pre>
              </div>
            ) : (
              <Text type="secondary">No stat changes</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Quests" span={2}>
            {choice.quests && choice.quests.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                {choice.quests.map((q, index) => (
                  <Tag key={index} icon={<FlagOutlined />} color="gold" style={{ fontSize: 14 }}>
                    {q.quest?.name || q.quest_id}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No quests associated</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(choice.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="ID">
            <Text copyable>{choice.id}</Text>
          </Descriptions.Item>
        </Descriptions>

        {choice.next_scene && (
          <>
            <Divider />
            <Alert
              message="Next Scene Preview"
              description={
                <div>
                  <Text strong>Scene #{choice.next_scene.scene_order}</Text>
                  <Paragraph style={{ marginTop: 8 }}>
                    {choice.next_scene.dialog_text}
                  </Paragraph>
                  {choice.next_scene.speaker_id && (
                    <Tag color="blue">Speaker: {choice.next_scene.speaker_id}</Tag>
                  )}
                  {choice.next_scene.background && (
                    <Tag icon={<PictureOutlined />}>{choice.next_scene.background}</Tag>
                  )}
                  {choice.next_scene.sound_effect && (
                    <Tag icon={<SoundOutlined />}>{choice.next_scene.sound_effect}</Tag>
                  )}
                </div>
              }
              type="info"
              icon={<LinkOutlined />}
              showIcon
            />
          </>
        )}
      </Spin>
    </Drawer>
  );
};
