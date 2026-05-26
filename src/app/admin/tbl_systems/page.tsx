// app/database/tables/page.tsx
"use client";

import { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Button,
  Space,
  Input,
  Tag,
  Tooltip,
  Statistic,
  Row,
  Col,
  Divider,
  Alert,
  Badge,
  Spin,
  Segmented,
  Empty,
  Modal,
  Descriptions,
  Collapse,
  Tabs,
  List,
  message,
  Progress,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  DatabaseOutlined,
  TableOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CodeOutlined,
  ApiOutlined,
  FileTextOutlined,
  CopyOutlined,
  DownloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useSupabaseTables,
  type SupabaseTable,
  type TriggerFilter,
  type SupabaseTriggerDDL,
} from "./hooks/useSupabaseTables";
import Editor from "@monaco-editor/react";

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

export default function TablesManager() {
  const {
    tables,
    filteredTables,
    loadingTables,
    tablesError,
    refetchTables,
    searchText,
    setSearchText,
    triggerFilter,
    setTriggerFilter,
    generateTableDDL,
    generatingTableDDL,
    generateTriggerDDL,
    generatingTriggerDDL,
  } = useSupabaseTables();

  const [selectedTable, setSelectedTable] = useState<SupabaseTable | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDDLModalOpen, setIsDDLModalOpen] = useState(false);
  const [isTriggerDDLModalOpen, setIsTriggerDDLModalOpen] = useState(false);
  const [tableDDL, setTableDDL] = useState<string>("");
  const [triggerDDLs, setTriggerDDLs] = useState<SupabaseTriggerDDL[]>([]);
  const [activeTab, setActiveTab] = useState("1");

  // Statistics
  const stats = {
    total: tables.length,
    withTriggers: tables.filter((t) => t.has_trigger).length,
    noTriggers: tables.filter((t) => !t.has_trigger).length,
    totalTriggers: tables.reduce((sum, t) => sum + (t.trigger_count || 0), 0),
  };

  // Group tables by schema
  const tablesBySchema = filteredTables.reduce(
    (acc, table) => {
      const schema = table.schema_name;
      if (!acc[schema]) acc[schema] = [];
      acc[schema].push(table);
      return acc;
    },
    {} as Record<string, SupabaseTable[]>
  );

  // Handle view table DDL
  const handleViewTableDDL = async (table: SupabaseTable) => {
    try {
      const ddl = await generateTableDDL(table.table_name);
      setTableDDL(ddl || "Không thể tạo DDL cho table này");
      setSelectedTable(table);
      setIsDDLModalOpen(true);
    } catch (error: any) {
      message.error(error.message || "Không thể tạo DDL");
    }
  };

  // Handle view trigger DDL
  const handleViewTriggerDDL = async (table?: SupabaseTable) => {
    try {
      const triggers = await generateTriggerDDL(table?.table_name);
      setTriggerDDLs(triggers);
      setSelectedTable(table || null);
      setIsTriggerDDLModalOpen(true);
    } catch (error: any) {
      message.error(error.message || "Không thể tạo Trigger DDL");
    }
  };

  // Handle copy DDL
  const handleCopyDDL = (ddl: string) => {
    navigator.clipboard.writeText(ddl);
    message.success("Đã sao chép DDL vào clipboard");
  };

  // Handle download DDL
  const handleDownloadDDL = (ddl: string, filename: string) => {
    const blob = new Blob([ddl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    message.success("Đã tải file DDL");
  };

  // Handle view table details
  const handleViewDetails = (table: SupabaseTable) => {
    setSelectedTable(table);
    setIsDetailModalOpen(true);
  };

  // Get trigger icon based on count
  const getTriggerIcon = (count: number) => {
    if (count === 0) return <CloseCircleOutlined />;
    if (count <= 2) return <ThunderboltOutlined />;
    return <WarningOutlined />;
  };

  if (tablesError) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#F5F5DC" }}>
        <Content style={{ padding: 24 }}>
          <Alert
            message="Lỗi tải dữ liệu"
            description={(tablesError as Error).message}
            type="error"
            showIcon
          />
          <Button
            onClick={() => refetchTables()}
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
          <DatabaseOutlined style={{ fontSize: 28, color: "#D4AF37" }} />
          <Title
            level={3}
            style={{
              color: "#D4AF37",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🗄️ Quản Lý Tables & Triggers
          </Title>
        </Space>
        <Space style={{ margin: "12px 0" }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetchTables()}
            style={{
              background: "#D4AF37",
              color: "#8B0000",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Làm mới
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24 }}>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "#FFFFFF",
                border: "1px solid #D4AF37",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <Statistic
                title="Tổng số Tables"
                value={stats.total}
                prefix={<TableOutlined />}
                valueStyle={{ color: "#D4AF37", fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "#FFFFFF",
                border: "1px solid #D4AF37",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <Statistic
                title="Có Triggers"
                value={stats.withTriggers}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a", fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "#FFFFFF",
                border: "1px solid #D4AF37",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <Statistic
                title="Không Triggers"
                value={stats.noTriggers}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f", fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "#FFFFFF",
                border: "1px solid #D4AF37",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <Statistic
                title="Tổng số Triggers"
                value={stats.totalTriggers}
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: "#D4AF37", fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #D4AF37",
            background: "#FFFFFF",
            marginBottom: 24,
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong style={{ color: "#8B0000" }}>
                🔍 Tìm kiếm
              </Text>
              <Input
                placeholder="Tìm kiếm theo tên table hoặc schema..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
                style={{ marginTop: 8 }}
              />
            </div>

            <div>
              <Text strong style={{ color: "#8B0000" }}>
                ⚡ Lọc theo Trigger
              </Text>
              <div style={{ marginTop: 8 }}>
                <Segmented
                  value={triggerFilter}
                  onChange={(value) => setTriggerFilter(value as TriggerFilter)}
                  options={[
                    { label: "Tất cả", value: "all" },
                    { label: "Có Trigger", value: "has_trigger" },
                    { label: "Không Trigger", value: "no_trigger" },
                  ]}
                  size="large"
                />
              </div>
            </div>

            <Divider style={{ margin: "8px 0" }} />

            <div>
              <Space>
                <DatabaseOutlined style={{ color: "#D4AF37" }} />
                <Text strong>
                  Kết quả: {filteredTables.length} / {tables.length} tables
                </Text>
              </Space>
            </div>
          </Space>
        </Card>

        {/* Tables List */}
        <Card
          title={
            <Space>
              <TableOutlined style={{ color: "#D4AF37" }} />
              <span>Danh sách Tables</span>
            </Space>
          }
          style={{
            borderRadius: 12,
            border: "1px solid #D4AF37",
            background: "#FFFFFF",
          }}
        >
          {loadingTables ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : filteredTables.length === 0 ? (
            <Empty description="Không tìm thấy table nào" />
          ) : (
            <Card
              title={
                <Space>
                  <TableOutlined style={{ color: "#D4AF37" }} />
                  <span>Danh sách Tables</span>
                </Space>
              }
              style={{
                borderRadius: 12,
                border: "1px solid #D4AF37",
                background: "#FFFFFF",
              }}
            >
              {loadingTables ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <Spin size="large" />
                </div>
              ) : filteredTables.length === 0 ? (
                <Empty description="Không tìm thấy table nào" />
              ) : (
                <Collapse
                  defaultActiveKey={Object.keys(tablesBySchema)}
                  ghost
                  expandIconPosition="end"
                  items={Object.entries(tablesBySchema).map(
                    ([schema, schemaTables]) => ({
                      key: schema,
                      label: (
                        <Space>
                          <DatabaseOutlined style={{ color: "#D4AF37" }} />
                          <strong style={{ fontSize: 16 }}>{schema}</strong>
                          <Badge
                            count={schemaTables.length}
                            style={{ backgroundColor: "#8B0000" }}
                          />
                        </Space>
                      ),
                      children: (
                        <div style={{ paddingLeft: 24 }}>
                          {schemaTables.map((table) => (
                            <Card
                              key={`${table.schema_name}.${table.table_name}`}
                              style={{
                                marginBottom: 12,
                                border: "1px solid #F0F0F0",
                                borderRadius: 8,
                                cursor: "pointer",
                                transition: "all 0.3s",
                              }}
                              hoverable
                              onClick={() => handleViewDetails(table)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                  gap: 12,
                                }}
                              >
                                <Space>
                                  <TableOutlined
                                    style={{ fontSize: 20, color: "#D4AF37" }}
                                  />
                                  <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                      {table.table_name}
                                    </Text>
                                    <div>
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                      >
                                        {table.table_type}
                                      </Text>
                                    </div>
                                  </div>
                                </Space>

                                <Space>
                                  {table.has_trigger ? (
                                    <Tooltip
                                      title={`Có ${table.trigger_count} triggers`}
                                    >
                                      <Tag
                                        icon={getTriggerIcon(
                                          table.trigger_count
                                        )}
                                        color="success"
                                        style={{ padding: "4px 12px" }}
                                      >
                                        {table.trigger_count} Triggers
                                      </Tag>
                                    </Tooltip>
                                  ) : (
                                    <Tag
                                      icon={<CloseCircleOutlined />}
                                      color="default"
                                    >
                                      Không có Trigger
                                    </Tag>
                                  )}
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(table);
                                    }}
                                  >
                                    Chi tiết
                                  </Button>
                                </Space>
                              </div>

                              {/* Quick stats */}
                              {table.has_trigger && (
                                <div
                                  style={{
                                    marginTop: 12,
                                    paddingTop: 12,
                                    borderTop: "1px solid #F0F0F0",
                                  }}
                                >
                                  <Space size="large">
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      <ThunderboltOutlined />{" "}
                                      {table.trigger_count} trigger(s) đang hoạt
                                      động
                                    </Text>
                                  </Space>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      ),
                    })
                  )}
                />
              )}
            </Card>
          )}
        </Card>
      </Content>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <TableOutlined style={{ color: "#D4AF37" }} />
            <span>
              Chi tiết Table: <Text strong>{selectedTable?.table_name}</Text>
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
            style={{
              background: "#8B0000",
              borderColor: "#D4AF37",
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        {selectedTable && (
          <Descriptions
            bordered
            column={1}
            style={{ marginTop: 16 }}
            labelStyle={{ fontWeight: "bold", background: "#F1E8D6" }}
          >
            <Descriptions.Item label="Tên Table">
              <Tag color="red">{selectedTable.table_name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Schema">
              <Tag color="geekblue">{selectedTable.schema_name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Kiểu">
              <Tag color="purple">{selectedTable.table_type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trigger Status">
              {selectedTable.has_trigger ? (
                <Space>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <Text style={{ color: "#52c41a" }}>Có trigger</Text>
                  <Badge
                    count={selectedTable.trigger_count}
                    style={{ backgroundColor: "#D4AF37" }}
                  />
                </Space>
              ) : (
                <Space>
                  <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                  <Text style={{ color: "#ff4d4f" }}>Không có trigger</Text>
                </Space>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Actions">
              <Space wrap>
                <Button
                  icon={<CodeOutlined />}
                  onClick={() => handleViewTableDDL(selectedTable)}
                  loading={generatingTableDDL}
                >
                  Xem DDL Table
                </Button>
                <Button
                  icon={<ThunderboltOutlined />}
                  onClick={() => handleViewTriggerDDL(selectedTable)}
                  loading={generatingTriggerDDL}
                  disabled={!selectedTable.has_trigger}
                >
                  Xem DDL Triggers
                </Button>
                <Button
                  icon={<ApiOutlined />}
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    // Navigate to relations page
                    window.location.href = "/database/relations";
                  }}
                >
                  Xem Relations
                </Button>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Table DDL Modal */}
      <Modal
        title={
          <Space>
            <CodeOutlined style={{ color: "#D4AF37" }} />
            <span>
              DDL Table: <Text strong>{selectedTable?.table_name}</Text>
            </span>
          </Space>
        }
        open={isDDLModalOpen}
        onCancel={() => setIsDDLModalOpen(false)}
        width={900}
        footer={[
          <Button
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => handleCopyDDL(tableDDL)}
          >
            Sao chép
          </Button>,
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={() =>
              handleDownloadDDL(tableDDL, `${selectedTable?.table_name}.sql`)
            }
          >
            Tải xuống
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setIsDDLModalOpen(false)}
            style={{ background: "#8B0000", borderColor: "#D4AF37" }}
          >
            Đóng
          </Button>,
        ]}
      >
        <div style={{ height: 350, marginTop: 16 }}>
          <Editor
            height="350px"
            defaultLanguage="sql"
            value={tableDDL}
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

      {/* Trigger DDL Modal */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined style={{ color: "#D4AF37" }} />
            <span>
              DDL Triggers{" "}
              {selectedTable && `của table: ${selectedTable.table_name}`}
            </span>
          </Space>
        }
        open={isTriggerDDLModalOpen}
        onCancel={() => setIsTriggerDDLModalOpen(false)}
        width={900}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsTriggerDDLModalOpen(false)}
            style={{ background: "#8B0000", borderColor: "#D4AF37" }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Tabs
          defaultActiveKey="0"
          type="card"
          style={{ marginTop: 16 }}
          items={triggerDDLs.map((trigger, index) => ({
            key: String(index),
            label: (
              <Space>
                <ThunderboltOutlined />
                {trigger.trigger_name}
              </Space>
            ),
            children: (
              <div>
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyDDL(trigger.ddl)}
                  >
                    Sao chép
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownloadDDL(
                        trigger.ddl,
                        `${trigger.trigger_name}.sql`
                      )
                    }
                  >
                    Tải xuống
                  </Button>
                </div>
                <div style={{ height: 400 }}>
                  <Editor
                    height="350px"
                    defaultLanguage="sql"
                    value={trigger.ddl}
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
              </div>
            ),
          }))}
        />
        {triggerDDLs.length === 0 && (
          <Empty
            description="Không có triggers nào"
            style={{ marginTop: 60 }}
          />
        )}
      </Modal>
    </Layout>
  );
}
