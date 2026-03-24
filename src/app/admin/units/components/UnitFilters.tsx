// app/admin/units/components/UnitFilters.tsx
'use client';

import React from 'react';
import { Card, Row, Col, Input, Select, Slider, Button, Space, Tag } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import { UnitFilterParams, UnitRank, UnitType } from '../types';

const { Option } = Select;

interface UnitFiltersProps {
    filters: UnitFilterParams;
    onFilterChange: (filters: UnitFilterParams) => void;
}

const UnitFilters: React.FC<UnitFiltersProps> = ({ filters, onFilterChange }) => {
    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archer', 'siege', 'mythical', 'legendary'];
    const unitRanks: UnitRank[] = ['regular', 'elite', 'champion', 'legendary', 'mythic'];

    const handleSearchChange = (value: string) => {
        onFilterChange({ ...filters, searchTerm: value });
    };

    const handleTypeChange = (value: UnitType) => {
        onFilterChange({ ...filters, type: value });
    };

    const handleRankChange = (value: UnitRank) => {
        onFilterChange({ ...filters, rank: value });
    };

    const handleVipChange = (value: string) => {
        onFilterChange({
            ...filters,
            isVip: value === 'all' ? undefined : value === 'vip'
        });
    };

    const handleAtkChange = (value: number[]) => {
        onFilterChange({
            ...filters,
            minAtk: value[0],
            maxAtk: value[1] === 1000 ? undefined : value[1]
        });
    };

    const handleClearFilters = () => {
        onFilterChange({});
    };

    return (
        <Card
            style={{
                marginBottom: 24,
                border: `2px solid ${theme.token?.colorBorder}`,
                borderRadius: theme.token?.borderRadius,
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Search units..."
                        prefix={<SearchOutlined style={{ color: theme.token?.colorPrimary }} />}
                        value={filters.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>

                <Col xs={24} md={6}>
                    <Select
                        placeholder="Unit Type"
                        allowClear
                        style={{ width: '100%' }}
                        value={filters.type}
                        onChange={handleTypeChange}
                    >
                        {unitTypes.map(type => (
                            <Option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} md={5}>
                    <Select
                        placeholder="Rank"
                        allowClear
                        style={{ width: '100%' }}
                        value={filters.rank}
                        onChange={handleRankChange}
                    >
                        {unitRanks.map(rank => (
                            <Option key={rank} value={rank}>
                                {rank.charAt(0).toUpperCase() + rank.slice(1)}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} md={5}>
                    <Select
                        placeholder="VIP Status"
                        allowClear
                        style={{ width: '100%' }}
                        value={filters.isVip === undefined ? undefined : filters.isVip ? 'vip' : 'non-vip'}
                        onChange={handleVipChange}
                    >
                        <Option value="all">All</Option>
                        <Option value="vip">VIP Only</Option>
                        <Option value="non-vip">Non-VIP</Option>
                    </Select>
                </Col>

                <Col xs={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Tag color={theme.token?.colorPrimary}>Attack Range</Tag>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            defaultValue={[0, 1000]}
                            value={[filters.minAtk || 0, filters.maxAtk || 1000]}
                            onChange={handleAtkChange}
                            style={{ marginBottom: 16 }}
                        />
                    </Space>
                </Col>

                <Col xs={24} style={{ textAlign: 'right' }}>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearFilters}
                        style={{ marginRight: 8 }}
                    >
                        Clear Filters
                    </Button>
                    <Button type="primary" onClick={() => onFilterChange(filters)}>
                        Apply Filters
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default UnitFilters;
