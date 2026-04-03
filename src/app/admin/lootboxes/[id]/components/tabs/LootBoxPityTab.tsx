// components/lootbox/tabs/LootBoxPityTab.tsx
'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Descriptions,
  Badge,
  Empty,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Divider,
  Spin,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { RARITIES } from '../../../constants/lootbox.constants';
import { useLootBoxPitySystem } from '../../hooks/usePitySystem';

const { Title, Text } = Typography;
const { Option } = Select;

interface LootBoxPityTabProps {
  lootBoxId: string;
}

export const LootBoxPityTab: React.FC<LootBoxPityTabProps> = ({ lootBoxId }) => {
  const {
    data: pitySystem,
    loading,
    createPitySystem,
    updatePitySystem,
    deletePitySystem,
    addCounter,
    updateCounter,
    deleteCounter,
    addPityItem,
    deletePityItem,
    refetch,
  } = useLootBoxPitySystem(lootBoxId);

  const [isSystemModalVisible, setIsSystemModalVisible] = useState(false);
  const [isCounterModalVisible, setIsCounterModalVisible] = useState(false);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [counterForm] = Form.useForm();
  const [itemForm] = Form.useForm();

  const getRarityColor = (rarity: string) => {
    const rarityInfo = RARITIES.find(r => r.value === rarity);
    return rarityInfo?.color || '#808080';
  };

  const getRarityLabel = (rarity: string) => {
    const rarityInfo = RARITIES.find(r => r.value === rarity);
    return rarityInfo?.label || rarity;
  };

  const [messagegeApi, contextHolder] = message.useMessage();

  const handleSavePitySystem = async (values: any) => {
    try {
      if (pitySystem) {
        await updatePitySystem({
          enabled: values.enabled,
          reset_on_rare_drop: values.reset_on_rare_drop,
        });
        messagegeApi.success('Cập nhật hệ thống tích lũy thành công');
      } else {
        await createPitySystem();
        if (values.enabled !== undefined || values.reset_on_rare_drop !== undefined) {
          await updatePitySystem({
            enabled: values.enabled,
            reset_on_rare_drop: values.reset_on_rare_drop,
          });
        }
        messagegeApi.success('Tạo hệ thống tích lũy thành công');
      }
      setIsSystemModalVisible(false);
      await refetch();
    } catch (error) {
      messagegeApi.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDeletePitySystem = async () => {
    if (!pitySystem) return;
    try {
      await deletePitySystem();
      messagegeApi.success('Xóa hệ thống tích lũy thành công');
      setIsSystemModalVisible(false);
      await refetch();
    } catch (error) {
      messagegeApi.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleSaveCounter = async (values: any) => {
    if (!pitySystem) return;
    try {
      if (selectedCounter) {
        await updateCounter(selectedCounter.id, {
          rarity: values.rarity,
          threshold: values.threshold,
        });
        messagegeApi.success('Cập nhật bộ đếm thành công');
      } else {
        await addCounter({
          pity_system_id: pitySystem.id,
          rarity: values.rarity,
          threshold: values.threshold,
        });
        messagegeApi.success('Tạo bộ đếm thành công');
      }
      setIsCounterModalVisible(false);
      setSelectedCounter(null);
      counterForm.resetFields();
      await refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDeleteCounter = async (counterId: string) => {
    try {
      await deleteCounter(counterId);
      messagegeApi.success('Xóa bộ đếm thành công');
      await refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleSaveItem = async (values: any) => {
    if (!selectedCounter) return;
    try {
      await addPityItem({
        pity_counter_id: selectedCounter.id,
        reward_item_id: values.reward_item_id,
        weight: values.weight,
      });
      message.success(editingItem ? 'Cập nhật vật phẩm thành công' : 'Thêm vật phẩm thành công');
      setIsItemModalVisible(false);
      setSelectedCounter(null);
      setEditingItem(null);
      itemForm.resetFields();
      await refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deletePityItem(itemId);
      message.success('Xóa vật phẩm thành công');
      await refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const openCounterModal = (counter?: any) => {
    if (counter) {
      setSelectedCounter(counter);
      counterForm.setFieldsValue({
        rarity: counter.rarity,
        threshold: counter.threshold,
      });
    } else {
      setSelectedCounter(null);
      counterForm.resetFields();
    }
    setIsCounterModalVisible(true);
  };

  const openItemModal = (counter: any, item?: any) => {
    setSelectedCounter(counter);
    if (item) {
      setEditingItem(item);
      itemForm.setFieldsValue({
        reward_item_id: item.reward_item_id,
        weight: item.weight,
      });
    } else {
      setEditingItem(null);
      itemForm.resetFields();
    }
    setIsItemModalVisible(true);
  };

  const openSystemModal = () => {
    if (pitySystem) {
      form.setFieldsValue({
        enabled: pitySystem.enabled,
        reset_on_rare_drop: pitySystem.reset_on_rare_drop,
      });
    } else {
      form.setFieldsValue({
        enabled: true,
        reset_on_rare_drop: true,
      });
    }
    setIsSystemModalVisible(true);
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Cấu hình hệ thống tích lũy</Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={openSystemModal}
            >
              {pitySystem ? 'Cấu hình tích lũy' : 'Thiết lập tích lũy'}
            </Button>
            {pitySystem && (
              <Button
                icon={<ReloadOutlined />}
                onClick={refetch}
              >
                Làm mới
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {pitySystem ? (
        <>
          <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Trạng thái">
              <Badge
                status={pitySystem.enabled ? 'success' : 'default'}
                text={pitySystem.enabled ? 'Đã bật' : 'Đã tắt'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Đặt lại khi nhận vật phẩm hiếm">
              <Badge
                status={pitySystem.reset_on_rare_drop ? 'processing' : 'default'}
                text={pitySystem.reset_on_rare_drop ? 'Có' : 'Không'}
              />
            </Descriptions.Item>
          </Descriptions>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5}>Bộ đếm tích lũy</Title>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => openCounterModal()}
            >
              Thêm bộ đếm
            </Button>
          </div>

          {pitySystem.pity_counters && pitySystem.pity_counters.length > 0 ? (
            <Table
              dataSource={pitySystem.pity_counters}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: 'Độ hiếm',
                  dataIndex: 'rarity',
                  key: 'rarity',
                  render: (rarity) => (
                    <Tag color={getRarityColor(rarity)}>
                      {getRarityLabel(rarity).toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: 'Ngưỡng',
                  dataIndex: 'threshold',
                  key: 'threshold',
                  render: (threshold) => <Text strong>{threshold} lần mở</Text>,
                },
                {
                  title: 'Vật phẩm',
                  key: 'items',
                  render: (_, record) => (
                    <Tag color="purple">{record.pity_items?.length || 0} vật phẩm</Tag>
                  ),
                },
                {
                  title: 'Thao tác',
                  key: 'actions',
                  width: 150,
                  render: (_, record) => (
                    <Space>
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => openCounterModal(record)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Xóa bộ đếm?"
                        description="Hành động này sẽ xóa tất cả vật phẩm liên quan"
                        onConfirm={() => handleDeleteCounter(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Tooltip title="Xóa">
                          <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ paddingLeft: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Title level={5}>Vật phẩm đảm bảo</Title>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => openItemModal(record)}
                      >
                        Thêm vật phẩm
                      </Button>
                    </div>
                    {record.pity_items && record.pity_items.length > 0 ? (
                      <Table
                        dataSource={record.pity_items}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        columns={[
                          {
                            title: 'Vật phẩm thưởng',
                            dataIndex: 'reward_item',
                            key: 'reward_item',
                            render: (rewardItem) => (
                              <Space>
                                <Tag color="blue">{rewardItem?.reward_type}</Tag>
                                <Text>
                                  {rewardItem?.item_id ||
                                    rewardItem?.currency_type ||
                                    rewardItem?.reward_type ||
                                    'N/A'}
                                </Text>
                                {rewardItem?.amount_min && rewardItem?.amount_max && (
                                  <Text type="secondary">
                                    ({rewardItem.amount_min}-{rewardItem.amount_max})
                                  </Text>
                                )}
                              </Space>
                            ),
                          },
                          {
                            title: 'Trọng số',
                            dataIndex: 'weight',
                            key: 'weight',
                            render: (weight) => <Tag color="purple">{weight}</Tag>,
                          },
                          {
                            title: 'Thao tác',
                            key: 'actions',
                            width: 100,
                            render: (_, item) => (
                              <Space>
                                <Popconfirm
                                  title="Xóa vật phẩm?"
                                  onConfirm={() => handleDeleteItem(item.id)}
                                  okText="Xóa"
                                  cancelText="Hủy"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Tooltip title="Xóa">
                                    <Button
                                      type="link"
                                      size="small"
                                      danger
                                      icon={<DeleteOutlined />}
                                    />
                                  </Tooltip>
                                </Popconfirm>
                              </Space>
                            ),
                          },
                        ]}
                      />
                    ) : (
                      <Empty description="Chưa cấu hình vật phẩm" />
                    )}
                  </div>
                ),
              }}
            />
          ) : (
            <Empty description="Chưa cấu hình bộ đếm tích lũy">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openCounterModal()}
              >
                Thêm bộ đếm đầu tiên
              </Button>
            </Empty>
          )}
        </>
      ) : (
        <Empty description="Chưa cấu hình hệ thống tích lũy">
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={openSystemModal}
          >
            Thiết lập tích lũy
          </Button>
        </Empty>
      )}

      {/* Modal cấu hình hệ thống pity */}
      <Modal
        title={pitySystem ? "Cấu hình hệ thống tích lũy" : "Thiết lập hệ thống tích lũy"}
        open={isSystemModalVisible}
        onCancel={() => setIsSystemModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSavePitySystem}
        >
          <Form.Item
            name="enabled"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="reset_on_rare_drop"
            label="Đặt lại khi nhận vật phẩm hiếm"
            valuePropName="checked"
            tooltip="Khi người chơi nhận được vật phẩm hiếm, bộ đếm tích lũy sẽ được đặt lại"
          >
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsSystemModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
              >
                Lưu
              </Button>
              {pitySystem && (
                <Popconfirm
                  title="Xóa hệ thống tích lũy?"
                  description="Hành động này sẽ xóa tất cả bộ đếm và vật phẩm liên quan"
                  onConfirm={handleDeletePitySystem}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger>
                    Xóa hệ thống
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cấu hình bộ đếm */}
      <Modal
        title={selectedCounter ? "Cập nhật bộ đếm" : "Thêm bộ đếm mới"}
        open={isCounterModalVisible}
        onCancel={() => {
          setIsCounterModalVisible(false);
          setSelectedCounter(null);
          counterForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={counterForm}
          layout="vertical"
          onFinish={handleSaveCounter}
        >
          <Form.Item
            name="rarity"
            label="Độ hiếm"
            rules={[{ required: true, message: 'Vui lòng chọn độ hiếm' }]}
          >
            <Select placeholder="Chọn độ hiếm">
              {RARITIES.map(rarity => (
                <Option key={rarity.value} value={rarity.value}>
                  <Tag color={rarity.color}>{rarity.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="threshold"
            label="Ngưỡng kích hoạt"
            rules={[{ required: true, message: 'Vui lòng nhập ngưỡng' }]}
            tooltip="Số lần mở rương tối đa trước khi nhận được vật phẩm đảm bảo"
          >
            <InputNumber
              min={1}
              max={1000}
              style={{ width: '100%' }}
              placeholder="Nhập số lần mở"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsCounterModalVisible(false);
                setSelectedCounter(null);
                counterForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedCounter ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cấu hình vật phẩm */}
      <Modal
        title={editingItem ? "Cập nhật vật phẩm" : "Thêm vật phẩm"}
        open={isItemModalVisible}
        onCancel={() => {
          setIsItemModalVisible(false);
          setSelectedCounter(null);
          setEditingItem(null);
          itemForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={itemForm}
          layout="vertical"
          onFinish={handleSaveItem}
        >
          {!editingItem && (
            <Form.Item
              name="reward_item_id"
              label="Vật phẩm thưởng"
              rules={[{ required: true, message: 'Vui lòng chọn vật phẩm' }]}
            >
              <Select
                placeholder="Chọn vật phẩm thưởng"
                showSearch
                optionFilterProp="children"
              >
                {/* You'll need to fetch available reward items here */}
                <Option value="sample">Sample Item</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="weight"
            label="Trọng số"
            rules={[{ required: true, message: 'Vui lòng nhập trọng số' }]}
            initialValue={100}
            tooltip="Trọng số càng cao, tỷ lệ xuất hiện càng lớn"
          >
            <InputNumber
              min={1}
              max={10000}
              style={{ width: '100%' }}
              placeholder="Nhập trọng số"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsItemModalVisible(false);
                setSelectedCounter(null);
                setEditingItem(null);
                itemForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
