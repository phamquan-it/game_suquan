// components/player/PlayerBeautyManager.tsx
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
  Tooltip,
  message,
  Select,
  Tabs,
  Progress,
  Table,
  Badge,
  Skeleton,
  Divider,
  Typography,
  Image,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  PlusOutlined,
  StarOutlined,
  TrophyOutlined,
  SmileOutlined,
  CrownOutlined,
  FireOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { usePlayerBeauties } from "../hooks/usePlayerBeauties";
import { PlayerBeautyWithDetail } from "../types/player-beauty";

const { Title, Text } = Typography;
const { Option } = Select;

interface PlayerBeautyManagerProps {
  playerId: string;
  availableBeauties?: Array<{
    id: string;
    name: string;
    title: string;
    rarity: string;
    avatar: string;
    level: number;
    full_image?: string;
  }>;
  onBeautyAdded?: () => void;
  onBeautyRemoved?: () => void;
  readOnly?: boolean;
}

const rarityColors = {
  common: "#808079",
  rare: "#0E90FF",
  epic: "#9931CC",
  legendary: "#FF7C00",
};

const rarityNames = {
  common: "Thường",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
};

const rarityIcons = {
  common: <SmileOutlined />,
  rare: <StarOutlined />,
  epic: <CrownOutlined />,
  legendary: <FireOutlined />,
};

const statusColors = {
  available: "#1E8B57",
  mission: "#FF7C00",
  training: "#0E90FF",
  resting: "#DC142C",
};

const statusNames = {
  available: "Sẵn sàng",
  mission: "Đang nhiệm vụ",
  training: "Đang huấn luyện",
  resting: "Nghỉ ngơi",
};

const statusIcons = {
  available: <SmileOutlined />,
  mission: <TrophyOutlined />,
  training: <FireOutlined />,
  resting: <ClockCircleOutlined />,
};

export function PlayerBeautyManager({
  playerId,
  availableBeauties = [],
  onBeautyAdded,
  onBeautyRemoved,
  readOnly = false,
}: PlayerBeautyManagerProps) {
  const { data, loading, addBeauty, removeBeauty, refetch } =
    usePlayerBeauties(playerId);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedBeautyId, setSelectedBeautyId] = useState<string>();
  const [addingBeauty, setAddingBeauty] = useState(false);
  const [activeTab, setActiveTab] = useState("owned");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Get owned beauty IDs
  const ownedBeautyIds = data.map((beauty) => beauty.beauty_id);

  // Filter available beauties that are not owned
  const unownedBeauties = availableBeauties.filter(
    (beauty) => !ownedBeautyIds.includes(beauty.id)
  );

  const handleAddBeauty = async () => {
    if (!selectedBeautyId) {
      message.warning("Vui lòng chọn mỹ nhân");
      return;
    }

    setAddingBeauty(true);
    const { error } = await addBeauty(selectedBeautyId);
    setAddingBeauty(false);

    if (!error) {
      message.success("Thêm mỹ nhân thành công!");
      setAddModalVisible(false);
      setSelectedBeautyId(undefined);
      onBeautyAdded?.();
    } else {
      message.error("Thêm mỹ nhân thất bại");
    }
  };

  const handleRemoveBeauty = async (beautyId: string, beautyName: string) => {
    const { error } = await removeBeauty(beautyId);
    if (!error) {
      message.success(`Đã xóa ${beautyName} khỏi bộ sưu tập!`);
      onBeautyRemoved?.();
    } else {
      message.error("Xóa mỹ nhân thất bại");
    }
  };

  // Table columns for owned beauties
  const ownedColumns: ColumnsType<PlayerBeautyWithDetail> = [
    {
      title: "Mỹ nhân",
      key: "beauty",
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={48}
            src={record.beauty.avatar}
            icon={<HeartOutlined />}
            style={{ border: `2px solid ${rarityColors[record.beauty.rarity]}` }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.beauty.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.beauty.title}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Độ hiếm",
      dataIndex: ["beauty", "rarity"],
      key: "rarity",
      width: 120,
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
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      width: 100,
      render: (level) => <Tag color="blue">Lv.{level}</Tag>,
    },
    {
      title: "Thân mật",
      key: "intimacy",
      width: 200,
      render: (_, record) => {
        const maxPoints = record.intimacy_level * 100;
        const progress = (record.intimacy_points / maxPoints) * 100;
        return (
          <div>
            <Space>
              <HeartFilled style={{ color: "#DC142C" }} />
              <Text strong>Cấp {record.intimacy_level}</Text>
            </Space>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              style={{ marginTop: 4 }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.intimacy_points}/{maxPoints}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Kinh nghiệm",
      key: "experience",
      width: 150,
      render: (_, record) => {
        const maxExp = record.level * 100;
        const progress = (record.experience / maxExp) * 100;
        return (
          <div>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              strokeColor="#0E90FF"
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.experience}/{maxExp}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: keyof typeof statusColors) => (
        <Badge
          color={statusColors[status]}
          text={
            <Space size={4}>
              {statusIcons[status]}
              <Text style={{ color: statusColors[status], fontSize: 13 }}>
                {statusNames[status]}
              </Text>
            </Space>
          }
        />
      ),
    },
    {
      title: "Ngày nhận",
      dataIndex: "acquisition_date",
      key: "acquisition_date",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    ...(!readOnly
      ? [
        {
          title: "Thao tác",
          key: "action",
          width: 100,
          fixed: "right" as const,
          render: (_: any, record: PlayerBeautyWithDetail) => (
            <Popconfirm
              title="Xóa mỹ nhân"
              description={`Bạn có chắc chắn muốn xóa ${record.beauty.name} khỏi bộ sưu tập?`}
              onConfirm={() =>
                handleRemoveBeauty(record.beauty_id, record.beauty.name)
              }
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          ),
        },
      ]
      : []),
  ];

  // Table columns for available beauties
  const availableColumns: ColumnsType<(typeof availableBeauties)[0]> = [
    {
      title: "Mỹ nhân",
      key: "beauty",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={48}
            src={record.avatar}
            icon={<HeartOutlined />}
            style={{ border: `2px solid ${rarityColors[record.rarity as keyof typeof rarityColors]}` }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.title}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Độ hiếm",
      dataIndex: "rarity",
      key: "rarity",
      width: 120,
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
      title: "Cấp độ cơ bản",
      dataIndex: "level",
      key: "level",
      width: 120,
      render: (level) => <Tag color="blue">Lv.{level}</Tag>,
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
            setSelectedBeautyId(record.id);
            handleAddBeauty();
          }}
        >
          Thêm
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active avatar paragraph={{ rows: 5 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Thêm mỹ nhân
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "owned",
            label: `Đã sở hữu (${data.length})`,
            icon: <HeartFilled />,
            children:
              data.length === 0 ? (
                <Empty
                  description="Chưa có mỹ nhân nào trong bộ sưu tập"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Table
                  columns={ownedColumns}
                  dataSource={data}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} mỹ nhân`,
                  }}
                  scroll={{ x: 1000 }}
                  bordered
                />
              ),
          },
          ...(!readOnly && unownedBeauties.length > 0
            ? [
              {
                key: "available",
                label: `Có thể thêm (${unownedBeauties.length})`,
                icon: <PlusOutlined />,
                children: (
                  <Table
                    columns={availableColumns}
                    dataSource={unownedBeauties}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} mỹ nhân`,
                    }}
                    scroll={{ x: 800 }}
                    bordered
                  />
                ),
              },
            ]
            : []),
        ]}
      />

      {/* Add Beauty Modal */}
      <Modal
        title="Thêm mỹ nhân mới"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedBeautyId(undefined);
        }}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="add"
            type="primary"
            loading={addingBeauty}
            onClick={handleAddBeauty}
          >
            Thêm mỹ nhân
          </Button>,
        ]}
        width={600}
      >
        <Select
          placeholder="Chọn mỹ nhân để thêm"
          style={{ width: "100%" }}
          value={selectedBeautyId}
          onChange={setSelectedBeautyId}
          showSearch
          optionFilterProp="children"
          size="large"
        >
          {unownedBeauties.map((beauty) => (
            <Option key={beauty.id} value={beauty.id}>
              <Space>
                <Avatar size="small" src={beauty.avatar} />
                <span>{beauty.name}</span>
                <Tag
                  color={rarityColors[beauty.rarity as keyof typeof rarityColors]}
                >
                  {rarityNames[beauty.rarity as keyof typeof rarityNames]}
                </Tag>
              </Space>
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="auto"
        centered
      >
        <Image
          src={previewImage || ""}
          alt="Preview"
          style={{ width: "100%" }}
          preview={false}
        />
      </Modal>
    </div>
  );
}
