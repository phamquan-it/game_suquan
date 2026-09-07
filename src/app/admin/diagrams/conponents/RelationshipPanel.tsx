"use client";

import React, { useState } from 'react';
import { Card, Button, Tag, Space, Typography, Badge, List, Tooltip, FloatButton, Drawer, Divider, Tabs, Empty, Avatar } from 'antd';
import {
  LinkOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  TableOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { TableInfo } from '../types/diagram';
import { getBorderColor, getTableColor } from '../utils';

const { Text } = Typography;

interface RelationshipPanelProps {
  relationships: any[];
  hasRelationships: boolean;
  loading?: boolean;
  selectedTablesData?: TableInfo[];
  onRefresh?: () => void;
  onHandleRemoveTable?: (tableName: string) => void;
}

export default function RelationshipPanel({
  relationships,
  hasRelationships,
  loading = false,
  selectedTablesData = [],
  onRefresh,
  onHandleRemoveTable
}: RelationshipPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('relationships');

  const totalRelationships = relationships.length;
  const selectedTableNames = selectedTablesData.map(t => t.table_name);

  // ===== Tab Items =====
  const tabItems = [
    {
      key: 'relationships',
      label: (
        <Space>
          <LinkOutlined />
          <span>Quan hệ</span>
          <Badge
            count={totalRelationships}
            style={{
              backgroundColor: hasRelationships ? '#2E8B57' : '#DC143C',
              fontSize: 11,
              height: 20,
              lineHeight: '20px',
              minWidth: 20,
            }}
          />
        </Space>
      ),
      children: (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <Text type="secondary">Đang kiểm tra quan hệ...</Text>
            </div>
          ) : hasRelationships ? (
            <List
              size="small"
              dataSource={relationships}
              renderItem={(pair) => (
                <List.Item
                  style={{
                    padding: '12px 16px',
                    marginBottom: 8,
                    background: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f0f0';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Space size="middle">
                        <Tag color="blue" style={{ fontWeight: 500, fontSize: 13, padding: '4px 12px' }}>
                          {pair.table1}
                        </Tag>
                        <Text strong style={{ color: '#D4AF37', fontSize: 16 }}>→</Text>
                        <Tag color="green" style={{ fontWeight: 500, fontSize: 13, padding: '4px 12px' }}>
                          {pair.table2}
                        </Tag>
                      </Space>
                      <Tooltip title="Xem chi tiết">
                        <Button
                          size="small"
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            console.log('Chi tiết:', pair);
                          }}
                        />
                      </Tooltip>
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                      <code style={{
                        background: '#e9ecef',
                        padding: '2px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#1976D2'
                      }}>
                        {pair.relationship.source_column}
                      </code>
                      <span style={{ margin: '0 8px', color: '#999' }}>⟷</span>
                      <code style={{
                        background: '#e9ecef',
                        padding: '2px 10px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#2E7D32'
                      }}>
                        {pair.relationship.target_column}
                      </code>
                      <span style={{ marginLeft: 12 }}>
                        <Tag
                          color={pair.relationship.on_delete_action === 'CASCADE' ? 'red' : 'default'}
                          style={{ fontSize: 11, fontWeight: 500 }}
                        >
                          DELETE: {pair.relationship.on_delete_action}
                        </Tag>
                        <Tag
                          color={pair.relationship.on_update_action === 'CASCADE' ? 'blue' : 'default'}
                          style={{ fontSize: 11, fontWeight: 500, marginLeft: 4 }}
                        >
                          UPDATE: {pair.relationship.on_update_action}
                        </Tag>
                      </span>
                    </div>
                    {pair.relationship.constraint_name && (
                      <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                        <Text type="secondary">Ràng buộc: </Text>
                        <code style={{
                          background: '#f5f5f5',
                          padding: '1px 8px',
                          borderRadius: 3,
                          fontSize: 11
                        }}>
                          {pair.relationship.constraint_name}
                        </code>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CloseCircleOutlined style={{ fontSize: 32, color: '#DC143C' }} />
              </div>
              <Text type="secondary" style={{ fontSize: 15 }}>
                Không có quan hệ giữa các bảng
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Hãy thử chọn các bảng khác nhau
                </Text>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      key: 'tables',
      label: (
        <Space>
          <TableOutlined />
          <span>Bảng đã chọn</span>
          <Badge
            count={selectedTablesData.length}
            style={{
              backgroundColor: '#8B0000',
              fontSize: 11,
              height: 20,
              lineHeight: '20px',
              minWidth: 20,
            }}
          />
        </Space>
      ),
      children: (
        <>
          {selectedTablesData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Empty
                description="Chưa có bảng nào được chọn"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Text type="secondary" style={{ fontSize: 13, marginTop: 8, display: 'block' }}>
                Hãy thêm bảng từ danh sách
              </Text>
            </div>
          ) : (
            <>
              {/* Grid hiển thị bảng */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
                padding: '4px 0',
                marginBottom: 16
              }}>
                {selectedTablesData.map((table) => {
                  const hasRelation = relationships.some(
                    r => r.table1 === table.table_name || r.table2 === table.table_name
                  );

                  return (
                    <div
                      key={table.table_name}
                      style={{
                        padding: '14px 16px',
                        background: getTableColor(table.table_name),
                        border: `2px solid ${getBorderColor(table.table_name)}`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      <Avatar
                        icon={<TableOutlined />}
                        style={{
                          background: getBorderColor(table.table_name),
                          color: '#fff',
                          width: 32,
                          height: 32,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 13, display: 'block' }}>
                          {table.table_name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {table.schema_name}
                        </Text>
                      </div>
                      <Space size={4}>
                        {hasRelation && (
                          <Tooltip title="Có quan hệ với bảng khác">
                            <CheckCircleOutlined style={{ color: '#2E8B57', fontSize: 16 }} />
                          </Tooltip>
                        )}
                        {onHandleRemoveTable && (
                          <Tooltip title="Xóa bảng">
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => onHandleRemoveTable(table.table_name)}
                              style={{
                                color: '#DC143C',
                                padding: '0 4px',
                                height: 24,
                              }}
                            />
                          </Tooltip>
                        )}
                      </Space>
                    </div>
                  );
                })}
              </div>

              {/* Thống kê nhanh */}
              <div style={{
                padding: '16px 20px',
                background: '#f8f9fa',
                borderRadius: 8,
                border: '1px solid #e8e8e8',
                display: 'flex',
                gap: 32,
                flexWrap: 'wrap'
              }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    <DatabaseOutlined /> Tổng số bảng
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#8B0000' }}>
                    {selectedTablesData.length}
                  </Text>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    <CheckCircleOutlined style={{ color: '#2E8B57' }} /> Có quan hệ
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#2E8B57' }}>
                    {selectedTablesData.filter(table =>
                      relationships.some(r => r.table1 === table.table_name || r.table2 === table.table_name)
                    ).length}
                  </Text>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    <CloseCircleOutlined style={{ color: '#DC143C' }} /> Không có quan hệ
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#DC143C' }}>
                    {selectedTablesData.filter(table =>
                      !relationships.some(r => r.table1 === table.table_name || r.table2 === table.table_name)
                    ).length}
                  </Text>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    <LinkOutlined /> Tổng quan hệ
                  </Text>
                  <Text strong style={{ fontSize: 20, color: '#D4AF37' }}>
                    {totalRelationships}
                  </Text>
                </div>
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      {/* ===== FLOAT BUTTON ===== */}
      <FloatButton
        icon={<UnorderedListOutlined />}
        type="primary"
        style={{
          position: 'fixed',
          bottom: 80,
          right: 30,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: 56,
          height: 56,
        }}
        badge={{
          count: totalRelationships > 0 ? totalRelationships : 0,
          color: hasRelationships ? '#2E8B57' : '#DC143C',
        }}
        onClick={() => setIsOpen(!isOpen)}
        tooltip={isOpen ? 'Đóng' : 'Xem quan hệ'}
      />

      {/* ===== DRAWER PANEL (Slide up) ===== */}
      <Drawer
        title={
          <Space>
            <LinkOutlined style={{ color: hasRelationships ? '#2E8B57' : '#DC143C' }} />
            <Text strong>Quản lý quan hệ</Text>
            <Badge
              count={totalRelationships}
              style={{
                backgroundColor: hasRelationships ? '#2E8B57' : '#DC143C',
                marginLeft: 4
              }}
            />
          </Space>
        }
        placement="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        height={520}
        closable={false}
        maskClosable={true}
        extra={
          <Space>
            {onRefresh && (
              <Button
                type="text"
                icon={<ReloadOutlined spin={loading} />}
                onClick={onRefresh}
                loading={loading}
              >
                Làm mới
              </Button>
            )}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
            />
          </Space>
        }
        style={{
          borderRadius: '16px 16px 0 0',
          borderTop: `3px solid ${hasRelationships ? '#2E8B57' : '#DC143C'}`,
        }}
        styles={{
          body: {
            padding: '8px 16px 24px',
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
          }
        }}
        footer={
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {hasRelationships
                ? `Tìm thấy ${totalRelationships} quan hệ giữa ${selectedTablesData.length} bảng`
                : `${selectedTablesData.length} bảng được chọn, không có quan hệ nào`}
            </Text>
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          style={{ marginTop: -8 }}
        />
      </Drawer>

      <style jsx>{`
        .loading-dots {
          display: inline-flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .loading-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #8B0000;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
