'use client';

import { Card, Tabs, Form, Input, InputNumber, Switch, Button, Select, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

export default function SettingsPage() {
  const [generalForm] = Form.useForm();
  const [missionForm] = Form.useForm();
  const [trainingForm] = Form.useForm();

  const handleSaveGeneral = (values: any) => {
    message.success('General settings saved successfully');
    console.log('General settings:', values);
  };

  const handleSaveMission = (values: any) => {
    message.success('Mission settings saved successfully');
    console.log('Mission settings:', values);
  };

  const handleSaveTraining = (values: any) => {
    message.success('Training settings saved successfully');
    console.log('Training settings:', values);
  };

  return (
    <div>
      <h1 style={{ color: '#8B4513', fontSize: 28, marginBottom: 24 }}>Settings</h1>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="General" key="1">
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={handleSaveGeneral}
              initialValues={{
                maxLevel: 100,
                expPerLevel: 1000,
                maxBeauties: 50,
                enableAutoRest: true,
                defaultStatus: 'available',
              }}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="maxLevel"
                label="Maximum Level"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="expPerLevel"
                label="Experience Points Per Level"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="maxBeauties"
                label="Maximum Beauties"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="defaultStatus"
                label="Default Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="available">Available</Option>
                  <Option value="resting">Resting</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="enableAutoRest"
                label="Enable Auto Rest"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: '#8B0000' }}>
                  Save General Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Mission" key="2">
            <Form
              form={missionForm}
              layout="vertical"
              onFinish={handleSaveMission}
              initialValues={{
                baseSuccessRate: 50,
                maxSuccessRate: 95,
                minSuccessRate: 10,
                missionDurationMin: 1,
                missionDurationMax: 24,
                expRewardMin: 50,
                expRewardMax: 500,
              }}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="baseSuccessRate"
                label="Base Success Rate (%)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="minSuccessRate"
                  label="Minimum Success Rate (%)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="maxSuccessRate"
                  label="Maximum Success Rate (%)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="missionDurationMin"
                  label="Min Mission Duration (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="missionDurationMax"
                  label="Max Mission Duration (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="expRewardMin"
                  label="Min EXP Reward"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="expRewardMax"
                  label="Max EXP Reward"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: '#8B0000' }}>
                  Save Mission Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Training" key="3">
            <Form
              form={trainingForm}
              layout="vertical"
              onFinish={handleSaveTraining}
              initialValues={{
                trainingSpeedBase: 1,
                trainingSpeedMax: 5,
                trainingDurationMin: 1,
                trainingDurationMax: 48,
                attributeGainMin: 1,
                attributeGainMax: 10,
              }}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="trainingSpeedBase"
                label="Base Training Speed"
                rules={[{ required: true }]}
              >
                <InputNumber min={0.1} max={10} step={0.1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="trainingSpeedMax"
                label="Max Training Speed"
                rules={[{ required: true }]}
              >
                <InputNumber min={0.1} max={10} step={0.1} style={{ width: '100%' }} />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="trainingDurationMin"
                  label="Min Training Duration (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="trainingDurationMax"
                  label="Max Training Duration (hours)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="attributeGainMin"
                  label="Min Attribute Gain"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="attributeGainMax"
                  label="Max Attribute Gain"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: '#8B0000' }}>
                  Save Training Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
