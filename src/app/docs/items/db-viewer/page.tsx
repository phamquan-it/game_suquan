"use client";
import { BaseItem } from "@/types/items/base";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Card,
    Tag,
    Space,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    message,
    Popconfirm,
    Typography,
    Row,
    Col,
    Statistic,
    Divider
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    ShoppingOutlined,
    CrownOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ItemsPage() {
    const [items, setItems] = useState<BaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<BaseItem | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from("base_items")
            .select("*")
            .order("base_value", { ascending: false });

        if (error) {
            console.error("Error fetching items:", error);
            message.error("Failed to fetch items");
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    const handleInsert = async (values: any) => {
        const newItem = {
            ...values,
            id: `item_${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from("base_items")
            .insert([newItem]);

        if (error) {
            console.error("Insert error:", error);
            message.error("Failed to insert item");
        } else {
            message.success("Item created successfully");
            setModalVisible(false);
            form.resetFields();
            fetchItems();
        }
    };

    const handleUpdate = async (values: any) => {
        if (!editingItem) return;

        const { error } = await supabase
            .from("base_items")
            .update({
                ...values,
                updated_at: new Date().toISOString()
            })
            .eq("id", editingItem.id);

        if (error) {
            console.error("Update error:", error);
            message.error("Failed to update item");
        } else {
            message.success("Item updated successfully");
            setModalVisible(false);
            setEditingItem(null);
            form.resetFields();
            fetchItems();
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("base_items")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete error:", error);
            message.error("Failed to delete item");
        } else {
            message.success("Item deleted successfully");
            fetchItems();
        }
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setModalVisible(true);
        form.resetFields();
    };

    const openEditModal = (item: BaseItem) => {
        setEditingItem(item);
        setModalVisible(true);
        form.setFieldsValue(item);
    };

    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            common: "gray",
            uncommon: "green",
            rare: "blue",
            epic: "purple",
            legendary: "orange",
            mythic: "red"
        };
        return colors[rarity] || "default";
    };

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            weapon: "red",
            armor: "blue",
            consumable: "green",
            material: "orange",
            quest: "purple",
            special: "cyan",
            currency: "gold"
        };
        return colors[type] || "default";
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: BaseItem) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.description}
                    </Text>
                </div>
            ),
        },
        {
            title: "Type & Rarity",
            key: "type_rarity",
            render: (record: BaseItem) => (
                <Space direction="vertical" size="small">
                    <Tag color={getTypeColor(record.type)}>{record.type}</Tag>
                    <Tag color={getRarityColor(record.rarity)}>
                        <CrownOutlined /> {record.rarity}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Level & Quality",
            key: "level_quality",
            render: (record: BaseItem) => (
                <Space direction="vertical" size="small">
                    <Tag color="blue">Lv. {record.level_requirement}</Tag>
                    <Tag color="cyan">{record.quality}</Tag>
                </Space>
            ),
        },
        {
            title: "Value",
            dataIndex: "base_value",
            key: "base_value",
            render: (value: number) => (
                <Text strong style={{ color: "#52c41a" }}>
                    <ShoppingOutlined /> {value.toLocaleString()}g
                </Text>
            ),
            sorter: (a: BaseItem, b: BaseItem) => a.base_value - b.base_value,
        },
        {
            title: "Stack",
            key: "stack",
            render: (record: BaseItem) => (
                record.stackable ? (
                    <Tag color="green">Max: {record.max_stack}</Tag>
                ) : (
                    <Tag color="red">Not Stackable</Tag>
                )
            ),
        },
        {
            title: "Properties",
            key: "properties",
            render: (record: BaseItem) => (
                <Space size="small" direction="vertical">
                    {record.is_tradable && <Tag color="green" size="small">Tradable</Tag>}
                    {record.is_sellable && <Tag color="blue" size="small">Sellable</Tag>}
                    {record.is_destroyable && <Tag color="orange" size="small">Destroyable</Tag>}
                    {record.is_quest_item && <Tag color="purple" size="small">Quest</Tag>}
                </Space>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: BaseItem) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Item"
                        description="Are you sure to delete this item?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Calculate statistics
    const totalValue = items.reduce((sum, item) => sum + item.base_value, 0);
    const averageLevel = items.length > 0
        ? items.reduce((sum, item) => sum + item.level_requirement, 0) / items.length
        : 0;

    return (
        <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
            <Card>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <Title level={1}>🎮 Items Management</Title>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchItems}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateModal}
                        >
                            Add New Item
                        </Button>
                    </Space>
                </div>

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic
                                title="Total Items"
                                value={items.length}
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic
                                title="Total Value"
                                value={totalValue}
                                prefix="💰"
                                suffix="g"
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic
                                title="Average Level"
                                value={Math.round(averageLevel)}
                                prefix="⚡"
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider />

                {/* Items Table */}
                <Table
                    dataSource={items}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 1000 }}
                />

                {/* Create/Edit Modal */}
                <Modal
                    title={editingItem ? "Edit Item" : "Create New Item"}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingItem(null);
                        form.resetFields();
                    }}
                    footer={null}
                    width={700}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={editingItem ? handleUpdate : handleInsert}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Item Name"
                                    rules={[{ required: true, message: "Please enter item name" }]}
                                >
                                    <Input placeholder="Enter item name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="type"
                                    label="Item Type"
                                    rules={[{ required: true, message: "Please select item type" }]}
                                >
                                    <Select placeholder="Select item type">
                                        <Option value="weapon">Weapon</Option>
                                        <Option value="armor">Armor</Option>
                                        <Option value="consumable">Consumable</Option>
                                        <Option value="material">Material</Option>
                                        <Option value="quest">Quest</Option>
                                        <Option value="special">Special</Option>
                                        <Option value="currency">Currency</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <Input.TextArea placeholder="Enter item description" rows={3} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="rarity"
                                    label="Rarity"
                                    rules={[{ required: true, message: "Please select rarity" }]}
                                >
                                    <Select placeholder="Select rarity">
                                        <Option value="common">Common</Option>
                                        <Option value="uncommon">Uncommon</Option>
                                        <Option value="rare">Rare</Option>
                                        <Option value="epic">Epic</Option>
                                        <Option value="legendary">Legendary</Option>
                                        <Option value="mythic">Mythic</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="quality"
                                    label="Quality"
                                    rules={[{ required: true, message: "Please select quality" }]}
                                >
                                    <Select placeholder="Select quality">
                                        <Option value="broken">Broken</Option>
                                        <Option value="damaged">Damaged</Option>
                                        <Option value="normal">Normal</Option>
                                        <Option value="good">Good</Option>
                                        <Option value="excellent">Excellent</Option>
                                        <Option value="perfect">Perfect</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="level_requirement"
                                    label="Level Requirement"
                                    rules={[{ required: true, message: "Please enter level requirement" }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{ width: "100%" }}
                                        placeholder="Level"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="base_value"
                                    label="Base Value"
                                    rules={[{ required: true, message: "Please enter base value" }]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder="Gold value"
                                        addonAfter="g"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="max_stack"
                                    label="Max Stack"
                                    rules={[{ required: true, message: "Please enter max stack" }]}
                                >
                                    <InputNumber
                                        min={1}
                                        style={{ width: "100%" }}
                                        placeholder="Stack size"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="stackable"
                                    label="Stackable"
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item
                                    name="is_tradable"
                                    label="Tradable"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="is_sellable"
                                    label="Sellable"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="is_destroyable"
                                    label="Destroyable"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="is_quest_item"
                                    label="Quest Item"
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {editingItem ? "Update Item" : "Create Item"}
                                </Button>
                                <Button onClick={() => {
                                    setModalVisible(false);
                                    setEditingItem(null);
                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
}
