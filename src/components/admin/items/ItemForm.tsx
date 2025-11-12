'use client';

import React, { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Switch,
    Row,
    Col,
    Space,
    Tag
} from 'antd';
import { BaseItem, ItemType, ItemRarity, ItemQuality } from '@/lib/types/items';
import { getRarityColor, getRarityText, getTypeColor, getTypeText } from '@/lib/utils/item-utils';

const { Option } = Select;
const { TextArea } = Input;

interface ItemFormProps {
    visible: boolean;
    editingItem: BaseItem | null;
    onSave: (item: Partial<BaseItem>) => void;
    onCancel: () => void;
}

export default function ItemForm({ visible, editingItem, onSave, onCancel }: ItemFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (editingItem) {
                form.setFieldsValue(editingItem);
            } else {
                form.resetFields();
                form.setFieldsValue({
                    rarity: 'common',
                    quality: 'normal',
                    type: 'weapon',
                    stackable: true,
                    maxStack: 1,
                    baseValue: 100,
                    isTradable: true,
                    isSellable: true,
                    isDestroyable: true,
                    isQuestItem: false,
                    status: 'active',
                    levelRequirement: 1
                });
            }
        }
    }, [visible, editingItem, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSave(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const itemTypes: ItemType[] = ['weapon', 'armor', 'consumable', 'material', 'quest', 'special', 'currency'];
    const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    const qualities: ItemQuality[] = ['broken', 'damaged', 'normal', 'good', 'excellent', 'perfect'];

    return (
        <Modal
            title={editingItem ? `Chỉnh sửa: ${editingItem.name}` : 'Tạo Vật Phẩm Mới'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            width={800}
            okText={editingItem ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                name="itemForm"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Tên Vật Phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên vật phẩm' }]}
                        >
                            <Input placeholder="Nhập tên vật phẩm" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="icon"
                            label="Biểu Tượng"
                            rules={[{ required: true, message: 'Vui lòng nhập biểu tượng' }]}
                        >
                            <Input placeholder="Nhập biểu tượng (emoji)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Mô Tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập mô tả chi tiết về vật phẩm"
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="type"
                            label="Loại Vật Phẩm"
                            rules={[{ required: true, message: 'Vui lòng chọn loại vật phẩm' }]}
                        >
                            <Select placeholder="Chọn loại">
                                {itemTypes.map(type => (
                                    <Option key={type} value={type}>
                                        <Space>
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: getTypeColor(type)
                                                }}
                                            />
                                            {getTypeText(type)}
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="rarity"
                            label="Độ Hiếm"
                            rules={[{ required: true, message: 'Vui lòng chọn độ hiếm' }]}
                        >
                            <Select placeholder="Chọn độ hiếm">
                                {rarities.map(rarity => (
                                    <Option key={rarity} value={rarity}>
                                        <Space>
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: getRarityColor(rarity)
                                                }}
                                            />
                                            {getRarityText(rarity)}
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="quality"
                            label="Chất Lượng"
                            rules={[{ required: true, message: 'Vui lòng chọn chất lượng' }]}
                        >
                            <Select placeholder="Chọn chất lượng">
                                {qualities.map(quality => (
                                    <Option key={quality} value={quality}>
                                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="levelRequirement"
                            label="Cấp Yêu Cầu"
                            rules={[{ required: true, message: 'Vui lòng nhập cấp yêu cầu' }]}
                        >
                            <InputNumber
                                min={1}
                                max={100}
                                style={{ width: '100%' }}
                                placeholder="Cấp độ"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="baseValue"
                            label="Giá Trị Cơ Bản"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
                                placeholder="Giá vàng"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="maxStack"
                            label="Số Lượng Tối Đa"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tối đa' }]}
                        >
                            <InputNumber
                                min={1}
                                max={9999}
                                style={{ width: '100%' }}
                                placeholder="Số lượng"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="status"
                            label="Trạng Thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="active">Hoạt động</Option>
                                <Option value="inactive">Ngừng hoạt động</Option>
                                <Option value="testing">Đang thử nghiệm</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="stackable"
                            label="Có thể xếp chồng"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="isTradable"
                            label="Có thể giao dịch"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="isSellable"
                            label="Có thể bán"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="isDestroyable"
                            label="Có thể phá hủy"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="isQuestItem"
                    label="Vật phẩm nhiệm vụ"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}
