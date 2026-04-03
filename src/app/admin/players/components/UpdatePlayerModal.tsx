// components/admin/players/UpdatePlayerModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Spin,
  Alert,
  Tag,
  Avatar,
  Descriptions,
  Divider,
  Card,
  Empty,
  message
} from 'antd';
import {
  UserOutlined,
  CrownOutlined,
  HeartOutlined,
  GiftOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Player } from '@/types/player';
import { supabase } from '@/utils/supabase/client';
import { PlayerBeautyManager } from './PlayerBeautyManager';
import { BaseItem } from '../types/player-item';
import { PlayerItemsManager } from './PlayerItemsManager';
import { useAllItems } from '../hooks/useAllItems';
import { PlayerGeneralsManager } from './PlayerGeneralsManager';

interface UpdatePlayerModalProps {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onSuccess: () => void;
  loading?: boolean;
}

const { Option } = Select;

// Mock available beauties data - you should fetch this from your database
// In a real implementation, you'd fetch this from your beauties table
const fetchAvailableBeauties = async () => {
  // Replace with your actual API call
  const { data, error } = await supabase
    .from('beauty_characters')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching beauties:', error);
    return [];
  }

  return data || [];
};



const UpdatePlayerModal: React.FC<UpdatePlayerModalProps> = ({
  open,
  player,
  onClose,
  onSuccess,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [submitting, setSubmitting] = useState(false);
  const [availableBeauties, setAvailableBeauties] = useState<any[]>([]);
  const [loadingBeauties, setLoadingBeauties] = useState(false);

  // State for items
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: availableItems, loading: loadingItems } = useAllItems();

  // Reset form when player changes
  useEffect(() => {
    if (player && open) {
      form.setFieldsValue({
        username: player.username,
        email: player.email,
        status: player.status,
        level: player.level,
        vipLevel: 0,
        totalSpent: 0,
      });
    }
  }, [player, open, form]);

  // Fetch available beauties when modal opens and beauties tab is active
  useEffect(() => {
    if (open && activeTab === 'beauties') {
      loadAvailableBeauties();
    }
  }, [open, activeTab]);

  const loadAvailableBeauties = async () => {
    setLoadingBeauties(true);
    const beauties = await fetchAvailableBeauties();
    setAvailableBeauties(beauties);
    setLoadingBeauties(false);
  };

  const handleItemAdded = () => {
    message.success('Vật phẩm đã được thêm thành công!');
    setRefreshKey(prev => prev + 1);
  };

  const handleItemRemoved = () => {
    message.success('Vật phẩm đã được xóa thành công!');
    setRefreshKey(prev => prev + 1);
  };



  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // TODO: Call update API here
      // await updatePlayerMutation.mutateAsync({ id: player?.id, data: values });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Cập nhật người chơi thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Update player error:', error);
      message.error('Cập nhật người chơi thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setActiveTab('info');
    onClose();
  };

  const handleBeautyAdded = () => {
    message.success('Mỹ nhân đã được thêm thành công!');
    // Refresh the beauties list in the tab
    setRefreshKey(prev => prev + 1);
  };

  const handleBeautyRemoved = () => {
    message.success('Mỹ nhân đã được xóa thành công!');
    // Refresh the beauties list in the tab
    setRefreshKey(prev => prev + 1);
  };

  // Tab content components
  const renderInfoTab = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        status: 'online',
        level: 1,
        vipLevel: 0,
        totalSpent: 0,
      }}
    >
      <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
        <Card size="small" style={{ marginBottom: 16, background: '#f5f5f5' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#8B0000' }} />
              <div>
                <h3 style={{ margin: 0 }}>{player?.username}</h3>
                <p style={{ margin: 0, color: '#666' }}>ID: {player?.id}</p>
              </div>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Ngày đăng ký">
                {'Chờ cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Lần đăng nhập cuối">
                {player?.last_login
                  ? new Date(player.last_login).toLocaleDateString('vi-VN')
                  : 'Chờ cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        <Form.Item
          name="username"
          label="Tên người chơi"
          rules={[{ required: true, message: 'Vui lòng nhập tên người chơi' }]}
        >
          <Input placeholder="Nhập tên người chơi" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
        >
          <Select>
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
            <Option value="banned">Bị cấm</Option>
            <Option value="suspended">Tạm ngưng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="level"
          label="Cấp độ"
        >
          <InputNumber min={1} max={999} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="vipLevel"
          label="VIP Level"
        >
          <Select>
            {[0, 1, 2, 3, 4, 5].map(level => (
              <Option key={level} value={level}>VIP {level}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="totalSpent"
          label="Tổng tiền đã nạp"
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
            suffix="VNĐ"
          />
        </Form.Item>
      </div>
    </Form>
  );

  // In UpdatePlayerModal.tsx, add to imports:

  // Add handler functions:
  const handleGeneralAdded = () => {
    message.success('Tướng đã được thêm thành công!');
    setRefreshKey(prev => prev + 1);
  };

  const handleGeneralRemoved = () => {
    message.success('Tướng đã được xóa thành công!');
    setRefreshKey(prev => prev + 1);
  };

  // Replace the renderHeroesTab with:
  const renderHeroesTab = () => {
    if (!player?.id) {
      return (
        <Empty
          description="Không thể tải thông tin người chơi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px 8px' }}>
        <PlayerGeneralsManager
          key={`generals-manager-${refreshKey}`}
          playerId={player.id}
          onGeneralAdded={handleGeneralAdded}
          onGeneralRemoved={handleGeneralRemoved}
          readOnly={false}
        />
      </div>
    );
  };

  const renderBeautiesTab = () => {
    if (!player?.id) {
      return (
        <Empty
          description="Không thể tải thông tin người chơi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px 8px' }}>
        <Spin spinning={loadingBeauties}>
          <PlayerBeautyManager
            key={`beauty-manager-${refreshKey}`}
            playerId={player.id}
            availableBeauties={availableBeauties}
            onBeautyAdded={handleBeautyAdded}
            onBeautyRemoved={handleBeautyRemoved}
            readOnly={false}
          />
        </Spin>
      </div>
    );
  };

  const renderItemsTab = () => {
    if (!player?.id) {
      return (
        <Empty
          description="Không thể tải thông tin người chơi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px 8px' }}>
        <Spin spinning={loadingItems}>
          <PlayerItemsManager
            key={`items-manager-${refreshKey}`}
            playerId={player.id}
            availableItems={availableItems}
            onItemAdded={() => {
              message.success('Vật phẩm đã được thêm thành công!');
              setRefreshKey(prev => prev + 1);
            }}
            onItemRemoved={() => {
              message.success('Vật phẩm đã được xóa thành công!');
              setRefreshKey(prev => prev + 1);
            }}
            readOnly={false}
            showInventory={true}
          />
        </Spin>
      </div>
    );
  };


  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: (
        <span>
          <UserOutlined />
          Thông tin
        </span>
      ),
      children: renderInfoTab(),
    },
    {
      key: 'heroes',
      label: (
        <span>
          <CrownOutlined />
          Tướng
        </span>
      ),
      children: renderHeroesTab(),
    },
    {
      key: 'beauties',
      label: (
        <span>
          <HeartOutlined />
          Mỹ nhân
        </span>
      ),
      children: renderBeautiesTab(),
    },
    {
      key: 'items',
      label: (
        <span>
          <GiftOutlined />
          Item
        </span>
      ),
      children: renderItemsTab(),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          <span>Chỉnh sửa người chơi: {player?.username || '...'}</span>
        </Space>
      }
      open={open}
      onCancel={handleClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleClose} icon={<CloseOutlined />}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting || loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
          style={{ backgroundColor: '#8B0000' }}
        >
          Lưu thay đổi
        </Button>,
      ]}
      destroyOnHidden
    >
      <Spin spinning={loading || submitting}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          style={{ marginTop: 16 }}
        />
      </Spin>
    </Modal>
  );
};

export default UpdatePlayerModal;
