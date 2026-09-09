'use client';

import { Card, Flex, Spin, Typography, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Content } = Layout;

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  subMessage?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'default' | 'large';
}

export default function PayLoading({ 
  fullScreen = true,
  message = 'Đang tải thông tin đơn hàng...',
  subMessage = 'Vui lòng chờ trong giây lát',
  icon = '⚜️',
  size = 'large'
}: LoadingProps) {
  const loadingContent = (
    <Flex justify="center" align="center" vertical gap="large" style={{ padding: '4rem 0' }}>
      <div style={{ fontSize: 48, color: '#D4AF37' }}>{icon}</div>
      <Spin 
        size={size} 
      />
      <Text style={{ 
        color: '#D4AF37', 
        fontSize: 18, 
        fontFamily: '"Cinzel", serif',
        letterSpacing: 1
      }}>
        {message}
      </Text>
      <Text type="secondary" style={{ 
        fontSize: 14, 
        color: '#B8860B',
        letterSpacing: 0.5
      }}>
        {subMessage}
      </Text>
    </Flex>
  );

  if (fullScreen) {
    return (
      <Layout style={styles.fullLayout}>
        <Content style={styles.fullContent}>
          <div style={styles.loadingWrapper}>
            <Card style={styles.loadingCard}>
              {loadingContent}
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        {loadingContent}
      </Card>
    </div>
  );
}

// Embedded styles
const styles = {
  fullLayout: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1515 30%, #1a0a0a 60%, #0f0f1a 100%)',
  },
  fullContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 0,
  },
  loadingWrapper: {
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  loadingCard: {
    borderRadius: 24,
    boxShadow: '0 8px 40px rgba(212, 175, 55, 0.15)',
    border: '2px solid #D4AF37',
    background: 'linear-gradient(135deg, #0a0a1a, #1a0a0a)',
  },
  container: {
    width: '100%',
    maxWidth: 900,
    margin: '2rem auto',
    padding: '0 1rem',
  },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(212, 175, 55, 0.15)',
    border: '2px solid #D4AF37',
    background: 'linear-gradient(135deg, #0a0a1a, #1a0a0a)',
  },
};

// Add global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');

    .ant-spin-dot-item {
      background-color: #D4AF37 !important;
    }

    .ant-spin-text {
      color: #D4AF37 !important;
    }
  `;
  document.head.appendChild(styleSheet);
}
