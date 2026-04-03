'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useLogin } from '../hooks/useAuth';
import ForgotPassword from './ForgotPassword';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm();
  const { mutateAsync, isPending, error } = useLogin();
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await mutateAsync(values);
      // Optionally add success handling (e.g., redirect, show success message)
    } catch (err) {
      // Error is already handled in the hook
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      {error && (
        <Alert
          message="Đăng nhập thất bại"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email của bạn' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#8B4513' }} />}
            placeholder="Email"
            style={{
              borderColor: '#CD7F32',
              borderRadius: 8
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#8B4513' }} />}
            placeholder="Mật khẩu"
            style={{
              borderColor: '#CD7F32',
              borderRadius: 8
            }}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox style={{ color: '#8B4513' }}>
              Ghi nhớ đăng nhập
            </Checkbox>
            <Button
              type="link"
              onClick={() => setForgotPasswordVisible(true)}
              style={{ color: '#8B0000' }}
            >
              Quên mật khẩu?
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<LoginOutlined />}
            loading={isPending}
            style={{
              height: 48,
              backgroundColor: '#8B0000',
              border: '2px solid #D4AF37',
              fontWeight: 'bold',
              fontSize: 16
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider style={{ borderColor: '#D4AF37', color: '#8B4513' }}>
          Chưa có tài khoản?
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="link"
            onClick={onSwitchToRegister}
            style={{ color: '#8B0000', fontWeight: 'bold', fontSize: 16 }}
          >
            Tạo tài khoản ngay
          </Button>
        </div>
      </Form>

      <ForgotPassword
        visible={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
      />
    </>
  );
};

export default LoginForm;
