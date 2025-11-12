'use client';

import React, { useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Input,
    InputNumber,
    Form,
    Modal,
    message,
    Card,
    Typography,
    Tooltip,
    Switch,
    Statistic,
    Row,
    Col
} from 'antd';
import {
    EditOutlined,
    PlusOutlined,
    DollarOutlined,
    LineChartOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { Currency } from '@/lib/types/economy.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;

interface CurrencyManagerProps {
    currencies: Currency[];
    onCurrenciesChange: (currencies: Currency[]) => void;
}

export default function CurrencyManager({ currencies, onCurrenciesChange }: CurrencyManagerProps) {
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const filteredCurrencies = currencies.filter(currency =>
        currency.name.toLowerCase().includes(searchText.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchText.toLowerCase())
    );

    const getCurrencyTypeColor = (type: Currency['type']) => {
        switch (type) {
            case 'premium': return 'gold';
            case 'basic': return 'blue';
            case 'special': return 'purple';
            default: return 'default';
        }
    };

    const getCurrencyTypeText = (type: Currency['type']) => {
        switch (type) {
            case 'premium': return 'Premium';
            case 'basic': return 'Cơ bản';
            case 'special': return 'Đặc biệt';
            default: return type;
        }
    };

    const getStatusColor = (status: Currency['status']) => {
        return status === 'active' ? 'green' : 'red';
    };

    const handleEdit = (currency: Currency) => {
        setEditingCurrency(currency);
        form.setFieldsValue(currency);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setEditingCurrency(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSave = async (values: any) => {
        try {
            if (editingCurrency) {
                // Update existing currency
                const updated = currencies.map(c =>
                    c.id === editingCurrency.id ? { ...c, ...values } : c
                );
                onCurrenciesChange(updated);
                message.success('Cập nhật tiền tệ thành công');
            } else {
                // Add new currency
                const newCurrency: Currency = {
                    id: `currency_${Date.now()}`,
                    ...values,
                    lastUpdated: new Date().toISOString(),
                };
                onCurrenciesChange([...currencies, newCurrency]);
                message.success('Thêm tiền tệ mới thành công');
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error('Có lỗi xảy ra');
        }
    };

    const handleAdjustInflation = (currencyId: string, newRate: number) => {
        const updated = currencies.map(c =>
            c.id === currencyId ? { ...c, inflationRate: newRate } : c
        );
        onCurrenciesChange(updated);
        message.success('Điều chỉnh tỷ lệ lạm phát thành công');
    };

    const columns: ColumnsType<Currency> = [
        {
            title: 'Tiền tệ',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (name: string, record: Currency) => (
                <Space>
                    <DollarOutlined style={{ color: '#D4AF37' }} />
                    <div>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.code}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: Currency['type']) => (
                <Tag color={getCurrencyTypeColor(type)}>
                    {getCurrencyTypeText(type)}
                </Tag>
            ),
        },
        {
            title: 'Số lượng lưu thông',
            dataIndex: 'inCirculation',
            key: 'inCirculation',
            width: 150,
            sorter: (a, b) => a.inCirculation - b.inCirculation,
            render: (amount: number) => (
                <Text strong>{(amount / 1000000).toFixed(1)}M</Text>
            ),
        },
        {
            title: 'Tỷ giá',
            dataIndex: 'exchangeRate',
            key: 'exchangeRate',
            width: 100,
            sorter: (a, b) => a.exchangeRate - b.exchangeRate,
            render: (rate: number) => (
                <Text>{rate === 0 ? 'Không đổi' : rate.toFixed(2)}</Text>
            ),
        },
        {
            title: 'Lạm phát',
            dataIndex: 'inflationRate',
            key: 'inflationRate',
            width: 120,
            sorter: (a, b) => a.inflationRate - b.inflationRate,
            render: (rate: number, record: Currency) => (
                <Space>
                    <Text style={{
                        color: rate > 3 ? '#dc143c' :
                            rate > 1.5 ? '#d4af37' : '#2e8b57',
                        fontWeight: 'bold'
                    }}>
                        {rate}%
                    </Text>
                    <Tooltip title="Điều chỉnh lạm phát">
                        <Button
                            size="small"
                            type="text"
                            icon={<LineChartOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Điều chỉnh tỷ lệ lạm phát',
                                    content: (
                                        <InputNumber
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            defaultValue={rate}
                                            style={{ width: '100%', marginTop: 8 }}
                                        />
                                    ),
                                    onOk: (value) => {
                                        const newRate = parseFloat(value);
                                        handleAdjustInflation(record.id, newRate);
                                    }
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: Currency['status']) => (
                <Tag color={getStatusColor(status)}>
                    {status === 'active' ? 'Hoạt động' : 'Ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Cập nhật',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            width: 120,
            render: (date: string) => (
                <Text style={{ fontSize: 12 }}>
                    {new Date(date).toLocaleDateString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const totalInCirculation = currencies.reduce((sum, c) => sum + c.inCirculation, 0);
    const avgInflation = currencies.reduce((sum, c) => sum + c.inflationRate, 0) / currencies.length;

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Summary Stats */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng tiền lưu thông"
                            value={totalInCirculation}
                            precision={0}
                            prefix="₫"
                            valueStyle={{ color: '#D4AF37' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Lạm phát trung bình"
                            value={avgInflation}
                            precision={1}
                            suffix="%"
                            valueStyle={{
                                color: avgInflation > 3 ? '#dc143c' :
                                    avgInflation > 1.5 ? '#d4af37' : '#2e8b57'
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Số loại tiền tệ"
                            value={currencies.length}
                            valueStyle={{ color: '#003366' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Action Bar */}
            <Card size="small" variant="borderless">
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Search
                        placeholder="Tìm kiếm tiền tệ..."
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Thêm Tiền Tệ
                    </Button>
                </Space>
            </Card>

            {/* Currency Table */}
            <Card variant="borderless">
                <Table
                    columns={columns}
                    dataSource={filteredCurrencies}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    size="middle"
                />
            </Card>

            {/* Edit/Add Modal */}
            <Modal
                title={editingCurrency ? 'Chỉnh sửa Tiền tệ' : 'Thêm Tiền tệ Mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên tiền tệ"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tiền tệ' }]}
                            >
                                <Input placeholder="Ví dụ: Vàng, Kim Cương..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Mã code"
                                rules={[{ required: true, message: 'Vui lòng nhập mã code' }]}
                            >
                                <Input placeholder="Ví dụ: GOLD, DIAMOND..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Loại tiền tệ"
                                rules={[{ required: true, message: 'Vui lòng chọn loại tiền tệ' }]}
                            >
                                <Input placeholder="premium, basic, special" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="exchangeRate"
                                label="Tỷ giá quy đổi"
                                rules={[{ required: true, message: 'Vui lòng nhập tỷ giá' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={0.01}
                                    placeholder="1.0"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="inCirculation"
                                label="Số lượng lưu thông"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={1000}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="inflationRate"
                                label="Tỷ lệ lạm phát (%)"
                                rules={[{ required: true, message: 'Vui lòng nhập tỷ lệ lạm phát' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    placeholder="2.1"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch
                            checkedChildren="Hoạt động"
                            unCheckedChildren="Ngừng"
                            defaultChecked
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
