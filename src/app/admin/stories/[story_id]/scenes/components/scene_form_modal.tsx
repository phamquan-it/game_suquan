import { Alert, Col, Form, Input, Modal, Row, Select, Space, Switch, Tooltip } from "antd";
import { StoryCharacter, StoryScene, TYPING_STYLES } from "../../../hooks/useStoryScenes";
import { useEffect } from "react";
import { EditOutlined, FlagOutlined, PlusOutlined, QuestionCircleOutlined, WarningOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

// Scene Form Modal
export const SceneFormModal: React.FC<{
  visible: boolean;
  storyId: string;
  editingScene: StoryScene | null;
  loading: boolean;
  characters: StoryCharacter[];
  existingScenes: StoryScene[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ visible, storyId, editingScene, loading, characters, existingScenes, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingScene) {
      form.setFieldsValue({
        ...editingScene,
        speaker_id: editingScene.speaker_id,
        is_end_story: editingScene.is_end_story || false,
        is_failed_story: editingScene.is_failed_story || false,
        active_scene_name: editingScene.active_scene_name || null,
        failure_scene_name: editingScene.failure_scene_name || null,
        typing_style: editingScene.typing_style || null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        story_id: storyId,
        scene_order: existingScenes.length + 1,
        sound_effect: '',
        background: null,
        is_end_story: false,
        is_failed_story: false,
        active_scene_name: null,
        failure_scene_name: null,
        typing_style: null,
      });
    }
  }, [editingScene, storyId, existingScenes.length, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {editingScene ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingScene ? 'Edit Scene' : 'Add New Scene'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText={editingScene ? 'Update' : 'Create'}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="story_id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="scene_order"
              label="Scene Order"
              rules={[
                { required: true, message: 'Enter scene order' },
                { type: 'number', min: 1, message: 'Order must be at least 1' },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="speaker_id"
              label="Speaker"
              rules={[{ required: true, message: 'Select speaker' }]}
            >
              <Select
                placeholder="Select character"
                options={characters.map((char) => ({
                  label: (
                    <Space>
                      <span style={{ color: char.color }}>●</span>
                      {char.name}
                    </Space>
                  ),
                  value: char.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="typing_style"
              label="Typing Style"
            >

              <Select
                placeholder="Select typing style"
                allowClear
                options={TYPING_STYLES.map((style) => ({
                  label: (
                    <Tooltip title={style.description}>
                      {style.label}
                    </Tooltip>
                  ),
                  value: style.value,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="dialog_text"
          label="Dialog Text"
          rules={[
            { required: true, message: 'Enter dialog text' },
            { max: 1000, message: 'Dialog must be less than 1000 characters' },
          ]}
        >
          <TextArea
            placeholder="Enter the dialog text"
            rows={3}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="background"
              label="Background"
            >
              <Input placeholder="Background image path or URL" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sound_effect"
              label="Sound Effect"
            >
              <Input placeholder="Sound effect path or URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="active_scene_name"
              label="Active Scene Name"
              tooltip="Name displayed when scene is active"
            >
              <Input placeholder="e.g., 'Tense Standoff', 'Peaceful Garden'" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="failure_scene_name"
              label="Failure Scene Name"
              tooltip="Name displayed when scene fails"
            >
              <Input placeholder="e.g., 'Battle Lost', 'Mission Failed'" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="is_end_story"
              label="End Story Scene"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={<FlagOutlined />}
                unCheckedChildren="Normal"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="is_failed_story"
              label="Failed Story Scene"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={<WarningOutlined />}
                unCheckedChildren="Normal"
              />
            </Form.Item>
          </Col>
        </Row>

        <Alert
          message="Note"
          description="You can add choices to this scene after creating it. End Story and Failed Story scenes typically have no choices."
          type="info"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};


