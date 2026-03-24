// app/admin/base_items/components/ItemForm.tsx
'use client';

import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Tabs,
  Space,
  Row,
  Col,
  Button,
  Divider,
  message,
  theme,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useCreateItem } from '../hooks/useCreateItem';
import { useUpdateItem } from '../hooks/useUpdateItem';
import { EquipmentSlotType, ItemFormData, ItemStatusType, ItemType, QualityType, RarityType } from '../types';
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface ItemFormProps {
  visible: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function ItemForm({ visible, onClose, initialData }: ItemFormProps) {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        levelRequirement: initialData.levelRequirement,
        baseValue: initialData.baseValue,
        maxStack: initialData.maxStack,
        stats: initialData.stats || {},
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = async (values: ItemFormData) => {
    try {
      if (initialData?.id) {
        await updateItem.mutateAsync({ id: initialData.id, data: values });
      } else {
        await createItem.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      // Error handled in hooks
    }
  };

  const itemTypes: ItemType[] = [
    'weapon', 'armor', 'consumable', 'material', 'relic', 'general',
    'helmet', 'cloak', 'boots', 'shield', 'accessory'
  ];

  const rarities: RarityType[] = [
    'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'
  ];

  const qualities: QualityType[] = [
    'broken', 'damaged', 'normal', 'good', 'excellent', 'perfect'
  ];

  const statuses: ItemStatusType[] = ['active', 'inactive', 'testing'];

  const equipmentSlots: EquipmentSlotType[] = [
    'weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory'
  ];

  return (
    <Modal
      title={initialData ? 'Edit Item' : 'Create New Item'}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={createItem.isPending || updateItem.isPending}
          style={{ background: token.colorPrimary }}
        >
          {initialData ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          stackable: false,
          maxStack: 1,
          isTradable: true,
          isSellable: true,
          isDestroyable: true,
          isQuestItem: false,
          levelRequirement: 1,
          baseValue: 0,
          quality: 'normal',
          status: 'active',
        }}
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="Basic Info" key="basic">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="Item ID"
                  rules={[{ required: true, message: 'Please enter item ID' }]}
                >
                  <Input placeholder="e.g., iron_sword_001" disabled={!!initialData} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Item Name"
                  rules={[{ required: true, message: 'Please enter item name' }]}
                >
                  <Input placeholder="Enter item name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} placeholder="Enter item description" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select type">
                    {itemTypes.map(type => (
                      <Option key={type} value={type}>
                        {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="rarity"
                  label="Rarity"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select rarity">
                    {rarities.map(rarity => (
                      <Option key={rarity} value={rarity}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quality"
                  label="Quality"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select quality">
                    {qualities.map(quality => (
                      <Option key={quality} value={quality}>
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="levelRequirement"
                  label="Level Requirement"
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="baseValue"
                  label="Base Value"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Select>
                    {statuses.map(status => (
                      <Option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stackable"
                  label="Stackable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="maxStack"
                  label="Max Stack"
                >
                  <InputNumber min={1} max={999} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Properties</Divider>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="isTradable"
                  label="Tradable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="isSellable"
                  label="Sellable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="isDestroyable"
                  label="Destroyable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="isQuestItem"
                  label="Quest Item"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Stats" key="stats">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['stats', 'attack']} label="Attack">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'defense']} label="Defense">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'health']} label="Health">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['stats', 'mana']} label="Mana">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'strength']} label="Strength">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'agility']} label="Agility">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['stats', 'intelligence']} label="Intelligence">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'speed']} label="Speed">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['stats', 'leadership']} label="Leadership">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Combat Stats</Divider>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name={['stats', 'criticalChance']} label="Crit Chance %">
                  <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={['stats', 'criticalDamage']} label="Crit Damage %">
                  <InputNumber min={0} max={500} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={['stats', 'dodge']} label="Dodge %">
                  <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={['stats', 'block']} label="Block %">
                  <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['stats', 'resistance']} label="Resistance %">
                  <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Media" key="media">
            <Form.Item
              name="icon"
              label="Icon URL"
            >
              <Input placeholder="https://example.com/icon.png" />
            </Form.Item>

            <Form.Item
              name="svgIcon"
              label="SVG Icon (XML)"
            >
              <TextArea rows={6} placeholder="Paste SVG XML here" />
            </Form.Item>
          </TabPane>

          <TabPane tab="Set" key="set">
            <Form.Item
              name={['setMembership', 'requiredSlot']}
              label="Equipment Slot"
            >
              <Select placeholder="Select slot (if equipment)" allowClear>
                {equipmentSlots.map(slot => (
                  <Option key={slot} value={slot}>
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
}
