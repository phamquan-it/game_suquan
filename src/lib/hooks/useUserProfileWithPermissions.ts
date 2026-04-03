// hooks/useUserProfileWithPermissions.ts
import { UserProfileWithPermissions } from '@/types/admin';
import { supabase } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseUserProfileWithPermissionsOptions {
    enabled?: boolean;
    staleTime?: number;
}

export const useUserProfileWithPermissions = (
    userId: string | undefined | null,
    options: UseUserProfileWithPermissionsOptions = {}
) => {
    const {
        enabled = true,
        staleTime = 5 * 60 * 1000, // 5 minutes
    } = options;

    return useQuery({
        queryKey: ['user-profile-permissions', userId],
        queryFn: async (): Promise<UserProfileWithPermissions | null> => {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const { data, error } = await supabase
                .rpc('get_user_profile_with_permissions', { user_uuid: userId })
                .single();

            if (error) {
                console.error('Error fetching user profile with permissions:', error);
                throw new Error(`Failed to fetch user profile: ${error.message}`);
            }

            return data as UserProfileWithPermissions;
        },
        enabled: !!userId && enabled,
        staleTime,
        retry: 2,
    });
};
