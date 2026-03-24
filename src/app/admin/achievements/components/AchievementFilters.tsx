// app/admin/achievements/components/AchievementFilters.tsx
'use client';

import React from 'react';
import { Card, Input, Select, Row, Col, Button, Space, Radio } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { AchievementFilters } from '../types';

const { Option } = Select;

interface AchievementFiltersProps {
  filters: AchievementFilters;
  onFilterChange: (filters: AchievementFilters) => void;
  onReset: () => void;
}

export const AchievementFiltersComponent: React.FC<AchievementFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleChange = (key: keyof AchievementFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card className="shadow-sm">
      <Space direction="vertical" size="middle" className="w-full">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by name or description"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              prefix={<SearchOutlined className="text-gray-400" />}
              allowClear
            />
          </Col>

          <Col xs={24} md={16}>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Select
                  mode="multiple"
                  placeholder="Type"
                  value={filters.type}
                  onChange={(val) => handleChange('type', val)}
                  className="w-full"
                  maxTagCount="responsive"
                >
                  <Option value="progression">Progression</Option>
                  <Option value="combat">Combat</Option>
                  <Option value="exploration">Exploration</Option>
                  <Option value="collection">Collection</Option>
                  <Option value="crafting">Crafting</Option>
                  <Option value="social">Social</Option>
                  <Option value="economy">Economy</Option>
                  <Option value="alliance">Alliance</Option>
                  <Option value="seasonal">Seasonal</Option>
                  <Option value="milestone">Milestone</Option>
                  <Option value="secret">Secret</Option>
                </Select>
              </Col>

              <Col span={8}>
                <Select
                  mode="multiple"
                  placeholder="Category"
                  value={filters.category}
                  onChange={(val) => handleChange('category', val)}
                  className="w-full"
                  maxTagCount="responsive"
                >
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                  <Option value="expert">Expert</Option>
                  <Option value="master">Master</Option>
                  <Option value="legendary">Legendary</Option>
                </Select>
              </Col>

              <Col span={8}>
                <Select
                  mode="multiple"
                  placeholder="Tier"
                  value={filters.tier}
                  onChange={(val) => handleChange('tier', val)}
                  className="w-full"
                  maxTagCount="responsive"
                >
                  <Option value="bronze">Bronze</Option>
                  <Option value="silver">Silver</Option>
                  <Option value="gold">Gold</Option>
                  <Option value="platinum">Platinum</Option>
                  <Option value="diamond">Diamond</Option>
                  <Option value="master">Master</Option>
                  <Option value="grandmaster">Grandmaster</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Select
              mode="multiple"
              placeholder="Rarity"
              value={filters.rarity}
              onChange={(val) => handleChange('rarity', val)}
              className="w-full"
              maxTagCount="responsive"
            >
              <Option value="common">Common</Option>
              <Option value="uncommon">Uncommon</Option>
              <Option value="rare">Rare</Option>
              <Option value="epic">Epic</Option>
              <Option value="legendary">Legendary</Option>
              <Option value="mythic">Mythic</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Select
              mode="multiple"
              placeholder="Difficulty"
              value={filters.difficulty}
              onChange={(val) => handleChange('difficulty', val)}
              className="w-full"
              maxTagCount="responsive"
            >
              <Option value="very_easy">Very Easy</Option>
              <Option value="easy">Easy</Option>
              <Option value="medium">Medium</Option>
              <Option value="hard">Hard</Option>
              <Option value="very_hard">Very Hard</Option>
              <Option value="extreme">Extreme</Option>
              <Option value="impossible">Impossible</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Select
              mode="multiple"
              placeholder="Status"
              value={filters.status}
              onChange={(val) => handleChange('status', val)}
              className="w-full"
              maxTagCount="responsive"
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="hidden">Hidden</Option>
            </Select>
          </Col>

          <Col xs={24} md={6}>
            <Radio.Group
              value={filters.repeatable}
              onChange={(e) => handleChange('repeatable', e.target.value)}
              className="w-full"
            >
              <Radio.Button value={null}>All</Radio.Button>
              <Radio.Button value={true}>Repeatable</Radio.Button>
              <Radio.Button value={false}>Non-repeatable</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        <Row justify="end">
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              Reset Filters
            </Button>
            <Button type="primary" icon={<FilterOutlined />}>
              Apply Filters
            </Button>
          </Space>
        </Row>
      </Space>
    </Card>
  );
};
