"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-firebase-auth";

import { AppSidebar } from "./_components/app-sidebar";
import { UserSidebar } from "./_components/user-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAdmin = userData?.role === "admin";

  return (
    <ProtectedRoute>
      <SidebarProvider>
        {isAdmin ? <AppSidebar /> : <UserSidebar />}
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
