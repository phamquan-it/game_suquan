// app/(admin)/generals/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Space,
    Upload,
    message,
    Row,
    Col,
    Divider,
    Tabs,
    Statistic,
    Switch,
    Skeleton,
    Alert
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    UploadOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function EditGeneralPage() {
    const [form] = Form.useForm();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [generalData, setGeneralData] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const generalId = params.id as string;

    // Load dữ liệu tướng
    useEffect(() => {
        const loadGeneralData = async () => {
            setDataLoading(true);
            try {
                // Mock API call - thay bằng API thực tế
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData = {
                    id: generalId,
                    name: 'Lê Hoàn',
                    title: 'Đại Vương',
                    rarity: 'legendary',
                    element: 'fire',
                    type: 'warrior',
                    level: 95,
                    maxLevel: 100,
                    baseStats: {
                        attack: 950,
                        defense: 850,
                        health: 12000,
                        speed: 80,
                        intelligence: 70,
                        leadership: 95
                    },
                    currentStats: {
                        attack: 1250,
                        defense: 1050,
                        health: 15000,
                        speed: 85,
                        intelligence: 75,
                        leadership: 98
                    },
                    skills: [
                        {
                            id: '1',
                            name: 'Thiên Mệnh',
                            type: 'ultimate',
                            description: 'Tăng sức mạnh toàn quân'
                        }
                    ],
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
                };

                setGeneralData(mockData);
                form.setFieldsValue(mockData);
                setImageUrl(mockData.image);
            } catch (error) {
                message.error('Không thể tải dữ liệu tướng');
                console.error('Error loading general:', error);
            } finally {
                setDataLoading(false);
            }
        };

        if (generalId) {
            loadGeneralData();
        }
    }, [generalId, form]);

    // Xử lý submit form
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Gọi API để cập nhật tướng
            console.log('Update values:', values);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            message.success('Cập nhật tướng thành công!');
            router.push('/generals');
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật tướng');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý upload ảnh
    const handleImageUpload = (info: any) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} upload thành công`);
            setImageUrl(URL.createObjectURL(info.file.originFileObj));
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload thất bại`);
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('Chỉ có thể upload file ảnh!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Ảnh phải nhỏ hơn 2MB!');
            }
            return isImage && isLt2M;
        },
        onChange: handleImageUpload,
    };

    if (dataLoading) {
        return (
            <div style={{ padding: 24 }}>
                <Card>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    if (!generalData) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Lỗi"
                    description="Không tìm thấy thông tin tướng"
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        style={{ marginBottom: 16 }}
                    >
                        Quay Lại
                    </Button>
                    <h1 style={{ margin: 0, color: '#8B0000' }}>
                        <EditOutlined /> Chỉnh Sửa Tướng: {generalData.name}
                    </h1>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={generalData}
                >
                    <Row gutter={[24, 24]}>
                        {/* Preview Section */}
                        <Col xs={24} lg={8}>
                            <Card title="Preview" style={{ position: 'sticky', top: 24 }}>
                                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                    <Upload
                                        {...uploadProps}
                                        showUploadList={false}
                                        accept="image/*"
                                    >
                                        <div
                                            style={{
                                                width: 200,
                                                height: 200,
                                                border: '2px dashed #d9d9d9',
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                cursor: 'pointer',
                                                backgroundColor: '#fafafa'
                                            }}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="Avatar"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: 6
                                                    }}
                                                />
                                            ) : (
                                                <div>
                                                    <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
                                                    <div style={{ marginTop: 8 }}>Upload Ảnh</div>
                                                </div>
                                            )}
                                        </div>
                                    </Upload>
                                </div>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Số Trận Đã Đánh"
                                            value={generalData.battleCount}
                                            valueStyle={{ color: '#8B0000' }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Tỷ Lệ Thắng"
                                            value={generalData.winRate}
                                            suffix="%"
                                            valueStyle={{
                                                color: generalData.winRate >= 70 ? '#52C41A' :
                                                    generalData.winRate >= 50 ? '#FAAD14' : '#F5222D'
                                            }}
                                        />
                                    </Col>
                                </Row>

                                <Divider />

                                <div style={{ textAlign: 'left' }}>
                                    <h4>Thông Tin Hệ Thống</h4>
                                    <p><strong>ID:</strong> {generalData.id}</p>
                                    <p><strong>Ngày Nhận:</strong> {generalData.obtainedDate}</p>
                                    <p><strong>Lần Cuối Sử Dụng:</strong> {generalData.lastUsed}</p>
                                </div>
                            </Card>
                        </Col>

                        {/* Form Section */}
                        <Col xs={24} lg={16}>
                            <Tabs defaultActiveKey="basic">
                                <TabPane tab="Thông Tin Cơ Bản" key="basic">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Tên Tướng"
                                                name="name"
                                                rules={[{ required: true, message: 'Vui lòng nhập tên tướng' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Danh Hiệu"
                                                name="title"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Độ Hiếm"
                                                name="rarity"
                                            >
                                                <Select>
                                                    <Option value="common">Thường</Option>
                                                    <Option value="rare">Hiếm</Option>
                                                    <Option value="epic">Sử Thi</Option>
                                                    <Option value="legendary">Huyền Thoại</Option>
                                                    <Option value="mythic">Thần Thoại</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Nguyên Tố"
                                                name="element"
                                            >
                                                <Select>
                                                    <Option value="fire">Hỏa</Option>
                                                    <Option value="water">Thủy</Option>
                                                    <Option value="earth">Thổ</Option>
                                                    <Option value="wind">Phong</Option>
                                                    <Option value="light">Quang</Option>
                                                    <Option value="dark">Ám</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Loại Tướng"
                                                name="type"
                                            >
                                                <Select>
                                                    <Option value="warrior">Chiến Binh</Option>
                                                    <Option value="archer">Cung Thủ</Option>
                                                    <Option value="mage">Pháp Sư</Option>
                                                    <Option value="assassin">Sát Thủ</Option>
                                                    <Option value="support">Hỗ Trợ</Option>
                                                    <Option value="tank">Đỡ Đòn</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label="Tiểu Sử"
                                        name="biography"
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Diễn Viên Lồng Tiếng"
                                        name="voiceActor"
                                    >
                                        <Input />
                                    </Form.Item>
                                </TabPane>

                                <TabPane tab="Chỉ Số & Kỹ Năng" key="stats">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Tấn Công (ATK)"
                                                name={['currentStats', 'attack']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={9999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="ATK"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Phòng Thủ (DEF)"
                                                name={['currentStats', 'defense']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={9999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="DEF"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Sinh Lực (HP)"
                                                name={['currentStats', 'health']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={99999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="HP"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Tốc Độ (SPD)"
                                                name={['currentStats', 'speed']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="SPD"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </TabPane>

                                <TabPane tab="Cài Đặt Hệ Thống" key="system">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Cấp Độ"
                                                name="level"
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={100}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Sao"
                                                name="starLevel"
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={6}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Thức Tỉnh"
                                                name="awakeningLevel"
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Trạng Thái"
                                                name="status"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Hoạt Động"
                                                    unCheckedChildren="Không Hoạt Động"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Yêu Thích"
                                                name="favorite"
                                                valuePropName="checked"
                                            >
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>

                            <Divider />

                            {/* Action Buttons */}
                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        size="large"
                                    >
                                        Cập Nhật
                                    </Button>
                                    <Button
                                        onClick={() => router.back()}
                                        size="large"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={() => form.resetFields()}
                                        size="large"
                                    >
                                        Đặt Lại
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
