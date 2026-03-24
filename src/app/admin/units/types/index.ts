
export type UnitType = 'infantry' | 'cavalry' | 'archer' | 'siege' | 'mythical' | 'legendary';
export type UnitRank = 'regular' | 'elite' | 'champion' | 'legendary' | 'mythic';

export interface Unit {
  id: string;
  name: string;
  imagePath: string | null;
  type: UnitType;
  description: string | null;
  quantity: number;
  level: number;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  speed: number;
  range: number;
  isVip: boolean;
  createdAt: string;
  updatedAt: string;
  rank: UnitRank;
  isSpecial: boolean;
  joinDate: string | null;
  playerUnitId: string | null;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  effectValue: number;
  cooldown?: number;
  manaCost?: number;
  iconPath?: string;
}

export interface UnitSkill {
  id: number;
  unitId: string;
  skillId: string;
  createdAt: string;
  skill?: Skill;
}

export interface UnitWithSkills extends Unit {
  skills: Skill[];
}

export interface UnitFilterParams {
  type?: UnitType;
  level?: number;
  isVip?: boolean;
  isSpecial?: boolean;
  rank?: UnitRank;
  searchTerm?: string;
  minAtk?: number;
  maxAtk?: number;
  minDef?: number;
  maxDef?: number;
  page?: number;
  limit?: number;
}

export interface CreateUnitDTO {
  id: string;
  name: string;
  type: UnitType;
  description?: string;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  speed: number;
  range?: number;
  level?: number;
  quantity?: number;
  isVip?: boolean;
  rank?: UnitRank;
  isSpecial?: boolean;
  imagePath?: string;
}

export interface UpdateUnitDTO extends Partial<CreateUnitDTO> {
}

export interface UnitsResponse {
  data: UnitWithSkills[];
  total: number;
  page: number;
  limit: number;
}
