// app/admin/lootboxes/components/LootBoxForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Card,
  Button,
  Space,
  Row,
  Col,
  Tabs,
  message,
  Divider,
  Typography,
  Tag,
  Alert,
  Spin,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  StarOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  LOOT_BOX_TYPES,
  LOOT_BOX_CATEGORIES,
  LOOT_BOX_TIERS,
  CURRENCY_OPTIONS,
  OPENING_ANIMATION_TYPES,
} from '../constants/lootbox.constants';
import { useCreateLootBox, useUpdateLootBox, useLootBox } from '../hooks/useLootBoxQueries';
import RewardTableManager from './RewardTables/RewardTableManager';
import PitySystemManager from './PitySystem/PitySystemManager';
import GuaranteedDropManager from './GuaranteedDrops/GuaranteedDropManager';
import StreakBonusManager from './StreakBonuses/StreakBonusManager';
import FirstTimeBonusManager from './FirstTimeBonuses/FirstTimeBonusManager';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface LootBoxFormProps {
  id?: string;
  isEdit?: boolean;
}

export default function LootBoxForm({ id, isEdit }: LootBoxFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { data: lootBox, isLoading: isLoadingLootBox } = useLootBox(id || '');
  const createMutation = useCreateLootBox();
  const updateMutation = useUpdateLootBox(id || '');

  useEffect(() => {
    if (lootBox && isEdit) {
      // Convert tags object to array if needed
      const tagsArray = lootBox.tags
        ? (Array.isArray(lootBox.tags)
          ? lootBox.tags
          : Object.keys(lootBox.tags).filter(key => lootBox.tags[Number(key)]))
        : [];

      setTags(tagsArray);

      form.setFieldsValue({
        ...lootBox,
        available_from: lootBox.available_from ? dayjs(lootBox.available_from) : null,
        available_until: lootBox.available_until ? dayjs(lootBox.available_until) : null,
      });
    }
  }, [lootBox, form, isEdit]);

  const onFinish = async (values: any) => {
    try {
      // Convert tags array to object format expected by database
      const tagsObject = tags.reduce((acc, tag) => ({ ...acc, [tag]: true }), {});

      const formattedValues = {
        ...values,
        tags: tagsObject,
        available_from: values.available_from?.toISOString(),
        available_until: values.available_until?.toISOString(),
      };

      if (isEdit && id) {
        await updateMutation.mutateAsync(formattedValues);
        message.success('Loot box updated successfully');
      } else {
        await createMutation.mutateAsync(formattedValues);
        message.success('Loot box created successfully');
      }

      router.push('/admin/lootboxes');
    } catch (error) {
      console.error('Error saving loot box:', error);
      message.error('Failed to save loot box');
    }
  };

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
    setInputVisible(false);
  };

  const handleRemoveTag = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  if (isLoadingLootBox && isEdit) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        open_cost_amount: 0,
        opening_animation_duration: 3000,
        shine_effect: false,
        rarity_pulse: false,
        exclusive: false,
        time_limited: false,
        type: 'common',
        box_type: 'common',
        tier: 'basic',
        category: 'mixed',
        open_cost_currency: 'gold',
        opening_animation_type: 'simple',
      }}
    >
      <Card>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/admin/lootboxes')}
              >
                Back
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                {isEdit ? 'Edit Loot Box' : 'Create New Loot Box'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => router.push('/admin/lootboxes')}>
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Save
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                Basic Information
              </span>
            }
            key="basic"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="ID"
                  rules={[
                    { required: true, message: 'Please enter loot box ID' },
                    { pattern: /^[a-z0-9_]+$/, message: 'Only lowercase letters, numbers, and underscores allowed' }
                  ]}
                  tooltip="Unique identifier for the loot box. Cannot be changed after creation."
                >
                  <Input
                    placeholder="e.g., legendary_dragon_chest"
                    disabled={isEdit}
                    addonBefore="lootbox_"
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter loot box name' }]}
                >
                  <Input placeholder="e.g., Legendary Dragon Chest" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe the loot box contents, theme, and any special features..."
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="type"
                      label="Type"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {LOOT_BOX_TYPES.map(type => (
                          <Option key={type.value} value={type.value}>
                            {type.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="box_type"
                      label="Box Type"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {LOOT_BOX_TYPES.map(type => (
                          <Option key={type.value} value={type.value}>
                            {type.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="tier"
                      label="Tier"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {LOOT_BOX_TIERS.map(tier => (
                          <Option key={tier.value} value={tier.value}>
                            <Space>
                              <span style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: tier.color
                              }} />
                              {tier.label}
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {LOOT_BOX_CATEGORIES.map(category => (
                          <Option key={category.value} value={category.value}>
                            {category.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="open_cost_currency"
                      label="Open Cost Currency"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {CURRENCY_OPTIONS.map(currency => (
                          <Option key={currency.value} value={currency.value}>
                            {currency.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="open_cost_amount"
                      label="Open Cost Amount"
                      rules={[{ required: true, type: 'number', min: 0 }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="opening_animation_duration"
                      label="Animation Duration (ms)"
                      rules={[{ required: true, type: 'number', min: 500, max: 10000 }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={500}
                        max={10000}
                        step={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Card title="Visual Settings" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="opening_animation_type"
                        label="Opening Animation Type"
                        rules={[{ required: true }]}
                      >
                        <Select>
                          {OPENING_ANIMATION_TYPES.map(type => (
                            <Option key={type.value} value={type.value}>
                              {type.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="glow_color" label="Glow Color">
                        <Input type="color" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="particle_color" label="Particle Color">
                        <Input type="color" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="sound_effect" label="Sound Effect">
                        <Input placeholder="sound_effect_name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="particle_effect" label="Particle Effect">
                        <Input placeholder="particle_effect_name" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="custom_animation" label="Custom Animation">
                    <Input placeholder="custom_animation_path" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="shine_effect" label="Shine Effect" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="rarity_pulse" label="Rarity Pulse" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card title="Tags" style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    {tags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        style={{ marginBottom: 8 }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  {inputVisible ? (
                    <Input
                      type="text"
                      size="small"
                      style={{ width: 150 }}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onBlur={handleAddTag}
                      onPressEnter={handleAddTag}
                      autoFocus
                    />
                  ) : (
                    <Button
                      size="small"
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setInputVisible(true)}
                    >
                      Add Tag
                    </Button>
                  )}
                </Card>

                <Card title="Availability">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="season" label="Season">
                        <Input placeholder="e.g., season_3" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="event" label="Event">
                        <Input placeholder="e.g., halloween_2024" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="exclusive" label="Exclusive" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="time_limited" label="Time Limited" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.time_limited !== currentValues.time_limited
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('time_limited') && (
                        <>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item name="available_from" label="Available From">
                                <DatePicker
                                  showTime
                                  style={{ width: '100%' }}
                                  placeholder="Select start date"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name="available_until" label="Available Until">
                                <DatePicker
                                  showTime
                                  style={{ width: '100%' }}
                                  placeholder="Select end date"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Alert
                            message="Time Limited"
                            description="This loot box will only be available during the specified period."
                            type="info"
                            showIcon
                            style={{ marginTop: 8 }}
                          />
                        </>
                      )
                    }
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <GiftOutlined />
                Reward Tables
              </span>
            }
            key="rewards"
            disabled={!id && !isEdit}
          >
            {id && <RewardTableManager lootBoxId={id} />}
          </TabPane>

          <TabPane
            tab={
              <span>
                <SafetyOutlined />
                Pity System
              </span>
            }
            key="pity"
            disabled={!id && !isEdit}
          >
            {id && <PitySystemManager lootBoxId={id} />}
          </TabPane>

          <TabPane
            tab={
              <span>
                <StarOutlined />
                Guaranteed Drops
              </span>
            }
            key="guaranteed"
            disabled={!id && !isEdit}
          >
            {id && <GuaranteedDropManager lootBoxId={id} />}
          </TabPane>

          <TabPane
            tab={
              <span>
                <ThunderboltOutlined />
                Streak Bonuses
              </span>
            }
            key="streak"
            disabled={!id && !isEdit}
          >
            {id && <StreakBonusManager lootBoxId={id} />}
          </TabPane>

          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                First Time Bonuses
              </span>
            }
            key="firsttime"
            disabled={!id && !isEdit}
          >
            {id && <FirstTimeBonusManager lootBoxId={id} />}
          </TabPane>
        </Tabs>

        {/* Footer */}
        <Divider />
        <Row justify="end">
          <Space>
            <Button onClick={() => router.push('/admin/lootboxes')}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              Save
            </Button>
          </Space>
        </Row>
      </Card>
    </Form>
  );
}
