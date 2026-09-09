import Card from "antd/es/card";
import { StoryCharacter, TYPING_STYLES } from "../../../hooks/useStoryScenes";
import Row from "antd/es/row";
import { Col } from "antd/es/grid";
import Input from "antd/es/input/Input";
import { DeleteOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Select from "antd/es/select";
import { useState } from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
const { Option } = Select
// Scene Filters Component
export const SceneFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  availableCharacters: StoryCharacter[];
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  availableCharacters,
  onBulkDelete,
  selectedRowKeys,
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={6}>
            <Input
              placeholder="Search dialog, background, scene names..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
              size="middle"
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Speaker"
              style={{ width: '100%' }}
              value={filters.speakerId}
              onChange={(value) => setFilters({ ...filters, speakerId: value })}
              allowClear
              size="middle"
            >
              {availableCharacters.map((char) => (
                <Option key={char.id} value={char.id}>
                  <Space>
                    <span style={{ color: char.color }}>●</span>
                    {char.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={3}>
            <Select
              placeholder="Has Choices"
              style={{ width: '100%' }}
              value={filters.hasChoices}
              onChange={(value) => setFilters({ ...filters, hasChoices: value })}
              allowClear
              size="middle"
            >
              <Option value={true}>With Choices</Option>
              <Option value={false}>Without Choices</Option>
            </Select>
          </Col>
          <Col xs={12} md={3}>
            <Select
              placeholder="End Story"
              style={{ width: '100%' }}
              value={filters.isEndStory}
              onChange={(value) => setFilters({ ...filters, isEndStory: value })}
              allowClear
              size="middle"
            >
              <Option value={true}>Is End Story</Option>
              <Option value={false}>Not End Story</Option>
            </Select>
          </Col>
          <Col xs={12} md={3}>
            <Select
              placeholder="Failed Story"
              style={{ width: '100%' }}
              value={filters.isFailedStory}
              onChange={(value) => setFilters({ ...filters, isFailedStory: value })}
              allowClear
              size="middle"
            >
              <Option value={true}>Is Failed Story</Option>
              <Option value={false}>Not Failed Story</Option>
            </Select>
          </Col>
          <Col xs={24} md={5}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Tooltip title="Toggle Advanced Filters">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  type={showAdvancedFilters ? 'primary' : 'default'}
                />
              </Tooltip>
              <Tooltip title="Refresh">
                <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
              </Tooltip>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title="Delete Selected Scenes"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} scenes?`}
                  onConfirm={onBulkDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
                Add Scene
              </Button>
            </Space>
          </Col>
        </Row>

        {showAdvancedFilters && (
          <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
            <Col xs={24} md={6}>
              <Select
                placeholder="Typing Style"
                style={{ width: '100%' }}
                value={filters.typingStyle}
                onChange={(value) => setFilters({ ...filters, typingStyle: value })}
                allowClear
                size="middle"
              >
                {TYPING_STYLES.map((style) => (
                  <Option key={style.value} value={style.value}>
                    {style.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={3}>
              <Select
                placeholder="Has Active Scene Name"
                style={{ width: '100%' }}
                value={filters.hasActiveSceneName}
                onChange={(value) => setFilters({ ...filters, hasActiveSceneName: value })}
                allowClear
                size="middle"
              >
                <Option value={true}>Has Active Scene Name</Option>
                <Option value={false}>No Active Scene Name</Option>
              </Select>
            </Col>
            <Col xs={12} md={3}>
              <Select
                placeholder="Has Failure Scene Name"
                style={{ width: '100%' }}
                value={filters.hasFailureSceneName}
                onChange={(value) => setFilters({ ...filters, hasFailureSceneName: value })}
                allowClear
                size="middle"
              >
                <Option value={true}>Has Failure Scene Name</Option>
                <Option value={false}>No Failure Scene Name</Option>
              </Select>
            </Col>
            <Col xs={12} md={3}>
              <Select
                placeholder="Background"
                style={{ width: '100%' }}
                value={filters.hasBackground}
                onChange={(value) => setFilters({ ...filters, hasBackground: value })}
                allowClear
                size="middle"
              >
                <Option value={true}>Has Background</Option>
                <Option value={false}>No Background</Option>
              </Select>
            </Col>
            <Col xs={12} md={3}>
              <Select
                placeholder="Sound Effect"
                style={{ width: '100%' }}
                value={filters.hasSoundEffect}
                onChange={(value) => setFilters({ ...filters, hasSoundEffect: value })}
                allowClear
                size="middle"
              >
                <Option value={true}>Has Sound</Option>
                <Option value={false}>No Sound</Option>
              </Select>
            </Col>
          </Row>
        )}
      </Card>
    );
  };
