// app/admin/units/components/UnitForm.tsx
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
  Upload,
  message,
  Button,
  Alert,
} from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { CreateUnitDTO, Unit, UnitRank, UnitType } from '../types';
import { supabase } from '@/utils/supabase/client';

const { Option } = Select;
const { TextArea } = Input;

interface UnitFormProps {
  visible: boolean;
  unit: Unit | null;
  onCancel: () => void;
  onSubmit: (values: CreateUnitDTO) => void;
  loading: boolean;
}

const UnitForm: React.FC<UnitFormProps> = ({
  visible,
  unit,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const [idChecking, setIdChecking] = React.useState(false);
  const [idAvailable, setIdAvailable] = React.useState<boolean | null>(null);

  const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archer', 'siege', 'mythical', 'legendary'];
  const unitRanks: UnitRank[] = ['regular', 'elite', 'champion', 'legendary', 'mythic'];

  useEffect(() => {
    if (visible) {
      if (unit) {
        // Editing existing unit
        form.setFieldsValue({
          id: unit.id,
          name: unit.name,
          type: unit.type,
          description: unit.description,
          maxHp: unit.maxHp,
          currentHp: unit.currentHp,
          atk: unit.atk,
          def: unit.def,
          speed: unit.speed,
          range: unit.range,
          level: unit.level,
          quantity: unit.quantity,
          isVip: unit.isVip,
          rank: unit.rank,
          isSpecial: unit.isSpecial,
          imagePath: unit.imagePath,
        });
        setIdAvailable(true); // Existing ID is always available for its own record
      } else {
        // Creating new unit - reset form
        form.resetFields();
        form.setFieldsValue({
          level: 1,
          quantity: 1,
          range: 1,
          isVip: false,
          isSpecial: false,
          rank: 'regular',
        });
        setIdAvailable(null);
      }
    }
  }, [visible, unit, form]);

  // Check if ID is available (for new units only)
  const checkIdAvailability = async (id: string) => {
    if (!id || id.trim() === '' || unit) {
      setIdAvailable(null);
      return;
    }

    setIdChecking(true);
    try {
      const { data, error } = await supabase
        .from('units')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      // If no data found, ID is available
      setIdAvailable(!data);
    } catch (error) {
      console.error('Error checking ID:', error);
      setIdAvailable(null);
    } finally {
      setIdChecking(false);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    form.setFieldValue('id', id);

    // Debounce ID check
    const timeoutId = setTimeout(() => {
      checkIdAvailability(id);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Custom validator for ID field
  const validateId = async (_: any, value: string) => {
    if (!unit) {
      // For new units
      if (!value || value.trim() === '') {
        return Promise.reject(new Error('Please enter a unit ID'));
      }

      // Check format (alphanumeric and underscores only, 3-50 chars)
      const idRegex = /^[a-zA-Z0-9_]{3,50}$/;
      if (!idRegex.test(value)) {
        return Promise.reject(new Error('ID must be 3-50 characters and can only contain letters, numbers, and underscores'));
      }

      // Check availability
      if (idAvailable === false) {
        return Promise.reject(new Error('This ID is already taken. Please choose another one.'));
      }

      if (idChecking) {
        return Promise.reject(new Error('Checking ID availability...'));
      }
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={unit ? 'Edit Unit' : 'Create New Unit'}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 20 }}
      >
        <Row gutter={16}>
          {/* ID Field - Only shown for new units, hidden for editing */}
          {!unit && (
            <>
              <Col span={24}>
                <Form.Item
                  name="id"
                  label={
                    <Space>
                      <span>Unit ID</span>
                      <InfoCircleOutlined style={{ color: '#999' }} />
                    </Space>
                  }
                  rules={[{ validator: validateId }]}
                  tooltip="Unique identifier for the unit. Use lowercase letters, numbers, and underscores only."
                  hasFeedback
                  validateStatus={
                    idChecking ? 'validating' :
                      idAvailable === true ? 'success' :
                        idAvailable === false ? 'error' : undefined
                  }
                >
                  <Input
                    placeholder="e.g., infantry_swordsman_01"
                    onChange={handleIdChange}
                    disabled={!!unit}
                  />
                </Form.Item>
              </Col>

              {/* ID Suggestions */}
              <Col span={24}>
                <Alert
                  message="ID Suggestions"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li>Use format: type_name_number (e.g., infantry_swordsman_01)</li>
                      <li>Only lowercase letters, numbers, and underscores</li>
                      <li>3-50 characters long</li>
                      <li>Must be unique across all units</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              </Col>
            </>
          )}

          <Col span={12}>
            <Form.Item
              name="name"
              label="Unit Name"
              rules={[{ required: true, message: 'Please input unit name!' }]}
            >
              <Input placeholder="Enter unit name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="type"
              label="Unit Type"
              rules={[{ required: true, message: 'Please select unit type!' }]}
            >
              <Select placeholder="Select type">
                {unitTypes.map(type => (
                  <Option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Description">
              <TextArea rows={3} placeholder="Enter unit description" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="imagePath" label="Unit Image">
              <Upload
                beforeUpload={() => { }}
                maxCount={1}
                accept="image/*"
                listType="picture-card"
                showUploadList={{ showPreviewIcon: true }}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="maxHp"
              label="Max HP"
              rules={[{ required: true, message: 'Required!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="currentHp"
              label="Current HP"
              rules={[{ required: true, message: 'Required!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="atk"
              label="Attack"
              rules={[{ required: true, message: 'Required!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="def"
              label="Defense"
              rules={[{ required: true, message: 'Required!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="speed"
              label="Speed"
              rules={[{ required: true, message: 'Required!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="range" label="Range">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="level" label="Level">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="quantity" label="Quantity">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="rank" label="Rank">
              <Select>
                {unitRanks.map(rank => (
                  <Option key={rank} value={rank}>
                    {rank.charAt(0).toUpperCase() + rank.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="isVip" label="VIP Unit" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="isSpecial" label="Special Unit" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!unit && idAvailable === false}
              >
                {unit ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UnitForm;
