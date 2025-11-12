'use client';

import React from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Button,
    Space,
    Avatar,
    message,
    Row,
    Col
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { AdminProfile } from '@/lib/types/admin.types';

const { Option } = Select;
const { TextArea } = Input;

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    profile: AdminProfile;
    onProfileUpdate: (profile: AdminProfile) => void;
}

export default function EditProfileModal({
    open,
    onClose,
    profile,
    onProfileUpdate
}: EditProfileModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedProfile: AdminProfile = {
                ...profile,
                ...values
            };

            onProfileUpdate(updatedProfile);
            message.success('Cập nhật hồ sơ thành công');
            onClose();
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ chấp nhận file JPG/PNG!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Kích thước file phải nhỏ hơn 2MB!');
            }
            return false; // Prevent auto upload
        },
    };

    return (
        <Modal
            title="Chỉnh Sửa Hồ Sơ"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={profile}
                onFinish={handleSubmit}
            >
                {/* Avatar Upload */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#8B0000',
                            marginBottom: 16
                        }}
                    />
                    <br />
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
                    </Upload>
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="Họ"
                            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập họ"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input
                                placeholder="Nhập tên"
                            />
                        </Form.Item>
                    </Col>
                </Row>

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
                        placeholder="admin@example.com"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="+84 912 345 678"
                    />
                </Form.Item>

                <Form.Item
                    name="department"
                    label="Phòng ban"
                >
                    <Select placeholder="Chọn phòng ban">
                        <Option value="Game Operations">Vận Hành Game</Option>
                        <Option value="Customer Support">Hỗ Trợ Khách Hàng</Option>
                        <Option value="Technical">Kỹ Thuật</Option>
                        <Option value="Security">Bảo Mật</Option>
                        <Option value="Management">Quản Lý</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="location"
                    label="Địa điểm"
                >
                    <Input
                        prefix={<EnvironmentOutlined />}
                        placeholder="Hà Nội, Vietnam"
                    />
                </Form.Item>

                <Form.Item
                    name="bio"
                    label="Giới thiệu bản thân"
                >
                    <TextArea
                        rows={4}
                        placeholder="Mô tả ngắn về bản thân..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Space>
                        <Button onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ background: '#8B0000', borderColor: '#8B0000' }}
                        >
                            Cập Nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
