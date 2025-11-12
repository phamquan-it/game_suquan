"use client"
import { Card, Row, Col, Typography, Button, Divider } from 'antd';
import Link from 'next/link';
import { DatabaseOutlined, ApiOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function DocsPage() {
  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: 48, color: '#8B0000' }} />,
      title: 'Database Analysis',
      description: 'Phân tích chi tiết cấu trúc database, relationships và query optimization',
      link: '/docs/beauty/database-analysis',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 48, color: '#003366' }} />,
      title: 'API Examples',
      description: 'Ví dụ đầy đủ về API endpoints với Next.js App Router',
      link: '/docs/beauty/api-examples',
    },
    {
      icon: <BookOutlined style={{ fontSize: 48, color: '#2E8B57' }} />,
      title: 'Tutorial Guide',
      description: 'Hướng dẫn từng bước để implement hệ thống',
      link: '/docs/beauty/tutorial',
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#F5F5DC', minHeight: '100vh' }}>
      <Card>
        <Title level={1}>📚 Beauty System Documentation</Title>
        <Paragraph>
          Tài liệu toàn diện cho hệ thống quản lý mỹ nhân với Next.js, TypeScript, Ant Design và PostgreSQL.
        </Paragraph>

        <Divider />

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card 
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
              >
                {feature.icon}
                <Title level={3} style={{ marginTop: 16 }}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
                <Link href={feature.link}>
                  <Button type="primary" size="large">
                    Explore
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="🚀 Quick Start" size="small">
              <ol>
                <li>Clone repository và cài đặt dependencies</li>
                <li>Chạy SQL script để tạo database schema</li>
                <li>Configure database connection trong .env</li>
                <li>Khởi chạy development server</li>
                <li>Truy cập http://localhost:3000/docs để xem tài liệu</li>
              </ol>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
