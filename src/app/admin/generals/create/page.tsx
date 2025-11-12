// app/(admin)/generals/create/page.tsx
'use client';

import React, { useState } from 'react';
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
    Slider,
    Tag
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    UploadOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    FireOutlined,
    WaterOutlined,
    EarthOutlined,
    WindOutlined,
    SunOutlined,
    MoonOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function CreateGeneralPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [previewStats, setPreviewStats] = useState({
        combatPower: 0,
        tier: 'D'
    });

    // Tính toán combat power dựa trên stats
    const calculateCombatPower = (stats: any) => {
        if (!stats) return 0;
        return Math.round(
            (stats.attack || 0) * 2 +
            (stats.defense || 0) * 1.5 +
            (stats.health || 0) * 0.1 +
            (stats.speed || 0) * 3 +
            (stats.intelligence || 0) * 1.2 +
            (stats.leadership || 0) * 1.8
        );
    };

    // Xử lý submit form
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Gọi API để tạo tướng mới
            console.log('Form values:', values);
            
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            message.success('Tạo tướng mới thành công!');
            router.push('/generals');
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo tướng');
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

    // Cập nhật preview stats khi form thay đổi
    const onValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.baseStats) {
            const combatPower = calculateCombatPower(allValues.baseStats);
            let tier = 'D';
            if (combatPower >= 5000) tier = 'SS';
            else if (combatPower >= 4000) tier = 'S';
            else if (combatPower >= 3000) tier = 'A';
            else if (combatPower >= 2000) tier = 'B';
            else if (combatPower >= 1000) tier = 'C';
            
            setPreviewStats({ combatPower, tier });
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

    const getElementIcon = (element: string) => {
        const icons = {
            fire: <FireOutlined style={{ color: '#FF4D4F' }} />,
            water: <WaterOutlined style={{ color: '#1890FF' }} />,
            earth: <EarthOutlined style={{ color: '#52C41A' }} />,
            wind: <WindOutlined style={{ color: '#13C2C2' }} />,
            light: <SunOutlined style={{ color: '#FAAD14' }} />,
            dark: <MoonOutlined style={{ color: '#722ED1' }} />
        };
        return icons[element as keyof typeof icons] || <FireOutlined />;
    };

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
                    <h1 style={{ margin: 0, color: '#8B0000' }}>Tạo Tướng Mới</h1>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                    initialValues={{
                        rarity: 'common',
                        element: 'fire',
                        type: 'warrior',
                        status: 'active',
                        baseStats: {
                            attack: 100,
                            defense: 100,
                            health: 1000,
                            speed: 100,
                            intelligence: 100,
                            leadership: 100
                        },
                        starLevel: 1,
                        maxStarLevel: 6,
                        awakeningLevel: 0,
                        bondLevel: 1,
                        favorite: false
                    }}
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
                                            title="Sức Mạnh Chiến Đấu"
                                            value={previewStats.combatPower}
                                            valueStyle={{ color: '#8B0000', fontWeight: 600 }}
                                            suffix="CP"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Phân Hạng"
                                            value={previewStats.tier}
                                            valueStyle={{ 
                                                color: previewStats.tier === 'SS' ? '#F5222D' : 
                                                       previewStats.tier === 'S' ? '#FA8C16' : 
                                                       previewStats.tier === 'A' ? '#52C41A' : 
                                                       previewStats.tier === 'B' ? '#1890FF' : '#8C8C8C',
                                                fontWeight: 600,
                                                fontSize: 24
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Form Section */}
                        <Col xs={24} lg={16}>
                            <Tabs defaultActiveKey="basic">
                                {/* Tab Thông Tin Cơ Bản */}
                                <TabPane tab="Thông Tin Cơ Bản" key="basic">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Tên Tướng"
                                                name="name"
                                                rules={[{ required: true, message: 'Vui lòng nhập tên tướng' }]}
                                            >
                                                <Input placeholder="Nhập tên tướng" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Danh Hiệu"
                                                name="title"
                                            >
                                                <Input placeholder="Nhập danh hiệu" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Độ Hiếm"
                                                name="rarity"
                                                rules={[{ required: true, message: 'Vui lòng chọn độ hiếm' }]}
                                            >
                                                <Select>
                                                    <Option value="common">
                                                        <Tag color="#8C8C8C">Thường</Tag>
                                                    </Option>
                                                    <Option value="rare">
                                                        <Tag color="#1890FF">Hiếm</Tag>
                                                    </Option>
                                                    <Option value="epic">
                                                        <Tag color="#722ED1">Sử Thi</Tag>
                                                    </Option>
                                                    <Option value="legendary">
                                                        <Tag color="#FA8C16">Huyền Thoại</Tag>
                                                    </Option>
                                                    <Option value="mythic">
                                                        <Tag color="#F5222D">Thần Thoại</Tag>
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Nguyên Tố"
                                                name="element"
                                                rules={[{ required: true, message: 'Vui lòng chọn nguyên tố' }]}
                                            >
                                                <Select>
                                                    <Option value="fire">
                                                        <Space>
                                                            {getElementIcon('fire')}
                                                            Hỏa
                                                        </Space>
                                                    </Option>
                                                    <Option value="water">
                                                        <Space>
                                                            {getElementIcon('water')}
                                                            Thủy
                                                        </Space>
                                                    </Option>
                                                    <Option value="earth">
                                                        <Space>
                                                            {getElementIcon('earth')}
                                                            Thổ
                                                        </Space>
                                                    </Option>
                                                    <Option value="wind">
                                                        <Space>
                                                            {getElementIcon('wind')}
                                                            Phong
                                                        </Space>
                                                    </Option>
                                                    <Option value="light">
                                                        <Space>
                                                            {getElementIcon('light')}
                                                            Quang
                                                        </Space>
                                                    </Option>
                                                    <Option value="dark">
                                                        <Space>
                                                            {getElementIcon('dark')}
                                                            Ám
                                                        </Space>
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Loại Tướng"
                                                name="type"
                                                rules={[{ required: true, message: 'Vui lòng chọn loại tướng' }]}
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
                                        <TextArea
                                            rows={4}
                                            placeholder="Nhập tiểu sử của tướng..."
                                            showCount
                                            maxLength={1000}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Diễn Viên Lồng Tiếng"
                                        name="voiceActor"
                                    >
                                        <Input placeholder="Nhập tên diễn viên lồng tiếng" />
                                    </Form.Item>
                                </TabPane>

                                {/* Tab Chỉ Số */}
                                <TabPane tab="Chỉ Số" key="stats">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Tấn Công (ATK)"
                                                name={['baseStats', 'attack']}
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
                                                name={['baseStats', 'defense']}
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
                                                name={['baseStats', 'health']}
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
                                                name={['baseStats', 'speed']}
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

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Trí Tuệ (INT)"
                                                name={['baseStats', 'intelligence']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="INT"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Lãnh Đạo (LDR)"
                                                name={['baseStats', 'leadership']}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={999}
                                                    style={{ width: '100%' }}
                                                    addonAfter="LDR"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </TabPane>

                                {/* Tab Hệ Thống */}
                                <TabPane tab="Hệ Thống" key="system">
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                label="Cấp Độ"
                                                name="level"
                                                initialValue={1}
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
                                                label="Sao Hiện Tại"
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
                                                label="Sao Tối Đa"
                                                name="maxStarLevel"
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={6}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Cấp Thức Tỉnh"
                                                name="awakeningLevel"
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={10}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Cấp Độ Thân Mật"
                                                name="bondLevel"
                                            >
                                                <InputNumber
                                                    min={1}
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
                                                    defaultChecked
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

                                {/* Tab Kỹ Năng */}
                                <TabPane tab="Kỹ Năng" key="skills">
                                    <Form.List name="skills">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Card
                                                        key={key}
                                                        size="small"
                                                        title={`Kỹ Năng ${name + 1}`}
                                                        extra={
                                                            <MinusCircleOutlined
                                                                onClick={() => remove(name)}
                                                                style={{ color: '#ff4d4f' }}
                                                            />
                                                        }
                                                        style={{ marginBottom: 16 }}
                                                    >
                                                        <Row gutter={[16, 16]}>
                                                            <Col xs={24} md={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label="Tên Kỹ Năng"
                                                                    name={[name, 'name']}
                                                                >
                                                                    <Input placeholder="Nhập tên kỹ năng" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col xs={24} md={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label="Loại Kỹ Năng"
                                                                    name={[name, 'type']}
                                                                >
                                                                    <Select>
                                                                        <Option value="active">Chủ Động</Option>
                                                                        <Option value="passive">Bị Động</Option>
                                                                        <Option value="ultimate">Tuyệt Kỹ</Option>
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Form.Item
                                                            {...restField}
                                                            label="Mô Tả"
                                                            name={[name, 'description']}
                                                        >
                                                            <TextArea
                                                                rows={3}
                                                                placeholder="Mô tả hiệu ứng kỹ năng..."
                                                            />
                                                        </Form.Item>
                                                    </Card>
                                                ))}
                                                <Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => add()}
                                                        block
                                                        icon={<PlusOutlined />}
                                                    >
                                                        Thêm Kỹ Năng
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
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
                                        Tạo Tướng
                                    </Button>
                                    <Button
                                        onClick={() => router.back()}
                                        size="large"
                                    >
                                        Hủy
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
