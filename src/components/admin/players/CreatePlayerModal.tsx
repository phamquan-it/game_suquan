// components/CreatePlayerModal.tsx
'use client';

import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Space,
    message,
    Avatar,
    Row,
    Col,
    Divider,
    Card
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    CrownOutlined,
    ThunderboltOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useCreatePlayer } from '@/lib/hooks/usePlayers';
import { CreatePlayerData } from '@/types/player';

const { Option } = Select;
const { TextArea } = Input;

interface CreatePlayerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreatePlayerModal({
    open,
    onClose,
    onSuccess
}: CreatePlayerModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    const createPlayerMutation = useCreatePlayer();

    // Options data
    const statusOptions = [
        { value: 'online', label: '🟢 Đang online' },
        { value: 'offline', label: '⚫ Offline' },
        { value: 'suspended', label: '🟡 Tạm ngưng' },
    ];

    const allianceOptions = [
        { value: 'ThienDang', label: 'Thiên Đàng' },
        { value: 'LongMon', label: 'Long Môn' },
        { value: 'NguCo', label: 'Ngư Cô' },
        { value: 'DuongMon', label: 'Dương Môn' },
        { value: 'ThieuLam', label: 'Thiếu Lâm' },
        { value: 'VoDang', label: 'Võ Đang' },
        { value: 'CaiBang', label: 'Cái Bang' },
        { value: 'ThienNhan', label: 'Thiên Nhẫn' },
        { value: 'ConLon', label: 'Côn Lôn' },
        { value: 'NgaMy', label: 'Nga My' },
        { value: 'DoanThi', label: 'Đoàn Thị' },
        { value: 'HoaSon', label: 'Hoa Sơn' },
    ];

    const specializationOptions = [
        { value: 'warrior', label: '⚔️ Chiến binh' },
        { value: 'archer', label: '🏹 Cung thủ' },
        { value: 'mage', label: '🔮 Pháp sư' },
        { value: 'assassin', label: '🗡️ Sát thủ' },
        { value: 'support', label: '💖 Hỗ trợ' },
        { value: 'tank', label: '🛡️ TanK' },
    ];

    const roleOptions = [
        { value: 'member', label: 'Thành viên' },
        { value: 'leader', label: 'Lãnh đạo' },
    ];

    const countryOptions = [
        { value: 'VN', label: '🇻🇳 Việt Nam' },
        { value: 'US', label: '🇺🇸 Mỹ' },
        { value: 'CN', label: '🇨🇳 Trung Quốc' },
        { value: 'JP', label: '🇯🇵 Nhật Bản' },
        { value: 'KR', label: '🇰🇷 Hàn Quốc' },
        { value: 'TH', label: '🇹🇭 Thái Lan' },
    ];

    const titleOptions = [
        { value: 'newbie', label: '🐣 Tân thủ' },
        { value: 'warrior', label: '⚔️ Chiến binh' },
        { value: 'elite', label: '⭐ Tinh nhuệ' },
        { value: 'master', label: '👑 Bậc thầy' },
        { value: 'legend', label: '🏆 Huyền thoại' },
        { value: 'emperor', label: '👑 Đế vương' },
    ];

    const handleSubmit = async (values: any) => {
        setLoading(true);

        try {
            const playerData: CreatePlayerData = {
                username: values.username,
                email: values.email,
                level: values.level || 1,
                power: values.power || 0,
                alliance: values.alliance,
                status: values.status || 'offline',
                country: values.country,
                specialization: values.specialization,
                title: values.title,
                role_in_alliance: values.role_in_alliance || 'member',
            };

            await createPlayerMutation.mutateAsync(playerData);

            message.success('Tạo người chơi mới thành công!');
            form.resetFields();
            setAvatarPreview('');
            onSuccess?.();
            onClose();

        } catch (error: any) {
            message.error(`Lỗi khi tạo người chơi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setAvatarPreview('');
        onClose();
    };

    const generateAvatarUrl = (username: string) => {
        // In a real app, you might generate or upload an avatar
        // For now, we'll use a placeholder
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
    };

    const handleUsernameChange = (username: string) => {
        if (username) {
            const avatarUrl = generateAvatarUrl(username);
            setAvatarPreview(avatarUrl);
            form.setFieldValue('avatar', avatarUrl);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <UserOutlined style={{ color: '#8B0000' }} />
                    <span>Tạo Người Chơi Mới</span>
                </Space>
            }
            open={open}
            onCancel={handleClose}
            width={800}
            footer={null}
            centered
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    level: 1,
                    power: 0,
                    status: 'offline',
                    role_in_alliance: 'member',
                    victory_points: 0,
                    territory: 0,
                    battles: 0,
                    wins: 0,
                    violations: 0,
                    win_rate: 0,
                }}
            >
                <Row gutter={[16, 16]}>
                    {/* Left Column - Basic Info */}
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Thông Tin Cơ Bản" style={{ height: '100%' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                {/* Avatar Preview */}
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <Avatar
                                        size={80}
                                        src={avatarPreview}
                                        icon={<UserOutlined />}
                                        style={{
                                            border: '2px solid #d9d9d9',
                                            marginBottom: 8
                                        }}
                                    />
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        Avatar sẽ được tạo tự động
                                    </div>
                                </div>

                                <Form.Item
                                    name="username"
                                    label="Tên người dùng"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên người dùng' },
                                        { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự' },
                                        { max: 50, message: 'Tên người dùng không quá 50 ký tự' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nhập tên người dùng"
                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Nhập địa chỉ email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="country"
                                    label="Quốc gia"
                                >
                                    <Select
                                        placeholder="Chọn quốc gia"
                                        options={countryOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                >
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        options={statusOptions}
                                    />
                                </Form.Item>
                            </Space>
                        </Card>
                    </Col>

                    {/* Right Column - Game Stats */}
                    <Col xs={24} lg={12}>
                        <Card size="small" title="Thông Tin Game" style={{ height: '100%' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="level"
                                            label="Cấp độ"
                                        >
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                style={{ width: '100%' }}
                                                placeholder="Level"
                                                prefix={<CrownOutlined />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="power"
                                            label="Sức mạnh"
                                        >
                                            <InputNumber
                                                min={0}
                                                max={5000000}
                                                style={{ width: '100%' }}
                                                placeholder="Power"
                                                prefix={<ThunderboltOutlined />}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="specialization"
                                    label="Chuyên môn"
                                >
                                    <Select
                                        placeholder="Chọn chuyên môn"
                                        options={specializationOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="title"
                                    label="Danh hiệu"
                                >
                                    <Select
                                        placeholder="Chọn danh hiệu"
                                        options={titleOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="alliance"
                                    label="Liên minh"
                                >
                                    <Select
                                        placeholder="Chọn liên minh"
                                        options={allianceOptions}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="role_in_alliance"
                                    label="Vai trò trong liên minh"
                                >
                                    <Select
                                        placeholder="Chọn vai trò"
                                        options={roleOptions}
                                    />
                                </Form.Item>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Hidden avatar field */}
                <Form.Item name="avatar" hidden>
                    <Input />
                </Form.Item>

                <Divider />

                {/* Action Buttons */}
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button
                            icon={<CloseOutlined />}
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            htmlType="submit"
                            loading={loading}
                            style={{ background: '#8B0000', borderColor: '#8B0000' }}
                        >
                            Tạo Người Chơi
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
}
