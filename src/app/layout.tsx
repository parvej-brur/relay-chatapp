import type { Metadata } from "next";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "frontend-task-chatapp",
  description: "Chat application frontend built with Next.js React",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
