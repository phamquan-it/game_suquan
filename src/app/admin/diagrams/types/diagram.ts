// ==================== INTERFACES ====================
export interface TableRelationship {
  relationship_exists: boolean;
  total_relationships?: number;
  constraint_name?: string | null;
  source_table?: string | null;
  source_column?: string | null;
  target_table?: string | null;
  target_column?: string | null;
  on_delete_action?: string | null;
  on_update_action?: string | null;
  relationships?: Array<{
    constraint_name: string;
    source_table: string;
    source_column: string;
    target_table: string;
    target_column: string;
    on_delete_action: string;
    on_update_action: string;
  }>;
  message?: string;
}

export interface TableInfo {
  schema_name: string;
  table_name: string;
  table_type: string;
  columns?: TableColumn[];
}

export interface RelationshipSummary {
  table_name: string;
  relationships: {
    incoming: TableRelationship[];
    outgoing: TableRelationship[];
  };
}

export interface MultiTableRelationship {
  table1: string;
  table2: string;
  relationship: TableRelationship;
}

export interface Position {
  x: number;
  y: number;
}


export interface DiagramState {
  pos: Record<string, { x: number; y: number }>;
  selected: string[];
  arrow: number;
}
export type DiagramStateMap = Map<string, DiagramState>;


// ===== Table with Columns =====
export interface TableWithColumns {
  schema_name: string;
  table_name: string;
  table_type: string;
  columns: TableColumn[];
}


// ===== Table Column =====
export interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
  character_maximum_length?: number | null;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  foreign_table: string | null;
  foreign_column: string | null;
}




