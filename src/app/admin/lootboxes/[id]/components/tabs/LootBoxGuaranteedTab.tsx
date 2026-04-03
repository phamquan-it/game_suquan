// components/lootbox/tabs/LootBoxGuaranteedTab.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Empty,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Switch,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Badge,
  Alert,
  Spin,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  GiftOutlined,
  TrophyOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { LootBoxGuaranteedDropFull } from '../../../types/database';
import { useAllRewardItems } from '../../../hooks/useAllRewardItems';
import { useLootBoxGuaranteedDrops } from '../../../hooks/useGuaranteedDrops';
import Input from 'antd/es/input/Input';


const { Title, Text } = Typography;

interface LootBoxGuaranteedTabProps {
  lootBoxId: string;
  rewardPoolId?: string;
}

// Helper functions for rarity
const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#808080',
    uncommon: '#2E8B57',
    rare: '#1E90FF',
    epic: '#9932CC',
    legendary: '#FF8C00',
    mythic: '#FF1493',
    ancient: '#CD7F32',
    divine: '#D4AF37',
  };
  return colors[rarity] || '#808080';
};

const getRarityLabel = (rarity: string): string => {
  const labels: Record<string, string> = {
    common: 'Thường',
    uncommon: 'Không phổ biến',
    rare: 'Hiếm',
    epic: 'Sử thi',
    legendary: 'Huyền thoại',
    mythic: 'Thần thoại',
    ancient: 'Cổ đại',
    divine: 'Thần thánh',
  };
  return labels[rarity] || rarity;
};

const getRewardTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    currency: 'Tiền tệ',
    item: 'Vật phẩm',
    equipment: 'Trang bị',
    skill: 'Kỹ năng',
    pet: 'Thú cưng',
    mount: 'Tọa kỵ',
  };
  return labels[type] || type;
};

export const LootBoxGuaranteedTab: React.FC<LootBoxGuaranteedTabProps> = ({
  lootBoxId,
  rewardPoolId,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDrop, setEditingDrop] = useState<LootBoxGuaranteedDropFull | null>(null);
  const [form] = Form.useForm();
  const [selectedRewardIds, setSelectedRewardIds] = useState<string[]>([]);

  const {
    guaranteedDrops,
    loading,
    error,
    fetchGuaranteedDrops,
    createGuaranteedDrop,
    updateGuaranteedDrop,
    deleteGuaranteedDrop,
    deleteGuaranteedReward,
    validateOpenCount,
    getNextAvailableOpenCount,
  } = useLootBoxGuaranteedDrops({ lootBoxId });

  const { data: rewardItems, loading: rewardLoading } = useAllRewardItems();

  // Filter reward items by reward pool if provided
  const filteredRewardItems = rewardPoolId
    ? (rewardItems || []).filter(item => item.reward_pool_id === rewardPoolId)
    : rewardItems || [];

  useEffect(() => {
    fetchGuaranteedDrops();
  }, [fetchGuaranteedDrops]);

  const handleOpenModal = (drop?: LootBoxGuaranteedDropFull) => {
    if (drop) {
      setEditingDrop(drop);
      form.setFieldsValue({
        open_count: drop.open_count,
        reset_after_claim: drop.reset_after_claim,
      });
      setSelectedRewardIds(drop.loot_box_guaranteed_rewards?.map(r => r.reward_item_id) || []);
    } else {
      setEditingDrop(null);
      const nextOpenCount = getNextAvailableOpenCount(guaranteedDrops);
      form.setFieldsValue({
        open_count: nextOpenCount,
        reset_after_claim: true,
      });
      setSelectedRewardIds([]);
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingDrop(null);
    form.resetFields();
    setSelectedRewardIds([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (selectedRewardIds.length === 0) {
        message.warning('Vui lòng chọn ít nhất một phần thưởng');
        return;
      }

      if (!editingDrop) {
        // Create new guaranteed drop
        const result = await createGuaranteedDrop({
          id: values.id,
          loot_box_id: lootBoxId,
          open_count: values.open_count,
          reset_after_claim: values.reset_after_claim,
          rewards: selectedRewardIds.map(id => ({ reward_item_id: id })),
        });

        if (result) {
          message.success('Tạo phần thưởng đảm bảo thành công');
          handleCloseModal();
        }
      } else {
        // Update existing guaranteed drop
        const currentRewards = editingDrop.loot_box_guaranteed_rewards || [];
        const rewardsToUpdate = [];

        // Check rewards to delete
        for (const reward of currentRewards) {
          if (!selectedRewardIds.includes(reward.reward_item_id)) {
            rewardsToUpdate.push({
              id: reward.id,
              reward_item_id: reward.reward_item_id,
              _delete: true,
            });
          }
        }

        // Check rewards to add
        for (const rewardId of selectedRewardIds) {
          const existingReward = currentRewards.find(r => r.reward_item_id === rewardId);
          if (!existingReward) {
            rewardsToUpdate.push({
              reward_item_id: rewardId,
            });
          }
        }

        const success = await updateGuaranteedDrop(editingDrop.id, {
          open_count: values.open_count,
          reset_after_claim: values.reset_after_claim,
          rewards: rewardsToUpdate,
        });

        if (success) {
          message.success('Cập nhật phần thưởng đảm bảo thành công');
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleDeleteDrop = async (id: string) => {
    const success = await deleteGuaranteedDrop(id);
    if (success) {
      message.success('Xóa phần thưởng đảm bảo thành công');
    }
  };

  const handleDeleteReward = async (rewardId: string, dropId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await deleteGuaranteedReward(rewardId);
    if (success) {
      message.success('Xóa phần thưởng thành công');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Text strong style={{ color: '#8B4513' }}>{index + 1}</Text>
      ),
    },
    {
      title: 'Số lần mở',
      dataIndex: 'open_count',
      key: 'open_count',
      render: (count: number) => (
        <Badge
          count={count}
          style={{
            backgroundColor: '#D4AF37',
            color: '#8B0000',
            fontSize: 14,
            fontWeight: 'bold',
            padding: '0 8px',
            minWidth: 32,
          }}
        />
      ),
    },
    {
      title: 'Đặt lại sau khi nhận',
      dataIndex: 'reset_after_claim',
      key: 'reset_after_claim',
      render: (value: boolean) => (
        <Tag
          icon={value ? <ReloadOutlined /> : <ClockCircleOutlined />}
          color={value ? 'success' : 'default'}
          style={{ fontSize: 12 }}
        >
          {value ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Phần thưởng',
      key: 'rewards',
      width: 300,
      render: (_: any, record: LootBoxGuaranteedDropFull) => (
        <Space wrap size={[0, 4]}>
          {record.loot_box_guaranteed_rewards?.map((reward) => (
            <Tooltip
              key={reward.id}
              title={
                <div>
                  <div>
                    <strong>Loại:</strong> {getRewardTypeLabel(reward.loot_box_reward_items?.reward_type || '')}
                  </div>
                  <div>
                    <strong>Số lượng:</strong> {reward.loot_box_reward_items?.amount_min} - {reward.loot_box_reward_items?.amount_max}
                  </div>
                  <div>
                    <strong>Trọng số:</strong> {reward.loot_box_reward_items?.weight}
                  </div>
                  <div>
                    <strong>Ràng buộc:</strong> {reward.loot_box_reward_items?.bound_type}
                  </div>
                </div>
              }
            >
              <Tag
                color={reward.loot_box_reward_items ? getRarityColor(reward.loot_box_reward_items.rarity) : 'blue'}
                style={{ margin: 2, cursor: 'pointer' }}
                closable
                onClose={(e) => handleDeleteReward(reward.id, record.id, e)}
              >
                {reward.loot_box_reward_items?.reward_type || reward.reward_item_id}
              </Tag>
            </Tooltip>
          ))}
          {(!record.loot_box_guaranteed_rewards || record.loot_box_guaranteed_rewards.length === 0) && (
            <Text type="secondary" italic>Chưa có phần thưởng</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, record: LootBoxGuaranteedDropFull) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: '#D4AF37' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa phần thưởng đảm bảo"
            description="Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteDrop(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Tooltip title="Xóa">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: LootBoxGuaranteedDropFull) => {
    if (!record.loot_box_guaranteed_rewards || record.loot_box_guaranteed_rewards.length === 0) {
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có phần thưởng nào"
            style={{ margin: 0 }}
          />
        </div>
      );
    }

    return (
      <div style={{ padding: '16px 24px', backgroundColor: '#FDF8E7' }}>
        <Title level={5} style={{ marginBottom: 16, color: '#8B4513' }}>
          <CrownOutlined style={{ marginRight: 8 }} />
          Chi tiết phần thưởng đảm bảo
        </Title>
        <Row gutter={[16, 16]}>
          {record.loot_box_guaranteed_rewards.map((reward) => {
            const item = reward.loot_box_reward_items;
            if (!item) return null;

            return (
              <Col xs={24} sm={12} md={8} key={reward.id}>
                <Card
                  size="small"
                  style={{
                    border: `2px solid ${getRarityColor(item.rarity)}`,
                    borderRadius: 8,
                    backgroundColor: '#FFF',
                  }}
                  styles={{ body: { padding: 12 } }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size={8}>
                    <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Space>
                        <GiftOutlined style={{ color: getRarityColor(item.rarity), fontSize: 16 }} />
                        <Text strong style={{ fontSize: 14 }}>
                          {getRewardTypeLabel(item.reward_type)}
                        </Text>
                      </Space>
                      <Tag color={getRarityColor(item.rarity)} style={{ margin: 0 }}>
                        {getRarityLabel(item.rarity)}
                      </Tag>
                    </Space>

                    <Divider style={{ margin: '4px 0' }} />

                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="Số lượng">
                        <Text strong>{item.amount_min} - {item.amount_max}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Trọng số">
                        <Text strong>{item.weight}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Loại ràng buộc">
                        <Tag color="gold">{item.bound_type}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => fetchGuaranteedDrops()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space align="center">
              <TrophyOutlined style={{ fontSize: 28, color: '#D4AF37' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#8B0000' }}>
                  Phần thưởng đảm bảo
                </Title>
                <Text type="secondary">
                  Thiết lập phần thưởng sẽ nhận sau mỗi N lần mở hòm
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              size="large"
              style={{
                background: '#8B0000',
                borderColor: '#D4AF37',
                fontWeight: 600,
              }}
            >
              Thêm phần thưởng đảm bảo
            </Button>
          </Col>
        </Row>

        {loading && guaranteedDrops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : guaranteedDrops && guaranteedDrops.length > 0 ? (
          <Table
            dataSource={guaranteedDrops}
            rowKey="id"
            columns={columns}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => (record.loot_box_guaranteed_rewards?.length || 0) > 0,
            }}
            pagination={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text>Chưa có phần thưởng đảm bảo nào</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Nhấn nút "Thêm phần thưởng đảm bảo" để bắt đầu
                </Text>
              </div>
            }
            style={{ padding: 48 }}
          />
        )}
      </Card>

      {/* Modal for Create/Edit */}
      <Modal
        title={
          <Space>
            {editingDrop ? <EditOutlined /> : <PlusOutlined />}
            <span style={{ color: '#8B0000', fontSize: 18, fontWeight: 600 }}>
              {editingDrop ? 'Chỉnh sửa phần thưởng đảm bảo' : 'Thêm phần thưởng đảm bảo mới'}
            </span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal} icon={<CloseOutlined />}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            icon={<SaveOutlined />}
            loading={loading}
            style={{
              background: '#8B0000',
              borderColor: '#D4AF37',
            }}
          >
            {editingDrop ? 'Cập nhật' : 'Tạo mới'}
          </Button>,
        ]}
        width={700}
        styles={{
          body: {
            padding: '24px',
            backgroundColor: '#FDF8E7',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            open_count: 1,
            reset_after_claim: true,
          }}
        >
          <Form.Item
            label="Id"
            name="id"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <Space>
                <span style={{ fontWeight: 600 }}>Số lần mở</span>
                <Tooltip title="Số lần mở hòm để nhận được phần thưởng này">
                  <WarningOutlined style={{ color: '#CD7F32' }} />
                </Tooltip>
              </Space>
            }
            name="open_count"
            rules={[
              { required: true, message: 'Vui lòng nhập số lần mở' },
              {
                validator: async (_, value) => {
                  if (!editingDrop && value && !validateOpenCount(value, guaranteedDrops)) {
                    throw new Error(`Số lần mở ${value} đã tồn tại`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
            extra="Số lần mở phải là duy nhất và lớn hơn 0"
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Nhập số lần mở"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Đặt lại sau khi nhận"
            name="reset_after_claim"
            valuePropName="checked"
            extra="Nếu bật, bộ đếm sẽ reset về 0 sau khi nhận thưởng"
          >
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              style={{
                backgroundColor: form.getFieldValue('reset_after_claim') ? '#2E8B57' : '#DC143C'
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <span style={{ fontWeight: 600 }}>Chọn phần thưởng</span>
                <Tooltip title="Chọn các phần thưởng sẽ được trao khi đạt số lần mở">
                  <GiftOutlined style={{ color: '#D4AF37' }} />
                </Tooltip>
              </Space>
            }
            required
          >
            <Select
              mode="multiple"
              value={selectedRewardIds}
              onChange={setSelectedRewardIds}
              placeholder="Chọn phần thưởng"
              style={{ width: '100%' }}
              size="large"
              loading={rewardLoading}
              optionLabelProp="label"
              maxTagCount="responsive"
            >
              {filteredRewardItems.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  label={
                    <Space>
                      <Tag color={getRarityColor(item.rarity)}>
                        {getRarityLabel(item.rarity)}
                      </Tag>
                      <span> {item.base_items?.name ?? ""}:{getRewardTypeLabel(item.reward_type)}</span>
                    </Space>
                  }
                >
                  <Space direction="vertical" size={0}>
                    <Space>
                      <Tag color={getRarityColor(item.rarity)}>
                        {getRarityLabel(item.rarity)}
                      </Tag>
                      <span style={{ fontWeight: 500 }}>
                        {getRewardTypeLabel(item.reward_type)}
                      </span>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Số lượng: {item.amount_min} - {item.amount_max} | Trọng số: {item.weight}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tên:
                      {item.base_items?.name ?? "unknown"}
                    </Text>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRewardIds.length > 0 && (
            <Alert
              message={`Đã chọn ${selectedRewardIds.length} phần thưởng`}
              type="success"
              icon={<CheckCircleOutlined />}
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Form>
      </Modal>
    </>
  );
};
