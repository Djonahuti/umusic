"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, LogOutIcon, UserCircle } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/AuthContext"
import { User } from "@/types"
import { SearchForm } from "@/components/SearchForm"
import Logo from "../../../public/Logo"
import { Separator } from "@/components/ui/separator"

const data = {
  navMain: [
    {
      title: "Getting Started",
      href: "#",
      items: [
        { title: "Dashboard", href: "/admin/dashboard" },
        { title: "Users", href: "/admin/users" },
        { title: "Songs", href: "/admin/songs" },
        { title: "Artists", href: "/admin/artists" },
        { title: "Albums", href: "/admin/albums" },
        { title: "Genres", href: "/admin/genres" },
      ],
    },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/sign-in'
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
       <Link href="/" className="flex items-center space-x-2 p-2"> 
        <Logo />
       </Link> 
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((nav) => (
                      <SidebarMenuItem key={nav.title}>
                        <SidebarMenuButton asChild isActive={pathname === nav.href}>
                          <Link href={nav.href}>{nav.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <Separator className="my-2" />
                  <SidebarMenu>
                    {user && user.id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Avatar className="w-8 h-8 rounded-full">
                            {user.avatar_url ? (
                              <AvatarImage
                                src={user.avatar_url}
                                alt={user.fullName}
                                className="w-10 h-10 rounded-full border-gray-300"
                              />
                            ) : (
                              <AvatarFallback className="rounded-full">{user.fullName?.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                          align="end"
                          sideOffset={4}
                        >
                          <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-full">
                                {user.avatar_url ? (
                                  <AvatarImage
                                    src={user.avatar_url}
                                    alt={user.fullName}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <AvatarFallback className="rounded-full">{user.fullName?.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.fullName}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <Link href="/profile" className="flex items-center gap-2">
                                <UserCircle className="w-4 h-4" />Profile
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <button onClick={handleLogout} className="flex space-x-0 w-full text-left cursor-pointer">
                              <LogOutIcon />
                              Log out
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link href="/sign-in" className="rounded-full">
                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarFallback className="rounded-full">US</AvatarFallback>
                        </Avatar>
                      </Link>
                    )}
                    <ThemeToggle />
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}