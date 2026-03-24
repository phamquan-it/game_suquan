'use client';

import { Card, List, Tag, Button, Space, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { BeautySkill } from '../types';
import { useSkills } from '../hooks/useSkills';

const { Option } = Select;
const { TextArea } = Input;

interface BeautySkillsProps {
  characterId: string;
  skills: BeautySkill[];
}

export function BeautySkills({ characterId, skills: initialSkills }: BeautySkillsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState<BeautySkill | null>(null);
  const [form] = Form.useForm();
  
  const { skills, addSkill, updateSkill, deleteSkill, loading } = useSkills(characterId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSkill) {
        await updateSkill(editingSkill.id, values);
      } else {
        await addSkill(values);
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingSkill(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEdit = (skill: BeautySkill) => {
    setEditingSkill(skill);
    form.setFieldsValue(skill);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Skill',
      content: 'Are you sure you want to delete this skill?',
      onOk: () => deleteSkill(id),
    });
  };

  const getEffectTypeColor = (type: string) => {
    const colors = {
      attribute_boost: '#2E8B57',
      mission_success: '#1E90FF',
      resource_bonus: '#D4AF37',
      special_event: '#800080',
    };
    return colors[type as keyof typeof colors] || '#CD7F32';
  };

  return (
    <Card
      title="Skills"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ background: '#8B0000' }}
        >
          Add Skill
        </Button>
      }
    >
      <List
        loading={loading}
        dataSource={skills.length > 0 ? skills : initialSkills}
        renderItem={(skill) => (
          <List.Item
            actions={[
              <Button 
                key="edit" 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => handleEdit(skill)}
              />,
              <Button 
                key="delete" 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
                onClick={() => handleDelete(skill.id)}
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span style={{ color: '#8B4513', fontWeight: 'bold' }}>{skill.name}</span>
                  <Tag color={skill.type === 'active' ? '#1E90FF' : '#2E8B57'}>
                    {skill.type}
                  </Tag>
                  <Tag color={getEffectTypeColor(skill.effect_type)}>
                    {skill.effect_type}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  <span>{skill.description}</span>
                  <Space>
                    <Tag color="#003366">
                      Value: {skill.effect_value}
                    </Tag>
                    <Tag color="#8B4513">
                      Target: {skill.effect_target}
                    </Tag>
                    {skill.cooldown && (
                      <Tag color="#DC143C">
                        Cooldown: {skill.cooldown}
                      </Tag>
                    )}
                    <Tag color="#D4AF37">
                      Level: {skill.level}/{skill.max_level}
                    </Tag>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSkill(null);
        }}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Skill Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="passive">Passive</Option>
                <Option value="active">Active</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="effect_type"
              label="Effect Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="attribute_boost">Attribute Boost</Option>
                <Option value="mission_success">Mission Success</Option>
                <Option value="resource_bonus">Resource Bonus</Option>
                <Option value="special_event">Special Event</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="effect_value"
              label="Effect Value"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="effect_target"
              label="Effect Target"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cooldown"
              label="Cooldown"
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="level"
              label="Level"
              initialValue={1}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="max_level"
              label="Max Level"
              initialValue={10}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
}
