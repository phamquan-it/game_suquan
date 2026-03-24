'use client';

import React from 'react';
import { CrownOutlined, ShopOutlined } from '@ant-design/icons';

const GameLogo: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
      }}>
        <CrownOutlined style={{
          fontSize: 48,
          color: '#D4AF37',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }} />
        <ShopOutlined style={{
          fontSize: 48,
          color: '#8B0000',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }} />
      </div>
      <h1 style={{
        fontSize: 42,
        margin: 0,
        fontFamily: '"Cinzel", "Times New Roman", serif',
        background: 'linear-gradient(135deg, #D4AF37 0%, #8B0000 50%, #D4AF37 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: 2
      }}>
        12 WARLORDS
      </h1>
      <p style={{
        color: '#8B4513',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
        borderTop: '1px solid #D4AF37',
        borderBottom: '1px solid #D4AF37',
        padding: '8px 0',
        display: 'inline-block'
      }}>
        Rise to Power, Claim Your Throne
      </p>
    </div>
  );
};

export default GameLogo;
