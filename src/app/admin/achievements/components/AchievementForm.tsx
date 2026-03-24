// app/admin/achievements/components/AchievementForm.tsx
'use client';

import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Space,
  Button,
  Row,
  Col,
  Divider,
  Tabs,
  message,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Achievement, AchievementFormData } from '../types';
import { AchievementRequirements } from './AchievementRequirements';
import { AchievementRewards } from './AchievementRewards';
import { useGameActions } from '../hooks/useGameActions';
import { useCurrencies } from '../hooks/useCurrencies';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface AchievementFormProps {
  initialValues?: Achievement;
  onSave: (values: AchievementFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({
  initialValues,
  onSave,
  onCancel,
  saving,
}) => {
  const [form] = Form.useForm();
  const { gameActions, loading: actionsLoading } = useGameActions();
  const { currencies, loading: currenciesLoading } = useCurrencies();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
    console.log("achivement_id"+initialValues?.id);
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        repeatable: false,
        hidden: false,
        secret: false,
        shareable: true,
        points: 0,
        max_completions: 1,
        status: 'active',
        version: '1.0.0',
        logic: 'AND',
      }}
      className="max-h-[80vh] overflow-y-auto pr-4"
    >
      <Tabs defaultActiveKey="basic">
        <TabPane tab="Basic Info" key="basic">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter achievement name' }]}
              >
                <Input placeholder="Enter achievement name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="id"
                label="ID"
                rules={[{ required: true, message: 'Please enter achievement ID' }]}
              >
                <Input 
                  placeholder="unique_id" 
                  disabled={!!initialValues}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Describe the achievement..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select type">
                  <Option value="progression">Progression</Option>
                  <Option value="combat">Combat</Option>
                  <Option value="exploration">Exploration</Option>
                  <Option value="collection">Collection</Option>
                  <Option value="crafting">Crafting</Option>
                  <Option value="social">Social</Option>
                  <Option value="economy">Economy</Option>
                  <Option value="alliance">Alliance</Option>
                  <Option value="seasonal">Seasonal</Option>
                  <Option value="milestone">Milestone</Option>
                  <Option value="secret">Secret</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select category">
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                  <Option value="expert">Expert</Option>
                  <Option value="master">Master</Option>
                  <Option value="legendary">Legendary</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="tier"
                label="Tier"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select tier">
                  <Option value="bronze">Bronze</Option>
                  <Option value="silver">Silver</Option>
                  <Option value="gold">Gold</Option>
                  <Option value="platinum">Platinum</Option>
                  <Option value="diamond">Diamond</Option>
                  <Option value="master">Master</Option>
                  <Option value="grandmaster">Grandmaster</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="rarity"
                label="Rarity"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select rarity">
                  <Option value="common">Common</Option>
                  <Option value="uncommon">Uncommon</Option>
                  <Option value="rare">Rare</Option>
                  <Option value="epic">Epic</Option>
                  <Option value="legendary">Legendary</Option>
                  <Option value="mythic">Mythic</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="Difficulty"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select difficulty">
                  <Option value="very_easy">Very Easy</Option>
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                  <Option value="very_hard">Very Hard</Option>
                  <Option value="extreme">Extreme</Option>
                  <Option value="impossible">Impossible</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="hidden">Hidden</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Configuration</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="repeatable" label="Repeatable" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="max_completions"
                label="Max Completions"
                dependencies={['repeatable']}
              >
                <InputNumber 
                  min={1} 
                  disabled={!form.getFieldValue('repeatable')}
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="hidden" label="Hidden" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="secret" label="Secret" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="shareable" label="Shareable" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="points" label="Points">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="time_limit" label="Time Limit (seconds)">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="logic" label="Logic">
                <Select>
                  <Option value="AND">AND</Option>
                  <Option value="OR">OR</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="icon" label="Icon URL">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="image" label="Image URL">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="version" label="Version">
            <Input placeholder="1.0.0" />
          </Form.Item>
        </TabPane>

        <TabPane tab="Requirements" key="requirements">
          <AchievementRequirements 
            achievementId={initialValues?.id}
            gameActions={gameActions}
          />
        </TabPane>

        <TabPane tab="Rewards" key="rewards">
          <AchievementRewards
            achievementId={initialValues?.id}
            currencies={currencies}
          />
        </TabPane>
      </Tabs>

      <Divider />

      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={saving}
            icon={<SaveOutlined />}
          >
            {initialValues ? 'Update' : 'Create'} Achievement
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
