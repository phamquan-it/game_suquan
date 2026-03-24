'use client';

import { Input, Select, Space, Button, Row, Col, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { BeautyFilters as FiltersType } from '../types';

const { Option } = Select;

interface BeautyFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  onReset: () => void;
}

export function BeautyFilters({ filters, onFilterChange, onReset }: BeautyFiltersProps) {
  const handleChange = (key: keyof FiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card style={{ marginBottom: 24, background: '#F1E8D6' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search by name or title"
            prefix={<SearchOutlined style={{ color: '#8B4513' }} />}
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            style={{ background: '#FFFFFF' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Rarity"
            style={{ width: '100%' }}
            value={filters.rarity}
            onChange={(value) => handleChange('rarity', value)}
            allowClear
          >
            <Option value="common">Common</Option>
            <Option value="rare">Rare</Option>
            <Option value="epic">Epic</Option>
            <Option value="legendary">Legendary</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Status"
            style={{ width: '100%' }}
            value={filters.status}
            onChange={(value) => handleChange('status', value)}
            allowClear
          >
            <Option value="available">Available</Option>
            <Option value="mission">On Mission</Option>
            <Option value="training">Training</Option>
            <Option value="resting">Resting</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Space>
            <Input
              placeholder="Min Level"
              type="number"
              value={filters.minLevel}
              onChange={(e) => handleChange('minLevel', parseInt(e.target.value) || undefined)}
              style={{ width: 80 }}
            />
            <span>-</span>
            <Input
              placeholder="Max Level"
              type="number"
              value={filters.maxLevel}
              onChange={(e) => handleChange('maxLevel', parseInt(e.target.value) || undefined)}
              style={{ width: 80 }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={8} lg={2}>
          <Button 
            icon={<FilterOutlined />} 
            onClick={onReset}
            style={{ background: '#8B0000', color: '#FFFFFF', border: 'none' }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
