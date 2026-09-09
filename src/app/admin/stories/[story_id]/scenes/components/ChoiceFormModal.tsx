import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Button,
  Divider,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { ChoiceFormModalProps } from './types';
import { Typography } from 'antd';

const { Text } = Typography;
const { TextArea } = Input;

export const ChoiceFormModal: React.FC<ChoiceFormModalProps> = ({
  visible,
  sceneId,
  editingChoice,
  loading,
  availableScenes,
  availableBosses,
  availableQuests,
  existingChoices,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [statsChangeKeys, setStatsChangeKeys] = useState<string[]>([]);

  useEffect(() => {
    if (editingChoice) {
      const statsKeys = Object.keys(editingChoice.stats_change || {});
      setStatsChangeKeys(statsKeys);
      form.setFieldsValue({
        ...editingChoice,
        quest_ids: editingChoice.quests?.map(q => q.quest_id) || [],
        stats_change: editingChoice.stats_change || {},
        active_scene: editingChoice.active_scene || 'main',
      });
    } else {
      form.resetFields();
      const nextOrder = existingChoices.length + 1;
      form.setFieldsValue({
        scene_id: sceneId,
        choice_order: nextOrder,
        stats_change: {},
        quest_ids: [],
        next_scene_id: null,
        boss_id: null,
        active_scene: 'main',
      });
      setStatsChangeKeys([]);
    }
  }, [editingChoice, sceneId, existingChoices.length, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddStatsChange = () => {
    const newKey = `stat_${statsChangeKeys.length + 1}`;
    setStatsChangeKeys([...statsChangeKeys, newKey]);
    const currentStats = form.getFieldValue('stats_change') || {};
    form.setFieldsValue({
      stats_change: { ...currentStats, [newKey]: 0 },
    });
  };

  const handleRemoveStatsChange = (key: string) => {
    setStatsChangeKeys(statsChangeKeys.filter(k => k !== key));
    const currentStats = form.getFieldValue('stats_change') || {};
    delete currentStats[key];
    form.setFieldsValue({ stats_change: currentStats });
  };

  return (
    <Modal
      title={
        <Space>
          {editingChoice ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingChoice ? 'Edit Choice' : 'Add New Choice'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText={editingChoice ? 'Update' : 'Create'}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="scene_id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="choice_order"
              label="Choice Order"
              rules={[
                { required: true, message: 'Enter choice order' },
                { type: 'number', min: 1, message: 'Order must be at least 1' },
              ]}
            >
              <Input type="number" min={1} placeholder="Enter order number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="active_scene"
              label="Active Scene"
              rules={[{ required: true, message: 'Select active scene' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="next_scene_id"
              label="Next Scene (Optional)"
            >
              <Select
                placeholder="Select next scene"
                allowClear
                options={availableScenes
                  .filter(scene => scene.id !== sceneId)
                  .map((scene) => ({
                    value: scene.id,
                    label: `Scene #${scene.scene_order}: ${scene.dialog_text.substring(0, 30)}...`,
                  }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="choice_text"
          label="Choice Text"
          rules={[
            { required: true, message: 'Enter choice text' },
            { max: 200, message: 'Choice text must be less than 200 characters' },
          ]}
        >
          <TextArea
            placeholder="Enter the choice text (e.g., 'Fight the dragon')"
            rows={2}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="effect_text"
          label="Effect Description"
          rules={[
            { required: true, message: 'Enter effect description' },
            { max: 500, message: 'Effect must be less than 500 characters' },
          ]}
        >
          <TextArea
            placeholder="Describe what happens when this choice is selected"
            rows={2}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="boss_id"
              label="Boss (Optional)"
            >
              <Select
                placeholder="Select boss"
                allowClear
                options={availableBosses.map((boss) => ({
                  value: boss.id,
                  label: (
                    <Space>
                      <TrophyOutlined />
                      {boss.name}
                    </Space>
                  ),
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quest_ids"
              label="Quests (Optional)"
            >
              <Select
                placeholder="Select quests"
                mode="multiple"
                allowClear
                optionLabelProp="label"
                options={availableQuests.map((quest) => ({
                  value: quest.id,
                  label: quest.name,
                  quest: quest,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Stats Changes</Divider>

        <Form.Item label="Stats Changes">
          <Space direction="vertical" style={{ width: '100%' }}>
            {statsChangeKeys.map((key) => (
              <Row key={key} gutter={8} align="middle">
                <Col span={10}>
                  <Form.Item
                    name={['stats_change', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter stat change value' }]}
                  >
                    <Input
                      placeholder="Stat name"
                      defaultValue={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        if (newKey && newKey !== key) {
                          const currentStats = form.getFieldValue('stats_change') || {};
                          const value = currentStats[key];
                          delete currentStats[key];
                          currentStats[newKey] = value;
                          setStatsChangeKeys(statsChangeKeys.map(k => k === key ? newKey : k));
                          form.setFieldsValue({ stats_change: currentStats });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={['stats_change', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter value' }]}
                  >
                    <Input type="number" placeholder="Value" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveStatsChange(key)}
                    size="small"
                  />
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={handleAddStatsChange} block icon={<PlusOutlined />}>
              Add Stats Change
            </Button>
          </Space>
        </Form.Item>

        <Alert
          message="Note"
          description="Choices create branching paths in your story. Each choice can lead to a different scene, trigger a boss fight, or reward players with quests."
          type="info"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};
