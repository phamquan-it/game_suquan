'use client';

import React, { useState } from 'react';
import { Tabs, Table, Card, Empty, Spin, Tag, Typography, Space, Avatar } from 'antd';
import {
  AppstoreOutlined,
  DatabaseOutlined,
  ToolOutlined,
  BookOutlined,
  CrownOutlined,
  FireOutlined,
  SafetyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { ResourceType, useResourceTypes, useResourceTypesByCategory } from '@/lib/hooks/useResourceTypes';

const { Title, Text, Paragraph } = Typography;

// Map categories to icons
const categoryIcons: Record<string, React.ReactNode> = {
  'weapon': <FireOutlined />,
  'armor': <SafetyOutlined />,
  'consumable': <DatabaseOutlined />,
  'material': <ToolOutlined />,
  'quest': <BookOutlined />,
  'currency': <CrownOutlined />,
  'special': <TeamOutlined />,
  'default': <AppstoreOutlined />
};

// Map categories to colors
const categoryColors: Record<string, string> = {
  'weapon': '#DC143C',
  'armor': '#2E8B57',
  'consumable': '#1E90FF',
  'material': '#FF8C00',
  'quest': '#8B4513',
  'currency': '#D4AF37',
  'special': '#8B0000',
  'default': '#003366'
};

interface ResourceTypesTabsProps {
  showCategoryFilter?: boolean;
  onResourceTypeSelect?: (resourceCode: string) => void;
  defaultActiveCategory?: string;
}

const ResourceTypesTabs: React.FC<ResourceTypesTabsProps> = ({
  showCategoryFilter = true,
  onResourceTypeSelect,
  defaultActiveCategory = 'all'
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(defaultActiveCategory);

  // Fetch all resource types
  const { data: allResources, isLoading: allLoading, error: allError } = useResourceTypes();

  // Fetch by category (if needed)
  const { data: categorizedResources, isLoading: categoryLoading } = useResourceTypesByCategory(
    activeCategory !== 'all' ? activeCategory : undefined
  );

  // Use appropriate data based on filter
  const resources = activeCategory !== 'all' ? categorizedResources : allResources;
  const isLoading = activeCategory !== 'all' ? categoryLoading : allLoading;
  const error = allError;

  // Get unique categories from all resources
  const categories = React.useMemo(() => {
    if (!allResources) return [];
    const uniqueCategories = Array.from(new Set(allResources.map(r => r.resource_category)));
    return uniqueCategories.map(cat => ({
      key: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: categoryIcons[cat] || categoryIcons.default
    }));
  }, [allResources]);

  // Table columns configuration with theme-aware styling
  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon_url',
      key: 'icon',
      width: 80,
      render: (iconUrl: string, record: ResourceType) => (
        iconUrl ? (
          <Avatar
            src={iconUrl}
            size={40}
            shape="square"
            style={{
              backgroundColor: categoryColors[record.resource_category] || '#F1E8D6',
              borderRadius: 8
            }}
          />
        ) : (
          <Avatar
            size={40}
            shape="square"
            style={{
              backgroundColor: categoryColors[record.resource_category] || '#F1E8D6',
              borderRadius: 8
            }}
            icon={categoryIcons[record.resource_category] || categoryIcons.default}
          />
        )
      )
    },
    {
      title: 'Resource Code',
      dataIndex: 'resource_code',
      key: 'code',
      width: 150,
      render: (code: string) => (
        <Text code style={{ fontSize: 12, backgroundColor: '#F5F5DC' }}>{code}</Text>
      )
    },
    {
      title: 'Resource Name',
      dataIndex: 'resource_name',
      key: 'name',
      width: 200,
      render: (name: string, record: ResourceType) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 14, color: '#8B4513' }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.resource_code}
          </Text>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'resource_category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag
          color={categoryColors[category] || '#666'}
          icon={categoryIcons[category] || categoryIcons.default}
          style={{
            borderRadius: 12,
            padding: '2px 12px',
            fontSize: 12,
            fontWeight: 500,
            border: 'none'
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
          style={{ marginBottom: 0, fontSize: 12, color: '#000000' }}
        >
          {description || 'No description available'}
        </Paragraph>
      )
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 100,
      align: 'center' as const,
      render: (order: number) => (
        <Tag
          color="#D4AF37"
          style={{
            borderRadius: 12,
            backgroundColor: '#F1E8D6',
            color: '#8B4513',
            border: '1px solid #D4AF37'
          }}
        >
          {order || '—'}
        </Tag>
      )
    }
  ];

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveCategory(key);
    if (onResourceTypeSelect) {
      onResourceTypeSelect('');
    }
  };

  // Handle row click
  const handleRowClick = (record: ResourceType) => {
    if (onResourceTypeSelect) {
      onResourceTypeSelect(record.resource_code);
    }
  };

  if (error) {
    return (
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)'
        }}
      >
        <Empty
          description="Failed to load resource types"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Text type="danger" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          {error.message}
        </Text>
      </Card>
    );
  }

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
        borderColor: '#F1E8D6'
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Tabs
        activeKey={activeCategory}
        onChange={handleTabChange}
        items={[
          {
            key: 'all',
            label: (
              <Space>
                <AppstoreOutlined />
                All Resources
              </Space>
            ),
            children: (
              <Spin spinning={isLoading}>
                <Table
                  columns={columns}
                  dataSource={resources}
                  rowKey="resource_code"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => (
                      <span style={{ color: '#8B4513' }}>
                        {range[0]}-{range[1]} of {total} resources
                      </span>
                    ),
                    style: { marginTop: 16 }
                  }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: {
                      cursor: onResourceTypeSelect ? 'pointer' : 'default',
                      transition: 'all 0.3s'
                    }
                  })}
                  scroll={{ x: 800 }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8
                  }}
                  className="resource-types-table"
                />
              </Spin>
            )
          },
          ...(showCategoryFilter ? categories.map(cat => ({
            key: cat.key,
            label: (
              <Space>
                {cat.icon}
                {cat.label}
              </Space>
            ),
            children: (
              <Spin spinning={isLoading}>
                <Table
                  columns={columns}
                  dataSource={resources?.filter(r => r.resource_category === cat.key)}
                  rowKey="resource_code"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => (
                      <span style={{ color: '#8B4513' }}>
                        {range[0]}-{range[1]} of {total} {cat.label.toLowerCase()} resources
                      </span>
                    ),
                    style: { marginTop: 16 }
                  }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: {
                      cursor: onResourceTypeSelect ? 'pointer' : 'default',
                      transition: 'all 0.3s'
                    }
                  })}
                  scroll={{ x: 800 }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8
                  }}
                  className="resource-types-table"
                />
              </Spin>
            )
          })) : [])
        ]}
        tabBarStyle={{
          borderBottomColor: '#D4AF37',
          marginBottom: 24,
          fontWeight: 500
        }}
      />
    </Card>
  );
};

// Alternative compact view using cards instead of table
export const ResourceTypesGrid: React.FC<ResourceTypesTabsProps> = ({
  showCategoryFilter = true,
  onResourceTypeSelect,
  defaultActiveCategory = 'all'
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(defaultActiveCategory);
  const { data: allResources, isLoading, error } = useResourceTypes();

  const filteredResources = React.useMemo(() => {
    if (!allResources) return [];
    if (activeCategory === 'all') return allResources;
    return allResources.filter(r => r.resource_category === activeCategory);
  }, [allResources, activeCategory]);

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!allResources) return [];
    const uniqueCategories = Array.from(new Set(allResources.map(r => r.resource_category)));
    return [
      { key: 'all', label: 'All', icon: <AppstoreOutlined /> },
      ...uniqueCategories.map(cat => ({
        key: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: categoryIcons[cat] || categoryIcons.default
      }))
    ];
  }, [allResources]);

  if (error) {
    return (
      <Card>
        <Empty description="Failed to load resource types" />
      </Card>
    );
  }

  return (
    <div>
      {showCategoryFilter && (
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          items={categories.map(cat => ({
            key: cat.key,
            label: (
              <Space>
                {cat.icon}
                {cat.label}
              </Space>
            )
          }))}
          tabBarStyle={{
            borderBottomColor: '#D4AF37',
            marginBottom: 24
          }}
        />
      )}

      <Spin spinning={isLoading}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16
        }}>
          {filteredResources?.map((resource) => (
            <Card
              key={resource.resource_code}
              hoverable={!!onResourceTypeSelect}
              onClick={() => onResourceTypeSelect?.(resource.resource_code)}
              style={{
                borderRadius: 12,
                cursor: onResourceTypeSelect ? 'pointer' : 'default',
                borderColor: '#F1E8D6',
                transition: 'all 0.3s'
              }}
              styles={{ body: { padding: '16px' } }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Space size={12} align="start">
                  {resource.icon_url ? (
                    <Avatar
                      src={resource.icon_url}
                      size={48}
                      shape="square"
                      style={{
                        backgroundColor: categoryColors[resource.resource_category] || '#F1E8D6',
                        borderRadius: 8
                      }}
                    />
                  ) : (
                    <Avatar
                      size={48}
                      shape="square"
                      style={{
                        backgroundColor: categoryColors[resource.resource_category] || '#F1E8D6',
                        borderRadius: 8
                      }}
                      icon={categoryIcons[resource.resource_category] || categoryIcons.default}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ margin: 0, color: '#8B4513' }}>
                      {resource.resource_name}
                    </Title>
                    <Text code style={{ fontSize: 11, backgroundColor: '#F5F5DC' }}>
                      {resource.resource_code}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag
                        color={categoryColors[resource.resource_category] || '#666'}
                        style={{ borderRadius: 12 }}
                      >
                        {resource.resource_category}
                      </Tag>
                      {resource.sort_order && (
                        <Tag color="#D4AF37" style={{ borderRadius: 12, marginLeft: 8 }}>
                          Order: {resource.sort_order}
                        </Tag>
                      )}
                    </div>
                  </div>
                </Space>
                {resource.description && (
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: 0, fontSize: 12, color: '#666' }}
                  >
                    {resource.description}
                  </Paragraph>
                )}
              </Space>
            </Card>
          ))}
        </div>
        {filteredResources?.length === 0 && !isLoading && (
          <Empty description="No resources found" style={{ marginTop: 48 }} />
        )}
      </Spin>
    </div>
  );
};

// Export both components
export default ResourceTypesTabs;
