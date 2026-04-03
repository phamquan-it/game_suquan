// app/admin/achievements/components/AchievementRewards.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  InputNumber,
  Select,
  Popconfirm,
  message,
  Card,
  Typography,
  Divider,
  Tag,
  Modal,
  Radio,
  Tooltip,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  GoldOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { supabase } from '@/utils/supabase/client';
import { AchievementReward, Currency } from './rewards/types';
import { useItems } from '../hooks/use-items';
import { useRewards } from '../hooks/useRewards';

const { Text } = Typography;
const { Option } = Select;

interface AchievementRewardsProps {
  requirementId?: string | number;
  currencies: Currency[];
  readOnly?: boolean;
}

interface RewardFormData {
  reward_type: 'item' | 'currency';
  item_id?: string;
  currency_type?: string;
  quantity: number;
  probability: number;
}

export const AchievementRewards: React.FC<AchievementRewardsProps> = ({
  requirementId,
  currencies,
  readOnly = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReward, setEditingReward] = useState<AchievementReward | null>(null);
  const [rewardType, setRewardType] = useState<'item' | 'currency'>('item');
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);

  // Sử dụng hook để lấy danh sách vật phẩm
  const { items, loading: itemsLoading, error: itemsError } = useItems();

  // Hiển thị lỗi nếu fetch items thất bại
  useEffect(() => {
    if (itemsError) message.error('Không thể tải danh sách vật phẩm: ' + itemsError);
  }, [itemsError]);

  // Hook lấy phần thưởng
  const {
    rewards,
    loading: hookLoading,
    error: hookError,
  } = useRewards({
    requirementId: requirementId ? Number(requirementId) : undefined,
    enabled: !!requirementId,
  });

  // Hiển thị lỗi từ hook phần thưởng
  useEffect(() => {
    if (hookError) message.error(hookError);
  }, [hookError]);

  const refreshRewards = useCallback(() => setRefreshKey(prev => prev + 1), []);

  const handleSave = async (values: RewardFormData) => {
    if (!requirementId) {
      message.warning('Vui lòng lưu thành tựu trước khi thêm phần thưởng');
      return;
    }

    try {
      const rewardData: any = {
        quantity: values.quantity,
        probability: values.probability,
        requirement_id: Number(requirementId),
      };

      if (values.reward_type === 'item') {
        rewardData.item_id = values.item_id;
        rewardData.currency_type = null;
      } else {
        rewardData.currency_type = values.currency_type;
        rewardData.item_id = null;
      }

      let error;
      if (editingReward) {
        const { error: updateError } = await supabase
          .from('achievement_rewards')
          .update(rewardData)
          .eq('id', editingReward.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('achievement_rewards')
          .insert([rewardData]);
        error = insertError;
      }

      if (error) throw error;

      message.success(`Phần thưởng ${editingReward ? 'cập nhật' : 'thêm mới'} thành công`);
      setModalVisible(false);
      form.resetFields();
      setEditingReward(null);
      refreshRewards();
    } catch (error) {
      console.error('Lỗi lưu phần thưởng:', error);
      message.error('Lưu phần thưởng thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('achievement_rewards')
        .delete()
        .eq('id', id);
      if (error) throw error;
      message.success('Xóa phần thưởng thành công');
      refreshRewards();
    } catch (error) {
      console.error('Lỗi xóa phần thưởng:', error);
      message.error('Xóa phần thưởng thất bại');
    }
  };

  // Hàm hỗ trợ hiển thị
  const getRewardIcon = (record: AchievementReward) => (
    record.item_id ? <GiftOutlined className="text-purple-600" /> :
      record.currency_type ? <GoldOutlined className="text-yellow-600" /> : null
  );

  const getRewardName = (record: AchievementReward) => {
    if (record.item) return record.item.name;
    if (record.currency) return record.currency.name;
    return record.item_id || record.currency_type || 'Không xác định';
  };

  const getRewardRarity = (record: AchievementReward) => record.item?.rarity;

  const columns = [
    {
      title: 'Loại',
      key: 'type',
      width: 100,
      render: (_: any, record: AchievementReward) => (
        <Space>
          {getRewardIcon(record)}
          <Tag color={record.item_id ? 'purple' : 'gold'}>
            {record.item_id ? 'Vật phẩm' : 'Tiền tệ'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Phần thưởng',
      key: 'name',
      render: (_: any, record: AchievementReward) => (
        <Space direction="vertical" size={0}>
          <Text strong>{getRewardName(record)}</Text>
          {record.item && record.item.rarity && (
            <Tag color="blue">{record.item.rarity}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right' as const,
      render: (quantity: number) => (
        <Text strong className="text-green-600">x{quantity.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Xác suất',
      dataIndex: 'probability',
      key: 'probability',
      width: 150,
      render: (probability: number) => (
        <Space direction="vertical" size={0} className="w-full">
          <Text>{(probability * 100).toFixed(2)}%</Text>
          <Progress
            percent={probability * 100}
            size="small"
            showInfo={false}
            strokeColor={probability >= 1 ? '#52c41a' : '#faad14'}
          />
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, record: AchievementReward) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingReward(record);
                setRewardType(record.item_id ? 'item' : 'currency');
                form.setFieldsValue({
                  reward_type: record.item_id ? 'item' : 'currency',
                  item_id: record.item_id,
                  currency_type: record.currency_type,
                  quantity: record.quantity,
                  probability: record.probability,
                });
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa phần thưởng"
            description="Bạn có chắc chắn muốn xóa phần thưởng này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-lg">
          Phần thưởng hoàn thành ({rewards.length})
        </Text>
        {!readOnly && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingReward(null);
              form.resetFields();
              setRewardType('item');
              setModalVisible(true);
            }}
            disabled={!requirementId}
          >
            Thêm phần thưởng
          </Button>
        )}
      </div>

      {!requirementId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <Text type="warning">
            Vui lòng lưu thành tựu trước khi thêm phần thưởng
          </Text>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={rewards}
        loading={hookLoading}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: 'Chưa có phần thưởng nào' }}
      />

      <Modal
        title={editingReward ? 'Sửa phần thưởng' : 'Thêm phần thưởng'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingReward(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ reward_type: 'item', quantity: 1, probability: 1.0 }}
        >
          <Form.Item name="reward_type" label="Loại phần thưởng" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
            <Radio.Group onChange={(e) => setRewardType(e.target.value)} className="w-full">
              <Radio.Button value="item" className="w-1/2 text-center">
                <GiftOutlined /> Vật phẩm
              </Radio.Button>
              <Radio.Button value="currency" className="w-1/2 text-center">
                <GoldOutlined /> Tiền tệ
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {rewardType === 'item' ? (
            <Form.Item name="item_id" label="Vật phẩm" rules={[{ required: true, message: 'Vui lòng chọn vật phẩm' }]}>
              <Select
                placeholder="Chọn vật phẩm"
                showSearch
                optionFilterProp="children"
                loading={itemsLoading}
              >
                {items.map(item => (
                  <Option key={item.id} value={item.id}>
                    <Space>
                      <span>{item.name}</span>
                      <Tag color="blue">{item.rarity}</Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item name="currency_type" label="Tiền tệ" rules={[{ required: true, message: 'Vui lòng chọn loại tiền tệ' }]}>
              <Select placeholder="Chọn tiền tệ">
                {currencies.map(currency => (
                  <Option key={currency.currency_type} value={currency.currency_type}>
                    <Space>
                      {currency.icon && <span>{currency.icon}</span>}
                      <span>{currency.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={1} className="w-full" placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item
            name="probability"
            label="Xác suất rơi"
            rules={[
              { required: true, message: 'Vui lòng nhập xác suất' },
              {
                validator: (_, value) => {
                  if (value >= 0 && value <= 1) return Promise.resolve();
                  return Promise.reject(new Error('Xác suất phải nằm trong khoảng 0 đến 1'));
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              className="w-full"
              placeholder="Nhập xác suất (0-1)"
            />
          </Form.Item>

          <Divider />
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingReward ? 'Cập nhật' : 'Thêm'} phần thưởng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
