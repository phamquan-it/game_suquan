// app/admin/stories/[story_id]/scenes/components/SceneTable.tsx
import { useParams, useRouter } from "next/navigation";
import { StoryCharacter, StoryScene, TYPING_STYLES } from "../../../hooks/useStoryScenes";
import Table, { ColumnsType } from "antd/es/table";
import { BranchesOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FlagOutlined, FontSizeOutlined, PictureOutlined, SoundOutlined, TagOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Empty, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
import dayjs from 'dayjs';
import StoryChoicesManagementPopup from "./scene_choise_popup";

const { Text } = Typography;

// Scene Table Component
export const SceneTable: React.FC<{
  scenes: StoryScene[];
  loading: boolean;
  onView: (scene: StoryScene) => void;
  onEdit: (scene: StoryScene) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (scenes: StoryScene[]) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: StoryScene[]) => void;
}> = ({
  scenes,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
  selectedRowKeys,
  onSelectChange,
}) => {
    const router = useRouter();
    const params = useParams();
    const storyId = params.story_id as string;

    // State for choice management popup
    const [choicePopupVisible, setChoicePopupVisible] = useState(false);
    const [selectedSceneForChoices, setSelectedSceneForChoices] = useState<StoryScene | null>(null);

    // Handle opening choice management popup
    const handleManageChoices = (record: StoryScene) => {
      setSelectedSceneForChoices(record);
      setChoicePopupVisible(true);
    };

    // Handle popup close
    const handlePopupClose = () => {
      setChoicePopupVisible(false);
      setSelectedSceneForChoices(null);
    };

    // Handle success callback
    const handlePopupSuccess = () => {
      // Refresh the scenes list if needed
      // You can pass a refresh callback from parent
    };

    const columns: ColumnsType<StoryScene> = [
      {
        title: '#',
        dataIndex: 'scene_order',
        key: 'order',
        width: 60,
        render: (order: number) => (
          <Tag color="blue" style={{ minWidth: 30, textAlign: 'center' }}>
            {order}
          </Tag>
        ),
        sorter: (a, b) => a.scene_order - b.scene_order,
      },
      {
        title: 'Dialog',
        dataIndex: 'dialog_text',
        key: 'dialog',
        ellipsis: true,
        width: 200,
        render: (text: string) => (
          <Tooltip title={text}>
            <Text ellipsis>{text}</Text>
          </Tooltip>
        ),
      },
      {
        title: 'Speaker',
        dataIndex: 'speaker',
        key: 'speaker',
        width: 120,
        render: (speaker: StoryCharacter) => (
          <Space>
            <Avatar size="small" style={{ backgroundColor: speaker?.color || '#ccc' }}>
              {speaker?.name?.[0] || '?'}
            </Avatar>
            <Text style={{ color: speaker?.color }}>{speaker?.name || 'Unknown'}</Text>
          </Space>
        ),
      },
      {
        title: 'Scene Names',
        key: 'scene_names',
        width: 150,
        render: (_: any, record: StoryScene) => (
          <Space direction="vertical" size={2}>
            {record.active_scene_name && (
              <Tag icon={<TagOutlined />} color="green">
                Active: {record.active_scene_name}
              </Tag>
            )}
            {record.failure_scene_name && (
              <Tag icon={<WarningOutlined />} color="red">
                Failure: {record.failure_scene_name}
              </Tag>
            )}
            {!record.active_scene_name && !record.failure_scene_name && (
              <Tag color="default">No scene names</Tag>
            )}
          </Space>
        ),
      },
      {
        title: 'Type',
        key: 'type',
        width: 120,
        render: (_: any, record: StoryScene) => (
          <Space direction="vertical" size={2}>
            {record.is_end_story && (
              <Tag icon={<FlagOutlined />} color="orange">
                End Story
              </Tag>
            )}
            {record.is_failed_story && (
              <Tag icon={<WarningOutlined />} color="red">
                Failed Story
              </Tag>
            )}
            {!record.is_end_story && !record.is_failed_story && (
              <Tag color="default">Normal</Tag>
            )}
          </Space>
        ),
      },
      {
        title: 'Typing',
        dataIndex: 'typing_style',
        key: 'typing_style',
        width: 100,
        render: (style: string) => {
          const styleInfo = TYPING_STYLES.find(s => s.value === style);
          return style ? (
            <Tooltip title={styleInfo?.description}>
              <Tag icon={<FontSizeOutlined />} color="cyan">
                {styleInfo?.label || style}
              </Tag>
            </Tooltip>
          ) : (
            <Tag color="default">Default</Tag>
          );
        },
      },
      {
        title: 'Background',
        dataIndex: 'background',
        key: 'background',
        width: 100,
        render: (bg: string) => (
          bg ? (
            <Tooltip title={bg}>
              <Tag icon={<PictureOutlined />} color="purple">
                {bg.split('/').pop()}
              </Tag>
            </Tooltip>
          ) : (
            <Tag color="default">None</Tag>
          )
        ),
      },
      {
        title: 'Sound',
        dataIndex: 'sound_effect',
        key: 'sound',
        width: 100,
        render: (sound: string) => (
          sound && sound !== '' ? (
            <Tooltip title={sound}>
              <Tag icon={<SoundOutlined />} color="cyan">
                {sound.split('/').pop()}
              </Tag>
            </Tooltip>
          ) : (
            <Tag color="default">None</Tag>
          )
        ),
      },
      {
        title: 'Choices',
        dataIndex: 'choices',
        key: 'choices',
        width: 80,
        render: (choices: any[]) => (
          <Badge
            count={choices?.length || 0}
            showZero
            color={choices?.length > 0 ? '#2E8B57' : '#DC143C'}
          />
        ),
      },
      {
        title: 'Created',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 120,
        render: (date: string) => dayjs(date).format('MMM D, HH:mm'),
        sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 220,
        fixed: 'right',
        render: (_: any, record: StoryScene) => (
          <Space size="small">
            <Tooltip title="Manage Choices">
              <Button
                type="primary"
                size="small"
                icon={<BranchesOutlined />}
                onClick={() => handleManageChoices(record)}
                style={{
                  backgroundColor: '#8B0000',
                  borderColor: '#8B0000',
                  minWidth: 70,
                }}
              >
                Choices
              </Button>
            </Tooltip>
            <Tooltip title="View Details">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Duplicate">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => onDuplicate(record.id)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete Scene"
                description="Are you sure you want to delete this scene?"
                onConfirm={() => onDelete(record.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    // Drag and drop reorder
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
      setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggingIndex === null || draggingIndex === index) return;

      const reorderedScenes = [...scenes];
      const [draggedItem] = reorderedScenes.splice(draggingIndex, 1);
      reorderedScenes.splice(index, 0, draggedItem);

      // Update order numbers
      const updatedScenes = reorderedScenes.map((scene, idx) => ({
        ...scene,
        scene_order: idx + 1,
      }));

      onReorder(updatedScenes);
      setDraggingIndex(index);
    };

    const handleDragEnd = () => {
      setDraggingIndex(null);
    };

    return (
      <>
        <Table
          columns={columns}
          dataSource={scenes}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} scenes`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <Empty
                description="No scenes found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          onRow={(record, index) => ({
            draggable: true,
            onDragStart: () => handleDragStart(index || 0),
            onDragOver: (e) => handleDragOver(e, index || 0),
            onDragEnd: handleDragEnd,
            style: {
              cursor: 'move',
              backgroundColor: draggingIndex === index ? '#f0f0f0' : 'transparent',
            },
          })}
        />

        {/* Choice Management Popup */}
        {selectedSceneForChoices && (
          <StoryChoicesManagementPopup
            visible={choicePopupVisible}
            sceneId={selectedSceneForChoices.id}
            storyId={storyId}
            onClose={handlePopupClose}
            onSuccess={handlePopupSuccess}
          />
        )}
      </>
    );
  };
