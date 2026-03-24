'use client';

import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tabs,
  Space,
  Button,
  Typography,
  Switch,
  Row,
  Col,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { GeneralWithRelations } from '../types/general.types';
import { useCreateGeneral, useUpdateGeneral } from '../hooks/useGeneralMutations';
import GeneralSkillsTab from './GeneralSkillsTab';

const { Text } = Typography;
const { Option } = Select;

interface GeneralFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: GeneralWithRelations | null;
  mode: 'create' | 'edit';
}

const GeneralForm: React.FC<GeneralFormProps> = ({
  open,
  onClose,
  initialData,
  mode,
}) => {
  const [form] = Form.useForm();
  const createGeneral = useCreateGeneral();
  const updateGeneral = useUpdateGeneral();

  useEffect(() => {
    if (initialData && mode === 'edit') {
      form.setFieldsValue({
        id: initialData.id,
        name: initialData.name,
        title: initialData.title,
        rarity: initialData.rarity,
        element: initialData.element,
        type: initialData.type,
        level: initialData.level,
        max_level: initialData.max_level,
        base_attack: initialData.base_attack,
        base_defense: initialData.base_defense,
        base_health: initialData.base_health,
        base_speed: initialData.base_speed,
        base_intelligence: initialData.base_intelligence,
        base_leadership: initialData.base_leadership,
        current_attack: initialData.current_attack,
        current_defense: initialData.current_defense,
        current_health: initialData.current_health,
        current_speed: initialData.current_speed,
        current_intelligence: initialData.current_intelligence,
        current_leadership: initialData.current_leadership,
        status: initialData.status,
        experience: initialData.experience,
        required_exp: initialData.required_exp,
        star_level: initialData.star_level,
        max_star_level: initialData.max_star_level,
        awakening_level: initialData.awakening_level,
        bond_level: initialData.bond_level,
        favorite: initialData.favorite,
        is_vip: initialData.is_vip,
        description: initialData.description,
        voice_actor: initialData.voice_actor,
        biography: initialData.biography,
        image: initialData.image,
        thumbnail: initialData.thumbnail,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        level: 1,
        max_level: 100,
        star_level: 1,
        max_star_level: 5,
        awakening_level: 0,
        bond_level: 0,
        experience: 0,
        required_exp: 100,
        favorite: false,
        is_vip: false,
        status: 'active',
      });
    }
  }, [initialData, mode, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await createGeneral.mutateAsync(values);
      } else if (initialData) {
        await updateGeneral.mutateAsync({
          id: initialData.id,
          data: values,
        });
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const items = [
    {
      key: 'basic',
      label: 'Thông tin cơ bản',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id"
                label="ID Tướng"
                rules={[{ required: true, message: 'Vui lòng nhập ID' }]}
              >
                <Input
                  placeholder="VD: general_001"
                  disabled={mode === 'edit'}
                  style={{ textTransform: 'lowercase' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên tướng"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Nhập tên tướng" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Danh hiệu">
                <Input placeholder="VD: Bá chủ chiến trường" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rarity" label="Độ hiếm" rules={[{ required: true }]}>
                <Select>
                  <Option value="common">Thường</Option>
                  <Option value="rare">Hiếm</Option>
                  <Option value="epic">Sử thi</Option>
                  <Option value="legendary">Huyền thoại</Option>
                  <Option value="mythic">Thần thoại</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="element" label="Nguyên tố" rules={[{ required: true }]}>
                <Select>
                  <Option value="fire">Hỏa</Option>
                  <Option value="water">Thủy</Option>
                  <Option value="earth">Thổ</Option>
                  <Option value="wind">Phong</Option>
                  <Option value="light">Quang</Option>
                  <Option value="dark">Ám</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="Loại tướng" rules={[{ required: true }]}>
                <Select>
                  <Option value="infantry">Bộ binh</Option>
                  <Option value="cavalry">Kỵ binh</Option>
                  <Option value="archer">Cung thủ</Option>
                  <Option value="siege">Công thành</Option>
                  <Option value="defense">Phòng thủ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Option value="active">Sẵn sàng</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="training">Đang huấn luyện</Option>
                  <Option value="deployed">Đang triển khai</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="favorite" valuePropName="checked" label="Yêu thích">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_vip" valuePropName="checked" label="VIP">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="biography" label="Tiểu sử">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="voice_actor" label="Lồng tiếng">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="image" label="URL ảnh">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="thumbnail" label="URL thumbnail">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: 'stats',
      label: 'Chỉ số',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="level" label="Cấp độ" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="max_level" label="Cấp tối đa" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="star_level" label="Số sao" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="max_star_level" label="Sao tối đa">
                <InputNumber min={1} max={5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="awakening_level" label="Cấp thức tỉnh">
                <InputNumber min={0} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bond_level" label="Cấp liên kết">
                <InputNumber min={0} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="experience" label="Kinh nghiệm">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="required_exp" label="Kinh nghiệm cần">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>Chỉ số cơ bản</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="base_attack" label="Tấn công cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="base_defense" label="Phòng thủ cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="base_health" label="Máu cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="base_speed" label="Tốc độ cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="base_intelligence" label="Thông minh cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="base_leadership" label="Lãnh đạo cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>Chỉ số hiện tại</Typography.Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="current_attack" label="Tấn công hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="current_defense" label="Phòng thủ hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="current_health" label="Máu hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="current_speed" label="Tốc độ hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="current_intelligence" label="Thông minh hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="current_leadership" label="Lãnh đạo hiện tại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: 'skills',
      label: 'Kỹ năng',
      children: initialData && <GeneralSkillsTab generalId={initialData.id} />,
      disabled: !initialData || mode === 'create',
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <Text strong style={{ color: '#8B4513', fontSize: 18 }}>
            {mode === 'create' ? 'Thêm tướng mới' : 'Chỉnh sửa tướng'}
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '20px 0',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Tabs
          items={items}
          type="card"
          style={{ marginBottom: 20 }}
        />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={createGeneral.isPending || updateGeneral.isPending}
            style={{
              background: '#8B0000',
            }}
          >
            {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default GeneralForm;
