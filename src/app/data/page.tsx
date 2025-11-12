"use client";

import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const Page = () => {
    const { data, isFetching, isError } = useQuery({
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

    useEffect(() => {
        console.log("data:", data);
    }, [data]);

    return <div>Check console for joined data</div>;
};

export default Page;

