// app/(admin)/beauty-system/add/page.tsx
'use client';

import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Upload,
    Row,
    Col,
    Divider,
    Space,
    message,
    Steps,
    Tag,
    Avatar,
    Switch,
    Slider,
    Tabs,
    Descriptions,
    Modal
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    UserOutlined,
    CrownOutlined,
    StarOutlined,
    TeamOutlined,
    RocketOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import { BeautyCharacter, BeautySkill, Costume, Jewelry } from '@/types/beauty-system';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const AddBeautyPage = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
    const [fullImageFile, setFullImageFile] = useState<UploadFile | null>(null);
    const [previewData, setPreviewData] = useState<Partial<BeautyCharacter> | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    // Upload handlers
    const handleAvatarUpload: UploadProps['beforeUpload'] = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ có thể upload file ảnh!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
            return false;
        }
        setAvatarFile(file);
        return false;
    };

    const handleFullImageUpload: UploadProps['beforeUpload'] = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ có thể upload file ảnh!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return false;
        }
        setFullImageFile(file);
        return false;
    };

    const removeAvatar = () => {
        setAvatarFile(null);
    };

    const removeFullImage = () => {
        setFullImageFile(null);
    };

    // Form steps
    const steps = [
        {
            title: 'Thông Tin Cơ Bản',
            description: 'Thông tin nhân vật và hình ảnh'
        },
        {
            title: 'Thuộc Tính & Kỹ Năng',
            description: 'Thiết lập thuộc tính và kỹ năng'
        },
        {
            title: 'Trang Bị & Xác Nhận',
            description: 'Trang bị ban đầu và xác nhận'
        }
    ];

    // Skill templates
    const skillTemplates = [
        {
            id: 'skill_template_1',
            name: 'Nụ Cười Nghiêng Nước',
            description: 'Tăng sức hút và khả năng thành công trong sứ mệnh ngoại giao.',
            type: 'passive',
            effect: { type: 'mission_success', value: 15, target: 'diplomatic_mission' },
            maxLevel: 5
        },
        {
            id: 'skill_template_2',
            name: 'Ca Khúc Hòa Bình',
            description: 'Tăng tỷ lệ thành công khi thực hiện sứ mệnh ngoại giao khó.',
            type: 'active',
            effect: { type: 'attribute_boost', value: 20, target: 'diplomacy' },
            cooldown: 24,
            maxLevel: 5
        },
        {
            id: 'skill_template_3',
            name: 'Liên Hoàn Kế',
            description: 'Tăng mạnh mưu kế và khả năng thao túng trong các nhiệm vụ cung đình.',
            type: 'active',
            effect: { type: 'special_event', value: 20, target: 'court_event' },
            cooldown: 12,
            maxLevel: 5
        },
        {
            id: 'skill_template_4',
            name: 'Vũ Điệu Thần Tiên',
            description: 'Tăng khả năng thu hút và gây ấn tượng trong các sự kiện.',
            type: 'passive',
            effect: { type: 'attribute_boost', value: 25, target: 'charm' },
            maxLevel: 5
        }
    ];

    // Costume templates
    const costumeTemplates = [
        {
            id: 'costume_template_1',
            name: 'Lụa Bích Thủy',
            rarity: 'epic',
            attributes: { charm: 20, intelligence: 5, diplomacy: 8 }
        },
        {
            id: 'costume_template_2',
            name: 'Áo Choàng Hồ Quốc',
            rarity: 'rare',
            attributes: { charm: 8, intelligence: 10, diplomacy: 15 }
        },
        {
            id: 'costume_template_3',
            name: 'Lụa Huyền Ảnh',
            rarity: 'legendary',
            attributes: { charm: 25, intelligence: 10, diplomacy: 5 }
        }
    ];

    // Jewelry templates
    const jewelryTemplates = [
        {
            id: 'jewelry_template_1',
            name: 'Trâm Ngọc Lam',
            type: 'hairpin',
            rarity: 'rare',
            attributes: { charm: 10, intrigue: 4, loyalty: 6 }
        },
        {
            id: 'jewelry_template_2',
            name: 'Vòng Ngọc Bích',
            type: 'bracelet',
            rarity: 'epic',
            attributes: { charm: 12, intrigue: 8, loyalty: 10 }
        },
        {
            id: 'jewelry_template_3',
            name: 'Khuyên Vàng Phượng',
            type: 'earring',
            rarity: 'legendary',
            attributes: { charm: 15, intrigue: 12, loyalty: 5 }
        }
    ];

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePreview = () => {
        form.validateFields().then(values => {
            setPreviewData({
                ...values,
                skills: values.skills || [],
                costumes: values.costumes || [],
                jewelry: values.jewelry || []
            });
            setPreviewVisible(true);
        }).catch(() => {
            message.warning('Vui lòng hoàn thành tất cả các trường bắt buộc!');
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            // Tạo character data
            const characterData: BeautyCharacter = {
                id: `beauty_${Date.now()}`,
                name: values.name,
                title: values.title,
                description: values.description,
                rarity: values.rarity,
                level: values.level || 1,
                experience: 0,
                maxLevel: values.maxLevel || 60,
                attributes: {
                    charm: values.charm || 50,
                    intelligence: values.intelligence || 50,
                    diplomacy: values.diplomacy || 50,
                    intrigue: values.intrigue || 50,
                    loyalty: values.loyalty || 50
                },
                skills: values.skills || [],
                costumes: values.costumes || [],
                jewelry: values.jewelry || [],
                status: 'available',
                avatar: avatarFile ? URL.createObjectURL(avatarFile as RcFile) : '/images/beauty/default_avatar.png',
                fullImage: fullImageFile ? URL.createObjectURL(fullImageFile as RcFile) : '/images/beauty/default_full.png',
                acquisitionDate: new Date().toISOString().split('T')[0],
                lastUsed: new Date().toISOString(),
                missionSuccessRate: 50
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Character created:', characterData);
            message.success('Tạo Giai Nhân mới thành công!');
            router.push('/beauty-system');
            
        } catch (error) {
            console.error('Error creating character:', error);
            message.error('Có lỗi xảy ra khi tạo Giai Nhân!');
        } finally {
            setLoading(false);
        }
    };

    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FAAD14'
        };
        return colors[rarity] || '#8C8C8C';
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <Card title="Thông Tin Cơ Bản" className="shadow-sm">
                            <Row gutter={[24, 16]}>
                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        label="Tên Giai Nhân"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên Giai Nhân!' }]}
                                    >
                                        <Input 
                                            size="large" 
                                            placeholder="Ví dụ: Tây Thi, Chiêu Quân..." 
                                            prefix={<UserOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Danh Hiệu"
                                        name="title"
                                        rules={[{ required: true, message: 'Vui lòng nhập danh hiệu!' }]}
                                    >
                                        <Input 
                                            placeholder="Ví dụ: Tuyệt Sắc Giai Nhân, Hồng Nhan Tri Kỷ..." 
                                            prefix={<CrownOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Độ Hiếm"
                                        name="rarity"
                                        rules={[{ required: true, message: 'Vui lòng chọn độ hiếm!' }]}
                                    >
                                        <Select placeholder="Chọn độ hiếm">
                                            <Option value="common">
                                                <Tag color="#8C8C8C">Thường</Tag>
                                            </Option>
                                            <Option value="rare">
                                                <Tag color="#1890FF">Hiếm</Tag>
                                            </Option>
                                            <Option value="epic">
                                                <Tag color="#722ED1">Siêu Cấp</Tag>
                                            </Option>
                                            <Option value="legendary">
                                                <Tag color="#FAAD14">Huyền Thoại</Tag>
                                            </Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Mô Tả"
                                        name="description"
                                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                                    >
                                        <TextArea 
                                            rows={4} 
                                            placeholder="Mô tả ngắn gọn về Giai Nhân..." 
                                            showCount 
                                            maxLength={200}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Form.Item
                                        label="Ảnh Đại Diện"
                                        required
                                    >
                                        <Upload
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={handleAvatarUpload}
                                            accept="image/*"
                                        >
                                            {avatarFile ? (
                                                <div className="relative">
                                                    <img 
                                                        src={URL.createObjectURL(avatarFile as RcFile)} 
                                                        alt="avatar" 
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                    <Button
                                                        type="link"
                                                        danger
                                                        size="small"
                                                        className="absolute top-1 right-1 bg-white rounded-full"
                                                        onClick={removeAvatar}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <PlusOutlined />
                                                    <div className="mt-2">Upload Avatar</div>
                                                </div>
                                            )}
                                        </Upload>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Tỷ lệ 1:1, tối đa 2MB
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="Ảnh Toàn Thân"
                                        required
                                    >
                                        <Upload
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={handleFullImageUpload}
                                            accept="image/*"
                                        >
                                            {fullImageFile ? (
                                                <div className="relative">
                                                    <img 
                                                        src={URL.createObjectURL(fullImageFile as RcFile)} 
                                                        alt="full" 
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                    <Button
                                                        type="link"
                                                        danger
                                                        size="small"
                                                        className="absolute top-1 right-1 bg-white rounded-full"
                                                        onClick={removeFullImage}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <PlusOutlined />
                                                    <div className="mt-2">Upload Ảnh Toàn Thân</div>
                                                </div>
                                            )}
                                        </Upload>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Tỷ lệ 3:4, tối đa 5MB
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <Card title="Thuộc Tính Cơ Bản" className="shadow-sm">
                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Duyên Dáng"
                                        name="charm"
                                        initialValue={50}
                                    >
                                        <div className="space-y-2">
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                marks={{
                                                    0: '0',
                                                    25: '25',
                                                    50: '50',
                                                    75: '75',
                                                    100: '100'
                                                }}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                addonAfter="điểm"
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="Trí Tuệ"
                                        name="intelligence"
                                        initialValue={50}
                                    >
                                        <div className="space-y-2">
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                marks={{
                                                    0: '0',
                                                    25: '25',
                                                    50: '50',
                                                    75: '75',
                                                    100: '100'
                                                }}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                addonAfter="điểm"
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Ngoại Giao"
                                        name="diplomacy"
                                        initialValue={50}
                                    >
                                        <div className="space-y-2">
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                marks={{
                                                    0: '0',
                                                    25: '25',
                                                    50: '50',
                                                    75: '75',
                                                    100: '100'
                                                }}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                addonAfter="điểm"
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="Mưu Mẹo"
                                        name="intrigue"
                                        initialValue={50}
                                    >
                                        <div className="space-y-2">
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                marks={{
                                                    0: '0',
                                                    25: '25',
                                                    50: '50',
                                                    75: '75',
                                                    100: '100'
                                                }}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                addonAfter="điểm"
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="Trung Thành"
                                        name="loyalty"
                                        initialValue={50}
                                    >
                                        <div className="space-y-2">
                                            <Slider
                                                min={1}
                                                max={100}
                                                step={1}
                                                marks={{
                                                    0: '0',
                                                    25: '25',
                                                    50: '50',
                                                    75: '75',
                                                    100: '100'
                                                }}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                addonAfter="điểm"
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Kỹ Năng Đặc Biệt" className="shadow-sm">
                            <Form.List name="skills">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key} className="p-4 border rounded-lg mb-4 bg-gray-50">
                                                <Row gutter={[16, 16]} align="middle">
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'name']}
                                                            label="Tên Kỹ Năng"
                                                            rules={[{ required: true, message: 'Vui lòng nhập tên kỹ năng!' }]}
                                                        >
                                                            <Select placeholder="Chọn kỹ năng mẫu">
                                                                {skillTemplates.map(skill => (
                                                                    <Option key={skill.id} value={skill.name}>
                                                                        {skill.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'level']}
                                                            label="Cấp Độ"
                                                            initialValue={1}
                                                        >
                                                            <InputNumber min={1} max={5} placeholder="1-5" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={10}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'description']}
                                                            label="Mô Tả"
                                                        >
                                                            <Input.TextArea rows={2} placeholder="Mô tả kỹ năng..." />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={2}>
                                                        <Button
                                                            type="link"
                                                            danger
                                                            onClick={() => remove(field.name)}
                                                            className="mt-6"
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm Kỹ Năng
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <Card title="Trang Phục Ban Đầu" className="shadow-sm">
                            <Form.List name="costumes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key} className="p-4 border rounded-lg mb-4 bg-gray-50">
                                                <Row gutter={[16, 16]} align="middle">
                                                    <Col xs={24} md={10}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'name']}
                                                            label="Trang Phục"
                                                            rules={[{ required: true, message: 'Vui lòng chọn trang phục!' }]}
                                                        >
                                                            <Select placeholder="Chọn trang phục mẫu">
                                                                {costumeTemplates.map(costume => (
                                                                    <Option key={costume.id} value={costume.name}>
                                                                        <div className="flex items-center">
                                                                            <span>{costume.name}</span>
                                                                            <Tag color={getRarityColor(costume.rarity)} className="ml-2">
                                                                                {costume.rarity}
                                                                            </Tag>
                                                                        </div>
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'equipped']}
                                                            label="Trang Bị"
                                                            valuePropName="checked"
                                                            initialValue={true}
                                                        >
                                                            <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'attributes']}
                                                            label="Bonus Thuộc Tính"
                                                        >
                                                            <Input.TextArea 
                                                                rows={2} 
                                                                placeholder="Thuộc tính bonus..." 
                                                                disabled 
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={2}>
                                                        <Button
                                                            type="link"
                                                            danger
                                                            onClick={() => remove(field.name)}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm Trang Phục
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card title="Trang Sức Ban Đầu" className="shadow-sm">
                            <Form.List name="jewelry">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key} className="p-4 border rounded-lg mb-4 bg-gray-50">
                                                <Row gutter={[16, 16]} align="middle">
                                                    <Col xs={24} md={10}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'name']}
                                                            label="Trang Sức"
                                                            rules={[{ required: true, message: 'Vui lòng chọn trang sức!' }]}
                                                        >
                                                            <Select placeholder="Chọn trang sức mẫu">
                                                                {jewelryTemplates.map(jewelry => (
                                                                    <Option key={jewelry.id} value={jewelry.name}>
                                                                        <div className="flex items-center">
                                                                            <span>{jewelry.name}</span>
                                                                            <Tag color={getRarityColor(jewelry.rarity)} className="ml-2">
                                                                                {jewelry.rarity}
                                                                            </Tag>
                                                                        </div>
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'equipped']}
                                                            label="Trang Bị"
                                                            valuePropName="checked"
                                                            initialValue={true}
                                                        >
                                                            <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'attributes']}
                                                            label="Bonus Thuộc Tính"
                                                        >
                                                            <Input.TextArea 
                                                                rows={2} 
                                                                placeholder="Thuộc tính bonus..." 
                                                                disabled 
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={2}>
                                                        <Button
                                                            type="link"
                                                            danger
                                                            onClick={() => remove(field.name)}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm Trang Sức
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card title="Xác Nhận Thông Tin" className="shadow-sm">
                            <div className="text-center space-y-4">
                                <p className="text-gray-600">
                                    Kiểm tra lại thông tin trước khi tạo Giai Nhân mới
                                </p>
                                <Space>
                                    <Button 
                                        type="primary" 
                                        icon={<EyeOutlined />}
                                        onClick={handlePreview}
                                    >
                                        Xem Trước
                                    </Button>
                                    <Button 
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        onClick={handleSubmit}
                                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                    >
                                        Tạo Giai Nhân
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="add-beauty-page">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => router.back()}
                            className="mb-2"
                        >
                            Quay Lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Thêm Giai Nhân Mới
                        </h1>
                        <p className="text-gray-600">
                            Tạo mới một Giai Nhân cho hệ thống Hồng Nhan
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Bước {currentStep + 1} / {steps.length}</div>
                        <div className="font-semibold">{steps[currentStep].title}</div>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <Card className="mb-6 shadow-sm">
                <Steps current={currentStep} size="small">
                    {steps.map((step, index) => (
                        <Step 
                            key={index} 
                            title={step.title} 
                            description={step.description}
                        />
                    ))}
                </Steps>
            </Card>

            {/* Form Content */}
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
                className="space-y-6"
            >
                {renderStepContent()}
            </Form>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <Button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    icon={<ArrowLeftOutlined />}
                >
                    Quay Lại
                </Button>
                
                {currentStep < steps.length - 1 ? (
                    <Button
                        type="primary"
                        onClick={nextStep}
                        icon={<ArrowLeftOutlined className="rotate-180" />}
                    >
                        Tiếp Theo
                    </Button>
                ) : null}
            </div>

            {/* Preview Modal */}
            <Modal
                title="Xem Trước Giai Nhân"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                width={800}
                footer={[
                    <Button key="back" onClick={() => setPreviewVisible(false)}>
                        Đóng
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Xác Nhận Tạo
                    </Button>
                ]}
            >
                {previewData && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar size={80} src={avatarFile ? URL.createObjectURL(avatarFile as RcFile) : undefined} />
                            <div>
                                <h3 className="text-xl font-bold">{previewData.name}</h3>
                                <p className="text-gray-600">{previewData.title}</p>
                                <Tag color={getRarityColor(previewData.rarity || 'common')}>
                                    {previewData.rarity?.toUpperCase()}
                                </Tag>
                            </div>
                        </div>
                        
                        <Descriptions title="Thông Tin Chi Tiết" bordered column={2}>
                            <Descriptions.Item label="Mô Tả" span={2}>
                                {previewData.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duyên Dáng">
                                {previewData.attributes?.charm}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trí Tuệ">
                                {previewData.attributes?.intelligence}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngoại Giao">
                                {previewData.attributes?.diplomacy}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mưu Mẹo">
                                {previewData.attributes?.intrigue}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kỹ Năng">
                                {previewData.skills?.length || 0} kỹ năng
                            </Descriptions.Item>
                            <Descriptions.Item label="Trang Bị">
                                {previewData.costumes?.filter(c => c.equipped).length || 0} trang phục, 
                                {previewData.jewelry?.filter(j => j.equipped).length || 0} trang sức
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AddBeautyPage;
