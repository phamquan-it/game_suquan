'use client';

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Statistic, 
    Tabs, 
    Button, 
    Space, 
    Input,
    Select,
    Tag,
    message
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined,
    ExportOutlined,
    ImportOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { BaseItem, ItemType, ItemRarity } from '@/lib/types/items';
import { getRarityColor, getRarityText, getTypeColor, getTypeText } from '@/lib/utils/item-utils';
import ItemTable from './ItemTable';
import ItemForm from './ItemForm';
import { getAllItems } from '@/lib/mocks/item-data';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

export default function ItemManagement() {
    const [items, setItems] = useState<BaseItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<BaseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedType, setSelectedType] = useState<ItemType | 'all'>('all');
    const [selectedRarity, setSelectedRarity] = useState<ItemRarity | 'all'>('all');
    const [formVisible, setFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<BaseItem | null>(null);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [items, searchText, selectedType, selectedRarity]);

    const loadItems = () => {
        setLoading(true);
        setTimeout(() => {
            setItems(getAllItems());
            setLoading(false);
        }, 1000);
    };

    const filterItems = () => {
        let filtered = items;

        if (searchText) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedType !== 'all') {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        if (selectedRarity !== 'all') {
            filtered = filtered.filter(item => item.rarity === selectedRarity);
        }

        setFilteredItems(filtered);
    };

    const handleCreateItem = () => {
        setEditingItem(null);
        setFormVisible(true);
    };

    const handleEditItem = (item: BaseItem) => {
        setEditingItem(item);
        setFormVisible(true);
    };

    const handleSaveItem = (itemData: Partial<BaseItem>) => {
        if (editingItem) {
            // Update existing item
            setItems(prev => prev.map(item => 
                item.id === editingItem.id 
                    ? { ...item, ...itemData, updatedAt: new Date().toISOString() }
                    : item
            ));
            message.success('Cập nhật vật phẩm thành công');
        } else {
            // Create new item
            const newItem: BaseItem = {
                ...itemData as BaseItem,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: `item_${Date.now()}`,
            };
            setItems(prev => [newItem, ...prev]);
            message.success('Tạo vật phẩm mới thành công');
        }
        setFormVisible(false);
    };

    const handleDeleteItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        message.success('Xóa vật phẩm thành công');
    };

    const getStats = () => {
        const totalItems = items.length;
        const activeItems = items.filter(item => item.status === 'active').length;
        const weapons = items.filter(item => item.type === 'weapon').length;
        const legendaryItems = items.filter(item => item.rarity === 'legendary').length;

        return { totalItems, activeItems, weapons, legendaryItems };
    };

    const stats = getStats();

    return (
        <div>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng Vật Phẩm"
                            value={stats.totalItems}
                            prefix="📦"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đang Hoạt Động"
                            value={stats.activeItems}
                            prefix="✅"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Vũ Khí"
                            value={stats.weapons}
                            prefix="⚔️"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Huyền Thoại"
                            value={stats.legendaryItems}
                            prefix="💎"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space size="middle">
                        <Search
                            placeholder="Tìm kiếm vật phẩm..."
                            allowClear
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            value={selectedType}
                            onChange={setSelectedType}
                            style={{ width: 150 }}
                            placeholder="Loại vật phẩm"
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="weapon">Vũ Khí</Option>
                            <Option value="armor">Giáp Trụ</Option>
                            <Option value="consumable">Tiêu Hao</Option>
                            <Option value="material">Nguyên Liệu</Option>
                            <Option value="special">Đặc Biệt</Option>
                        </Select>
                        <Select
                            value={selectedRarity}
                            onChange={setSelectedRarity}
                            style={{ width: 150 }}
                            placeholder="Độ hiếm"
                        >
                            <Option value="all">Tất cả độ hiếm</Option>
                            <Option value="common">Phổ Thông</Option>
                            <Option value="uncommon">Khá Hiếm</Option>
                            <Option value="rare">Hiếm</Option>
                            <Option value="epic">Cực Hiếm</Option>
                            <Option value="legendary">Huyền Thoại</Option>
                        </Select>
                    </Space>

                    <Space>
                        <Button 
                            icon={<ReloadOutlined />}
                            onClick={loadItems}
                            loading={loading}
                        >
                            Làm mới
                        </Button>
                        <Button 
                            icon={<ExportOutlined />}
                        >
                            Xuất file
                        </Button>
                        <Button 
                            icon={<ImportOutlined />}
                        >
                            Nhập file
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={handleCreateItem}
                        >
                            Thêm Vật Phẩm
                        </Button>
                    </Space>
                </div>

                {/* Items Table */}
                <ItemTable
                    items={filteredItems}
                    loading={loading}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                />
            </Card>

            {/* Item Form Modal */}
            <ItemForm
                visible={formVisible}
                editingItem={editingItem}
                onSave={handleSaveItem}
                onCancel={() => setFormVisible(false)}
            />
        </div>
    );
}
