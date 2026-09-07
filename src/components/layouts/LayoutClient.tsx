'use client';

import 'antd/dist/reset.css';
import '../../app/globals.css';
import '@ant-design/v5-patch-for-react-19';
import { Suspense } from 'react';
import { App, ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import theme from '@/theme/themeConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient()
export default function LayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={theme}
        >
            {/*
              AntD <App> cung cấp message/notification/modal the context cho App.useApp().
              Đặt trong ConfigProvider để các instance này consume đúng dynamic theme
              (tránh cảnh báo "Static function can not consume context like dynamic theme").
            */}
            <App>
                <Suspense>
                    <AntdRegistry>
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </AntdRegistry>
                </Suspense>
            </App>
        </ConfigProvider>
    );
}

