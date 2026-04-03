// components/player/PlayerItemsManager.tsx
"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Card,
  Avatar,
  Tag,
  Space,
  Empty,
  message,
  Select,
  Tabs,
  Table,
  Badge,
  Skeleton,
  Typography,
  InputNumber,
  Popconfirm,
  Slider,
  Alert,
  Statistic,
  Row,
  Col,
  Progress,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  GiftOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  StarOutlined,
  CrownOutlined,
  FireOutlined,
  ShoppingOutlined,
  WarningOutlined,
  ReloadOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import { usePlayerItems } from "../hooks/usePlayerItems";
import { BaseItem, PlayerItemWithDetail } from "../types/player-item";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PlayerItemsManagerProps {
  playerId: string;
  availableItems?: Array<BaseItem>;
  onItemAdded?: () => void;
  onItemRemoved?: () => void;
  readOnly?: boolean;
  showInventory?: boolean;
}

const rarityColors = {
  common: "#808079",
  uncommon: "#2E8B57",
  rare: "#0E90FF",
  epic: "#9931CC",
  legendary: "#FF7C00",
  mythic: "#DC142C",
};

const rarityNames = {
  common: "Thường",
  uncommon: "Không thường",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
  mythic: "Thần thoại",
};

const rarityIcons = {
  common: <MedicineBoxOutlined />,
  uncommon: <StarOutlined />,
  rare: <StarOutlined />,
  epic: <CrownOutlined />,
  legendary: <FireOutlined />,
  mythic: <FireOutlined />,
};

const qualityColors = {
  poor: "#808079",
  normal: "#0E90FF",
  good: "#2E8B57",
  excellent: "#9931CC",
  perfect: "#FF7C00",
  masterwork: "#DC142C",
};

const qualityNames = {
  poor: "Kém",
  normal: "Thường",
  good: "Tốt",
  excellent: "Tuyệt vời",
  perfect: "Hoàn hảo",
  masterwork: "Kiệt tác",
};

const itemTypeIcons = {
  weapon: "⚔️",
  armor: "🛡️",
  accessory: "💍",
  consumable: "🧪",
  material: "📦",
  currency: "💰",
  special: "✨",
  quest: "📜",
};

const itemTypeNames = {
  weapon: "Vũ khí",
  armor: "Giáp",
  accessory: "Phụ kiện",
  consumable: "Tiêu hao",
  material: "Nguyên liệu",
  currency: "Tiền tệ",
  special: "Đặc biệt",
  quest: "Nhiệm vụ",
};

export function PlayerItemsManager({
  playerId,
  availableItems = [],
  onItemAdded,
  onItemRemoved,
  readOnly = false,
  showInventory = true,
}: PlayerItemsManagerProps) {
  const { data, loading, addItem, removeItem, refetch } =
    usePlayerItems(playerId);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>();
  const [itemQuantity, setItemQuantity] = useState(1);
  const [addingItem, setAddingItem] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  // Get owned item IDs
  const ownedItemIds = data.map((item) => item.item_id);

  // Filter available items that are not owned or can be stacked
  const unownedItems = availableItems.filter(
    (item) => !ownedItemIds.includes(item.id)
  );

  // Group items by type for better organization
  const groupedItems = data.reduce((acc, item) => {
    const type = item.item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, PlayerItemWithDetail[]>);

  const handleAddItem = async () => {
    if (!selectedItemId) {
      message.warning("Vui lòng chọn vật phẩm");
      return;
    }

    const selectedItem = availableItems.find((item) => item.id === selectedItemId);
    if (!selectedItem) return;

    if (!selectedItem.stackable && itemQuantity > 1) {
      message.warning("Vật phẩm này không thể xếp chồng, chỉ có thể thêm 1 mỗi lần");
      return;
    }

    if (selectedItem.stackable && itemQuantity > selectedItem.max_stack) {
      message.warning(`Số lượng tối đa cho mỗi slot là ${selectedItem.max_stack}`);
      return;
    }

    setAddingItem(true);
    const { error } = await addItem(selectedItemId, itemQuantity);
    setAddingItem(false);

    if (!error) {
      messageApi.success(`Thêm ${itemQuantity} ${selectedItem.name} thành công!`);
      setAddModalVisible(false);
      setSelectedItemId(undefined);
      setItemQuantity(1);
      onItemAdded?.();
    } else {
      messageApi.error("Thêm vật phẩm thất bại");
    }
  };

  const handleRemoveItem = async (
    itemId: string,
    itemName: string,
    currentQuantity: number,
    removeQuantity?: number
  ) => {
    const quantity = removeQuantity || 1;

    if (quantity > currentQuantity) {
      messageApi.error("Số lượng xóa vượt quá số lượng hiện có");
      return;
    }

    const error = await removeItem(itemId, quantity);
    if (!error) {
      messageApi.success(`Đã xóa ${quantity} ${itemName}`);
      onItemRemoved?.();
    } else {
      message.error("Xóa vật phẩm thất bại");
    }
  };

  // Table columns for inventory
  const inventoryColumns: ColumnsType<PlayerItemWithDetail> = [
    {
      title: "Vật phẩm",
      key: "item",
      width: 280,
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={48}
            src={record.item.icon || record.item.svg_icon}
            icon={<GiftOutlined />}
            style={{
              backgroundColor: rarityColors[record.item.rarity as keyof typeof rarityColors] || "#666",
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.item.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.item.description || "Không có mô tả"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: ["item", "type"],
      key: "type",
      width: 100,
      render: (type: keyof typeof itemTypeNames) => (
        <Tag icon={<span>{itemTypeIcons[type] || "📦"}</span>}>
          {itemTypeNames[type] || type}
        </Tag>
      ),
    },
    {
      title: "Độ hiếm",
      dataIndex: ["item", "rarity"],
      key: "rarity",
      width: 110,
      render: (rarity: keyof typeof rarityColors) => (
        <Tag
          icon={rarityIcons[rarity]}
          color={rarityColors[rarity]}
          style={{ margin: 0 }}
        >
          {rarityNames[rarity]}
        </Tag>
      ),
    },
    {
      title: "Phẩm chất",
      dataIndex: ["item", "quality"],
      key: "quality",
      width: 100,
      render: (quality: keyof typeof qualityColors) => (
        <Tag color={qualityColors[quality]} style={{ margin: 0 }}>
          {qualityNames[quality]}
        </Tag>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (quantity, record) => (
        <Space>
          <span style={{ fontWeight: "bold", fontSize: 16 }}>{quantity}</span>
          {record.item.stackable && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              / {record.item.max_stack}
            </Text>
          )}
          {!record.item.stackable && quantity > 1 && (
            <Tag color="orange">Không xếp chồng</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Trang bị",
      dataIndex: "equipped",
      key: "equipped",
      width: 100,
      render: (equipped) =>
        equipped ? (
          <Badge status="success" text="Đã trang bị" />
        ) : (
          <Badge status="default" text="Chưa trang bị" />
        ),
    },
    {
      title: "Độ bền",
      dataIndex: "condition",
      key: "condition",
      width: 120,
      render: (condition) => {
        const percent = (condition / 100) * 100;
        return (
          <div>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor={percent > 70 ? "#2E8B57" : percent > 30 ? "#FF7C00" : "#DC142C"}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {condition}%
            </Text>
          </div>
        );
      },
    },
    {
      title: "Ngày nhận",
      dataIndex: "acquired_at",
      key: "acquired_at",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    ...(!readOnly
      ? [
        {
          title: "Thao tác",
          key: "action",
          width: 150,
          fixed: "right" as const,
          render: (_: any, record: PlayerItemWithDetail) => (
            <Space size="small">
              {record.item.type === "consumable" && (
                <Popconfirm
                  title="Sử dụng vật phẩm"
                  description={`Bạn có chắc muốn sử dụng ${record.item.name}?`}
                  onConfirm={() =>
                    handleRemoveItem(record.item_id, record.item.name, record.quantity, 1)
                  }
                  okText="Sử dụng"
                  cancelText="Hủy"
                >
                  <Button size="small" icon={<ReloadOutlined />}>
                    Sử dụng
                  </Button>
                </Popconfirm>
              )}
              <Popconfirm
                title="Xóa vật phẩm"
                description={
                  record.quantity > 1 ? (
                    <div>
                      <p>Bạn có muốn xóa toàn bộ {record.quantity} {record.item.name}?</p>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(record.item_id, record.item.name, record.quantity, 1);
                        }}
                      >
                        Xóa 1 cái
                      </Button>
                    </div>
                  ) : (
                    `Bạn có chắc chắn muốn xóa ${record.item.name}?`
                  )
                }
                onConfirm={() =>
                  handleRemoveItem(record.item_id, record.item.name, record.quantity)
                }
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ]
      : []),
  ];

  // Table columns for available items
  const availableColumns: ColumnsType<(typeof availableItems)[0]> = [
    {
      title: "Vật phẩm",
      key: "item",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={48}
            icon={<GiftOutlined />}
            style={{
              backgroundColor: rarityColors[record.rarity as keyof typeof rarityColors] || "#666",
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {itemTypeNames[record.type as keyof typeof itemTypeNames] || record.type}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Độ hiếm",
      dataIndex: "rarity",
      key: "rarity",
      width: 110,
      render: (rarity: keyof typeof rarityColors) => (
        <Tag
          icon={rarityIcons[rarity]}
          color={rarityColors[rarity]}
          style={{ margin: 0 }}
        >
          {rarityNames[rarity]}
        </Tag>
      ),
    },
    {
      title: "Phẩm chất",
      dataIndex: "quality",
      key: "quality",
      width: 100,
      render: (quality: keyof typeof qualityColors) => (
        <Tag color={qualityColors[quality]} style={{ margin: 0 }}>
          {qualityNames[quality]}
        </Tag>
      ),
    },
    {
      title: "Xếp chồng",
      key: "stack",
      width: 120,
      render: (_, record) =>
        record.stackable ? (
          <Tag color="green">Có (max {record.max_stack})</Tag>
        ) : (
          <Tag color="red">Không</Tag>
        ),
    },
    {
      title: "Giá trị",
      dataIndex: "base_value",
      key: "base_value",
      width: 100,
      render: (value) => (
        <Text strong>{value.toLocaleString("vi-VN")}</Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right" as const,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedItemId(record.id);
            setItemQuantity(1);
            setAddModalVisible(true);
          }}
        >
          Thêm
        </Button>
      ),
    },
  ];

  // Calculate inventory statistics
  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = data.length;
  const equippedItems = data.filter((item) => item.equipped).length;
  const totalValue = data.reduce(
    (sum, item) => sum + item.item.base_value * item.quantity,
    0
  );

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 0" }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          <GiftOutlined /> Quản lý vật phẩm
        </Title>
        {!readOnly && availableItems.length > 0 && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedItemId(undefined);
              setItemQuantity(1);
              setAddModalVisible(true);
            }}
          >
            Thêm vật phẩm
          </Button>
        )}
      </div>

      {/* Inventory Statistics */}
      {showInventory && data.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số lượng"
                value={totalItems}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ color: "#0E90FF" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Loại vật phẩm"
                value={uniqueItems}
                prefix={<GiftOutlined />}
                valueStyle={{ color: "#2E8B57" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang trang bị"
                value={equippedItems}
                prefix={<SettingOutlined />}
                valueStyle={{ color: "#FF7C00" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng giá trị"
                value={totalValue}
                prefix={<ShoppingOutlined />}
                suffix="VNĐ"
                valueStyle={{ color: "#DC142C" }}
                formatter={(value) => (value as number).toLocaleString("vi-VN")}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "inventory",
            label: `Kho đồ (${totalItems})`,
            icon: <BoxPlotOutlined />,
            children:
              data.length === 0 ? (
                <Empty
                  description="Kho đồ trống"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {!readOnly && availableItems.length > 0 && (
                    <Button
                      type="primary"
                      onClick={() => setAddModalVisible(true)}
                    >
                      Thêm vật phẩm đầu tiên
                    </Button>
                  )}
                </Empty>
              ) : (
                <Table
                  columns={inventoryColumns}
                  dataSource={data}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} vật phẩm`,
                  }}
                  scroll={{ x: 1200 }}
                  bordered
                />
              ),
          },
          ...(!readOnly && unownedItems.length > 0
            ? [
              {
                key: "available",
                label: `Có thể thêm (${unownedItems.length})`,
                icon: <PlusOutlined />,
                children: (
                  <Table
                    columns={availableColumns}
                    dataSource={unownedItems}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} vật phẩm`,
                    }}
                    scroll={{ x: 900 }}
                    bordered
                  />
                ),
              },
            ]
            : []),
        ]}
      />

      {/* Add Item Modal */}
      <Modal
        title="Thêm vật phẩm"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedItemId(undefined);
          setItemQuantity(1);
        }}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="add"
            type="primary"
            loading={addingItem}
            onClick={handleAddItem}
          >
            Thêm vật phẩm
          </Button>,
        ]}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Chọn vật phẩm</Text>
            <Select
              placeholder="Chọn vật phẩm để thêm"
              style={{ width: "100%", marginTop: 8 }}
              value={selectedItemId}
              onChange={(value) => {
                setSelectedItemId(value);
                const item = availableItems.find((i) => i.id === value);
                if (item && !item.stackable) {
                  setItemQuantity(1);
                }
              }}
              showSearch
              optionFilterProp="children"
              size="large"
            >
              {(selectedItemId ? [availableItems.find(i => i.id === selectedItemId), ...unownedItems.filter(i => i.id !== selectedItemId)] : unownedItems).map((item) => (
                <Option key={item?.id} value={item?.id}>
                  <Space>

                    <span>{item?.name}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          {selectedItemId && (
            <>
              <div>
                <Text strong>Số lượng</Text>
                <div style={{ marginTop: 8 }}>
                  <InputNumber
                    min={1}
                    max={
                      availableItems.find((i) => i.id === selectedItemId)?.stackable
                        ? availableItems.find((i) => i.id === selectedItemId)?.max_stack || 999
                        : 1
                    }
                    value={itemQuantity}
                    onChange={(value) => setItemQuantity(value || 1)}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </div>
              </div>

              {availableItems.find((i) => i.id === selectedItemId)?.stackable && (
                <div>
                  <Text strong>Chọn số lượng nhanh</Text>
                  <Slider
                    min={1}
                    max={
                      availableItems.find((i) => i.id === selectedItemId)?.max_stack || 999
                    }
                    value={itemQuantity}
                    onChange={(value) => setItemQuantity(value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
              )}

              <Alert
                message="Thông tin vật phẩm"
                description={
                  <div>
                    <p>
                      <strong>Loại:</strong>{" "}
                      {
                        itemTypeNames[
                        availableItems.find((i) => i.id === selectedItemId)
                          ?.type as keyof typeof itemTypeNames
                        ]
                      }
                    </p>
                    <p>
                      <strong>Xếp chồng:</strong>{" "}
                      {availableItems.find((i) => i.id === selectedItemId)?.stackable
                        ? `Có (tối đa ${availableItems.find((i) => i.id === selectedItemId)?.max_stack})`
                        : "Không"}
                    </p>
                    <p>
                      <strong>Giá trị:</strong>{" "}
                      {availableItems
                        .find((i) => i.id === selectedItemId)
                        ?.base_value.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                }
                type="info"
                showIcon
              />
            </>
          )}
        </Space>
      </Modal>
    </div>
  );
}
