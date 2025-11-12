// components/equipment/EquipmentManager.tsx
import React, { useState } from 'react';
import { Row, Col, Tabs, Card, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Equipment, EquipmentSlot } from '@/lib/types/equipment';
import { EquipmentGrid } from './EquipmentGrid';
import { EquipmentFilters } from './EquipmentFilters';
import { EquipmentStats } from './EquipmentStats';
import { useEquipment } from '@/lib/hooks/use-equipment';

const { TabPane } = Tabs;

export const EquipmentManager: React.FC = () => {
    const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot>('weapon_main');
    const [filters, setFilters] = useState({});
    const { equipment, loading, enhanceEquipment, repairEquipment } = useEquipment();

    const slotCategories = {
        weapons: ['weapon_main', 'weapon_off'],
        armor: ['helmet', 'chest', 'gloves', 'pants', 'boots', 'shoulders'],
        accessories: ['necklace', 'ring_1', 'ring_2', 'earring_1', 'earring_2'],
        special: ['belt', 'artifact']
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
                {/* Filters Sidebar */}
                <Col xs={24} lg={6}>
                    <Card title="Bộ Lọc Trang Bị">
                        <EquipmentFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                        />
                    </Card>

                    <Card title="Thống Kê" style={{ marginTop: 16 }}>
                        <EquipmentStats equipment={equipment} />
                    </Card>
                </Col>

                {/* Main Content */}
                <Col xs={24} lg={18}>
                    <Card
                        title="Quản Lý Trang Bị"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />}>
                                Thêm Trang Bị Mới
                            </Button>
                        }
                    >
                        <Tabs
                            defaultActiveKey="weapons"
                            onChange={(key) => {
                                const firstSlot = slotCategories[key as keyof typeof slotCategories][0];
                                setSelectedSlot(firstSlot as EquipmentSlot);
                            }}
                        >
                            <TabPane tab="Vũ Khí" key="weapons">
                                <EquipmentGrid
                                    slots={slotCategories.weapons}
                                    equipment={equipment}
                                    selectedSlot={selectedSlot}
                                    onSlotSelect={setSelectedSlot}
                                    onEnhance={enhanceEquipment}
                                    onRepair={repairEquipment}
                                />
                            </TabPane>

                            <TabPane tab="Giáp" key="armor">
                                <EquipmentGrid
                                    slots={slotCategories.armor}
                                    equipment={equipment}
                                    selectedSlot={selectedSlot}
                                    onSlotSelect={setSelectedSlot}
                                    onEnhance={enhanceEquipment}
                                    onRepair={repairEquipment}
                                />
                            </TabPane>

                            <TabPane tab="Trang Sức" key="accessories">
                                <EquipmentGrid
                                    slots={slotCategories.accessories}
                                    equipment={equipment}
                                    selectedSlot={selectedSlot}
                                    onSlotSelect={setSelectedSlot}
                                    onEnhance={enhanceEquipment}
                                    onRepair={repairEquipment}
                                />
                            </TabPane>

                            <TabPane tab="Đặc Biệt" key="special">
                                <EquipmentGrid
                                    slots={slotCategories.special}
                                    equipment={equipment}
                                    selectedSlot={selectedSlot}
                                    onSlotSelect={setSelectedSlot}
                                    onEnhance={enhanceEquipment}
                                    onRepair={repairEquipment}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
