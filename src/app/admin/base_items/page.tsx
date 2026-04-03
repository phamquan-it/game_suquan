// app/admin/base_items/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Card,
  theme,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import ItemTable from './components/ItemTable';
import ItemFilters from './components/ItemFilters';
import ItemForm from './components/ItemForm';
import { ItemFilterParams } from './types';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function BaseItemsPage() {
  const [filters, setFilters] = useState<ItemFilterParams>({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { token } = theme.useToken();

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormVisible(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingItem(null);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgBase }}>
      <Header style={{
        background: token.colorBgElevated,
        padding: '0 24px',
        borderBottom: `2px solid ${token.colorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Title level={3} style={{ margin: 0, color: token.colorTextSecondary }}>
          Quản Lý Vật Phẩm
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
          >
            Làm Mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ background: token.colorPrimary, borderColor: token.colorBorder }}
          >
            Tạo Vật Phẩm
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <ItemFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </Col>
          <Col xs={24} lg={18}>
            <Card
              variant='borderless'
              style={{
                boxShadow: token.boxShadowTertiary,
                borderRadius: token.borderRadiusLG,
              }}
            >
              <ItemTable
                filters={filters}
                onEdit={handleEdit}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      <ItemForm
        visible={isFormVisible}
        onClose={handleCloseForm}
        initialData={editingItem}
      />
    </Layout>
  );
}
