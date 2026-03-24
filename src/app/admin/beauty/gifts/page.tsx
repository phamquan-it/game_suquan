'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GiftBeauty } from '../types';
import { supabase } from '@/utils/supabase/client';

const { Option } = Select;
const { TextArea } = Input;

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftBeauty[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftBeauty | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gift_beauty')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGifts(data || []);
    } catch (error: any) {
      message.error('Error fetching gifts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingGift) {
        const { error } = await supabase
          .from('gift_beauty')
          .update(values)
          .eq('id', editingGift.id);

        if (error) throw error;
        message.success('Gift updated successfully');
      } else {
        const { error } = await supabase
          .from('gift_beauty')
          .insert([values]);

        if (error) throw error;
        message.success('Gift created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingGift(null);
      fetchGifts();
    } catch (error: any) {
      message.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Gift',
      content: 'Are you sure you want to delete this gift?',
      onOk: async () => {
        try {
          const { error } = await supabase
            .from('gift_beauty')
            .delete()
            .eq('id', id);

          if (error) throw error;
          message.success('Gift deleted successfully');
          fetchGifts();
        } catch (error: any) {
          message.error('Error: ' + error.message);
        }
      },
    });
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GiftBeauty) => (
        <Space>
          {record.icon && <img src={record.icon} alt={text} style={{ width: 32, height: 32 }} />}
          <span style={{ color: '#8B4513', fontWeight: 'bold' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: string) => (
        <Tag color={getRarityColor(rarity)} style={{ textTransform: 'uppercase' }}>
          {rarity}
        </Tag>
      ),
    },
    {
      title: 'Intimacy Points',
      dataIndex: 'intimacy_points',
      key: 'intimacy_points',
      render: (points: number) => (
        <Tag color="#8B4513">{points} pts</Tag>
      ),
    },
    {
      title: 'Bonuses',
      key: 'bonuses',
      render: (_: any, record: GiftBeauty) => (
        <Space>
          {record.bonus_success_rate && (
            <Tag color="#2E8B57">Success +{record.bonus_success_rate}%</Tag>
          )}
          {record.bonus_training_speed && (
            <Tag color="#1E90FF">Training +{record.bonus_training_speed}%</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `$${price}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? '#2E8B57' : '#DC143C'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: GiftBeauty) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingGift(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
            style={{ borderColor: '#003366', color: '#003366' }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#8B4513', fontSize: 28, margin: 0 }}>Gift Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGift(null);
            form.resetFields();
            setModalVisible(true);
          }}
          style={{ background: '#8B0000' }}
        >
          Add New Gift
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={gifts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} gifts`,
          }}
        />
      </Card>

      <Modal
        title={editingGift ? 'Edit Gift' : 'Add New Gift'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingGift(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rarity: 'common',
            is_active: true,
            intimacy_points: 10,
          }}
        >
          <Form.Item
            name="name"
            label="Gift Name"
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

            <Form.Item
              name="intimacy_points"
              label="Intimacy Points"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={1000} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="bonus_success_rate"
              label="Bonus Success Rate (%)"
            >
              <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="bonus_training_speed"
              label="Bonus Training Speed (%)"
            >
              <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="price"
              label="Price"
            >
              <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="icon"
              label="Icon URL"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
