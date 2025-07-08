"use client";

import clsx from "clsx";
import {
  Hamburger,
  LayoutDashboard,
  Loader2,
  LogOut,
  ScrollText,
  UserCog,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

interface AppSidebarProps {
  userRoleName: string;
}

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pedidos",
    url: "/customerOrders",
    icon: ScrollText,
  },
  {
    title: "Produtos",
    url: "/products",
    icon: Hamburger,
  },
];

export function AppSidebar({ userRoleName }: AppSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const session = authClient.useSession();

  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-2 border-b bg-white p-4">
        <Image
          alt="Logo MC LogAp"
          src="/mc-logap.png"
          className="rounded"
          width={48}
          height={48}
        />
        <span className="font-semibold text-[#1D4382]">MC LogAp</span>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#5B7189]">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={clsx("", {
                    hidden:
                      userRoleName === "vendedor" && item.title === "Dashboard",
                  })}
                >
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon
                        className={`${pathname === item.url ? "text-[#0B68F7]" : "text-[#5B7189]"}`}
                      />
                      <span
                        className={`${pathname === item.url ? "text-[#0B68F7]" : "text-[#5B7189]"} font-semibold`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {userRoleName === "administrador" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[#5B7189]">
                Configurações
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/users"}>
                      <Link href="/users">
                        <UserCog
                          className={`${pathname === "/users" ? "text-[#0B68F7]" : "text-[#5B7189]"}`}
                        />
                        <span
                          className={`${pathname === "/users" ? "text-[#0B68F7]" : "text-[#5B7189]"} font-semibold`}
                        >
                          Usuários
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"}>
                  <Avatar>
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{session.data?.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {session.data?.user.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSignOut}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut />
                  )}
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
