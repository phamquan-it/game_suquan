// hooks/useAdminProfile.ts
import { supabase } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

export interface AdminProfile {
    player_id: string
    user_id: string
    username: string
    email: string
    role: string
    status: string
    avatar: string
    join_date: string
    last_login: string
    location: string
    title: string
    specialization: string
    ip_address: string
}

export const useAdminProfile = (userId: string) => {
    return useQuery({
        queryKey: ['admin-profile', userId],
        queryFn: async (): Promise<AdminProfile | null> => {
            const { data, error } = await supabase
                .from('admin_basic_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                throw new Error(error.message)
            }

            return data
        },
        enabled: !!userId, // Only run query if userId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
