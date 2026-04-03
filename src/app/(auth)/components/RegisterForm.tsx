'use client';

import React from 'react';
import { Form, Input, Button, Select, Divider, Progress, Checkbox } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GlobalOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useRegister } from '../hooks/useAuth';

const { Option } = Select;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [form] = Form.useForm();
  const register = useRegister();
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return '#DC143C';
    if (passwordStrength < 75) return '#FF8C00';
    return '#2E8B57';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (values: any) => {
    //    await register.mutateAsync(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      size="large"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Choose your warlord name' },
          { min: 3, message: 'Name must be at least 3 characters' },
          { max: 20, message: 'Name must be at most 20 characters' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores' }
        ]}
      >
        <Input
          prefix={<CrownOutlined style={{ color: '#8B4513' }} />}
          placeholder="Warlord Name"
          style={{ borderColor: '#CD7F32', borderRadius: 8 }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Enter your email' },
          { type: 'email', message: 'Enter a valid email' }
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: '#8B4513' }} />}
          placeholder="Email"
          style={{ borderColor: '#CD7F32', borderRadius: 8 }}
        />
      </Form.Item>

      <Form.Item
        name="country"
        rules={[{ required: false }]}
      >
        <Select
          prefix={<GlobalOutlined style={{ color: '#8B4513' }} />}
          placeholder="Select your realm (optional)"
          style={{ borderColor: '#CD7F32', borderRadius: 8 }}
          allowClear
        >
          <Option value="US">United States</Option>
          <Option value="UK">United Kingdom</Option>
          <Option value="JP">Japan</Option>
          <Option value="CN">China</Option>
          <Option value="KR">Korea</Option>
          <Option value="DE">Germany</Option>
          <Option value="FR">France</Option>
          <Option value="Other">Other Realms</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Create a password' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#8B4513' }} />}
          placeholder="Password"
          onChange={(e) => checkPasswordStrength(e.target.value)}
          style={{ borderColor: '#CD7F32', borderRadius: 8 }}
        />
      </Form.Item>

      {form.getFieldValue('password') && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#8B4513' }}>Password Strength:</span>
            <span style={{ color: getStrengthColor(), fontWeight: 'bold' }}>
              {getStrengthText()}
            </span>
          </div>
          <Progress
            percent={passwordStrength}
            showInfo={false}
            strokeColor={getStrengthColor()}
            trailColor="#F1E8D6"
            size="small"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#8B4513' }}>
            <CheckCircleOutlined style={{ color: passwordStrength >= 25 ? '#2E8B57' : '#CD7F32', marginRight: 4 }} />
            8+ characters
            <br />
            <CheckCircleOutlined style={{ color: passwordStrength >= 50 ? '#2E8B57' : '#CD7F32', marginRight: 4 }} />
            Uppercase letter
            <br />
            <CheckCircleOutlined style={{ color: passwordStrength >= 75 ? '#2E8B57' : '#CD7F32', marginRight: 4 }} />
            Number
            <br />
            <CheckCircleOutlined style={{ color: passwordStrength >= 100 ? '#2E8B57' : '#CD7F32', marginRight: 4 }} />
            Special character
          </div>
        </div>
      )}

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#8B4513' }} />}
          placeholder="Confirm Password"
          style={{ borderColor: '#CD7F32', borderRadius: 8 }}
        />
      </Form.Item>

      <Form.Item
        name="terms"
        valuePropName="checked"
        rules={[
          { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms')) }
        ]}
      >
        <Checkbox style={{ color: '#8B4513' }}>
          I accept the <a href="#" style={{ color: '#8B0000' }}>Warlord&apos;s Code</a> and <a href="#" style={{ color: '#8B0000' }}>Terms of Service</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={register.isPending}
          style={{
            height: 48,
            backgroundColor: '#8B0000',
            border: '2px solid #D4AF37',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          Forge Your Destiny
        </Button>
      </Form.Item>

      <Divider style={{ borderColor: '#D4AF37', color: '#8B4513' }}>
        Already a Warlord?
      </Divider>

      <Button
        block
        onClick={onSwitchToLogin}
        style={{
          borderColor: '#CD7F32',
          color: '#8B4513',
          height: 40
        }}
      >
        Return to Login
      </Button>
    </Form>
  );
};

export default RegisterForm;
