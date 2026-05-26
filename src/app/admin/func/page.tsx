// app/database/functions/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Card,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
  Tag,
  Tooltip,
  Tabs,
  Statistic,
  Row,
  Col,
  Divider,
  Alert,
  Popconfirm,
  Badge,
  Descriptions,
  Empty,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CodeOutlined,
  CopyOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  FunctionOutlined,
  ApiOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  TagOutlined,
} from "@ant-design/icons";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import type { OnMount, OnValidate } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  SupabaseFunction,
  useSupabaseFunctions,
} from "./hooks/useSupabaseFunctions";

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

// Cấu hình Monaco Editor
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

// Định nghĩa các nhóm filter
const FUNCTION_GROUPS = [
  { label: "Tất cả", value: "all", keywords: [] },
  {
    label: "Beauty",
    value: "beauty",
    keywords: ["beauty", "makeup", "cosmetic", "skin", "hair", "dress", "cloth"],
    icon: "💄"
  },
  {
    label: "Item",
    value: "item",
    keywords: ["item", "items", "inventory_item", "equipment", "consumable", "material"],
    icon: "🎒"
  },
  {
    label: "Lootbox",
    value: "lootbox",
    keywords: ["lootbox", "loot_box", "loot", "chest", "gacha", "random_box", "reward_box"],
    icon: "🎁"
  },
  {
    label: "General",
    value: "general",
    keywords: ["general", "common", "global", "system", "config", "setting", "utility"],
    icon: "⚙️"
  },
  {
    label: "Unit",
    value: "unit",
    keywords: ["unit", "soldier", "troop", "army", "warrior", "hero", "character"],
    icon: "⚔️"
  },
  {
    label: "Alliance",
    value: "alliance",
    keywords: ["alliance", "guild", "clan", "team", "member", "guild_", "clan_"],
    icon: "🤝"
  },
  {
    label: "Friend",
    value: "friend",
    keywords: ["friend", "buddy", "social", "relationship", "friend_"],
    icon: "👥"
  },
  {
    label: "Inventory",
    value: "inventory",
    keywords: ["inventory", "bag", "backpack", "storage", "warehouse", "slot"],
    icon: "📦"
  },
  {
    label: "Building",
    value: "building",
    keywords: ["building", "construction", "facility", "structure", "castle", "farm", "mine", "barracks", "temple", "market", "workshop"],
    icon: "🏗️"
  },
  {
    label: "Region",
    value: "region",
    keywords: ["region", "area", "zone", "territory", "province", "map", "location"],
    icon: "🗺️"
  },
  {
    label: "Battle",
    value: "battle",
    keywords: ["battle", "fight", "combat", "war", "attack", "defense", "duel", "pvp", "pve"],
    icon: "⚡"
  },
];

export default function FunctionsManager() {
  const {
    functions,
    loadingFunctions,
    functionsError,
    generateDDL,
    generatingDDL,
    createFunction,
    creatingFunction,
    deleteFunction,
    deletingFunction,
    executeFunction,
    executingFunction,
    refetchFunctions,
  } = useSupabaseFunctions();

  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isViewDDLModalOpen, setIsViewDDLModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] =
    useState<SupabaseFunction | null>(null);
  const [ddlContent, setDdlContent] = useState("");
  const [executeResult, setExecuteResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("1");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoInstance = useMonaco();

  const [form] = Form.useForm();
  const [executeForm] = Form.useForm();

  // Filter functions by group
  const filterByGroup = (func: SupabaseFunction): boolean => {
    if (selectedGroup === "all") return true;

    const group = FUNCTION_GROUPS.find(g => g.value === selectedGroup);
    if (!group || group.keywords.length === 0) return true;

    const funcName = func.name.toLowerCase();
    return group.keywords.some(keyword => funcName.includes(keyword.toLowerCase()));
  };

  // Filter functions by search text
  const filterBySearch = (func: SupabaseFunction): boolean => {
    if (!searchText) return true;
    return func.name.toLowerCase().includes(searchText.toLowerCase());
  };

  // Combined filter
  const filteredData = functions.filter((func) => {
    return filterByGroup(func) && filterBySearch(func);
  });

  // Get statistics by group
  const getGroupStats = () => {
    const stats: Record<string, number> = {};
    FUNCTION_GROUPS.forEach(group => {
      if (group.value === "all") {
        stats[group.value] = functions.length;
      } else {
        stats[group.value] = functions.filter(func =>
          group.keywords.some(keyword =>
            func.name.toLowerCase().includes(keyword.toLowerCase())
          )
        ).length;
      }
    });
    return stats;
  };

  const groupStats = getGroupStats();

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom theme cho game
    monaco.editor.defineTheme("gameTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "#D4AF37", fontStyle: "bold" },
        { token: "string", foreground: "#50C878" },
        { token: "comment", foreground: "#8B4513", fontStyle: "italic" },
        { token: "number", foreground: "#FF8C00" },
      ],
      colors: {
        "editor.background": "#1a1a1a",
        "editor.lineHighlightBackground": "#8B000020",
        "editorCursor.foreground": "#D4AF37",
        "editor.selectionBackground": "#D4AF3740",
      },
    });

    monaco.editor.setTheme("gameTheme");
    editor.focus();
  };

  // Handle validation
  const handleEditorValidation: OnValidate = (markers) => {
    const errors = markers.filter((m) => m.severity === 8);
    if (errors.length > 0 && isCreateModalOpen) {
      console.log(`Có ${errors.length} lỗi trong code`);
    }
  };

  // Handle view DDL - sử dụng oid
  const handleViewDDL = async (record: SupabaseFunction) => {
    try {
      const oid = (record as any).oid;
      if (!oid) {
        message.error("Không tìm thấy OID của function");
        return;
      }
      const ddl = await generateDDL({ oid });
      setDdlContent(ddl);
      setSelectedFunction(record);
      setIsViewDDLModalOpen(true);
    } catch (error: any) {
      message.error(error.message || "Không thể tải DDL của function");
    }
  };

  // Handle view details
  const handleViewDetails = (record: SupabaseFunction) => {
    setSelectedFunction(record);
    setIsDetailModalOpen(true);
  };

  // Handle delete function - sử dụng identity_args
  const handleDelete = async (record: SupabaseFunction) => {
    try {
      await deleteFunction({
        name: record.name,
        identityArgs: record.identity_args || "",
      });
      message.success(`Function "${record.name}" đã được xóa thành công`);
      refetchFunctions();
    } catch (error: any) {
      message.error(error.message || "Không thể xóa function");
    }
  };

  // Handle execute function
  const handleExecute = async (values: { params: string }) => {
    if (!selectedFunction) return;

    try {
      const params = values.params ? JSON.parse(values.params) : {};
      const result = await executeFunction({
        functionName: selectedFunction.name,
        params,
      });
      setExecuteResult(result);
      message.success("Function đã được thực thi thành công");
    } catch (error: any) {
      message.error(error.message || "Không thể thực thi function");
    }
  };

  // Handle create function
  const handleCreate = async (values: any) => {
    try {
      await createFunction({
        name: values.name,
        params: values.params || "",
        returns: values.returns,
        language: values.language,
        body: values.body,
      });
      message.success(`Function "${values.name}" đã được tạo thành công`);
      setIsCreateModalOpen(false);
      form.resetFields();
      refetchFunctions();
    } catch (error: any) {
      message.error(error.message || "Không thể tạo function");
    }
  };

  // Handle copy DDL
  const handleCopyDDL = () => {
    navigator.clipboard.writeText(ddlContent);
    message.success("Đã sao chép DDL vào clipboard");
  };

  // Table columns với key unique
  const columns = [
    {
      title: "Tên Function",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text: string, record: SupabaseFunction) => (
        <Space direction="vertical" size={0}>
          <Space>
            <FunctionOutlined style={{ color: "#D4AF37" }} />
            <Text strong style={{ color: "#8B0000", fontSize: 14 }}>
              {text}
            </Text>
            {record.identity_args && (
              <Badge
                count="overload"
                size="small"
                style={{ backgroundColor: "#D4AF37", color: "#8B0000" }}
              />
            )}
          </Space>
          {record.identity_args && (
            <Text
              type="secondary"
              style={{ fontSize: 11, fontFamily: "monospace" }}
            >
              Args: {record.identity_args}
            </Text>
          )}
          {record.args && !record.identity_args && (
            <Text
              type="secondary"
              style={{ fontSize: 11, fontFamily: "monospace" }}
            >
              Params: {record.args}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Schema",
      dataIndex: "schema",
      key: "schema",
      width: "12%",
      render: (schema: string) => (
        <Tag color="geekblue" icon={<DatabaseOutlined />}>
          {schema || "public"}
        </Tag>
      ),
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      width: "12%",
      render: (lang: string) => (
        <Tag color="purple" icon={<CodeOutlined />}>
          {lang || "plpgsql"}
        </Tag>
      ),
    },
    {
      title: "Tham số",
      dataIndex: "args",
      key: "args",
      width: "25%",
      render: (args: string) => (
        <Text code style={{ fontSize: 12 }}>
          {args || "không có tham số"}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "26%",
      render: (_: any, record: SupabaseFunction) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Xem DDL">
            <Button
              type="text"
              size="small"
              icon={<CodeOutlined />}
              onClick={() => handleViewDDL(record)}
              style={{ color: "#D4AF37" }}
            />
          </Tooltip>
          <Tooltip title="Thực thi">
            <Button
              type="text"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => {
                setSelectedFunction(record);
                setIsExecuteModalOpen(true);
                executeForm.resetFields();
                setExecuteResult(null);
              }}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa function"
              description={`Bạn có chắc chắn muốn xóa function "${record.name}"${record.identity_args ? ` với signature ${record.identity_args}` : ""}?`}
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: functions.length,
    plpgsql: functions.filter((f) => f.language === "plpgsql").length,
    sql: functions.filter((f) => f.language === "sql").length,
    withArgs: functions.filter((f) => f.args && f.args.length > 0).length,
  };

  if (functionsError) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#F5F5DC" }}>
        <Content style={{ padding: 24 }}>
          <Alert
            message="Lỗi tải dữ liệu"
            description={(functionsError as Error).message}
            type="error"
            showIcon
          />
          <Button
            onClick={() => refetchFunctions()}
            style={{ marginTop: 16 }}
            icon={<ReloadOutlined />}
          >
            Thử lại
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F5DC" }}>
      <Header
        style={{
          background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
          borderBottom: "2px solid #D4AF37",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          height: "auto",
          minHeight: 64,
        }}
      >
        <Space style={{ margin: "12px 0" }}>
          <ApiOutlined style={{ fontSize: 28, color: "#D4AF37" }} />
          <Title
            level={3}
            style={{
              color: "#D4AF37",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            ⚔️ Quản Lý Function ⚔️
          </Title>
        </Space>
        <Space style={{ margin: "12px 0" }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetchFunctions()}
            style={{
              background: "#D4AF37",
              color: "#8B0000",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
              border: "1px solid #D4AF37",
              fontWeight: "bold",
            }}
          >
            Tạo Function
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <FunctionOutlined /> Danh sách Functions
                </span>
              ),
              children: (
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #D4AF37",
                    boxShadow: "0 4px 12px rgba(139, 69, 19, 0.1)",
                  }}
                >
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {/* Filter Group Section */}
                    <div>
                      <div style={{ marginBottom: 12 }}>
                        <Space>
                          <FilterOutlined style={{ color: "#D4AF37" }} />
                          <Text strong style={{ color: "#8B0000" }}>
                            Lọc theo nhóm chức năng:
                          </Text>
                          <TagOutlined style={{ color: "#D4AF37" }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {filteredData.length} / {functions.length} functions
                          </Text>
                        </Space>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {FUNCTION_GROUPS.map((group) => (
                          <Button
                            key={group.value}
                            size="middle"
                            type={selectedGroup === group.value ? "primary" : "default"}
                            onClick={() => setSelectedGroup(group.value)}
                            style={{
                              ...(selectedGroup === group.value
                                ? {
                                  background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
                                  borderColor: "#D4AF37",
                                  color: "#D4AF37",
                                }
                                : {
                                  background: "#F1E8D6",
                                  borderColor: "#D4AF37",
                                  color: "#8B4513",
                                }),
                              fontWeight: "bold",
                              borderRadius: 20,
                            }}
                          >
                            <Space size={4}>
                              <span>{group.icon || "📁"}</span>
                              <span>{group.label}</span>
                              <Badge
                                count={groupStats[group.value] || 0}
                                size="small"
                                style={{
                                  backgroundColor: selectedGroup === group.value ? "#D4AF37" : "#8B0000",
                                  color: selectedGroup === group.value ? "#8B0000" : "#D4AF37",
                                  marginLeft: 4,
                                }}
                              />
                            </Space>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Search Input */}
                    <Input
                      placeholder="Tìm kiếm function theo tên..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 350 }}
                      allowClear
                      size="large"
                    />

                    {/* Table */}
                    <Table
                      columns={columns}
                      dataSource={filteredData}
                      loading={loadingFunctions}
                      rowKey={(record) =>
                        `${record.schema}_${record.name}_${record.identity_args || ""}`
                      }
                      pagination={{
                        pageSize: 10,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} của ${total} functions`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                      }}
                      scroll={{ x: 900 }}
                      locale={{
                        emptyText: (
                          <Empty description="Không có function nào" />
                        ),
                      }}
                    />
                  </Space>
                </Card>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <ThunderboltOutlined /> Thống kê
                </span>
              ),
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #F1E8D6 100%)",
                          border: "1px solid #D4AF37",
                          borderRadius: 12,
                          textAlign: "center",
                        }}
                      >
                        <Statistic
                          title="Tổng số Functions"
                          value={stats.total}
                          prefix={<FunctionOutlined />}
                          valueStyle={{
                            color: "#D4AF37",
                            fontSize: 32,
                          }}
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #F1E8D6 100%)",
                          border: "1px solid #D4AF37",
                          borderRadius: 12,
                          textAlign: "center",
                        }}
                      >
                        <Statistic
                          title="PL/pgSQL"
                          value={stats.plpgsql}
                          prefix={<DatabaseOutlined />}
                          valueStyle={{
                            color: "#8B0000",
                            fontSize: 32,
                          }}
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #F1E8D6 100%)",
                          border: "1px solid #D4AF37",
                          borderRadius: 12,
                          textAlign: "center",
                        }}
                      >
                        <Statistic
                          title="SQL Functions"
                          value={stats.sql}
                          prefix={<CodeOutlined />}
                          valueStyle={{
                            color: "#1890ff",
                            fontSize: 32,
                          }}
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                      <Card
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #F1E8D6 100%)",
                          border: "1px solid #D4AF37",
                          borderRadius: 12,
                          textAlign: "center",
                        }}
                      >
                        <Statistic
                          title="Có tham số"
                          value={stats.withArgs}
                          prefix={<ApiOutlined />}
                          valueStyle={{
                            color: "#52c41a",
                            fontSize: 32,
                          }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Divider />

                  {/* Group Statistics */}
                  <Card
                    title={
                      <Space>
                        <TagOutlined style={{ color: "#D4AF37" }} />
                        <span>Thống kê theo nhóm chức năng</span>
                      </Space>
                    }
                    style={{
                      borderRadius: 12,
                      border: "1px solid #D4AF37",
                      marginBottom: 16,
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      {FUNCTION_GROUPS.filter(g => g.value !== "all").map((group) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={group.value}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              background: "#F1E8D6",
                              borderRadius: 8,
                              border: "1px solid #D4AF37",
                            }}
                          >
                            <Space>
                              <span style={{ fontSize: 20 }}>{group.icon || "📁"}</span>
                              <Text strong>{group.label}</Text>
                            </Space>
                            <Badge
                              count={groupStats[group.value]}
                              style={{
                                backgroundColor: "#8B0000",
                                color: "#D4AF37",
                                fontSize: 14,
                                fontWeight: "bold",
                              }}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card>

                  <Card
                    title={
                      <Space>
                        <InfoCircleOutlined style={{ color: "#D4AF37" }} />
                        <span>Hướng dẫn sử dụng</span>
                      </Space>
                    }
                    style={{
                      borderRadius: 12,
                      border: "1px solid #D4AF37",
                      marginTop: 16,
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <div style={{ textAlign: "center" }}>
                          <PlusOutlined
                            style={{
                              fontSize: 24,
                              color: "#D4AF37",
                            }}
                          />
                          <Title level={5}>Tạo Function</Title>
                          <Text type="secondary">
                            Tạo function mới với editor hỗ trợ SQL
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={8}>
                        <div style={{ textAlign: "center" }}>
                          <PlayCircleOutlined
                            style={{
                              fontSize: 24,
                              color: "#52c41a",
                            }}
                          />
                          <Title level={5}>Thực thi</Title>
                          <Text type="secondary">
                            Chạy function với tham số JSON
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={8}>
                        <div style={{ textAlign: "center" }}>
                          <CodeOutlined
                            style={{
                              fontSize: 24,
                              color: "#D4AF37",
                            }}
                          />
                          <Title level={5}>Xem DDL</Title>
                          <Text type="secondary">
                            Xem và sao chép DDL của function
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </>
              ),
            },
          ]}
        />
      </Content>

      {/* Create Function Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: "#D4AF37" }} />
            <span style={{ color: "#8B0000" }}>Tạo Function Mới</span>
          </Space>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsCreateModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={creatingFunction}
            onClick={() => form.submit()}
            style={{
              background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
              border: "1px solid #D4AF37",
            }}
          >
            Tạo Function
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Tên Function"
            rules={[
              { required: true, message: "Vui lòng nhập tên function" },
              {
                pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                message: "Tên function không hợp lệ",
              },
            ]}
            tooltip="Tên function phải bắt đầu bằng chữ hoặc dấu _, chỉ chứa chữ, số và dấu _"
          >
            <Input placeholder="ví dụ: get_user_by_id" size="large" />
          </Form.Item>

          <Form.Item
            name="params"
            label="Tham số"
            tooltip="Định nghĩa tham số cho function"
          >
            <TextArea
              placeholder="ví dụ: p_user_id UUID, p_name TEXT"
              rows={2}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="returns" label="Kiểu trả về" initialValue="json">
                <Select size="large">
                  <Option value="json">JSON</Option>
                  <Option value="text">TEXT</Option>
                  <Option value="integer">INTEGER</Option>
                  <Option value="bigint">BIGINT</Option>
                  <Option value="boolean">BOOLEAN</Option>
                  <Option value="void">VOID</Option>
                  <Option value="record">RECORD</Option>
                  <Option value="setof record">SETOF RECORD</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Ngôn ngữ"
                initialValue="plpgsql"
              >
                <Select size="large">
                  <Option value="plpgsql">PL/pgSQL</Option>
                  <Option value="sql">SQL</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="body"
            label="Nội dung Function"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung function" },
            ]}
          >
            <div
              style={{
                height: 400,
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="sql"
                defaultValue={`BEGIN\n  -- Viết logic function của bạn ở đây\n  \n  RETURN result;\nEND;`}
                onMount={handleEditorDidMount}
                onValidate={handleEditorValidation}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Execute Function Modal */}
      <Modal
        title={
          <Space>
            <PlayCircleOutlined style={{ color: "#52c41a" }} />
            <span>
              Thực thi Function: <Text strong>{selectedFunction?.name}</Text>
            </span>
          </Space>
        }
        open={isExecuteModalOpen}
        onCancel={() => setIsExecuteModalOpen(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsExecuteModalOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="execute"
            type="primary"
            loading={executingFunction}
            onClick={() => executeForm.submit()}
            icon={<PlayCircleOutlined />}
            style={{ background: "#52c41a" }}
          >
            Thực thi
          </Button>,
        ]}
      >
        <Form
          form={executeForm}
          layout="vertical"
          onFinish={handleExecute}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="params"
            label="Tham số (JSON format)"
            tooltip="Nhập tham số dưới dạng JSON object"
          >
            <TextArea
              placeholder='{"user_id": "123e4567-e89b-12d3-a456-426614174000"}'
              rows={4}
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>

          {executeResult !== null && (
            <Form.Item label="Kết quả">
              <div
                style={{
                  background: "#1e1e1e",
                  padding: 12,
                  borderRadius: 8,
                  overflow: "auto",
                  maxHeight: 300,
                }}
              >
                <pre
                  style={{
                    color: "#d4d4d4",
                    margin: 0,
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(executeResult, null, 2)}
                </pre>
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* View DDL Modal */}
      <Modal
        style={{ top: "5%" }}
        title={
          <Space>
            <CodeOutlined style={{ color: "#D4AF37" }} />
            <span>
              DDL của Function: <Text strong>{selectedFunction?.name}</Text>
            </span>
          </Space>
        }
        open={isViewDDLModalOpen}
        onCancel={() => setIsViewDDLModalOpen(false)}
        width={1000}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyDDL}>
            Sao chép
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setIsViewDDLModalOpen(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        <div style={{ height: 500, marginTop: 16 }}>
          <Editor
            height="100%"
            defaultLanguage="sql"
            value={ddlContent}
            loading={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Đang tải...
              </div>
            }
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined style={{ color: "#D4AF37" }} />
            <span>
              Chi tiết Function: <Text strong>{selectedFunction?.name}</Text>
            </span>
          </Space>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={700}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsDetailModalOpen(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        <Descriptions
          bordered
          column={1}
          style={{ marginTop: 16 }}
          styles={{ label: { fontWeight: "bold", background: "#F1E8D6" } }}
        >
          <Descriptions.Item label="Tên Function">
            <Tag color="red">{selectedFunction?.name}</Tag>
            {(selectedFunction as any)?.oid && (
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                OID: {(selectedFunction as any).oid}
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Schema">
            <Tag color="geekblue">{selectedFunction?.schema || "public"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngôn ngữ">
            <Tag color="purple">{selectedFunction?.language || "plpgsql"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tham số">
            <Text code>{selectedFunction?.args || "không có tham số"}</Text>
          </Descriptions.Item>
          {selectedFunction?.identity_args && (
            <Descriptions.Item label="Identity Args">
              <Text code style={{ color: "#D4AF37" }}>
                {selectedFunction.identity_args}
              </Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="DDL">
            <Button
              type="link"
              icon={<CodeOutlined />}
              onClick={() => {
                setIsDetailModalOpen(false);
                if (selectedFunction) handleViewDDL(selectedFunction);
              }}
            >
              Xem DDL đầy đủ
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </Layout>
  );
}
