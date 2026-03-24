'use client';

import React from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { QuestFilters as FiltersType } from '../types/quest.types';
import { QUEST_CATEGORIES, QUEST_DIFFICULTIES, QUEST_STATUSES, QUEST_TYPES } from '../types';

const { Option } = Select;

interface QuestFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
  onReset: () => void;
}

export const QuestFilters: React.FC<QuestFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Tìm kiếm nhiệm vụ..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            allowClear
          />
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Danh mục"
            value={filters.category}
            onChange={(value) => onFilterChange({ category: value })}
            className="w-full"
          >
            <Option value="all">Tất cả</Option>
            {QUEST_CATEGORIES.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Độ khó"
            value={filters.difficulty}
            onChange={(value) => onFilterChange({ difficulty: value })}
            className="w-full"
          >
            <Option value="all">Tất cả</Option>
            {QUEST_DIFFICULTIES.map(diff => (
              <Option key={diff} value={diff}>{diff}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Trạng thái"
            value={filters.status}
            onChange={(value) => onFilterChange({ status: value })}
            className="w-full"
          >
            <Option value="all">Tất cả</Option>
            {QUEST_STATUSES.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder="Loại"
            value={filters.type}
            onChange={(value) => onFilterChange({ type: value })}
            className="w-full"
          >
            <Option value="all">Tất cả</Option>
            {QUEST_TYPES.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={4}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
