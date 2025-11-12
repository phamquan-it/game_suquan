'use client';

import 'antd/dist/reset.css';
import '../../app/globals.css';
import '@ant-design/v5-patch-for-react-19';
import { Suspense } from 'react';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import theme from '@/theme/themeConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient()
export default function LayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={theme}
        >
            <Suspense>
                <AntdRegistry>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AntdRegistry>
            </Suspense>
        </ConfigProvider>
    );
}

