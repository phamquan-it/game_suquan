// components/Error/ErrorDisplay.tsx
'use client';

import { Card, Button, Space, Typography, Layout, Flex } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Content } = Layout;

interface ErrorDisplayProps {
  fullScreen?: boolean;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorDisplay({
  fullScreen = true,
  title = 'Không tìm thấy đơn hàng',
  message = 'Đơn hàng không tồn tại trong hệ thống.',
  icon = '🏰',
  showBackButton = true,
  showHomeButton = true,
  onRetry,
  retryText = 'Thử lại',
}: ErrorDisplayProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push('/');
  };

  const errorContent = (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: 72, marginBottom: '1rem' }}>{icon}</div>
      <Title level={2} style={{ 
        color: '#D4AF37', 
        fontFamily: '"Cinzel", serif',
        marginBottom: '0.5rem'
      }}>
        {title}
      </Title>
      <Text style={{ 
        fontSize: 16, 
        color: '#B8860B',
        display: 'block',
        marginBottom: '2rem'
      }}>
        {message}
      </Text>
      <Space size="middle" wrap style={{ justifyContent: 'center' }}>
        {showHomeButton && (
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={handleHome}
            style={{ 
              backgroundColor: '#8B0000', 
              borderColor: '#D4AF37',
              height: 48,
              padding: '0 32px',
              fontFamily: '"Cinzel", serif',
              boxShadow: '0 4px 16px rgba(139, 0, 0, 0.3)'
            }}
          >
            Về trang chủ
          </Button>
        )}
        
        {showBackButton && (
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ 
              borderColor: '#D4AF37',
              color: '#D4AF37',
              height: 48,
              padding: '0 32px',
              fontFamily: '"Cinzel", serif',
              background: 'transparent'
            }}
          >
            Quay lại
          </Button>
        )}
        
        {onRetry && (
          <Button 
            type="primary"
            onClick={onRetry}
            style={{ 
              backgroundColor: '#D4AF37', 
              borderColor: '#D4AF37',
              color: '#1a0a0a',
              height: 48,
              padding: '0 32px',
              fontFamily: '"Cinzel", serif',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
            }}
          >
            {retryText}
          </Button>
        )}
      </Space>
    </div>
  );

  if (fullScreen) {
    return (
      <Layout style={styles.fullLayout}>
        <Content style={styles.fullContent}>
          <div style={styles.wrapper}>
            <Card style={styles.card}>
              {errorContent}
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <div style={styles.container}>
      <Card style={styles.cardInline}>
        {errorContent}
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
  wrapper: {
    width: '100%',
    maxWidth: 900,
    margin: '20px auto',
    padding: '0 20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  card: {
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
  cardInline: {
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
  `;
  document.head.appendChild(styleSheet);
}
