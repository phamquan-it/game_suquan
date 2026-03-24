// app/admin/units/components/UnitSkillsManager.tsx
'use client';

import React from 'react';
import { Modal, List, Button, Space, Tag, Typography, Card, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  ThunderboltOutlined,
  FireOutlined,
  IeOutlined
} from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import { useSkills } from '../hooks/useSkills';
import { UnitWithSkills } from '../types';

const { Text } = Typography;

interface UnitSkillsManagerProps {
  visible: boolean;
  unit: UnitWithSkills | null;
  onClose: () => void;
  onAssignSkill: (skillId: string) => void;
  onRemoveSkill: (skillId: string) => void;
  loading?: boolean;
}

const UnitSkillsManager: React.FC<UnitSkillsManagerProps> = ({
  visible,
  unit,
  onClose,
  onAssignSkill,
  onRemoveSkill,
}) => {
  const { data: allSkills = [], isLoading: skillsLoading } = useSkills();

  if (!unit) return null;

  const assignedSkillIds = new Set(unit.skills?.map((s:any) => s.id) || []);
  
  const availableSkills = allSkills.filter(skill => !assignedSkillIds.has(skill.id));

  const getSkillIcon = (type: string) => {
    switch (type) {
      case 'active':
        return <FireOutlined style={{ color: '#FF8C00' }} />;
      case 'passive':
        return <IeOutlined style={{ color: '#2E8B57' }} />;
      default:
        return <ThunderboltOutlined />;
    }
  };

  return (
    <Modal
      title={`Manage Skills - ${unit.name}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Assigned Skills */}
        <Card 
          title="Assigned Skills" 
          size="small"
          style={{ 
            borderColor: theme.token?.colorBorder,
            borderRadius: theme.token?.borderRadius,
          }}
        >
          {unit.skills && unit.skills.length > 0 ? (
            <List
              dataSource={unit.skills}
              renderItem={(skill) => (
                <List.Item
                  actions={[
                    <Tooltip title="Remove Skill" key={unit.id}>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        size="small"
                        onClick={() => onRemoveSkill(skill.id)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Space>
                    {getSkillIcon(skill.type)}
                    <Space direction="vertical" size={0}>
                      <Text strong>{skill.name}</Text>
                      <Text type="secondary">{skill.description}</Text>
                    </Space>
                    <Tag color="processing">{skill.type}</Tag>
                    <Tag color="warning">Value: {skill.effectValue}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No skills assigned</Text>
          )}
        </Card>

        {/* Available Skills */}
        <Card 
          title="Available Skills" 
          size="small"
          style={{ 
            borderColor: theme.token?.colorBorder,
            borderRadius: theme.token?.borderRadius,
          }}
        >
          {availableSkills.length > 0 ? (
            <List
              loading={skillsLoading}
              dataSource={availableSkills}
              renderItem={(skill) => (
                <List.Item
                  actions={[
                    <Tooltip title="Assign Skill" key={skill.id}>
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        size="small"
                        onClick={() => onAssignSkill(skill.id)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Space>
                    {getSkillIcon(skill.type)}
                    <Space direction="vertical" size={0}>
                      <Text strong>{skill.name}</Text>
                      <Text type="secondary">{skill.description}</Text>
                    </Space>
                    <Tag color="processing">{skill.type}</Tag>
                    {skill.cooldown && (
                      <Tag color="blue">CD: {skill.cooldown}</Tag>
                    )}
                    {skill.manaCost && (
                      <Tag color="purple">MP: {skill.manaCost}</Tag>
                    )}
                  </Space>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No available skills to assign</Text>
          )}
        </Card>
      </Space>
    </Modal>
  );
};

export default UnitSkillsManager;
