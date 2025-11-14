// components/GeneralFormModal/constants/steps.ts
import { 
  UserOutlined, 
  BarChartOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

export const FORM_STEPS = [
  {
    key: 'basic',
    title: 'Basic Info',
    icon: <UserOutlined />,
    description: 'General information and characteristics',
  },
  {
    key: 'statistics',
    title: 'Statistics',
    icon: <BarChartOutlined />,
    description: 'Combat abilities and progression',
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: <SettingOutlined />,
    description: 'Additional configuration',
  },
] as const;

// Type definitions for steps
export type FormStepKey = typeof FORM_STEPS[number]['key'];
export type FormStep = typeof FORM_STEPS[number];
