import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { AuthGuard } from "@/components/AuthGuard";
import { ChatWidget } from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jimat AI",
  description: "A dashboard for household energy consumption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50/50 min-h-screen`}>
        <AuthProvider>
          <AuthGuard>
            <LayoutProvider>
              <DashboardProvider>
                <div className="min-h-screen">
                  <Navbar />
                  <div className="flex pt-16">
                    <Sidebar />
                    <main className="flex-1 ml-0 md:ml-64 w-full">
                      {children}
                    </main>
                    <ChatWidget />
                  </div>
                </div>
              </DashboardProvider>
            </LayoutProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
