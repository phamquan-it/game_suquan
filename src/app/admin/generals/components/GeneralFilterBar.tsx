'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Space,
  Slider,
  Checkbox,
  Typography
} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { HeroRarity, HeroElement, HeroType, HeroStatus } from '@/types/general';
const { Text } = Typography;

const { Option } = Select;

interface GeneralFilterBarProps {
  onFilterChange: (filters: any) => void;
}

const GeneralFilterBar: React.FC<GeneralFilterBarProps> = ({ onFilterChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    rarity: [],
    element: [],
    type: [],
    status: [],
    levelRange: [1, 100],
    starRange: [1, 5],
    isVip: undefined,
    favorite: undefined,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      rarity: [],
      element: [],
      type: [],
      status: [],
      levelRange: [1, 100],
      starRange: [1, 5],
      isVip: undefined,
      favorite: undefined,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card style={{ borderRadius: 12, border: '1px solid #F1E8D6' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên, danh hiệu..."
              prefix={<SearchOutlined />}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Độ hiếm"
              value={filters.rarity}
              onChange={(value) => handleFilterChange('rarity', value)}
              allowClear
            >
              <Option value="common">Thường</Option>
              <Option value="rare">Hiếm</Option>
              <Option value="epic">Sử thi</Option>
              <Option value="legendary">Huyền thoại</Option>
              <Option value="mythic">Thần thoại</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Nguyên tố"
              value={filters.element}
              onChange={(value) => handleFilterChange('element', value)}
              allowClear
            >
              <Option value="fire">Hỏa</Option>
              <Option value="water">Thủy</Option>
              <Option value="earth">Thổ</Option>
              <Option value="wind">Phong</Option>
              <Option value="light">Quang</Option>
              <Option value="dark">Ám</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Ẩn' : 'Hiện'} bộ lọc
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>

        {showAdvanced && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Loại tướng"
                  value={filters.type}
                  onChange={(value) => handleFilterChange('type', value)}
                  allowClear
                >
                  <Option value="infantry">Bộ binh</Option>
                  <Option value="cavalry">Kỵ binh</Option>
                  <Option value="archer">Cung thủ</Option>
                  <Option value="siege">Công thành</Option>
                  <Option value="defense">Phòng thủ</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Trạng thái"
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  allowClear
                >
                  <Option value="active">Sẵn sàng</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="training">Đang huấn luyện</Option>
                  <Option value="deployed">Đang triển khai</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Space size="large">
                  <Checkbox
                    checked={filters.isVip}
                    onChange={(e) => handleFilterChange('isVip', e.target.checked || undefined)}
                  >
                    VIP
                  </Checkbox>
                  <Checkbox
                    checked={filters.favorite}
                    onChange={(e) => handleFilterChange('favorite', e.target.checked || undefined)}
                  >
                    Yêu thích
                  </Checkbox>
                </Space>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>Cấp độ: {filters.levelRange[0]} - {filters.levelRange[1]}</Text>
                  <Slider
                    range
                    min={1}
                    max={100}
                    value={filters.levelRange}
                    onChange={(value) => handleFilterChange('levelRange', value)}
                  />
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>Số sao: {filters.starRange[0]} - {filters.starRange[1]}</Text>
                  <Slider
                    range
                    min={1}
                    max={5}
                    value={filters.starRange}
                    onChange={(value) => handleFilterChange('starRange', value)}
                  />
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Space>
    </Card>
  );
};

export default GeneralFilterBar;
