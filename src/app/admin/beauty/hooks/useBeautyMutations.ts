'use client';

import { message } from 'antd';
import { BeautyCharacter } from '../types';
import { supabase } from '@/utils/supabase/client';

export function useBeautyMutations() {
  const createBeauty = async (data: Partial<BeautyCharacter>) => {
    try {
      const { data: result, error } = await supabase
        .from('beauty_characters')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      message.success('Beauty created successfully');
      return result;
    } catch (error: any) {
      message.error('Error creating beauty: ' + error.message);
      throw error;
    }
  };

  const updateBeauty = async (id: string, data: Partial<BeautyCharacter>) => {
    try {
      const { data: result, error } = await supabase
        .from('beauty_characters')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      message.success('Beauty updated successfully');
      return result;
    } catch (error: any) {
      message.error('Error updating beauty: ' + error.message);
      throw error;
    }
  };

  const deleteBeauty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('beauty_characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      message.success('Beauty deleted successfully');
    } catch (error: any) {
      message.error('Error deleting beauty: ' + error.message);
      throw error;
    }
  };

  return {
    createBeauty,
    updateBeauty,
    deleteBeauty,
  };
}
