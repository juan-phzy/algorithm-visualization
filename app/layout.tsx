import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "Sorting Algorithm Visualizer",
    description:
        "Visualize and compare Selection Sort and Merge Sort algorithms",
    keywords:
        "sorting algorithms, visualization, selection sort, merge sort, algorithms, computer science",
    authors: [{ name: "Next.js Sorting Visualizer" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <main>{children}</main>
            </body>
        </html>
    );
}
