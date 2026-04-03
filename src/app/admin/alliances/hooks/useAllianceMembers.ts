// hooks/useAllianceMembers.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Member } from '../types/member';

export const useAllianceMembers = (allianceId?: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!allianceId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('alliance_members')
        .select(`
          role,
          joined_at,
          player:players (
            id,
            username,
            level,
            power,
            win_rate,
            avatar
          )
        `)
        .eq('alliance_id', allianceId)
        .order('joined_at', { ascending: true });

      if (error) throw error;

      const normalized: Member[] = (data || []).map((m: any) => ({
        role: m.role,
        joined_at: m.joined_at,
        player: m.player || null
      }));

      setMembers(normalized);
    } catch (err: any) {
      console.error('Fetch members error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [allianceId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (playerId: string, role: string = 'member') => {
    if (!allianceId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('alliance_members')
        .insert({
          alliance_id: allianceId,
          player_id: playerId,
          role
        })
        .select(`
          role,
          joined_at,
          player:players (
            id,
            username,
            level,
            power,
            win_rate,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      const newMember: Member = {
        role: data.role,
        joined_at: data.joined_at,
        player: data.player || null
      };

      setMembers(prev => [...prev, newMember]);

      return newMember;
    } catch (err: any) {
      console.error('Add member error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (playerId: string) => {
    if (!allianceId) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('alliance_members')
        .delete()
        .eq('alliance_id', allianceId)
        .eq('player_id', playerId);

      if (error) throw error;

      setMembers(prev =>
        prev.filter(m => m.player?.id !== playerId)
      );
    } catch (err: any) {
      console.error('Remove member error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (playerId: string, newRole: string) => {
    if (!allianceId) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('alliance_members')
        .update({ role: newRole })
        .eq('alliance_id', allianceId)
        .eq('player_id', playerId);

      if (error) throw error;

      setMembers(prev =>
        prev.map(m =>
          m.player?.id === playerId
            ? { ...m, role: newRole }
            : m
        )
      );
    } catch (err: any) {
      console.error('Update role error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = useCallback(() => {
    return fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    addMember,
    removeMember,
    updateMemberRole,
    refetch,
  };
};
