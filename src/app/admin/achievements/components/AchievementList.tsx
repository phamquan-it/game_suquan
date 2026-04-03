import React from "react";
import { Table, Tag, Space, Button, Popconfirm, Tooltip, Badge } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Achievement } from "../types";
import dayjs from "dayjs";

interface AchievementListProps {
  achievements: Achievement[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Achievement["status"]) => void;
  onDuplicate: (achievement: Achievement) => void;
}

export const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  onDuplicate,
}) => {
  const getStatusBadge = (status: Achievement["status"]) => {
    const config = {
      active: {
        status: "success",
        text: "Active",
        icon: <CheckCircleOutlined />,
      },
      inactive: {
        status: "default",
        text: "Inactive",
        icon: <StopOutlined />,
      },
      hidden: {
        status: "warning",
        text: "Hidden",
        icon: <EyeInvisibleOutlined />,
      },
    };
    return config[status];
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: "#CD7F32",
      silver: "#C0C0C0",
      gold: "#FFD700",
      platinum: "#E5E4E2",
      diamond: "#B9F2FF",
      master: "#8A2BE2",
      grandmaster: "#FF4500",
    };
    return colors[tier as keyof typeof colors] || "#000000";
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "#808080",
      uncommon: "#32CD32",
      rare: "#4169E1",
      epic: "#9370DB",
      legendary: "#FFA500",
      mythic: "#FF1493",
    };
    return colors[rarity as keyof typeof colors] || "#000000";
  };

  const columns: ColumnsType<Achievement> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-semibold">{text}</span>
          <span className="text-xs text-gray-500">{record.id}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const badge = getStatusBadge(status);
        return (
          <Badge
            status={badge.status as any}
            text={badge.text}
            className="capitalize"
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => (
        <Tag color="blue" className="capitalize">
          {type}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => (
        <Tag color="purple" className="capitalize">
          {category}
        </Tag>
      ),
    },
    {
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      width: 100,
      render: (tier) => (
        <Tag
          color={getTierColor(tier)}
          className="capitalize text-white"
        >
          {tier}
        </Tag>
      ),
    },
    {
      title: "Rarity",
      dataIndex: "rarity",
      key: "rarity",
      width: 100,
      render: (rarity) => (
        <Tag
          color={getRarityColor(rarity)}
          className="capitalize text-white"
        >
          {rarity}
        </Tag>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
      render: (difficulty) => (
        <Tag color="orange" className="capitalize">
          {difficulty.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      width: 80,
      align: "right",
      render: (points) => <span className="font-bold">{points}</span>,
    },
    {
      title: "Progress",
      dataIndex: "progress_percentage",
      key: "progress_percentage",
      width: 100,
      render: (progress) => (progress ? `${progress}%` : "-"),
    },
    {
      title: "Repeatable",
      dataIndex: "repeatable",
      key: "repeatable",
      width: 100,
      render: (repeatable) => (
        <Tag color={repeatable ? "green" : "red"}>
          {repeatable ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Completions",
      dataIndex: "total_completions",
      key: "total_completions",
      width: 100,
      align: "right",
      render: (total) => total || 0,
    },
    {
      title: "Completion Rate",
      dataIndex: "completion_rate",
      key: "completion_rate",
      width: 120,
      align: "right",
      render: (rate) => (rate ? `${rate.toFixed(2)}%` : "-"),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            />
          </Tooltip>

          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => onDuplicate(record)}
            />
          </Tooltip>

          {record.status === "active" ? (
            <Tooltip title="Deactivate">
              <Button
                type="text"
                danger
                icon={<StopOutlined />}
                onClick={() =>
                  onStatusChange(record.id, "inactive")
                }
              />
            </Tooltip>
          ) : record.status === "inactive" ? (
            <Tooltip title="Activate">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                style={{ color: "#52c41a" }}
                onClick={() =>
                  onStatusChange(record.id, "active")
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="Show">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() =>
                  onStatusChange(record.id, "active")
                }
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Delete achievement"
            description="Are you sure you want to delete this achievement? This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={achievements}
      loading={loading}
      rowKey="id"
      scroll={{ x: 1800 }}
      pagination={{
        total: achievements.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} achievements`,
      }}
      className="bg-white rounded-lg shadow-sm"
    />
  );
};
