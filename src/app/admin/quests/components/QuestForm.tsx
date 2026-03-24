'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Row, Col, Button, Space, Tabs } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { validateLevelRange } from '../utils/questHelpers';
import { CreateQuestInput, Quest, QUEST_CATEGORIES, QUEST_DIFFICULTIES, QUEST_STATUSES, QUEST_TYPES } from '../types';
import { DEFAULT_QUEST_FORM } from '../types/quest.types';
import { QuestRequirements } from './QuestRequirements';
import { QuestRewards } from './QuestRewards';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface QuestFormProps {
  initialData?: Quest;
  onSubmit: (data: CreateQuestInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const QuestForm: React.FC<QuestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.setFieldsValue(DEFAULT_QUEST_FORM);
    }
  }, [initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={DEFAULT_QUEST_FORM}
      className="quest-form"
    >
      <Tabs defaultActiveKey="basic" className="quest-tabs">
        <TabPane tab="Thông tin cơ bản" key="basic">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên nhiệm vụ"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}
              >
                <Input placeholder="Nhập tên nhiệm vụ" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại nhiệm vụ"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn loại nhiệm vụ">
                  {QUEST_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
              >
                <TextArea rows={4} placeholder="Nhập mô tả nhiệm vụ" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn danh mục">
                  {QUEST_CATEGORIES.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="Độ khó"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn độ khó">
                  {QUEST_DIFFICULTIES.map(diff => (
                    <Option key={diff} value={diff}>{diff}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn trạng thái">
                  {QUEST_STATUSES.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="min_level"
                label="Cấp độ tối thiểu"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="max_level"
                label="Cấp độ tối đa"
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || validateLevelRange(getFieldValue('min_level'), value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Cấp độ tối đa phải lớn hơn cấp độ tối thiểu'));
                    },
                  }),
                ]}
              >
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="completion_limit"
                label="Giới hạn hoàn thành"
                tooltip="Để trống nếu không giới hạn"
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        </TabPane>

        {initialData && (
          <>
            <TabPane tab="Yêu cầu" key="requirements">
              <QuestRequirements questId={initialData.id} />
            </TabPane>

            <TabPane tab="Phần thưởng" key="rewards">
              <QuestRewards questId={initialData.id} />
            </TabPane>
          </>
        )}
      </Tabs>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Space>
          <Button 
            icon={<CloseOutlined />} 
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            className="bg-imperialRed hover:bg-imperialRed-dark"
          >
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Space>
      </div>
    </Form>
  );
};
