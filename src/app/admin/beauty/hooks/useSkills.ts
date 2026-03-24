'use client';

import { useState } from 'react';
import { message } from 'antd';
import { BeautySkill } from '../types';
import { supabase } from '@/utils/supabase/client';

export function useSkills(characterId: string) {
  const [skills, setSkills] = useState<BeautySkill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    if (!characterId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('beauty_skills')
        .select('*')
        .eq('character_id', characterId);

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      message.error('Error fetching skills: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skill: Partial<BeautySkill>) => {
    try {
      const { data, error } = await supabase
        .from('beauty_skills')
        .insert([{ ...skill, character_id: characterId }])
        .select()
        .single();

      if (error) throw error;
      
      setSkills([...skills, data]);
      message.success('Skill added successfully');
      return data;
    } catch (error: any) {
      message.error('Error adding skill: ' + error.message);
      throw error;
    }
  };

  const updateSkill = async (id: string, updates: Partial<BeautySkill>) => {
    try {
      const { data, error } = await supabase
        .from('beauty_skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSkills(skills.map(s => s.id === id ? data : s));
      message.success('Skill updated successfully');
      return data;
    } catch (error: any) {
      message.error('Error updating skill: ' + error.message);
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('beauty_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSkills(skills.filter(s => s.id !== id));
      message.success('Skill deleted successfully');
    } catch (error: any) {
      message.error('Error deleting skill: ' + error.message);
      throw error;
    }
  };

  return {
    skills,
    loading,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
}
