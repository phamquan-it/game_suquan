// app/admin/stories/hooks/useStoryCharacters.ts
import { useEffect, useState, useCallback } from 'react';
import { message, Modal } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export interface StoryCharacter {
  id: string;
  name: string;
  avatar: string;
  color: string;
  default_position: 'left' | 'right' | 'center';
  created_at: string;
  faction_id: string | null;
  emotion_states: Record<string, any> | null;
  is_su_quan: boolean;
  // Joined data - manually joined since no FK exists
  faction?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  scene_count?: number;
  story_count?: number;
}

export interface CharacterFilters {
  search?: string;
  factionId?: string;
  position?: 'left' | 'right' | 'center' | null;
  isSuQuan?: boolean | null;
  hasEmotions?: boolean | null;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'created_at' | 'default_position';
  sortOrder?: 'asc' | 'desc';
}

export interface CharacterStats {
  total: number;
  totalWithFaction: number;
  totalWithoutFaction: number;
  totalSuQuan: number;
  totalWithEmotions: number;
  positions: {
    left: number;
    right: number;
    center: number;
  };
  mostUsedColor: string;
  factions: {
    id: string;
    name: string;
    count: number;
  }[];
  charactersByMonth: {
    month: string;
    count: number;
  }[];
}

export interface CreateCharacterData {
  name: string;
  avatar: string;
  color: string;
  default_position: 'left' | 'right' | 'center';
  faction_id?: string | null;
  emotion_states?: Record<string, any> | null;
  is_su_quan?: boolean;
}

export interface UpdateCharacterData {
  name?: string;
  avatar?: string;
  color?: string;
  default_position?: 'left' | 'right' | 'center';
  faction_id?: string | null;
  emotion_states?: Record<string, any> | null;
  is_su_quan?: boolean;
}

export const useStoryCharacters = (initialFilters?: CharacterFilters) => {
  const [characters, setCharacters] = useState<StoryCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CharacterFilters>(initialFilters || {
    search: '',
    factionId: '',
    position: null,
    isSuQuan: null,
    hasEmotions: null,
    dateFrom: '',
    dateTo: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter | null>(null);
  const [availableFactions, setAvailableFactions] = useState<{ id: string; name: string }[]>([]);

  // Fetch all factions separately (since no FK relationship)
  const fetchFactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('factions')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setAvailableFactions(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching factions:', error);
      // Don't show error message for factions - it's not critical
      return [];
    }
  }, []);

  // Fetch characters with filters
  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('story_characters')
        .select('*')
        .order(filters.sortBy || 'name', { 
          ascending: filters.sortOrder === 'asc' 
        });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,color.ilike.%${filters.search}%`);
      }

      if (filters.factionId) {
        query = query.eq('faction_id', filters.factionId);
      }

      if (filters.position) {
        query = query.eq('default_position', filters.position);
      }

      if (filters.isSuQuan !== null) {
        query = query.eq('is_su_quan', filters.isSuQuan);
      }

      if (filters.hasEmotions === true) {
        query = query.not('emotion_states', 'is', null);
      } else if (filters.hasEmotions === false) {
        query = query.is('emotion_states', null);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get factions data separately and manually join
      const factions = await fetchFactions();
      const factionMap = new Map(factions.map(f => [f.id, f]));

      // Get additional stats for each character
      const charactersWithStats = await Promise.all(
        (data || []).map(async (character) => {
          // Get scene count (how many scenes this character appears in)
          const { count: sceneCount } = await supabase
            .from('story_scenes')
            .select('*', { count: 'exact', head: true })
            .eq('speaker_id', character.id);

          // Get story count (distinct stories this character appears in)
          const { data: sceneData } = await supabase
            .from('story_scenes')
            .select('story_id')
            .eq('speaker_id', character.id);

          const uniqueStories = new Set(sceneData?.map(s => s.story_id) || []);

          // Manually join faction data
          const faction = character.faction_id ? factionMap.get(character.faction_id) : null;

          return {
            ...character,
            faction: faction || null,
            scene_count: sceneCount || 0,
            story_count: uniqueStories.size,
          };
        })
      );

      setCharacters(charactersWithStats);
    } catch (error) {
      console.error('Error fetching characters:', error);
      message.error('Failed to load characters');
    } finally {
      setLoading(false);
    }
  }, [filters, fetchFactions]);

  // Fetch character statistics
  const fetchStats = useCallback(async () => {
    try {
      // Total characters
      const { count: total } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true });

      // Characters with faction
      const { count: withFaction } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true })
        .not('faction_id', 'is', null);

      // Characters without faction
      const { count: withoutFaction } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true })
        .is('faction_id', null);

      // Su Quan characters
      const { count: suQuan } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true })
        .eq('is_su_quan', true);

      // Characters with emotions
      const { count: withEmotions } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true })
        .not('emotion_states', 'is', null);

      // Position distribution
      const { data: positionData } = await supabase
        .from('story_characters')
        .select('default_position');

      const positions = {
        left: 0,
        right: 0,
        center: 0,
      };

      positionData?.forEach(char => {
        if (char.default_position === 'left') positions.left++;
        else if (char.default_position === 'right') positions.right++;
        else if (char.default_position === 'center') positions.center++;
      });

      // Most used color
      const { data: colorData } = await supabase
        .from('story_characters')
        .select('color');

      const colorCounts: Record<string, number> = {};
      colorData?.forEach(char => {
        colorCounts[char.color] = (colorCounts[char.color] || 0) + 1;
      });

      let mostUsedColor = '#000000';
      let maxCount = 0;
      for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
          maxCount = count;
          mostUsedColor = color;
        }
      }

      // Factions distribution - manually fetch and count
      const { data: factionData } = await supabase
        .from('story_characters')
        .select('faction_id')
        .not('faction_id', 'is', null);

      // Get faction names
      const factions = await fetchFactions();
      const factionMap = new Map(factions.map(f => [f.id, f.name]));

      const factionCounts: Record<string, { name: string; count: number }> = {};
      factionData?.forEach(char => {
        if (char.faction_id) {
          const id = char.faction_id;
          if (!factionCounts[id]) {
            factionCounts[id] = {
              name: factionMap.get(id) || 'Unknown',
              count: 0,
            };
          }
          factionCounts[id].count++;
        }
      });

      const factionStats = Object.entries(factionCounts).map(([id, data]) => ({
        id,
        name: data.name,
        count: data.count,
      })).sort((a, b) => b.count - a.count);

      // Characters by month (last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const { data: monthlyData } = await supabase
        .from('story_characters')
        .select('created_at')
        .gte('created_at', twelveMonthsAgo.toISOString());

      const charactersByMonth: Record<string, number> = {};
      monthlyData?.forEach(char => {
        const month = new Date(char.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
        charactersByMonth[month] = (charactersByMonth[month] || 0) + 1;
      });

      const charactersByMonthArray = Object.entries(charactersByMonth)
        .map(([month, count]) => ({
          month,
          count,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });

      setStats({
        total: total || 0,
        totalWithFaction: withFaction || 0,
        totalWithoutFaction: withoutFaction || 0,
        totalSuQuan: suQuan || 0,
        totalWithEmotions: withEmotions || 0,
        positions,
        mostUsedColor,
        factions: factionStats,
        charactersByMonth: charactersByMonthArray,
      });
    } catch (error) {
      console.error('Error fetching character stats:', error);
    }
  }, [fetchFactions]);

  // Fetch a single character with all details
  const fetchCharacterDetails = useCallback(async (characterId: string): Promise<StoryCharacter | null> => {
    try {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (error) throw error;

      // Get factions
      const factions = await fetchFactions();
      const factionMap = new Map(factions.map(f => [f.id, f]));

      // Get scenes this character appears in
      const { data: scenes, count: sceneCount } = await supabase
        .from('story_scenes')
        .select('*', { count: 'exact' })
        .eq('speaker_id', characterId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get distinct stories
      const { data: storyData } = await supabase
        .from('story_scenes')
        .select('story_id')
        .eq('speaker_id', characterId);

      const uniqueStories = new Set(storyData?.map(s => s.story_id) || []);

      const characterWithDetails = {
        ...data,
        faction: data.faction_id ? factionMap.get(data.faction_id) || null : null,
        scene_count: sceneCount || 0,
        story_count: uniqueStories.size,
        recent_scenes: scenes || [],
      };

      setSelectedCharacter(characterWithDetails);
      return characterWithDetails;
    } catch (error) {
      console.error('Error fetching character details:', error);
      message.error('Failed to load character details');
      return null;
    }
  }, [fetchFactions]);

  // Create a new character
  const createCharacter = useCallback(async (data: CreateCharacterData): Promise<StoryCharacter | null> => {
    try {
      // Check if character name already exists
      const { count } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true })
        .ilike('name', data.name);

      if (count && count > 0) {
        message.error(`Character "${data.name}" already exists`);
        return null;
      }

      const { data: character, error } = await supabase
        .from('story_characters')
        .insert({
          id: crypto.randomUUID(),
          name: data.name,
          avatar: data.avatar,
          color: data.color,
          default_position: data.default_position,
          faction_id: data.faction_id || null,
          emotion_states: data.emotion_states || null,
          is_su_quan: data.is_su_quan || false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      message.success(`Character "${character.name}" created successfully`);
      await fetchCharacters();
      await fetchStats();
      return character;
    } catch (error) {
      console.error('Error creating character:', error);
      message.error('Failed to create character');
      return null;
    }
  }, [fetchCharacters, fetchStats]);

  // Update a character
  const updateCharacter = useCallback(async (id: string, data: UpdateCharacterData): Promise<StoryCharacter | null> => {
    try {
      // If changing name, check for duplicates
      if (data.name) {
        const { count } = await supabase
          .from('story_characters')
          .select('*', { count: 'exact', head: true })
          .ilike('name', data.name)
          .neq('id', id);

        if (count && count > 0) {
          message.error(`Character "${data.name}" already exists`);
          return null;
        }
      }

      const { data: character, error } = await supabase
        .from('story_characters')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      message.success(`Character "${character.name}" updated successfully`);
      await fetchCharacters();
      await fetchStats();
      return character;
    } catch (error) {
      console.error('Error updating character:', error);
      message.error('Failed to update character');
      return null;
    }
  }, [fetchCharacters, fetchStats]);

  // Delete a character
  const deleteCharacter = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Check if character is used in any scenes
      const { count } = await supabase
        .from('story_scenes')
        .select('*', { count: 'exact', head: true })
        .eq('speaker_id', id);

      if (count && count > 0) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: 'Character in Use',
            content: `This character appears in ${count} scene(s). Deleting them will restrict the scenes. Are you sure?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) return false;
      }

      const { error } = await supabase
        .from('story_characters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Character deleted successfully');
      await fetchCharacters();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      message.error('Failed to delete character');
      return false;
    }
  }, [fetchCharacters, fetchStats]);

  // Bulk delete characters
  const deleteCharacters = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      // Check which characters are in use
      const { data: usedCharacters } = await supabase
        .from('story_scenes')
        .select('speaker_id')
        .in('speaker_id', ids);

      const usedIds = new Set(usedCharacters?.map(c => c.speaker_id) || []);
      const safeIds = ids.filter(id => !usedIds.has(id));

      if (safeIds.length === 0) {
        message.warning('Selected characters are all in use and cannot be deleted');
        return false;
      }

      if (safeIds.length < ids.length) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Modal.confirm({
            title: 'Some Characters in Use',
            content: `${ids.length - safeIds.length} character(s) are in use and will be skipped. Delete ${safeIds.length} character(s)?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        if (!confirmed) return false;
      }

      const { error } = await supabase
        .from('story_characters')
        .delete()
        .in('id', safeIds);

      if (error) throw error;

      message.success(`Deleted ${safeIds.length} characters successfully`);
      await fetchCharacters();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting characters:', error);
      message.error('Failed to delete characters');
      return false;
    }
  }, [fetchCharacters, fetchStats]);

  // Duplicate a character
  const duplicateCharacter = useCallback(async (id: string): Promise<StoryCharacter | null> => {
    try {
      // Get original character
      const { data: original, error: fetchError } = await supabase
        .from('story_characters')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate with new name
      const { data: newCharacter, error: insertError } = await supabase
        .from('story_characters')
        .insert({
          id: crypto.randomUUID(),
          name: `${original.name} (Copy)`,
          avatar: original.avatar,
          color: original.color,
          default_position: original.default_position,
          faction_id: original.faction_id,
          emotion_states: original.emotion_states,
          is_su_quan: original.is_su_quan,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      message.success(`Character "${newCharacter.name}" duplicated successfully`);
      await fetchCharacters();
      await fetchStats();
      return newCharacter;
    } catch (error) {
      console.error('Error duplicating character:', error);
      message.error('Failed to duplicate character');
      return null;
    }
  }, [fetchCharacters, fetchStats]);

  // Get characters by faction
  const getCharactersByFaction = useCallback(async (factionId: string): Promise<StoryCharacter[]> => {
    try {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .eq('faction_id', factionId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching characters by faction:', error);
      message.error('Failed to load characters for faction');
      return [];
    }
  }, []);

  // Search characters
  const searchCharacters = useCallback(async (searchTerm: string): Promise<StoryCharacter[]> => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,color.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching characters:', error);
      return [];
    }
  }, []);

  // Get character usage stats
  const getCharacterUsage = useCallback(async (characterId: string) => {
    try {
      // Get scenes where character appears
      const { data: scenes, count: sceneCount } = await supabase
        .from('story_scenes')
        .select(`
          id,
          scene_order,
          dialog_text,
          story_id,
          story:story_id (
            id,
            title
          )
        `)
        .eq('speaker_id', characterId)
        .order('created_at', { ascending: false });

      return {
        scenes: scenes || [],
        sceneCount: sceneCount || 0,
      };
    } catch (error) {
      console.error('Error fetching character usage:', error);
      return {
        scenes: [],
        sceneCount: 0,
      };
    }
  }, []);

  // Validate character position
  const validatePosition = useCallback((position: string): position is 'left' | 'right' | 'center' => {
    return ['left', 'right', 'center'].includes(position);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      factionId: '',
      position: null,
      isSuQuan: null,
      hasEmotions: null,
      dateFrom: '',
      dateTo: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }, []);

  // Initial load
  useEffect(() => {
    fetchCharacters();
    fetchStats();
  }, [filters, fetchCharacters, fetchStats]);

  return {
    // State
    characters,
    loading,
    filters,
    setFilters,
    stats,
    selectedCharacter,
    availableFactions,

    // CRUD Operations
    createCharacter,
    updateCharacter,
    deleteCharacter,
    deleteCharacters,
    duplicateCharacter,
    fetchCharacterDetails,

    // Query Operations
    getCharactersByFaction,
    searchCharacters,
    getCharacterUsage,

    // Validation
    validatePosition,

    // Utility
    refresh: fetchCharacters,
    refreshStats: fetchStats,
    fetchFactions,
    clearFilters,
  };
};

// Helper function to get default avatar color based on character name
export const getDefaultAvatarColor = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F1948A', '#82E0AA', '#F8C471', '#73C6B6', '#AF7AC5',
  ];
  const index = name.length % colors.length;
  return colors[index];
};

// Helper function to generate avatar initials
export const getCharacterInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
