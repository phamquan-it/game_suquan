// components/player/PlayerGeneralsManager.tsx
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
  Table,
  Badge,
  Skeleton,
  Divider,
  Typography,
  InputNumber,
  Popconfirm,
  Slider,
  Alert,
  Statistic,
  Row,
  Col,
  Progress,
  Rate,
  Switch,
  Descriptions,
  Form,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  CrownOutlined,
  FireOutlined,
  HeartOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  RiseOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { usePlayerGenerals } from "../hooks/usePlayerGenerals";
import { useAllGenerals } from "../hooks/useAllGenerals";
import { PlayerGeneralWithDetail, General } from "../types/player-general";
import { ShieldIcon } from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

interface PlayerGeneralsManagerProps {
  playerId: string;
  onGeneralAdded?: () => void;
  onGeneralRemoved?: () => void;
  readOnly?: boolean;
}

const rarityColors = {
  common: "#808079",
  rare: "#0E90FF",
  epic: "#9931CC",
  legendary: "#FF7C00",
  mythic: "#DC142C",
};

const rarityNames = {
  common: "Thường",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
  mythic: "Thần thoại",
};

const rarityIcons = {
  common: <UserOutlined />,
  rare: <StarOutlined />,
  epic: <CrownOutlined />,
  legendary: <FireOutlined />,
  mythic: <FireOutlined />,
};

const elementColors = {
  fire: "#FF4D4F",
  water: "#1890FF",
  earth: "#52C41A",
  wind: "#13C2C2",
  light: "#FAAD14",
  dark: "#722ED1",
};

const elementNames = {
  fire: "Hỏa",
  water: "Thủy",
  earth: "Thổ",
  wind: "Phong",
  light: "Quang",
  dark: "Hắc",
};

const elementIcons = {
  fire: <FireOutlined />,
  water: <ThunderboltOutlined />,
  earth: <ShieldIcon />,
  wind: <RiseOutlined />,
  light: <StarOutlined />,
  dark: <CrownOutlined />,
};

export function PlayerGeneralsManager({
  playerId,
  onGeneralAdded,
  onGeneralRemoved,
  readOnly = false,
}: PlayerGeneralsManagerProps) {
  const { data, loading, addGeneral, removeGeneral, toggleFavorite, refetch } =
    usePlayerGenerals(playerId);
  const { data: allGenerals, loading: loadingGenerals } = useAllGenerals();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedGeneralId, setSelectedGeneralId] = useState<string>();
  const [addingGeneral, setAddingGeneral] = useState(false);
  const [activeTab, setActiveTab] = useState("owned");
  const [selectedGeneral, setSelectedGeneral] = useState<General | null>(null);
  const [statsForm, setStatsForm] = useState({
    attack: 0,
    defense: 0,
    health: 0,
    speed: 0,
    intelligence: 0,
    leadership: 0,
  });

  // Get owned general IDs
  const ownedGeneralIds = data.map((general) => general.general_id);

  // Filter available generals that are not owned
  const unownedGenerals = allGenerals.filter(
    (general) => !ownedGeneralIds.includes(general.id)
  );

  const handleSelectGeneral = (generalId: string) => {
    setSelectedGeneralId(generalId);
    const general = allGenerals.find((g) => g.id === generalId);
    if (general) {
      setSelectedGeneral(general);
      setStatsForm({
        attack: general.base_attack,
        defense: general.base_defense,
        health: general.base_health,
        speed: general.base_speed,
        intelligence: general.base_intelligence,
        leadership: general.base_leadership,
      });
    }
  };

  const handleAddGeneral = async () => {
    if (!selectedGeneralId || !selectedGeneral) {
      message.warning("Vui lòng chọn tướng");
      return;
    }

    setAddingGeneral(true);
    const { error } = await addGeneral({
      general_id: selectedGeneralId,
      stats: statsForm,
    });
    setAddingGeneral(false);

    if (!error) {
      message.success(`Thêm ${selectedGeneral.name} thành công!`);
      setAddModalVisible(false);
      setSelectedGeneralId(undefined);
      setSelectedGeneral(null);
      onGeneralAdded?.();
    } else {
      message.error("Thêm tướng thất bại");
    }
  };

  const handleRemoveGeneral = async (id: string, generalName: string) => {
    const { error } = await removeGeneral(id);
    if (!error) {
      message.success(`Đã xóa ${generalName} khỏi đội hình!`);
      onGeneralRemoved?.();
    } else {
      message.error("Xóa tướng thất bại");
    }
  };

  const handleToggleFavorite = async (id: string, favorite: boolean) => {
    const { error } = await toggleFavorite(id, favorite);
    if (!error) {
      message.success(favorite ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
    }
  };

  // Calculate stats for a general
  const calculateTotalStats = (general: PlayerGeneralWithDetail) => {
    const baseStats = {
      attack: general.general.base_attack,
      defense: general.general.base_defense,
      health: general.general.base_health,
      speed: general.general.base_speed,
      intelligence: general.general.base_intelligence,
      leadership: general.general.base_leadership,
    };

    const currentStats = {
      attack: general.current_attack,
      defense: general.current_defense,
      health: general.current_health,
      speed: general.current_speed,
      intelligence: general.current_intelligence,
      leadership: general.current_leadership,
    };

    const bonus = {
      attack: currentStats.attack - baseStats.attack,
      defense: currentStats.defense - baseStats.defense,
      health: currentStats.health - baseStats.health,
      speed: currentStats.speed - baseStats.speed,
      intelligence: currentStats.intelligence - baseStats.intelligence,
      leadership: currentStats.leadership - baseStats.leadership,
    };

    return { baseStats, currentStats, bonus };
  };

  // Table columns for owned generals
  const ownedColumns: ColumnsType<PlayerGeneralWithDetail> = [
    {
      title: "Tướng",
      key: "general",
      width: 280,
      fixed: "left",
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={56}
            src={record.general.thumbnail || record.general.image}
            icon={<UserOutlined />}
            style={{
              border: `2px solid ${rarityColors[record.general.rarity]}`,
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.general.name}
              {record.favorite && (
                <HeartOutlined style={{ color: "#DC142C", marginLeft: 8 }} />
              )}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.general.title || "Chưa có danh hiệu"}
            </div>
            <Space size={4} style={{ marginTop: 4 }}>
              <Tag
                icon={rarityIcons[record.general.rarity]}
                color={rarityColors[record.general.rarity]}
              >
                {rarityNames[record.general.rarity]}
              </Tag>
              <Tag
                icon={elementIcons[record.general.element]}
                color={elementColors[record.general.element]}
              >
                {elementNames[record.general.element]}
              </Tag>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: "Cấp độ",
      key: "level",
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong>Lv.{record.level}</Text>
          <Progress
            percent={(record.experience / (record.level * 100)) * 100}
            size="small"
            showInfo={false}
            style={{ marginTop: 4 }}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.experience}/{record.level * 100} EXP
          </Text>
        </div>
      ),
    },
    {
      title: "Sao",
      dataIndex: "star_level",
      key: "star_level",
      width: 120,
      render: (starLevel, record) => (
        <div>
          <Rate
            disabled
            value={starLevel}
            count={record.max_star_level}
            style={{ fontSize: 14 }}
          />
          <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
            {starLevel}/{record.max_star_level}
          </Text>
        </div>
      ),
    },
    {
      title: "Thức tỉnh",
      dataIndex: "awakening_level",
      key: "awakening_level",
      width: 100,
      render: (level) => (
        <Tag color="purple">
          <CrownOutlined /> Cấp {level}
        </Tag>
      ),
    },
    {
      title: "Chiến thuật",
      key: "stats",
      width: 200,
      render: (_, record) => {
        const { bonus } = calculateTotalStats(record);
        return (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text strong>Công: </Text>
              <Text>{record.current_attack}</Text>
              {bonus.attack > 0 && (
                <Text type="success" style={{ fontSize: 11 }}>
                  {" "}
                  (+{bonus.attack})
                </Text>
              )}
            </div>
            <div>
              <Text strong>Thủ: </Text>
              <Text>{record.current_defense}</Text>
              {bonus.defense > 0 && (
                <Text type="success" style={{ fontSize: 11 }}>
                  {" "}
                  (+{bonus.defense})
                </Text>
              )}
            </div>
            <div>
              <Text strong>Máu: </Text>
              <Text>{record.current_health}</Text>
              {bonus.health > 0 && (
                <Text type="success" style={{ fontSize: 11 }}>
                  {" "}
                  (+{bonus.health})
                </Text>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Thông số khác",
      key: "otherStats",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <ThunderboltOutlined /> Tốc độ: {record.current_speed}
          </div>
          <div>
            <RiseOutlined /> Trí tuệ: {record.current_intelligence}
          </div>
          <div>
            <TeamOutlined /> Lãnh đạo: {record.current_leadership}
          </div>
        </Space>
      ),
    },
    {
      title: "Chiến tích",
      key: "battle",
      width: 120,
      render: (_, record) => (
        <div>
          <div>
            <TrophyOutlined /> Trận: {record.battle_count}
          </div>
          <div>
            <RiseOutlined /> Tỉ lệ thắng: {record.win_rate}%
          </div>
        </div>
      ),
    },
    {
      title: "Yêu thích",
      dataIndex: "favorite",
      key: "favorite",
      width: 100,
      render: (favorite, record) =>
        !readOnly ? (
          <Switch
            checked={favorite}
            onChange={(checked) => handleToggleFavorite(record.id, checked)}
            checkedChildren={<HeartOutlined />}
            unCheckedChildren={<HeartOutlined />}
          />
        ) : (
          <Badge
            status={favorite ? "success" : "default"}
            text={favorite ? "Đã thích" : "Chưa thích"}
          />
        ),
    },
    ...(!readOnly
      ? [
        {
          title: "Thao tác",
          key: "action",
          width: 100,
          fixed: "right" as const,
          render: (_: any, record: PlayerGeneralWithDetail) => (
            <Popconfirm
              title="Xóa tướng"
              description={`Bạn có chắc chắn muốn xóa ${record.general.name} khỏi đội hình?`}
              onConfirm={() => handleRemoveGeneral(record.id, record.general.name)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                Xóa
              </Button>
            </Popconfirm>
          ),
        },
      ]
      : []),
  ];

  // Table columns for available generals
  const availableColumns: ColumnsType<General> = [
    {
      title: "Tướng",
      key: "general",
      width: 280,
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={56}
            src={record.thumbnail || record.image}
            icon={<UserOutlined />}
            style={{
              border: `2px solid ${rarityColors[record.rarity]}`,
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {record.title || "Chưa có danh hiệu"}
            </div>
            <Space size={4} style={{ marginTop: 4 }}>
              <Tag
                icon={rarityIcons[record.rarity]}
                color={rarityColors[record.rarity]}
              >
                {rarityNames[record.rarity]}
              </Tag>
              <Tag
                icon={elementIcons[record.element]}
                color={elementColors[record.element]}
              >
                {elementNames[record.element]}
              </Tag>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: "Chỉ số cơ bản",
      key: "baseStats",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>Công:</Text> {record.base_attack}
          </div>
          <div>
            <Text strong>Thủ:</Text> {record.base_defense}
          </div>
          <div>
            <Text strong>Máu:</Text> {record.base_health}
          </div>
        </Space>
      ),
    },
    {
      title: "Cấp độ tối đa",
      dataIndex: "max_level",
      key: "max_level",
      width: 100,
      render: (maxLevel, record) => (
        <div>
          <Text>{record.level}/{maxLevel}</Text>
          <Progress
            percent={(record.level / maxLevel) * 100}
            size="small"
            showInfo={false}
            style={{ marginTop: 4 }}
          />
        </div>
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
            setSelectedGeneralId(record.id);
            handleSelectGeneral(record.id);
            setAddModalVisible(true);
          }}
        >
          Thêm
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const totalGenerals = data.length;
  const favoriteGenerals = data.filter((g) => g.favorite).length;
  const totalPower = data.reduce(
    (sum, g) =>
      sum +
      g.current_attack +
      g.current_defense +
      g.current_health +
      g.current_speed +
      g.current_intelligence +
      g.current_leadership,
    0
  );
  const avgWinRate = data.reduce((sum, g) => sum + g.win_rate, 0) / (data.length || 1);

  if (loading || loadingGenerals) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active avatar paragraph={{ rows: 8 }} />
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
        <Title level={3} style={{ margin: 0 }}>
          <TeamOutlined /> Quản lý tướng
        </Title>
        {!readOnly && allGenerals.length > 0 && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedGeneralId(undefined);
              setAddModalVisible(true);
            }}
          >
            Thêm tướng
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      {data.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số tướng"
                value={totalGenerals}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#0E90FF" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Yêu thích"
                value={favoriteGenerals}
                prefix={<HeartOutlined />}
                valueStyle={{ color: "#DC142C" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng sức mạnh"
                value={totalPower}
                prefix={<RiseOutlined />}
                valueStyle={{ color: "#FF7C00" }}
                formatter={(value) => (value as number).toLocaleString("vi-VN")}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tỉ lệ thắng TB"
                value={avgWinRate}
                precision={1}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#2E8B57" }}
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
            key: "owned",
            label: `Đã sở hữu (${data.length})`,
            icon: <TeamOutlined />,
            children:
              data.length === 0 ? (
                <Empty
                  description="Chưa có tướng nào trong đội hình"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {!readOnly && allGenerals.length > 0 && (
                    <Button
                      type="primary"
                      onClick={() => setAddModalVisible(true)}
                    >
                      Thêm tướng đầu tiên
                    </Button>
                  )}
                </Empty>
              ) : (
                <Table
                  columns={ownedColumns}
                  dataSource={data}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} tướng`,
                  }}
                  scroll={{ x: 1400 }}
                  bordered
                />
              ),
          },
          ...(!readOnly && unownedGenerals.length > 0
            ? [
              {
                key: "available",
                label: `Có thể thêm (${unownedGenerals.length})`,
                icon: <PlusOutlined />,
                children: (
                  <Table
                    columns={availableColumns}
                    dataSource={unownedGenerals}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} tướng`,
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

      {/* Add General Modal */}
      <Modal
        title="Thêm tướng mới"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedGeneralId(undefined);
          setSelectedGeneral(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="add"
            type="primary"
            loading={addingGeneral}
            onClick={handleAddGeneral}
          >
            Thêm tướng
          </Button>,
        ]}
        width={800}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Chọn tướng</Text>
            <Select
              placeholder="Chọn tướng để thêm"
              style={{ width: "100%", marginTop: 8 }}
              value={selectedGeneralId}
              onChange={handleSelectGeneral}
              showSearch
              optionFilterProp="children"
              size="large"
            >
              {(selectedGeneralId
                ? [
                  allGenerals.find((g) => g.id === selectedGeneralId),
                  ...unownedGenerals.filter((g) => g.id !== selectedGeneralId),
                ]
                : unownedGenerals
              ).map(
                (general) =>
                  general && (
                    <Option key={general.id} value={general.id}>
                      <Space>
                        <Avatar
                          size="small"
                          src={general.thumbnail || general.image}
                          icon={<UserOutlined />}
                        />
                        <span>{general.name}</span>
                        <Tag color={rarityColors[general.rarity]}>
                          {rarityNames[general.rarity]}
                        </Tag>
                        <Tag color={elementColors[general.element]}>
                          {elementNames[general.element]}
                        </Tag>
                      </Space>
                    </Option>
                  )
              )}
            </Select>
          </div>

          {selectedGeneral && (
            <>
              <Divider>Thông số ban đầu</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tấn công">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.attack}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, attack: value || 0 })
                      }
                      min={0}
                      max={999999}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phòng thủ">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.defense}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, defense: value || 0 })
                      }
                      min={0}
                      max={999999}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Máu">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.health}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, health: value || 0 })
                      }
                      min={0}
                      max={999999}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tốc độ">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.speed}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, speed: value || 0 })
                      }
                      min={0}
                      max={999}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trí tuệ">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.intelligence}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, intelligence: value || 0 })
                      }
                      min={0}
                      max={999}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Lãnh đạo">
                    <InputNumber
                      style={{ width: "100%" }}
                      value={statsForm.leadership}
                      onChange={(value) =>
                        setStatsForm({ ...statsForm, leadership: value || 0 })
                      }
                      min={0}
                      max={999}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Alert
                message="Thông tin tướng"
                description={
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Cấp độ cơ bản">
                      {selectedGeneral.level}/{selectedGeneral.max_level}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại">
                      {selectedGeneral.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chỉ số cơ bản">
                      Công: {selectedGeneral.base_attack} | Thủ:{" "}
                      {selectedGeneral.base_defense} | Máu:{" "}
                      {selectedGeneral.base_health}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chỉ số phụ">
                      Tốc: {selectedGeneral.base_speed} | Trí:{" "}
                      {selectedGeneral.base_intelligence} | Lãnh:{" "}
                      {selectedGeneral.base_leadership}
                    </Descriptions.Item>
                  </Descriptions>
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
