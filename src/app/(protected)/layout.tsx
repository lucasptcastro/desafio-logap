import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserRole } from "@/actions/get-user-role";
import { AppSidebar } from "@/app/(protected)/_components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = await getUserRole({ userId: session.user.id });

  if (!userRole?.data) {
    redirect("/login");
  }

  const userRoleName = userRole.data[0].roleName.toLowerCase();

  return (
    <SidebarProvider>
      <AppSidebar userRoleName={userRoleName} />
      <main className="w-full bg-[#FAFAFA]">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
