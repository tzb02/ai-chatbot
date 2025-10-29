import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Survey Chatbot",
  description: "AI-powered survey chatbot widget",
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={geist.variable} lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
