'use client';

import React from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Space,
    Alert,
    message
} from 'antd';
import {
    LockOutlined,
    SafetyOutlined
} from '@ant-design/icons';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Password change:', values);
            message.success('Đổi mật khẩu thành công');
            form.resetFields();
            onClose();
        } catch (error) {
            message.error('Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập mật khẩu'));
        }

        const requirements = [
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /[0-9]/.test(value),
            /[!@#$%^&*]/.test(value)
        ];

        const metRequirements = requirements.filter(Boolean).length;

        if (metRequirements < 4) {
            return Promise.reject(
                new Error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
            );
        }

        return Promise.resolve();
    };

    return (
        <Modal
            title="Đổi Mật Khẩu"
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <Alert
                message="Bảo Mật Mật Khẩu"
                description="Để bảo vệ tài khoản, vui lòng sử dụng mật khẩu mạnh và không sử dụng lại mật khẩu cũ."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu hiện tại"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { validator: validatePassword }
                    ]}
                >
                    <Input.Password
                        prefix={<SafetyOutlined />}
                        placeholder="Nhập mật khẩu mới"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<SafetyOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                        size="large"
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
                            Đổi Mật Khẩu
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
