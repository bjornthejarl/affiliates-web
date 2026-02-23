import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeRegistry } from "./theme-registry";
import { QueryProvider } from "./query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
    title: "Nikkahify Affiliates",
    description: "Affiliate dashboard — earn by referring users to Nikkahify",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
    themeColor: "#111111",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={inter.variable}>
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#111111",
                    color: "#F5F5F5",
                    minHeight: "100dvh",
                    overscrollBehavior: "none",
                    WebkitFontSmoothing: "antialiased",
                }}
            >
                <QueryProvider>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </QueryProvider>
            </body>
        </html>
    );
}
