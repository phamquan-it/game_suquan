'use client';

import React from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { useForgotPassword } from '../hooks/useAuth';

interface ForgotPasswordProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const forgotPassword = useForgotPassword();
  const [emailSent, setEmailSent] = React.useState(false);

  const handleSubmit = async (values: { email: string }) => {
    await forgotPassword.mutateAsync(values.email);
    setEmailSent(true);
  };

  const handleClose = () => {
    form.resetFields();
    setEmailSent(false);
    onClose();
  };

  return (
    <Modal
      title={
        <span style={{ color: '#8B0000', fontSize: 20 }}>
          <MailOutlined /> Forgot Password
        </span>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={450}
    >
      {emailSent ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Alert
            message="Check Your Email"
            description="If an account exists with this email, you will receive password reset instructions."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Button 
            type="primary" 
            onClick={handleClose}
            style={{ backgroundColor: '#8B0000' }}
          >
            Return to Login
          </Button>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <p style={{ color: '#8B4513', marginBottom: 20 }}>
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#8B4513' }} />}
              placeholder="Email"
              style={{ borderColor: '#CD7F32' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<SendOutlined />}
              loading={forgotPassword.isPending}
              style={{ backgroundColor: '#8B0000' }}
            >
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={handleClose} style={{ color: '#8B4513' }}>
              Back to Login
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPassword;
