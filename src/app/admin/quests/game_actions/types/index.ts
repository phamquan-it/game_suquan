export type GameAction = {
  id: string;
  description: string;
  category: string;
  repeatable: boolean;
  metadata: Record<string, any>;
  created_at: string;
};

export type CreateGameActionInput = {
  id: string;
  description: string;
  category: string;
  repeatable?: boolean;
  metadata?: Record<string, any>;
};

export type UpdateGameActionInput = Partial<
  Omit<GameAction, 'id' | 'created_at'>
> & {
  id: string;
};


