'use client';

import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1f1f 50%, #1a0f0f 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        pointerEvents: 'none',
      }} />

      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 450,
          // Hiệu ứng nổi
          backgroundColor: 'rgba(26, 26, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        }}>
          {children}
        </div>
      </Content>

      {/* Footer with game version */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 24,
        color: '#D4AF37',
        fontSize: 12,
        opacity: 0.6,
        zIndex: 1,
      }}>
        12 Warlords v1.0.0
      </div>
    </Layout>
  );
}
