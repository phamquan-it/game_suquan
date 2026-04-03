// app/admin/achievements/components/AchievementForm.tsx
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Button,
  Row,
  Col,
  Divider,
  Tabs,
  App,
  Flex,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Achievement, AchievementFormData } from '../types';
import { AchievementRequirements } from './AchievementRequirements';
import { AchievementRewards } from './AchievementRewards';
import { useGameActions } from '../hooks/useGameActions';
import { useCurrencies } from '../hooks/useCurrencies';

const { TextArea } = Input;
const { useApp } = App;

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
  const { message } = useApp();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
    console.log("achivement_id" + initialValues?.id);
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
      message.success(`${initialValues ? 'Updated' : 'Created'} achievement successfully`);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please check the form for errors');
    }
  };

  // Define options for selects
  const typeOptions = [
    { value: 'progression', label: 'Progression' },
    { value: 'combat', label: 'Combat' },
    { value: 'exploration', label: 'Exploration' },
    { value: 'collection', label: 'Collection' },
    { value: 'crafting', label: 'Crafting' },
    { value: 'social', label: 'Social' },
    { value: 'economy', label: 'Economy' },
    { value: 'alliance', label: 'Alliance' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'secret', label: 'Secret' },
  ];

  const categoryOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
    { value: 'master', label: 'Master' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const tierOptions = [
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'master', label: 'Master' },
    { value: 'grandmaster', label: 'Grandmaster' },
  ];

  const rarityOptions = [
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
    { value: 'mythic', label: 'Mythic' },
  ];

  const difficultyOptions = [
    { value: 'very_easy', label: 'Very Easy' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'very_hard', label: 'Very Hard' },
    { value: 'extreme', label: 'Extreme' },
    { value: 'impossible', label: 'Impossible' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'hidden', label: 'Hidden' },
  ];

  const logicOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
  ];

  const [requirementId, setRequimentId] = useState<string | number | undefined>();

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
      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: 'Basic Info',
            children: (
              <>
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
                      <Select
                        placeholder="Select type"
                        options={typeOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select category"
                        options={categoryOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="tier"
                      label="Tier"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select tier"
                        options={tierOptions}
                      />
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
                      <Select
                        placeholder="Select rarity"
                        options={rarityOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="difficulty"
                      label="Difficulty"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select difficulty"
                        options={difficultyOptions}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select status"
                        options={statusOptions}
                      />
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
                      <Select
                        options={logicOptions}
                      />
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
              </>
            ),
          },
          {
            key: 'requirements',
            label: 'Requirements',
            children: (
              <AchievementRequirements
                achievementId={initialValues?.id}
                gameActions={gameActions}
                onRequirementSelected={(requiment) => {
                  setRequimentId(requiment.id)
                }}
              />
            ),
          },
          {
            key: 'rewards',
            label: 'Rewards',
            children: (
              <AchievementRewards
                requirementId={requirementId}
                currencies={currencies}
              />
            ),
          },
        ]}
      />

      <Divider />

      <Form.Item className="mb-0">
        <Flex justify="flex-end" gap="small">
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
        </Flex>
      </Form.Item>
    </Form>
  );
};
