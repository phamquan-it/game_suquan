'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Alert } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined,
  GoogleOutlined,
  GithubOutlined 
} from '@ant-design/icons';
import { useLogin } from '../hooks/useAuth';
import ForgotPassword from './ForgotPassword';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm();
  const login = useLogin();
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSubmit = async (values: any) => {
    await login.mutateAsync(values);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
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
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#8B4513' }} />}
            placeholder="Password"
            style={{ 
              borderColor: '#CD7F32',
              borderRadius: 8
            }}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox style={{ color: '#8B4513' }}>
              Remember me
            </Checkbox>
            <Button 
              type="link" 
              onClick={() => setForgotPasswordVisible(true)}
              style={{ color: '#8B0000' }}
            >
              Forgot password?
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<LoginOutlined />}
            loading={login.isPending}
            style={{ 
              height: 48,
              backgroundColor: '#8B0000',
              border: '2px solid #D4AF37',
              fontWeight: 'bold',
              fontSize: 16
            }}
          >
            Enter the Realm
          </Button>
        </Form.Item>

        <Divider style={{ borderColor: '#D4AF37', color: '#8B4513' }}>
          Or continue with
        </Divider>

        <div style={{ display: 'flex', gap: 16 }}>
          <Button
            block
            icon={<GoogleOutlined />}
            style={{ 
              borderColor: '#CD7F32',
              color: '#8B4513',
              height: 40
            }}
          >
            Google
          </Button>
          <Button
            block
            icon={<GithubOutlined />}
            style={{ 
              borderColor: '#CD7F32',
              color: '#8B4513',
              height: 40
            }}
          >
            GitHub
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: '#8B4513' }}>New to the realm? </span>
          <Button 
            type="link" 
            onClick={onSwitchToRegister}
            style={{ color: '#8B0000', fontWeight: 'bold' }}
          >
            Create your Warlord
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
