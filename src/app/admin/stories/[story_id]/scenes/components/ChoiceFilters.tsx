import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  FilterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ACTIVE_SCENE_OPTIONS } from '../../../hooks/useStoryChoices';
import { ChoiceFiltersProps } from './types';

const { Option } = Select;

export const ChoiceFilters: React.FC<ChoiceFiltersProps> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  availableBosses,
  availableQuests,
  onBulkDelete,
  selectedRowKeys,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={5}>
          <Input
            placeholder="Search choices..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Next Scene"
            style={{ width: '100%' }}
            value={filters.hasNextScene}
            onChange={(value) => setFilters({ ...filters, hasNextScene: value })}
            allowClear
            size="middle"
            options={[
              { value: true, label: 'Has Next Scene' },
              { value: false, label: 'No Next Scene' },
            ]}
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Boss"
            style={{ width: '100%' }}
            value={filters.hasBoss}
            onChange={(value) => setFilters({ ...filters, hasBoss: value })}
            allowClear
            size="middle"
            options={[
              { value: true, label: 'Has Boss' },
              { value: false, label: 'No Boss' },
            ]}
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Quests"
            style={{ width: '100%' }}
            value={filters.hasQuests}
            onChange={(value) => setFilters({ ...filters, hasQuests: value })}
            allowClear
            size="middle"
            options={[
              { value: true, label: 'Has Quests' },
              { value: false, label: 'No Quests' },
            ]}
          />
        </Col>
        <Col xs={24} md={7}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Tooltip title="Toggle Advanced Filters">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                type={showAdvancedFilters ? 'primary' : 'default'}
                size="middle"
              />
            </Tooltip>
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} size="middle" />
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Delete Selected Choices"
                description={`Are you sure you want to delete ${selectedRowKeys.length} choices?`}
                onConfirm={onBulkDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} size="middle">
                  Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew} size="middle">
              Add Choice
            </Button>
          </Space>
        </Col>
      </Row>

      {showAdvancedFilters && (
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col xs={24} md={6}>
            <Select
              placeholder="Active Scene"
              style={{ width: '100%' }}
              value={filters.activeScene}
              onChange={(value) => setFilters({ ...filters, activeScene: value })}
              allowClear
              size="middle"
              options={ACTIVE_SCENE_OPTIONS.map(opt => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
          </Col>
          <Col xs={12} md={3}>
            <Select
              placeholder="Order From"
              style={{ width: '100%' }}
              value={filters.orderFrom}
              onChange={(value) => setFilters({ ...filters, orderFrom: value })}
              allowClear
              size="middle"
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
                value: num,
                label: `Order ${num}`,
              }))}
            />
          </Col>
          <Col xs={12} md={3}>
            <Select
              placeholder="Order To"
              style={{ width: '100%' }}
              value={filters.orderTo}
              onChange={(value) => setFilters({ ...filters, orderTo: value })}
              allowClear
              size="middle"
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
                value: num,
                label: `Order ${num}`,
              }))}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
};
