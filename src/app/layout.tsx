import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import LayoutClient from "@/components/layouts/LayoutClient";
import StoreProvider from "@/lib/redux/StoreProvider";
import { ReactNode } from "react";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "12 Sứ Quân - Thời Kỳ Loạn Lạc Việt Nam Thế Kỷ X",
  description:
    "Tìm hiểu về thời kỳ 12 sứ quân (944-968) trong lịch sử Việt Nam: danh sách các sứ quân, lãnh địa, nguyên nhân, diễn biến và ý nghĩa lịch sử.",
  keywords: [
    "12 sứ quân",
    "loạn 12 sứ quân",
    "thời kỳ 12 sứ quân",
    "Đinh Bộ Lĩnh",
    "dẹp loạn 12 sứ quân",
    "lịch sử Việt Nam thế kỷ X",
    "các sứ quân",
    "sử Việt",
  ],
  authors: [{ name: "Mr.Quan" }], // bỏ url
  creator: "12 su quan team",
  publisher: "12 su quan",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "12 Sứ Quân - Thời Kỳ Loạn Lạc Và Thống Nhất Đất Nước",
    description:
      "Khám phá giai đoạn lịch sử đầy biến động với 12 cát cứ quân phiệt trước khi được Đinh Bộ Lĩnh thống nhất lập nên nhà Đinh.",
    // url: "https://yourdomain.com/12-su-quan", // comment lại
    siteName: "Lịch Sử Việt Nam",
    // images: [ // comment nếu chưa có ảnh
    //   {
    //     url: "https://yourdomain.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Bản đồ 12 sứ quân Việt Nam",
    //   },
    // ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "12 Sứ Quân - Lịch sử Việt Nam thế kỷ X",
    description:
      "Danh sách 12 sứ quân, lãnh địa, nguyên nhân và kết quả của thời kỳ loạn lạc này.",
    // images: ["https://yourdomain.com/twitter-image.jpg"], // comment lại
    // creator: "@your_twitter_handle", // comment lại
  },
  icons: {
    icon: "/icon.png", // đơn giản hơn, chỉ cần đường dẫn
    // Hoặc nếu muốn dùng array thì comment lại:
    // icon: [
    //   { url: "/favicon.ico", sizes: "any" },
    //   { url: "/icon?<generated>", type: "image/png", sizes: "32x32" },
    // ],
    // apple: [
    //   { url: "/apple-icon?<generated>", sizes: "180x180", type: "image/png" },
    // ],
  },
  // manifest: "/site.webmanifest", // comment lại nếu chưa có
  // verification: { // comment lại nếu chưa có mã xác thực
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },
  // alternates: { // comment lại nếu chưa có trang đa ngôn ngữ
  //   canonical: "https://yourdomain.com/12-su-quan",
  //   languages: {
  //     "vi-VN": "https://yourdomain.com/vi/12-su-quan",
  //     "en-US": "https://yourdomain.com/en/12-su-quan",
  //   },
  // },
  category: "history",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
            >
                <StoreProvider>
                    <LayoutClient>
                        {children}
                    </LayoutClient>
                </StoreProvider>
            </body>
        </html>
    );
}
