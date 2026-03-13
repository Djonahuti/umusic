'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { IconPlaylist } from "@tabler/icons-react";
import {
  Calendar,
  Mic,
  Folder,
  Music,
  Guitar,
  MoreHorizontal,
  UserCircle,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ThemeToggle } from "../ThemeToggle";

export function MobileNav() {
  const pathname = usePathname();
  const libraryItems = [
    { icon: <Calendar className="text-pink-500" />, label: "Recently Added", href: "/" },
    { icon: <Mic className="text-pink-500" />, label: "Artists", href: "/artists" },
    { icon: <Folder className="text-pink-500" />, label: "Albums", href: "/albums" },
    { icon: <Music className="text-pink-500" />, label: "Songs", href: "/songs" },
    { icon: <Guitar className="text-pink-500" />, label: "Genre", href: "/genres" },
    { icon: <IconPlaylist className="text-pink-500" />, label: "Playlist", href: "/playlists" },
  ];  
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/sign-in';
  };

  return (
    <nav className="w-full max-w-md mx-auto rounded-xl shadow p-4 md:hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Library</h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <MoreHorizontal className="w-6 h-6 text-gray-500" />
          </button>
        {user?.id ? (
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
        ):(
        <Link href="/sign-in" className="rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback className="rounded-full">US</AvatarFallback>
          </Avatar>        
        </Link>          
        )}
        <ThemeToggle />        
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {libraryItems.map(({ icon, label, href }) => (
         <li key={href}>
          <Link
           className={cn(
             "flex items-center gap-2 py-2 cursor-pointer hover:underline",
             pathname === href ? "text-pink-700 font-semibold" : "font-normal"
           )} 
           href={href}
          >
            <span className="flex items-center">{icon}</span>
            <span>{label}</span>
          </Link>
          </li> 
        ))}
      </ul>
    </nav>
  );
}
