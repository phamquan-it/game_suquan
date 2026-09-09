import { Boss, Quest, StoryChoice, StoryScene } from '../../../hooks/useStoryChoices';

export interface StoryChoicesManagementProps {
  visible: boolean;
  sceneId: string;
  storyId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface ChoiceFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  availableBosses: Boss[];
  availableQuests: Quest[];
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}

export interface ChoiceTableProps {
  choices: StoryChoice[];
  loading: boolean;
  onView: (choice: StoryChoice) => void;
  onEdit: (choice: StoryChoice) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (choices: StoryChoice[]) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: StoryChoice[]) => void;
  onValidate: (id: string) => void;
  onFindPath: (id: string) => void;
  validationResults: Map<string, { valid: boolean; message: string }>;
}

export interface ChoiceDetailDrawerProps {
  visible: boolean;
  choice: StoryChoice | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (choice: StoryChoice) => void;
}

export interface ChoiceFormModalProps {
  visible: boolean;
  sceneId: string;
  editingChoice: StoryChoice | null;
  loading: boolean;
  availableScenes: StoryScene[];
  availableBosses: Boss[];
  availableQuests: Quest[];
  existingChoices: StoryChoice[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}
