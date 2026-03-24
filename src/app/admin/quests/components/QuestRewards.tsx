'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, InputNumber, Select, Input, Popconfirm, Modal, Form, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/utils/supabase/client';
import { useCreateReward, useDeleteReward, useQuestRewards, useUpdateReward } from '../hooks/useQuestRewards';
import { REWARD_TYPES } from '../types';

const { Option } = Select;

interface QuestRewardsProps {
  questId: string;
}

export const QuestRewards: React.FC<QuestRewardsProps> = ({ questId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [form] = Form.useForm();
  const rewardType = Form.useWatch('reward_type', form);

  const { data: rewards, isLoading } = useQuestRewards(questId);
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();
  const deleteReward = useDeleteReward();

  useEffect(() => {
    fetchItems();
    fetchCurrencies();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('base_items')
      .select('id, name, type, rarity')
      .limit(100);
    if (data) setItems(data);
  };

  const fetchCurrencies = async () => {
    const { data } = await supabase
      .from('currencies')
      .select('currency_type, name');
    if (data) setCurrencies(data);
  };

  const handleAdd = () => {
    setEditingReward(null);
    form.resetFields();
    form.setFieldsValue({ reward_type: 'item', amount: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingReward(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingReward) {
        await updateReward.mutateAsync({
          id: editingReward.id,
          quest_id: questId,
          ...values
        });
      } else {
        await createReward.mutateAsync({
          ...values,
          quest_id: questId
        });
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const getRewardDescription = (record: any) => {
    if (record.reward_type === 'item') {
      const item = items.find(i => i.id === record.item_id);
      return `${item?.name || record.item_id} x${record.amount}`;
    } else if (record.reward_type === 'currency') {
      const currency = currencies.find(c => c.currency_type === record.currency_type);
      return `${currency?.name || record.currency_type}: ${record.amount}`;
    } else if (record.reward_type === 'experience') {
      return `${record.experience_amount} EXP`;
    }
    return record.description || '-';
  };

  const columns = [
    {
      title: 'Loại phần thưởng',
      dataIndex: 'reward_type',
      key: 'reward_type',
      render: (type: string) => {
        const types: Record<string, string> = {
          item: 'Vật phẩm',
          currency: 'Tiền tệ',
          experience: 'Kinh nghiệm',
        };
        return types[type] || type;
      },
    },
    {
      title: 'Chi tiết',
      key: 'details',
      render: (_: any, record: any) => getRewardDescription(record),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa phần thưởng"
            description="Bạn có chắc chắn muốn xóa phần thưởng này?"
            onConfirm={() => deleteReward.mutateAsync({ id: record.id, quest_id: questId })}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-imperialRed"
        >
          Thêm phần thưởng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rewards}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={editingReward ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        confirmLoading={createReward.isPending || updateReward.isPending}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="reward_type"
            label="Loại phần thưởng"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              {REWARD_TYPES.map(type => (
                <Radio.Button key={type} value={type}>
                  {type === 'item' && 'Vật phẩm'}
                  {type === 'currency' && 'Tiền tệ'}
                  {type === 'experience' && 'Kinh nghiệm'}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          {rewardType === 'item' && (
            <>
              <Form.Item
                name="item_id"
                label="Chọn vật phẩm"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Tìm kiếm vật phẩm"
                  optionFilterProp="children"
                >
                  {items.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name} ({item.rarity})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Số lượng"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </>
          )}

          {rewardType === 'currency' && (
            <>
              <Form.Item
                name="currency_type"
                label="Loại tiền tệ"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn loại tiền tệ">
                  {currencies.map(currency => (
                    <Option key={currency.currency_type} value={currency.currency_type}>
                      {currency.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Số lượng"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </>
          )}

          {rewardType === 'experience' && (
            <Form.Item
              name="experience_amount"
              label="Kinh nghiệm"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          )}

          <Form.Item
            name="description"
            label="Mô tả (tùy chọn)"
          >
            <Input.TextArea rows={2} placeholder="Mô tả phần thưởng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
