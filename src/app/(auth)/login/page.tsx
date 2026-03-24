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
    <>
      {registered && (
        <Alert
          message="Registration Successful"
          description="Your account has been created. Please log in to continue."
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
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
        marginTop: 24,
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        fontSize: 12,
        color: '#8B4513'
      }}>
        <a href="#" style={{ color: '#8B4513' }}>Terms of Service</a>
        <span>•</span>
        <a href="#" style={{ color: '#8B4513' }}>Privacy Policy</a>
        <span>•</span>
        <a href="#" style={{ color: '#8B4513' }}>Contact Support</a>
      </div>
    </>
  );
}
