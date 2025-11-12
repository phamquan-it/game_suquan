'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Slider, Button, Space, Collapse, Drawer } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAlliances } from '@/lib/hooks/useAlliances';

const { Search } = Input;
const { Panel } = Collapse;

export default function PlayerFilters() {
    const [form] = Form.useForm();
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [activeKeys, setActiveKeys] = useState<string[]>(['1']);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Load filters từ URL khi component mount hoặc URL thay đổi
    useEffect(() => {
        const urlFilters = parseUrlFilters(searchParams);
        form.setFieldsValue(urlFilters);

    }, [searchParams, form]);

    // Parse filters từ URL search params
    const parseUrlFilters = (params: URLSearchParams) => {
        const filters: any = {};

        // Xử lý các params đơn
        const singleParams = [
            'search', 'status', 'alliance', 'country', 'specialization',
            'title', 'violations_level', 'account_status'
        ];

        singleParams.forEach(key => {
            const value = params.get(key);
            if (value) filters[key] = value;
        });

        // Xử lý range params
        const rangeParams = ['level', 'power', 'win_rate', 'victory_points', 'territory', 'battles'];

        rangeParams.forEach(key => {
            const min = params.get(`${key}_min`);
            const max = params.get(`${key}_max`);

            if (min !== null || max !== null) {
                filters[key] = [
                    min ? Number(min) : getDefaultRangeMin(key),
                    max ? Number(max) : getDefaultRangeMax(key)
                ];
            }
        });

        return filters;
    };

    const getDefaultRangeMin = (key: string) => {
        const defaults: any = {
            level: 1,
            power: 0,
            win_rate: 0,
            victory_points: 0,
            territory: 0,
            battles: 0
        };
        return defaults[key] || 0;
    };

    const getDefaultRangeMax = (key: string) => {
        const defaults: any = {
            level: 100,
            power: 5000000,
            win_rate: 100,
            victory_points: 10000,
            territory: 100,
            battles: 10000
        };
        return defaults[key] || 100;
    };

    // Cập nhật URL khi filters thay đổi
    const handleValuesChange = (_: any, allValues: any) => {
        const filters = buildFilters(allValues);
        updateUrl(filters);
    };

    const buildFilters = (allValues: any) => {
        const filters: any = {};

        Object.entries(allValues).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || (value as any).length === 0) {
                return;
            }

            if (Array.isArray(value)) {
                // Xử lý range values
                if (value[0] !== undefined && value[0] !== null) {
                    filters[`${key}_min`] = value[0];
                }
                if (value[1] !== undefined && value[1] !== null) {
                    filters[`${key}_max`] = value[1];
                }
            } else {
                filters[key] = value;
            }
        });

        return filters;
    };

    const updateUrl = (filters: any) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, value.toString());
            }
        });

        const newUrl = `${pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const handleReset = () => {
        form.resetFields();
        router.push(pathname);
    };

    const { data: allianceOptions } = useAlliances();

   

    const statusOptions = [
        { value: 'online', label: '🟢 Đang online' },
        { value: 'offline', label: '⚫ Offline' },
        { value: 'banned', label: '🔴 Bị cấm' },
        { value: 'suspended', label: '🟡 Tạm ngưng' },
    ];

    const specializationOptions = [
        { value: 'warrior', label: 'Chiến binh' },
        { value: 'archer', label: 'Cung thủ' },
        { value: 'mage', label: 'Pháp sư' },
        { value: 'assassin', label: 'Sát thủ' },
        { value: 'support', label: 'Hỗ trợ' },
        { value: 'tank', label: 'TanK' },
    ];

    const violationsOptions = [
        { value: '0', label: 'Không vi phạm' },
        { value: '1-2', label: 'Nhẹ (1-2 lần)' },
        { value: '3-5', label: 'Trung bình (3-5 lần)' },
        { value: '6+', label: 'Nặng (6+ lần)' },
    ];

    const MoreFiltersDrawer = () => (
        <Drawer
            title="Bộ Lọc Nâng Cao"
            placement="right"
            onClose={() => setShowMoreFilters(false)}
            open={showMoreFilters}
            width={400}
            footer={
                <Button type="primary" onClick={() => setShowMoreFilters(false)}>
                    Áp dụng
                </Button>
            }
        >
            <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
                <Collapse
                    activeKey={activeKeys}
                    onChange={setActiveKeys}
                    ghost
                >
                    <Panel header="Thông Tin Cá Nhân" key="1">
                        <Form.Item label="Chuyên môn" name="specialization">
                            <Select
                                placeholder="Tất cả chuyên môn"
                                allowClear
                                options={specializationOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Quốc gia" name="country">
                            <Select
                                placeholder="Tất cả quốc gia"
                                allowClear
                                options={[
                                    { value: 'VN', label: 'Việt Nam' },
                                    { value: 'US', label: 'Mỹ' },
                                    { value: 'CN', label: 'Trung Quốc' },
                                    { value: 'JP', label: 'Nhật Bản' },
                                    { value: 'KR', label: 'Hàn Quốc' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="Danh hiệu" name="title">
                            <Select
                                placeholder="Tất cả danh hiệu"
                                allowClear
                                options={[
                                    { value: 'newbie', label: 'Tân thủ' },
                                    { value: 'warrior', label: 'Chiến binh' },
                                    { value: 'elite', label: 'Tinh nhuệ' },
                                    { value: 'master', label: 'Bậc thầy' },
                                    { value: 'legend', label: 'Huyền thoại' },
                                ]}
                            />
                        </Form.Item>
                    </Panel>

                    <Panel header="Thống Kê Chiến Đấu" key="2">
                        <Form.Item label="Điểm chiến thắng" name="victory_points">
                            <Slider
                                range
                                min={0}
                                max={10000}
                                step={100}
                                marks={{
                                    0: '0',
                                    5000: '5K',
                                    10000: '10K'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Lãnh thổ" name="territory">
                            <Slider
                                range
                                min={0}
                                max={100}
                                marks={{
                                    0: '0',
                                    50: '50',
                                    100: '100'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Số trận đấu" name="battles">
                            <Slider
                                range
                                min={0}
                                max={10000}
                                step={100}
                                marks={{
                                    0: '0',
                                    5000: '5K',
                                    10000: '10K'
                                }}
                            />
                        </Form.Item>
                    </Panel>

                    <Panel header="Hành Vi & Vi Phạm" key="3">
                        <Form.Item label="Mức độ vi phạm" name="violations_level">
                            <Select
                                placeholder="Tất cả mức độ"
                                allowClear
                                options={violationsOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Trạng thái tài khoản" name="account_status">
                            <Select
                                placeholder="Tất cả trạng thái"
                                allowClear
                                options={[
                                    { value: 'active', label: 'Đang hoạt động' },
                                    { value: 'inactive', label: 'Không hoạt động' },
                                    { value: 'warning', label: 'Cảnh báo' },
                                ]}
                            />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        </Drawer>
    );

    return (
        <>
            <Card
                title={
                    <Space>
                        <FilterOutlined />
                        Bộ Lọc Sứ Quân
                    </Space>
                }
                style={{ marginBottom: 16 }}
                extra={
                    <Space>
                        <Button
                            type="dashed"
                            icon={showMoreFilters ? <MinusOutlined /> : <PlusOutlined />}
                            onClick={() => setShowMoreFilters(!showMoreFilters)}
                        >
                            More Filters
                        </Button>
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                        >
                            Đặt lại
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleValuesChange}
                >
                    {/* Search - Luôn hiển thị */}
                    <Form.Item name="search">
                        <Search
                            placeholder="Tìm theo tên người dùng, email..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {/* Các filter quan trọng - Luôn hiển thị */}
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                placeholder="Tất cả trạng thái"
                                allowClear
                                options={statusOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Liên minh" name="alliance">
                            <Select
                                placeholder="Tất cả liên minh"
                                allowClear
                                options={allianceOptions?.map((al)=>({ value: al.id, label: al.name  }))}
                            />
                        </Form.Item>

                        {/* Sliders quan trọng - Luôn hiển thị */}
                        <Form.Item label="Cấp độ" name="level">
                            <Slider
                                range
                                min={1}
                                max={100}
                                marks={{
                                    1: '1',
                                    50: '50',
                                    100: '100'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Sức mạnh" name="power">
                            <Slider
                                range
                                min={0}
                                max={5000000}
                                step={100000}
                                marks={{
                                    0: '0',
                                    2500000: '2.5M',
                                    5000000: '5M'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label="Tỷ lệ thắng (%)" name="win_rate">
                            <Slider
                                range
                                min={0}
                                max={100}
                                marks={{
                                    0: '0%',
                                    50: '50%',
                                    100: '100%'
                                }}
                            />
                        </Form.Item>
                    </Space>
                </Form>
            </Card>

            <MoreFiltersDrawer />
        </>
    );
}
