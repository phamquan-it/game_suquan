// app/(admin)/generals/page.tsx
'use client';

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Select,
    Space,
    Table,
    Tag,
    Avatar,
    Progress,
    Statistic,
    Modal,
    Form,
    message,
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FilterOutlined,
    ExportOutlined,
    StarFilled,
    FireOutlined,
    SunOutlined,
    MoonOutlined,
    CloudUploadOutlined,
    WeiboOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { General } from '@/lib/types/hero.types';
import { ShipIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import CreateGeneralButton from '@/components/CreateGeneralButton';

const { Option } = Select;

export default function GeneralsManagementPage() {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Mock data - thay thế bằng API thực tế
    const mockGenerals: General[] = [
        {
            id: '1',
            name: 'Lê Hoàn',
            title: 'Đại Vương',
            rarity: 'legendary',
            element: 'fire',
            type: 'warrior',
            level: 95,
            maxLevel: 100,
            baseStats: { attack: 950, defense: 850, health: 12000, speed: 80, intelligence: 70, leadership: 95 },
            currentStats: { attack: 1250, defense: 1050, health: 15000, speed: 85, intelligence: 75, leadership: 98 },
            skills: [],
            equipment: [],
            status: 'active',
            location: 'Thăng Long',
            experience: 485000,
            requiredExp: 500000,
            starLevel: 5,
            maxStarLevel: 6,
            awakeningLevel: 3,
            bondLevel: 4,
            favorite: true,
            obtainedDate: '2024-01-15',
            lastUsed: '2024-12-01',
            battleCount: 1250,
            winRate: 78.5,
            specialAbilities: ['Thiên Mệnh', 'Long Bào'],
            voiceActor: 'Trần Văn A',
            biography: 'Người sáng lập nhà Tiền Lê...',
            quotes: ['Thiên hạ thái bình!', 'Vì dân vì nước!'],
            image: '/generals/le-hoan.jpg',
            thumbnail: '/generals/le-hoan-thumb.jpg'
        }
    ];

    const columns: ColumnsType<General> = [
        {
            title: 'Tướng',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 200,
            render: (name: string, record: General) => (
                <Space>
                    <Avatar
                        size="large"
                        src={record.thumbnail}
                        icon={<StarFilled />}
                        style={{ border: `2px solid ${getRarityColor(record.rarity)}` }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{record.title}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Cấp Độ',
            dataIndex: 'level',
            key: 'level',
            width: 120,
            render: (level: number, record: General) => (
                <div>
                    <div>Cấp {level}</div>
                    <Progress
                        percent={Math.round((record.experience / record.requiredExp) * 100)}
                        size="small"
                        showInfo={false}
                    />
                </div>
            ),
        },
        {
            title: 'Độ Hiếm',
            dataIndex: 'rarity',
            key: 'rarity',
            width: 120,
            render: (rarity: string) => (
                <Tag color={getRarityColor(rarity)} style={{ margin: 0 }}>
                    {getRarityText(rarity)}
                </Tag>
            ),
        },
        {
            title: 'Nguyên Tố',
            dataIndex: 'element',
            key: 'element',
            width: 100,
            render: (element: string) => (
                <Tooltip title={getElementText(element)}>
                    {getElementIcon(element)}
                </Tooltip>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: string) => (
                <Tag color={getTypeColor(type)}>
                    {getTypeText(type)}
                </Tag>
            ),
        },
        {
            title: 'Sao',
            dataIndex: 'starLevel',
            key: 'starLevel',
            width: 100,
            render: (starLevel: number, record: General) => (
                <Space>
                    {Array.from({ length: record.maxStarLevel }, (_, i) => (
                        <StarFilled
                            key={i}
                            style={{
                                color: i < starLevel ? '#D4AF37' : '#d9d9d9',
                                fontSize: 12
                            }}
                        />
                    ))}
                </Space>
            ),
        },
        {
            title: 'Chỉ Số Chiến Đấu',
            dataIndex: 'currentStats',
            key: 'power',
            width: 150,
            render: (stats: General['currentStats']) => (
                <Statistic
                    value={calculateCombatPower(stats)}
                    valueStyle={{ fontSize: 16, fontWeight: 600, color: '#8B0000' }}
                    suffix="CP"
                />
            ),
        },
        {
            title: 'Tỷ Lệ Thắng',
            dataIndex: 'winRate',
            key: 'winRate',
            width: 120,
            render: (winRate: number) => (
                <Progress
                    percent={winRate}
                    size="small"
                    strokeColor={winRate >= 70 ? '#52c41a' : winRate >= 50 ? '#faad14' : '#f5222d'}
                    format={percent => `${percent}%`}
                />
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Thao Tác',
            key: 'actions',
            fixed: 'right',
            width: 150,
            render: (_, record: General) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => viewGeneral(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => editGeneral(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteGeneral(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Helper functions
    const getRarityColor = (rarity: string) => {
        const colors = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FA8C16',
            mythic: '#F5222D'
        };
        return colors[rarity as keyof typeof colors] || '#8C8C8C';
    };

    const getRarityText = (rarity: string) => {
        const texts = {
            common: 'Thường',
            rare: 'Hiếm',
            epic: 'Sử Thi',
            legendary: 'Huyền Thoại',
            mythic: 'Thần Thoại'
        };
        return texts[rarity as keyof typeof texts] || 'Thường';
    };

    const getElementIcon = (element: string) => {
        const icons = {
            fire: <FireOutlined style={{ color: '#FF4D4F', fontSize: 18 }} />,
            water: <CloudUploadOutlined style={{ color: '#1890FF', fontSize: 18 }} />,
            earth: <WeiboOutlined style={{ color: '#52C41A', fontSize: 18 }} />,
            wind: <ShipIcon style={{ color: '#13C2C2', fontSize: 18 }} />,
            light: <SunOutlined style={{ color: '#FAAD14', fontSize: 18 }} />,
            dark: <MoonOutlined style={{ color: '#722ED1', fontSize: 18 }} />
        };
        return icons[element as keyof typeof icons] || <FireOutlined />;
    };

    const getElementText = (element: string) => {
        const texts = {
            fire: 'Hỏa',
            water: 'Thủy',
            earth: 'Thổ',
            wind: 'Phong',
            light: 'Quang',
            dark: 'Ám'
        };
        return texts[element as keyof typeof texts] || 'Hỏa';
    };

    const getTypeColor = (type: string) => {
        const colors = {
            warrior: '#CF1322',
            archer: '#389E0D',
            mage: '#722ED1',
            assassin: '#434343',
            support: '#08979C',
            tank: '#D46B08'
        };
        return colors[type as keyof typeof colors] || '#8C8C8C';
    };

    const getTypeText = (type: string) => {
        const texts = {
            warrior: 'Chiến Binh',
            archer: 'Cung Thủ',
            mage: 'Pháp Sư',
            assassin: 'Sát Thủ',
            support: 'Hỗ Trợ',
            tank: 'Đỡ Đòn'
        };
        return texts[type as keyof typeof texts] || 'Chiến Binh';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: '#52C41A',
            inactive: '#8C8C8C',
            training: '#1890FF',
            deployed: '#FA8C16'
        };
        return colors[status as keyof typeof colors] || '#8C8C8C';
    };

    const getStatusText = (status: string) => {
        const texts = {
            active: 'Hoạt Động',
            inactive: 'Không Hoạt Động',
            training: 'Đang Huấn Luyện',
            deployed: 'Đã Triển Khai'
        };
        return texts[status as keyof typeof texts] || 'Không Hoạt Động';
    };

    const calculateCombatPower = (stats: General['currentStats']) => {
        return 10

        //  Math.round(
        //     stats.attack * 2 +
        //     stats.defense * 1.5 +
        //     stats.health * 0.1 +
        //     stats.speed * 3 +
        //     stats.intelligence * 1.2 +
        //     stats.leadership * 1.8
        // );
    };

    // Action handlers
    const viewGeneral = (general: General) => {
        Modal.info({
            title: `Thông Tin Tướng: ${general.name}`,
            width: 800,
            content: (
                <div>
                    <p>Chi tiết tướng sẽ được hiển thị ở đây...</p>
                </div>
            ),
        });
    };

    const editGeneral = (general: General) => {
        message.info(`Chỉnh sửa tướng: ${general.name}`);
    };

    const deleteGeneral = (general: General) => {
        Modal.confirm({
            title: 'Xác Nhận Xóa',
            content: `Bạn có chắc muốn xóa tướng "${general.name}"?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk() {
                message.success(`Đã xóa tướng: ${general.name}`);
            },
        });
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một tướng');
            return;
        }

        Modal.confirm({
            title: 'Xác Nhận Xóa Hàng Loạt',
            content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} tướng đã chọn?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk() {
                message.success(`Đã xóa ${selectedRowKeys.length} tướng`);
                setSelectedRowKeys([]);
            },
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };
    const { data, isFetching } = useQuery({
        queryKey: ["generals"], // cache key
        queryFn: async () => await supabase.from("generals").select("*"),
        staleTime: 1000 * 60, // 1 min (optional)
    });

    return (
        <div style={{ padding: 24 }}>
            <Card>
                {/* Header với thống kê */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Tổng Số Tướng"
                            value={mockGenerals.length}
                            prefix={<StarFilled />}
                            valueStyle={{ color: '#8B0000' }}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Tướng Huyền Thoại"
                            value={mockGenerals.filter(g => g.rarity === 'legendary').length}
                            valueStyle={{ color: '#FA8C16' }}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Tỷ Lệ Hoạt Động"
                            value={Math.round((mockGenerals.filter(g => g.status === 'active').length / mockGenerals.length) * 100)}
                            suffix="%"
                            valueStyle={{ color: '#52C41A' }}
                        />
                    </Col>
                </Row>

                {/* Thanh công cụ */}
                <div style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} md={12}>
                            <Space>
                                <Input
                                    placeholder="Tìm kiếm tướng..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 300 }}
                                />
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => setFilterVisible(true)}
                                >
                                    Bộ Lọc
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <Space style={{ float: 'right' }}>
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={handleBulkDelete}
                                    >
                                        Xóa Đã Chọn ({selectedRowKeys.length})
                                    </Button>
                                )}
                                <CreateGeneralButton />
                                <Button
                                    icon={<ExportOutlined />}
                                >
                                    Xuất Excel
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Bảng dữ liệu */}
                <Table
                    columns={columns}
                    dataSource={data?.data ?? []}
                    rowSelection={rowSelection}
                    rowKey="id"
                    loading={isFetching}
                    scroll={{ x: 1500 }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} tướng`,
                    }}
                />
            </Card>

            {/* Modal bộ lọc */}
            <Modal
                title="Bộ Lọc Tướng"
                open={filterVisible}
                onCancel={() => setFilterVisible(false)}
                footer={[
                    <Button key="reset" onClick={() => ({})}>
                        Đặt Lại
                    </Button>,
                    <Button key="cancel" onClick={() => setFilterVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => setFilterVisible(false)}>
                        Áp Dụng
                    </Button>,
                ]}
                width={600}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Độ Hiếm">
                                <Select mode="multiple" placeholder="Chọn độ hiếm">
                                    <Option value="common">Thường</Option>
                                    <Option value="rare">Hiếm</Option>
                                    <Option value="epic">Sử Thi</Option>
                                    <Option value="legendary">Huyền Thoại</Option>
                                    <Option value="mythic">Thần Thoại</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Nguyên Tố">
                                <Select mode="multiple" placeholder="Chọn nguyên tố">
                                    <Option value="fire">Hỏa</Option>
                                    <Option value="water">Thủy</Option>
                                    <Option value="earth">Thổ</Option>
                                    <Option value="wind">Phong</Option>
                                    <Option value="light">Quang</Option>
                                    <Option value="dark">Ám</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Loại Tướng">
                                <Select mode="multiple" placeholder="Chọn loại">
                                    <Option value="warrior">Chiến Binh</Option>
                                    <Option value="archer">Cung Thủ</Option>
                                    <Option value="mage">Pháp Sư</Option>
                                    <Option value="assassin">Sát Thủ</Option>
                                    <Option value="support">Hỗ Trợ</Option>
                                    <Option value="tank">Đỡ Đòn</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Trạng Thái">
                                <Select mode="multiple" placeholder="Chọn trạng thái">
                                    <Option value="active">Hoạt Động</Option>
                                    <Option value="inactive">Không Hoạt Động</Option>
                                    <Option value="training">Đang Huấn Luyện</Option>
                                    <Option value="deployed">Đã Triển Khai</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Cấp Độ (Từ)">
                                <Input type="number" placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Cấp Độ (Đến)">
                                <Input type="number" placeholder="100" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
