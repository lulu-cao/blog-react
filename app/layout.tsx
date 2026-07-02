import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ButtonAppBar from "./ui/button-app-bar";
// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hello lulu",
  description: "good weather today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const queryClient = new QueryClient();
  
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <ButtonAppBar />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
