// hooks/useActivities.ts - Debug version
import { AdminActivity } from "@/types/admin";
import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useActivities = (
    userId?: string,
    options?: {
        limit?: number;
        enabled?: boolean;
    }
) => {
    const { limit = 50, enabled = true } = options || {};

    return useQuery({
        queryKey: ["activities", userId, limit],
        queryFn: async (): Promise<AdminActivity[]> => {
            console.log("Hook called with userId:", userId);

            if (!userId) {
                console.log("No userId provided, returning empty array");
                return [];
            }

            try {
                // First, let's check if the table exists and has any data
                const { data: allData, error: allError } = await supabase
                    .from("admin_activities")
                    .select("*")
                    .limit(5);

                console.log("All activities sample:", allData);
                console.log("All activities error:", allError);

                // Now query for specific user
                const { data, error, count } = await supabase
                    .from("admin_activities")
                    .select("*", { count: "exact" })
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(limit);

                console.log("Filtered activities data:", data);
                console.log("Filtered activities count:", count);
                console.log("Filtered activities error:", error);

                if (error) {
                    console.error("Supabase error:", error);
                    throw new Error(error.message);
                }

                if (!data || data.length === 0) {
                    console.log("No activities found for user:", userId);
                    return [];
                }

                // Transform the data
                const transformedData = data.map((activity) => ({
                    id: activity.id,
                    user_id: activity.user_id,
                    action: activity.action,
                    description: activity.description,
                    target: `${activity.target_type}:${activity.target_name || activity.target_id}`,
                    timestamp: activity.created_at,
                    ip: activity.ip_address,
                    severity: activity.severity as "low" | "medium" | "high",
                }));

                console.log("Transformed data:", transformedData);
                return transformedData;
            } catch (error) {
                console.error("Error in useActivities hook:", error);
                throw error;
            }
        },
        enabled: !!userId && enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
