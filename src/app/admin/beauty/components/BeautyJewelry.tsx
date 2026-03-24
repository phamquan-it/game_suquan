'use client';

import { Card, List, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Jewelry } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

const { Option } = Select;

interface BeautyJewelryProps {
  characterId: string;
  jewelry: Jewelry[];
}

export function BeautyJewelry({ characterId, jewelry: initialJewelry }: BeautyJewelryProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Jewelry | null>(null);
  const [form] = Form.useForm();
  const [jewelry, setJewelry] = useState<Jewelry[]>(initialJewelry);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        const { error } = await supabase
          .from('jewelry')
          .update(values)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        setJewelry(jewelry.map(j => j.id === editingItem.id ? { ...j, ...values } : j));
        message.success('Jewelry updated successfully');
      } else {
        const { data, error } = await supabase
          .from('jewelry')
          .insert([{ ...values, character_id: characterId }])
          .select()
          .single();

        if (error) throw error;
        
        setJewelry([...jewelry, data]);
        message.success('Jewelry added successfully');
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
      title: 'Delete Jewelry',
      content: 'Are you sure you want to delete this jewelry?',
      onOk: async () => {
        try {
          const { error } = await supabase
            .from('jewelry')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          setJewelry(jewelry.filter(j => j.id !== id));
          message.success('Jewelry deleted successfully');
        } catch (error: any) {
          message.error('Error: ' + error.message);
        }
      },
    });
  };

  const handleEdit = (item: Jewelry) => {
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
      title="Jewelry"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ background: '#8B0000' }}
        >
          Add Jewelry
        </Button>
      }
    >
      <List
        dataSource={jewelry}
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
                  <Tag color="#003366">
                    {item.type}
                  </Tag>
                  {item.equipped && (
                    <Tag color="#2E8B57">Equipped</Tag>
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  <Space>
                    {item.charm ? <Tag color="#8B4513">Charm +{item.charm}</Tag> : null}
                    {item.intrigue ? <Tag color="#DC143C">Intrigue +{item.intrigue}</Tag> : null}
                    {item.loyalty ? <Tag color="#D4AF37">Loyalty +{item.loyalty}</Tag> : null}
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingItem ? 'Edit Jewelry' : 'Add Jewelry'}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="hairpin">Hairpin</Option>
                <Option value="necklace">Necklace</Option>
                <Option value="bracelet">Bracelet</Option>
                <Option value="ring">Ring</Option>
                <Option value="earring">Earring</Option>
              </Select>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="charm"
              label="Charm Bonus"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="intrigue"
              label="Intrigue Bonus"
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="loyalty"
              label="Loyalty Bonus"
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
