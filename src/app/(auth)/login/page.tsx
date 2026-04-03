'use client';

import React, { useState } from 'react';
import GameLogo from '../components/GameLogo';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Alert } from 'antd';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 31, 31, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '32px',
        padding: '48px 40px',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        transition: 'all 0.3s ease',
      }}
    >
      {registered && (
        <Alert
          message="Registration Successful"
          description="Your account has been created. Please log in to continue."
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
          closable
        />
      )}

      <GameLogo />

      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}

      {/* Decorative elements */}
      <div style={{
        marginTop: 32,
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        fontSize: 12,
        color: '#CD7F32',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        paddingTop: 24,
      }}>
        {/* Decorative elements */}
        <div style={{
          marginTop: 32,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          fontSize: 12,
          color: '#CD7F32',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          paddingTop: 24,
        }}>
          <a href="#" style={{ color: '#CD7F32', textDecoration: 'none', transition: 'color 0.3s' }}>Điều khoản dịch vụ</a>
          <span style={{ color: '#D4AF37' }}>•</span>
          <a href="#" style={{ color: '#CD7F32', textDecoration: 'none', transition: 'color 0.3s' }}>Chính sách bảo mật</a>
          <span style={{ color: '#D4AF37' }}>•</span>
          <a href="#" style={{ color: '#CD7F32', textDecoration: 'none', transition: 'color 0.3s' }}>Hỗ trợ</a>
        </div>
      </div>
    </div>
  );
}
