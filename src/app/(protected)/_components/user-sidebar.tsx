"use client";

import {
    Calendar,
    CalendarPlus,
    Home,
    LogOut,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
import { useAuth } from "@/hooks/use-firebase-auth";

const items = [
    {
        title: "Dashboard",
        url: "/user-dashboard",
        icon: Home,
    },
    {
        title: "Solicitar Agendamento",
        url: "/request-appointment",
        icon: CalendarPlus,
    },
    {
        title: "Meus Agendamentos",
        url: "/my-appointments",
        icon: Calendar,
    },
    {
        title: "Perfil",
        url: "/profile",
        icon: User,
    },
];

export function UserSidebar() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await logout();
        router.push("/");
    };

    const getUserInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b p-4 flex justify-center items-center">
                <div className="w-[180px] h-[60px] relative">
                    <Image
                        src="/logo.svg.png"
                        alt="FGJN"
                        fill
                        style={{ objectFit: "contain" }}
                        priority
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getUserInitials(user?.name || "U")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm">
                                            {user?.name || "Usuário"}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {user?.email}
                                        </p>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut />
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