// app/admin/achievements/hooks/useAchievement.ts
import { useState } from 'react';
import {  AchievementFormData, AchievementWithRelations } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

export const useAchievement = (id?: string) => {
  const [achievement, setAchievement] = useState<AchievementWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAchievement = async (achievementId: string) => {
    try {
      setLoading(true);
      
      // Fetch achievement with requirements and rewards
      const { data: achievementData, error: achievementError } = await supabase
        .from('achievements')
        .select(`
          *,
          requirements:achievement_requirements(*),
          rewards:achievement_rewards(*)
        `)
        .eq('id', achievementId)
        .single();

      if (achievementError) throw achievementError;
      setAchievement(achievementData);
    } catch (error) {
      console.error('Error fetching achievement:', error);
      message.error('Failed to load achievement details');
    } finally {
      setLoading(false);
    }
  };

  const createAchievement = async (data: AchievementFormData) => {
    try {
      setSaving(true);
      
      const { data: newAchievement, error } = await supabase
        .from('achievements')
        .insert([{
          ...data,
          created_by: 'admin', // You might want to get this from auth context
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      
      message.success('Achievement created successfully');
      return newAchievement;
    } catch (error) {
      console.error('Error creating achievement:', error);
      message.error('Failed to create achievement');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateAchievement = async (achievementId: string, data: Partial<AchievementFormData>) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('achievements')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', achievementId);

      if (error) throw error;
      
      message.success('Achievement updated successfully');
      await fetchAchievement(achievementId);
    } catch (error) {
      console.error('Error updating achievement:', error);
      message.error('Failed to update achievement');
    } finally {
      setSaving(false);
    }
  };

  return {
    achievement,
    loading,
    saving,
    fetchAchievement,
    createAchievement,
    updateAchievement,
  };
};
