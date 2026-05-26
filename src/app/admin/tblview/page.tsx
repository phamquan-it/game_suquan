// app/database/views/page.tsx
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
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CodeOutlined,
    CopyOutlined,
    ReloadOutlined,
    SearchOutlined,
    EyeOutlined,
    ThunderboltOutlined,
    DatabaseOutlined,
    TableOutlined,
    ApiOutlined,
    InfoCircleOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import Editor, { useMonaco, loader } from "@monaco-editor/react";
import type { OnMount, OnValidate } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { SupabaseView, useSupabaseViews } from "./hooks/useSupabaseViews";

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

// Định nghĩa các nhóm filter cho Views
const VIEW_GROUPS = [
    { label: "Tất cả", value: "all", keywords: [], icon: "" },
    {
        label: "User & Profile",
        value: "user",
        keywords: ["user", "profile", "account", "player", "member"],
        icon: "",
    },
    {
        label: "Inventory & Item",
        value: "inventory",
        keywords: ["inventory", "item", "equipment", "resource", "material"],
        icon: "",
    },
    {
        label: "Battle & Combat",
        value: "battle",
        keywords: [
            "battle",
            "combat",
            "war",
            "fight",
            "pvp",
            "pve",
            "attack",
            "defense",
        ],
        icon: "",
    },
    {
        label: "Building & Construction",
        value: "building",
        keywords: [
            "building",
            "construction",
            "structure",
            "castle",
            "farm",
            "mine",
            "barracks",
        ],
        icon: "",
    },
    {
        label: "Social & Alliance",
        value: "social",
        keywords: ["alliance", "guild", "friend", "social", "chat", "mail"],
        icon: "",
    },
    {
        label: "Region & Map",
        value: "region",
        keywords: ["region", "area", "zone", "map", "territory", "province"],
        icon: "",
    },
    {
        label: "Analytics & Stats",
        value: "analytics",
        keywords: [
            "stat",
            "analytics",
            "report",
            "summary",
            "leaderboard",
            "ranking",
        ],
        icon: "",
    },
    {
        label: "Economy & Trade",
        value: "economy",
        keywords: [
            "economy",
            "trade",
            "market",
            "shop",
            "currency",
            "gold",
            "gem",
        ],
        icon: "",
    },
];

export default function ViewsManager() {
    const {
        views,
        loadingViews,
        viewsError,
        findViews,
        findingViews,
        createView,
        creatingView,
        updateView,
        updatingView,
        dropView,
        droppingView,
        getViewDDL,
        gettingViewDDL,
        refetchViews,
    } = useSupabaseViews();

    const [searchText, setSearchText] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewDDLModalOpen, setIsViewDDLModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedView, setSelectedView] = useState<SupabaseView | null>(null);
    const [ddlContent, setDdlContent] = useState("");
    const [activeTab, setActiveTab] = useState("1");

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const editEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoInstance = useMonaco();

    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Handle editor mount for create modal
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.editor.setTheme("vs-dark");
        editor.focus();
    };

    // Handle editor mount for edit modal
    const handleEditEditorDidMount: OnMount = (editor, monaco) => {
        editEditorRef.current = editor;
        monaco.editor.setTheme("vs-dark");
        editor.focus();
    };

    // Filter views by group
    const filterByGroup = (view: SupabaseView): boolean => {
        if (selectedGroup === "all") return true;

        const group = VIEW_GROUPS.find((g) => g.value === selectedGroup);
        if (!group || group.keywords.length === 0) return true;

        const viewName = view.view_name.toLowerCase();
        return group.keywords.some((keyword) =>
            viewName.includes(keyword.toLowerCase())
        );
    };

    // Filter views by search text
    // Cách 1: Sử dụng optional chaining và nullish coalescing
    const filterBySearch = (view: SupabaseView): boolean => {
        if (!searchText) return true;

        const viewName = view.view_name?.toLowerCase() || "";
        const schemaName = view.schema_name?.toLowerCase() || "";
        const searchLower = searchText.toLowerCase();

        return (
            viewName.includes(searchLower) || schemaName.includes(searchLower)
        );
    };
    // Combined filter
    const filteredData = views.filter((view) => {
        return filterByGroup(view) && filterBySearch(view);
    });

    // Get statistics by group
    const getGroupStats = () => {
        const stats: Record<string, number> = {};
        VIEW_GROUPS.forEach((group) => {
            if (group.value === "all") {
                stats[group.value] = views.length;
            } else {
                stats[group.value] = views.filter((view) =>
                    group.keywords.some((keyword) =>
                        view.view_name
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                    )
                ).length;
            }
        });
        return stats;
    };

    const groupStats = getGroupStats();

    // Handle search
    const handleSearch = async (value: string) => {
        if (!value || value.trim() === "") {
            refetchViews();
            return;
        }
        try {
            const results = await findViews(value);
            // Note: findViews returns filtered results, but we'll keep using refetch for now
            refetchViews();
        } catch (error) {
            message.error("Không thể tìm kiếm views");
        } finally {
        }
    };

    // Handle view details
    const handleViewDetails = (record: SupabaseView) => {
        setSelectedView(record);
        setIsDetailModalOpen(true);
    };

    // Handle view DDL
    const handleViewDDL = async (record: SupabaseView) => {
        try {
            const ddl = await getViewDDL(record.view_name);
            setDdlContent(ddl || "Không có DDL");
            setSelectedView(record);
            setIsViewDDLModalOpen(true);
        } catch (error: any) {
            message.error(error.message || "Không thể tải DDL của view");
        }
    };

    // Handle edit view
    const handleEditView = (record: SupabaseView) => {
        setSelectedView(record);
        editForm.setFieldsValue({
            viewName: record.view_name,
            viewSql: record.definition,
        });
        setIsEditModalOpen(true);
    };

    // Handle create view
    const handleCreate = async (values: any) => {
        try {
            await createView({
                viewName: values.viewName,
                viewSql: values.viewSql,
            });
            message.success(`View "${values.viewName}" đã được tạo thành công`);
            setIsCreateModalOpen(false);
            createForm.resetFields();
            refetchViews();
        } catch (error: any) {
            message.error(error.message || "Không thể tạo view");
        }
    };

    // Handle update view
    const handleUpdate = async (values: any) => {
        if (!selectedView) return;
        try {
            await updateView({
                viewName: selectedView.view_name,
                viewSql: values.viewSql,
            });
            message.success(
                `View "${selectedView.view_name}" đã được cập nhật thành công`
            );
            setIsEditModalOpen(false);
            editForm.resetFields();
            refetchViews();
        } catch (error: any) {
            message.error(error.message || "Không thể cập nhật view");
        }
    };

    // Handle delete view
    const handleDelete = async (record: SupabaseView) => {
        try {
            await dropView(record.view_name);
            message.success(
                `View "${record.view_name}" đã được xóa thành công`
            );
            refetchViews();
        } catch (error: any) {
            message.error(error.message || "Không thể xóa view");
        }
    };

    // Handle copy DDL
    const handleCopyDDL = () => {
        navigator.clipboard.writeText(ddlContent);
        message.success("Đã sao chép DDL vào clipboard");
    };

    // Table columns
    const columns = [
        {
            title: "Tên View",
            dataIndex: "view_name",
            key: "view_name",
            width: "30%",
            render: (text: string, record: SupabaseView) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <TableOutlined style={{ color: "#D4AF37" }} />
                        <Text strong style={{ color: "#8B0000", fontSize: 14 }}>
                            {text}
                        </Text>
                    </Space>
                    {record.schema_name && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            Schema: {record.schema_name}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Schema",
            dataIndex: "schema_name",
            key: "schema_name",
            width: "15%",
            render: (schema: string) => (
                <Tag color="geekblue" icon={<DatabaseOutlined />}>
                    {schema || "public"}
                </Tag>
            ),
        },
        {
            title: "Định nghĩa",
            dataIndex: "definition",
            key: "definition",
            width: "15%",
            render: (definition: string) => (
                <div
                    style={{
                        width: "100%",
                        maxWidth: 100,
                        overflow: "hidden",
                    }}
                >
                    <Text
                        code
                        style={{
                            fontSize: 12,
                            display: "block",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                        ellipsis={{
                            tooltip: definition,
                        }}
                    >
                        {definition || "Không có định nghĩa"}
                    </Text>
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            width: "20%",
            render: (_: any, record: SupabaseView) => (
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
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditView(record)}
                            style={{ color: "#52c41a" }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Xóa view"
                            description={`Bạn có chắc chắn muốn xóa view "${record.view_name}"?`}
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
        total: views.length,
        publicSchema: views.filter((v) => v.schema_name === "public").length,
        withDefinition: views.filter(
            (v) => v.definition && v.definition.length > 0
        ).length,
    };

    if (viewsError) {
        return (
            <Layout style={{ minHeight: "100vh", background: "#F5F5DC" }}>
                <Content style={{ padding: 24 }}>
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={(viewsError as Error).message}
                        type="error"
                        showIcon
                    />
                    <Button
                        onClick={() => refetchViews()}
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
                    background: "#8B0000",
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
                    <TableOutlined style={{ fontSize: 28, color: "#D4AF37" }} />
                    <Title
                        level={3}
                        style={{
                            color: "#D4AF37",
                            margin: 0,
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        Quản Lý View
                    </Title>
                </Space>
                <Space style={{ margin: "12px 0" }}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => refetchViews()}
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
                            background: "#8B0000",
                            border: "1px solid #D4AF37",
                            fontWeight: "bold",
                        }}
                    >
                        Tạo View
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
                                    <TableOutlined /> Danh sách Views
                                </span>
                            ),
                            children: (
                                <Card
                                    style={{
                                        borderRadius: 12,
                                        border: "1px solid #D4AF37",
                                        background: "#FFFFFF",
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
                                                    <FilterOutlined
                                                        style={{
                                                            color: "#D4AF37",
                                                        }}
                                                    />
                                                    <Text
                                                        strong
                                                        style={{
                                                            color: "#8B0000",
                                                        }}
                                                    >
                                                        Lọc theo nhóm chức năng:
                                                    </Text>
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {filteredData.length} /{" "}
                                                        {views.length} views
                                                    </Text>
                                                </Space>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 8,
                                                }}
                                            >
                                                {VIEW_GROUPS.map((group) => (
                                                    <Button
                                                        key={group.value}
                                                        size="middle"
                                                        type={
                                                            selectedGroup ===
                                                            group.value
                                                                ? "primary"
                                                                : "default"
                                                        }
                                                        onClick={() =>
                                                            setSelectedGroup(
                                                                group.value
                                                            )
                                                        }
                                                        style={{
                                                            ...(selectedGroup ===
                                                            group.value
                                                                ? {
                                                                      background:
                                                                          "#8B0000",
                                                                      borderColor:
                                                                          "#D4AF37",
                                                                      color: "#D4AF37",
                                                                  }
                                                                : {
                                                                      background:
                                                                          "#F1E8D6",
                                                                      borderColor:
                                                                          "#D4AF37",
                                                                      color: "#8B4513",
                                                                  }),
                                                            fontWeight: "bold",
                                                            borderRadius: 20,
                                                        }}
                                                    >
                                                        <Space size={4}>
                                                            <span>
                                                                {group.icon}
                                                            </span>
                                                            <span>
                                                                {group.label}
                                                            </span>
                                                            <Badge
                                                                count={
                                                                    groupStats[
                                                                        group
                                                                            .value
                                                                    ] || 0
                                                                }
                                                                size="small"
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedGroup ===
                                                                        group.value
                                                                            ? "#D4AF37"
                                                                            : "#8B0000",
                                                                    color:
                                                                        selectedGroup ===
                                                                        group.value
                                                                            ? "#8B0000"
                                                                            : "#D4AF37",
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
                                            placeholder="Tìm kiếm view theo tên hoặc schema..."
                                            prefix={<SearchOutlined />}
                                            value={searchText}
                                            onChange={(e) =>
                                                setSearchText(e.target.value)
                                            }
                                            style={{ width: 350 }}
                                            allowClear
                                            size="large"
                                        />

                                        {/* Table */}
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData}
                                            loading={
                                                loadingViews || findingViews
                                            }
                                            rowKey={(record) =>
                                                `${record.schema_name}_${record.view_name}`
                                            }
                                            pagination={{
                                                pageSize: 10,
                                                showTotal: (total, range) =>
                                                    `${range[0]}-${range[1]} của ${total} views`,
                                                showSizeChanger: true,
                                                showQuickJumper: true,
                                                pageSizeOptions: [
                                                    "10",
                                                    "20",
                                                    "50",
                                                    "100",
                                                ],
                                            }}
                                            scroll={{ x: 1000 }}
                                            locale={{
                                                emptyText: (
                                                    <Empty description="Không có view nào" />
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
                                        <Col xs={24} sm={12} lg={8}>
                                            <Card
                                                style={{
                                                    background: "#FFFFFF",
                                                    border: "1px solid #D4AF37",
                                                    borderRadius: 12,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Statistic
                                                    title="Tổng số Views"
                                                    value={stats.total}
                                                    prefix={<TableOutlined />}
                                                    valueStyle={{
                                                        color: "#D4AF37",
                                                        fontSize: 32,
                                                    }}
                                                />
                                            </Card>
                                        </Col>

                                        <Col xs={24} sm={12} lg={8}>
                                            <Card
                                                style={{
                                                    background: "#FFFFFF",
                                                    border: "1px solid #D4AF37",
                                                    borderRadius: 12,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Statistic
                                                    title="Public Schema"
                                                    value={stats.publicSchema}
                                                    prefix={
                                                        <DatabaseOutlined />
                                                    }
                                                    valueStyle={{
                                                        color: "#8B0000",
                                                        fontSize: 32,
                                                    }}
                                                />
                                            </Card>
                                        </Col>

                                        <Col xs={24} sm={12} lg={8}>
                                            <Card
                                                style={{
                                                    background: "#FFFFFF",
                                                    border: "1px solid #D4AF37",
                                                    borderRadius: 12,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Statistic
                                                    title="Có định nghĩa"
                                                    value={stats.withDefinition}
                                                    prefix={<CodeOutlined />}
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
                                                <InfoCircleOutlined
                                                    style={{ color: "#D4AF37" }}
                                                />
                                                <span>
                                                    Thống kê theo nhóm chức năng
                                                </span>
                                            </Space>
                                        }
                                        style={{
                                            borderRadius: 12,
                                            border: "1px solid #D4AF37",
                                            marginBottom: 16,
                                            background: "#FFFFFF",
                                        }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            {VIEW_GROUPS.filter(
                                                (g) => g.value !== "all"
                                            ).map((group) => (
                                                <Col
                                                    xs={24}
                                                    sm={12}
                                                    md={8}
                                                    lg={6}
                                                    key={group.value}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                            padding: "8px 12px",
                                                            background:
                                                                "#F1E8D6",
                                                            borderRadius: 8,
                                                            border: "1px solid #D4AF37",
                                                        }}
                                                    >
                                                        <Space>
                                                            <span
                                                                style={{
                                                                    fontSize: 20,
                                                                }}
                                                            >
                                                                {group.icon}
                                                            </span>
                                                            <Text strong>
                                                                {group.label}
                                                            </Text>
                                                        </Space>
                                                        <Badge
                                                            count={
                                                                groupStats[
                                                                    group.value
                                                                ]
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#8B0000",
                                                                color: "#D4AF37",
                                                                fontSize: 14,
                                                                fontWeight:
                                                                    "bold",
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
                                                <InfoCircleOutlined
                                                    style={{ color: "#D4AF37" }}
                                                />
                                                <span>Hướng dẫn sử dụng</span>
                                            </Space>
                                        }
                                        style={{
                                            borderRadius: 12,
                                            border: "1px solid #D4AF37",
                                            marginTop: 16,
                                            background: "#FFFFFF",
                                        }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={6}>
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <PlusOutlined
                                                        style={{
                                                            fontSize: 24,
                                                            color: "#D4AF37",
                                                        }}
                                                    />
                                                    <Title level={5}>
                                                        Tạo View
                                                    </Title>
                                                    <Text type="secondary">
                                                        Tạo view mới với SQL
                                                        editor
                                                    </Text>
                                                </div>
                                            </Col>

                                            <Col xs={24} md={6}>
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <EditOutlined
                                                        style={{
                                                            fontSize: 24,
                                                            color: "#52c41a",
                                                        }}
                                                    />
                                                    <Title level={5}>
                                                        Chỉnh sửa
                                                    </Title>
                                                    <Text type="secondary">
                                                        Sửa đổi định nghĩa view
                                                    </Text>
                                                </div>
                                            </Col>

                                            <Col xs={24} md={6}>
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <CodeOutlined
                                                        style={{
                                                            fontSize: 24,
                                                            color: "#D4AF37",
                                                        }}
                                                    />
                                                    <Title level={5}>
                                                        Xem DDL
                                                    </Title>
                                                    <Text type="secondary">
                                                        Xem và sao chép DDL của
                                                        view
                                                    </Text>
                                                </div>
                                            </Col>

                                            <Col xs={24} md={6}>
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <DeleteOutlined
                                                        style={{
                                                            fontSize: 24,
                                                            color: "#dc143c",
                                                        }}
                                                    />
                                                    <Title level={5}>
                                                        Xóa View
                                                    </Title>
                                                    <Text type="secondary">
                                                        Xóa view không còn sử
                                                        dụng
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

            {/* Create View Modal */}
            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: "#D4AF37" }} />
                        <span style={{ color: "#8B0000" }}>Tạo View Mới</span>
                    </Space>
                }
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                width={900}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={creatingView}
                        onClick={() => createForm.submit()}
                        style={{
                            background: "#8B0000",
                            border: "1px solid #D4AF37",
                        }}
                    >
                        Tạo View
                    </Button>,
                ]}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreate}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="viewName"
                        label="Tên View"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên view",
                            },
                            {
                                pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                                message: "Tên view không hợp lệ",
                            },
                        ]}
                        tooltip="Tên view phải bắt đầu bằng chữ hoặc dấu _, chỉ chứa chữ, số và dấu _"
                    >
                        <Input
                            placeholder="ví dụ: user_active_stats"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="viewSql"
                        label="SQL định nghĩa View"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập SQL cho view",
                            },
                        ]}
                        tooltip="Câu lệnh SELECT để định nghĩa view"
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
                                height="400"
                                defaultLanguage="sql"
                                defaultValue={`-- Viết SQL cho view của bạn ở đây\n-- Ví dụ:\nSELECT \n  id,\n  name,\n  created_at\nFROM users\nWHERE status = 'active';`}
                                onMount={handleEditorDidMount}
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
                                }}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit View Modal */}
            <Modal
                title={
                    <Space>
                        <EditOutlined style={{ color: "#52c41a" }} />
                        <span>
                            Chỉnh sửa View:{" "}
                            <Text strong>{selectedView?.view_name}</Text>
                        </span>
                    </Space>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                width={900}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={updatingView}
                        onClick={() => editForm.submit()}
                        style={{
                            background: "#8B0000",
                            border: "1px solid #D4AF37",
                        }}
                    >
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdate}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item name="viewName" label="Tên View">
                        <Input disabled size="large" />
                    </Form.Item>

                    <Form.Item
                        name="viewSql"
                        label="SQL định nghĩa View"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập SQL cho view",
                            },
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
                                height="400"
                                defaultLanguage="sql"
                                value={selectedView?.definition || ""}
                                onMount={handleEditEditorDidMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    roundedSelection: true,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    wordWrap: "on",
                                }}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View DDL Modal */}
            <Modal
                style={{ height:"80%", top:"5%"}}
                title={
                    <Space>
                        <CodeOutlined style={{ color: "#D4AF37" }} />
                        <span>
                            DDL của View:{" "}
                            <Text strong>{selectedView?.view_name}</Text>
                        </span>
                    </Space>
                }
                open={isViewDDLModalOpen}
                onCancel={() => setIsViewDDLModalOpen(false)}
                width={1000}
                footer={[
                    <Button
                        key="copy"
                        icon={<CopyOutlined />}
                        onClick={handleCopyDDL}
                    >
                        Sao chép
                    </Button>,
                    <Button
                        key="close"
                        type="primary"
                        onClick={() => setIsViewDDLModalOpen(false)}
                        style={{
                            background: "#8B0000",
                            borderColor: "#D4AF37",
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                <div style={{ height: 500, marginTop: 16 }}>
                    <Editor
                        height="500px"
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
                            Chi tiết View:{" "}
                            <Text strong>{selectedView?.view_name}</Text>
                        </span>
                    </Space>
                }
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                width={800}
                footer={[
                    <Button
                        key="close"
                        type="primary"
                        onClick={() => setIsDetailModalOpen(false)}
                        style={{
                            background: "#8B0000",
                            borderColor: "#D4AF37",
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                <Descriptions
                    bordered
                    column={1}
                    style={{ marginTop: 16 }}
                    labelStyle={{ fontWeight: "bold", background: "#F1E8D6" }}
                >
                    <Descriptions.Item label="Tên View">
                        <Tag color="red">{selectedView?.view_name}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Schema">
                        <Tag color="geekblue">
                            {selectedView?.schema_name || "public"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Định nghĩa">
                        <div
                            style={{
                                maxHeight: 300,
                                overflow: "auto",
                                background: "#1e1e1e",
                                padding: 12,
                                borderRadius: 8,
                            }}
                        >
                            <pre
                                style={{
                                    color: "#d4d4d4",
                                    margin: 0,
                                    fontSize: 12,
                                }}
                            >
                                {selectedView?.definition ||
                                    "Không có định nghĩa"}
                            </pre>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="DDL">
                        <Button
                            type="link"
                            icon={<CodeOutlined />}
                            onClick={() => {
                                setIsDetailModalOpen(false);
                                if (selectedView) handleViewDDL(selectedView);
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
