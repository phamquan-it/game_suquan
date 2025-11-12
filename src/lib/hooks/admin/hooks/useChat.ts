import { ChatConnection, ChatGroup, ChatMessage, DirectTrade, FriendRelationship } from "@/lib/types/chat.types"
import { supabase } from "@/utils/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Hook cho connections
export const useChatConnections = () => {
    return useQuery({
        queryKey: ["chat-connections"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("chat_connections")
                .select("*")
                .select(
                    `
                    *,
                    player:players(username)
                `
                )
                .order("last_seen", { ascending: false })

            if (error) throw error
            return data as ChatConnection[]
        },
        staleTime: 1000 * 30, // 30 seconds
    })
}

export const useChatMessages = () => {
    return useQuery({
        queryKey: ["chat-messages"],
        queryFn: async () => {
            // Chú ý: join bảng players và chat_groups
            const { data, error } = await supabase
                .from("chat_messages")
                .select(`
                    *,
                    sender:sender_id(username),
                    recipient:recipient_id(username)
                `)
                .order('created_date', { ascending: false })
                .limit(100);

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60, // 1 phút
    });
}

// Hook cho chat groups
export const useChatGroups = () => {
    return useQuery({
        queryKey: ["chat-groups"],
        queryFn: async () => {
            const { data: groups, error } = await supabase
                .from("chat_groups")
                .select(
                    `
                    *,
                    owner:players(username)
                `
                )
                .order("created_date", { ascending: false })

            if (error) throw error

            // Get member counts for each group
            const groupsWithCounts = await Promise.all(
                groups.map(async (group) => {
                    const { count, error: countError } = await supabase
                        .from("chat_group_members")
                        .select("*", { count: "exact", head: true })
                        .eq("group_id", group.id)

                    return {
                        ...group,
                        member_count: countError ? 0 : count,
                    }
                })
            )

            return groupsWithCounts as ChatGroup[]
        },
    })
}

// Hook cho friend relationships
export const useFriendRelationships = () => {
    return useQuery({
        queryKey: ["friend-relationships"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("friend_relationships")
                .select(
                    `
                    *,
                    friend:friend_id(username, level, status)
                `
                )
                .order("created_date", { ascending: false })

            if (error) throw error
            return data as FriendRelationship[]
        },
    })
}

// Hook cho direct trades
export const useDirectTrades = () => {
    return useQuery({
        queryKey: ["direct-trades"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("direct_trades")
                .select(
                    `
                    *,
                    initiator:initiator_id(username),
                    recipient:recipient_id(username)
                `
                )
                .order("created_date", { ascending: false })

            if (error) throw error
            return data as DirectTrade[]
        },
        staleTime: 1000 * 30, // 30 seconds
    })
}

// Mutation cho việc xóa message
export const useDeleteMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (messageId: string) => {
            const { error } = await supabase
                .from("chat_messages")
                .update({
                    is_deleted: true,
                    deleted_date: new Date().toISOString(),
                })
                .eq("id", messageId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat-messages"] })
        },
    })
}

// Mutation cho việc ban user
export const useBanUser = () => {
    return useMutation({
        mutationFn: async (playerId: string) => {
            const { error } = await supabase.from("players").update({ status: "banned" }).eq("id", playerId)

            if (error) throw error
        },
    })
}
