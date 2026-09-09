import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  Space,
  Button,
  Row,
  Col,
  Tag,
  Tooltip,
  message,
  Timeline,
  Divider,
  Alert,
} from 'antd';
import {
  BranchesOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useStoryChoices } from '../../../hooks/useStoryChoices';
import { useStoryScene } from '../../../hooks/useStoryScene';
import { StoryChoicesManagementProps } from './types';
import { ChoiceFilters } from './ChoiceFilters';
import { ChoiceTable } from './ChoiceTable';
import { ChoiceDetailDrawer } from './ChoiceDetailDrawer';
import { ChoiceFormModal } from './ChoiceFormModal';
import { Typography } from 'antd';

const { Text } = Typography;

export const StoryChoicesManagementPopup: React.FC<StoryChoicesManagementProps> = ({
  visible,
  sceneId,
  storyId,
  onClose,
  onSuccess,
}) => {
  const {
    choices,
    loading,
    filters,
    setFilters,
    stats,
    availableScenes,
    availableBosses,
    availableQuests,
    createChoice,
    updateChoice,
    deleteChoice,
    deleteChoices,
    validateChoiceChain,
    duplicateChoice,
    reorderChoices,
    fetchChoiceDetails,
    exportChoices,
    refresh,
    clearFilters,
  } = useStoryChoices({ sceneId });

  const { scene, loading: sceneLoading, fetchScene } = useStoryScene(sceneId);

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingChoice, setEditingChoice] = useState<any>(null);
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [validationResults, setValidationResults] = useState<Map<string, { valid: boolean; message: string }>>(new Map());

  // Load scene details when popup opens
  useEffect(() => {
    if (visible && sceneId) {
      fetchScene();
      refresh();
    }
  }, [visible, sceneId, fetchScene, refresh]);

  // Clear filters when popup closes
  useEffect(() => {
    if (!visible) {
      clearFilters();
      setSelectedRowKeys([]);
      setValidationResults(new Map());
    }
  }, [visible, clearFilters]);

  // Handlers
  const handleAddNew = () => {
    setEditingChoice(null);
    setFormModalVisible(true);
  };

  const handleEdit = (choice: any) => {
    setEditingChoice(choice);
    setFormModalVisible(true);
  };

  const handleView = async (choice: any) => {
    const details = await fetchChoiceDetails(choice.id);
    setSelectedChoice(details || choice);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteChoice(id);
    if (onSuccess) onSuccess();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateChoice(id);
    if (onSuccess) onSuccess();
  };

  const handleReorder = async (reorderedChoices: any[]) => {
    const ids = reorderedChoices.map(choice => choice.id);
    await reorderChoices(ids);
    if (onSuccess) onSuccess();
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteChoices(ids);
    setSelectedRowKeys([]);
    if (onSuccess) onSuccess();
  };

  const handleChoiceSubmit = async (data: any) => {
    if (editingChoice) {
      await updateChoice(editingChoice.id, data);
    } else {
      await createChoice(data);
    }
    setFormModalVisible(false);
    setEditingChoice(null);
    if (onSuccess) onSuccess();
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedChoice(null);
  };

  const handleExport = async () => {
    const data = await exportChoices(sceneId);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `choices_scene_${sceneId}_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('Choices exported successfully');
    }
  };

  // Validate all choices
  const handleValidateAll = async () => {
    if (choices.length === 0) {
      message.info('No choices to validate');
      return;
    }

    Modal.info({
      title: 'Choice Chain Validation',
      content: 'Validating all choice chains...',
      icon: <CheckCircleOutlined />,
      okText: 'Close',
      onOk: async () => {
        setValidationResults(new Map());

        let validCount = 0;
        let invalidCount = 0;
        const results = new Map();

        for (const choice of choices) {
          const result = await validateChoiceChain(choice.id);
          results.set(choice.id, {
            valid: result.valid,
            message: result.message,
          });

          if (result.valid) {
            validCount++;
          } else {
            invalidCount++;
          }
        }

        setValidationResults(results);

        Modal.success({
          title: 'Validation Complete',
          content: (
            <div>
              <p>
                <CheckCircleOutlined style={{ color: '#2E8B57' }} /> Valid: {validCount}
              </p>
              <p>
                <CloseCircleOutlined style={{ color: '#DC143C' }} /> Invalid: {invalidCount}
              </p>
              {invalidCount > 0 && (
                <Alert
                  message="Some choices have issues"
                  description="Check the table below for details"
                  type="warning"
                  showIcon
                />
              )}
            </div>
          ),
          okText: 'Close',
        });
      },
    });
  };

  // Validate single choice
  const handleValidateSingle = async (choiceId: string) => {
    const result = await validateChoiceChain(choiceId);

    if (result.valid) {
      Modal.success({
        title: 'Validation Passed',
        content: (
          <div>
            <p><CheckCircleOutlined style={{ color: '#2E8B57' }} /> Choice chain is valid</p>
            <p><Text type="secondary">{result.message}</Text></p>
            {result.chain && (
              <div>
                <Text strong>Path: </Text>
                <Space wrap>
                  {result.chain.map((id, index) => (
                    <React.Fragment key={id}>
                      <Tag color="blue">Choice {index + 1}</Tag>
                      {index < result.chain!.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </Space>
              </div>
            )}
          </div>
        ),
        okText: 'Close',
      });
    } else {
      Modal.error({
        title: 'Validation Failed',
        content: (
          <div>
            <p><CloseCircleOutlined style={{ color: '#DC143C' }} /> {result.message}</p>
            {result.chain && (
              <div>
                <Text strong>Chain: </Text>
                <Space wrap>
                  {result.chain.map((id, index) => (
                    <React.Fragment key={id}>
                      <Tag color="red">Choice {index + 1}</Tag>
                      {index < result.chain!.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </Space>
                <Alert
                  message="Circular reference detected!"
                  description="The choice chain creates a loop. Please check your choices."
                  type="error"
                  showIcon
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
          </div>
        ),
        okText: 'Close',
      });
    }
  };

  // Find choice chain path
  const handleFindPath = async (choiceId: string) => {
    const result = await validateChoiceChain(choiceId);

    if (result.chain) {
      Modal.info({
        title: 'Choice Path',
        content: (
          <div>
            <Text strong>Path from Choice #{choices.find(c => c.id === choiceId)?.choice_order}</Text>
            <div style={{ marginTop: 16 }}>
              <Timeline
                items={result.chain.map((id, index) => {
                  const choice = choices.find(c => c.id === id);
                  return {
                    color: index === result.chain!.length - 1 ? 'green' : 'blue',
                    children: (
                      <div>
                        <Text strong>Choice #{choice?.choice_order || index + 1}</Text>
                        <div><Text type="secondary">{choice?.choice_text || 'Unknown'}</Text></div>
                        {index < result.chain!.length - 1 && (
                          <Tag icon={<LinkOutlined />} color="green" style={{ marginTop: 4 }}>
                            Leads to next
                          </Tag>
                        )}
                        {index === result.chain!.length - 1 && (
                          <Tag icon={<FlagOutlined />} color="gold" style={{ marginTop: 4 }}>
                            End of chain
                          </Tag>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            </div>
            <Divider />
            <Alert
              message={`Chain length: ${result.chain.length} choices`}
              description={result.valid ? 'Valid chain' : 'Invalid chain - circular reference detected'}
              type={result.valid ? 'success' : 'error'}
              showIcon
            />
          </div>
        ),
        okText: 'Close',
        width: 600,
      });
    }
  };

  // Table selection
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Close popup
  const handleClose = () => {
    setViewDrawerVisible(false);
    setFormModalVisible(false);
    setEditingChoice(null);
    setSelectedChoice(null);
    setSelectedRowKeys([]);
    setValidationResults(new Map());
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <BranchesOutlined style={{ color: '#8B0000', fontSize: 24 }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>Choice Management</span>
          {scene && (
            <Tag color="blue" icon={<FileTextOutlined />} style={{ fontSize: 14 }}>
              Scene #{scene.scene_order}: {scene.dialog_text.substring(0, 30)}...
            </Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="95%"
      style={{ maxWidth: 1400, top: 20 }}
      bodyStyle={{ padding: '16px 24px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
      maskClosable={false}
    >
      <div style={{ background: '#F5F5DC', minHeight: '100%' }}>
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {/* Header Actions */}
          <div style={{ marginBottom: 24 }}>
            <Row align="middle" gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleClose}
                    size="large"
                  >
                    Close
                  </Button>
                </Space>
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Tooltip title="Export Choices">
                    <Button icon={<ExportOutlined />} onClick={handleExport}>
                      Export
                    </Button>
                  </Tooltip>
                  <Tooltip title="Validate All Choices">
                    <Button
                      icon={<CheckCircleOutlined />}
                      onClick={handleValidateAll}
                      style={{ borderColor: '#2E8B57', color: '#2E8B57' }}
                    >
                      Validate All
                    </Button>
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Filters */}
          <ChoiceFilters
            filters={filters}
            setFilters={setFilters}
            onRefresh={refresh}
            loading={loading}
            onAddNew={handleAddNew}
            availableBosses={availableBosses}
            availableQuests={availableQuests}
            onBulkDelete={handleBulkDelete}
            selectedRowKeys={selectedRowKeys}
          />

          {/* Validation Results Summary */}
          {validationResults.size > 0 && (
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Validation Results</Text>
                <Row gutter={[8, 8]}>
                  {Array.from(validationResults.entries()).map(([id, result]) => {
                    const choice = choices.find((c: any) => c.id === id);
                    return (
                      <Col key={id}>
                        <Tooltip title={result.message}>
                          <Tag
                            color={result.valid ? 'success' : 'error'}
                            icon={result.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            style={{ padding: '4px 12px', fontSize: 13 }}
                          >
                            Choice #{choice?.choice_order || '?'} {result.valid ? '✅' : '❌'}
                          </Tag>
                        </Tooltip>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </Card>
          )}

          {/* Choice Table */}
          <ChoiceTable
            choices={choices}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onReorder={handleReorder}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={onSelectChange}
            onValidate={handleValidateSingle}
            onFindPath={handleFindPath}
            validationResults={validationResults}
          />
        </Card>

        {/* Choice Form Modal */}
        <ChoiceFormModal
          visible={formModalVisible}
          sceneId={sceneId}
          editingChoice={editingChoice}
          loading={loading}
          availableScenes={availableScenes}
          availableBosses={availableBosses}
          availableQuests={availableQuests}
          existingChoices={choices}
          onClose={() => {
            setFormModalVisible(false);
            setEditingChoice(null);
          }}
          onSubmit={handleChoiceSubmit}
        />

        {/* Choice Detail Drawer */}
        <ChoiceDetailDrawer
          visible={viewDrawerVisible}
          choice={selectedChoice}
          loading={loading}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      </div>
    </Modal>
  );
};

export default StoryChoicesManagementPopup;
