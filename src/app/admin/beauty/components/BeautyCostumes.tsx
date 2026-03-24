'use client';

import { Card, List, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Costume } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

const { Option } = Select;

interface BeautyCostumesProps {
  characterId: string;
  costumes: Costume[];
}

export function BeautyCostumes({ characterId, costumes: initialCostumes }: BeautyCostumesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Costume | null>(null);
  const [form] = Form.useForm();
  const [costumes, setCostumes] = useState<Costume[]>(initialCostumes);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        const { error } = await supabase
          .from('costumes')
          .update(values)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        setCostumes(costumes.map(c => c.id === editingItem.id ? { ...c, ...values } : c));
        message.success('Costume updated successfully');
      } else {
        const { data, error } = await supabase
          .from('costumes')
          .insert([{ ...values, character_id: characterId }])
          .select()
          .single();

        if (error) throw error;
        
        setCostumes([...costumes, data]);
        message.success('Costume added successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error: any) {
      message.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Costume',
      content: 'Are you sure you want to delete this costume?',
      onOk: async () => {
        try {
          const { error } = await supabase
            .from('costumes')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          setCostumes(costumes.filter(c => c.id !== id));
          message.success('Costume deleted successfully');
        } catch (error: any) {
          message.error('Error: ' + error.message);
        }
      },
    });
  };

  const handleEdit = (item: Costume) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

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
    <Card
      title="Costumes"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ background: '#8B0000' }}
        >
          Add Costume
        </Button>
      }
    >
      <List
        dataSource={costumes}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button 
                key="edit" 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => handleEdit(item)}
              />,
              <Button 
                key="delete" 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
                onClick={() => handleDelete(item.id)}
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span style={{ color: '#8B4513', fontWeight: 'bold' }}>{item.name}</span>
                  <Tag color={getRarityColor(item.rarity)}>
                    {item.rarity}
                  </Tag>
                  {item.equipped && (
                    <Tag color="#2E8B57">Equipped</Tag>
                  )}
                </Space>
              }
              description={
                <Space>
                  {item.charm ? <Tag color="#8B4513">Charm +{item.charm}</Tag> : null}
                  {item.intelligence ? <Tag color="#003366">Intelligence +{item.intelligence}</Tag> : null}
                  {item.diplomacy ? <Tag color="#2E8B57">Diplomacy +{item.diplomacy}</Tag> : null}
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingItem ? 'Edit Costume' : 'Add Costume'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="rarity"
            label="Rarity"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="common">Common</Option>
              <Option value="rare">Rare</Option>
              <Option value="epic">Epic</Option>
              <Option value="legendary">Legendary</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="charm"
              label="Charm Bonus"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="intelligence"
              label="Intelligence Bonus"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="diplomacy"
              label="Diplomacy Bonus"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="equipped"
            label="Equipped"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
