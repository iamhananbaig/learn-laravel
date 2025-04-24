import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Key, SlidersVertical, UserRound } from 'lucide-react';
import * as React from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
    SidebarRail,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'User Management',
            url: '#',
            icon: Users,
            items: [
                {
                    title: 'Permissions',
                    url: '/permissions',
                    icon: Key,
                },
                {
                    title: 'Roles',
                    url: '/roles',
                    icon: SlidersVertical,
                },
                {
                    title: 'Users',
                    url: '/users',
                    icon: UserRound,
                },
            ],
        },
        {
            title: 'Vendors',
            url: '/vendors',
            icon: LayoutDashboard,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url } = usePage();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {data.navMain.map((item) => {
                    const hasChildren = !!item.items?.length;
                    const isActiveParent = item.items?.some((sub) => url.startsWith(sub.url));

                    if (!hasChildren) {
                        // Direct item (Dashboard), styled like parent
                        return (
                            <SidebarGroup key={`${item.title}-${item.url}`}>
                                <SidebarGroupLabel
                                    asChild
                                    className={`group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm ${
                                        url === item.url ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                    }`}
                                >
                                    <a href={item.url} className="flex w-full items-center gap-2 rounded-md px-3 py-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarGroupLabel>
                            </SidebarGroup>
                        );
                    }

                    // Collapsible parent with submenu
                    return (
                        <Collapsible key={item.title} title={item.title} className="group/collapsible" defaultOpen={isActiveParent}>
                            <SidebarGroup>
                                <SidebarGroupLabel
                                    asChild
                                    className={`group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-2 text-sm ${
                                        isActiveParent ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                    }`}
                                >
                                    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuItem key={`${subItem.title}-${subItem.url}`}>
                                                    <SidebarMenuButton asChild isActive={url.startsWith(subItem.url)}>
                                                        <a href={subItem.url} className="flex items-center gap-2 pl-6">
                                                            {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    );
                })}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
