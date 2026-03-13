'use client';
import { IconMicrophoneFilled, IconHome, IconLibrary, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { Player } from "./Player";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOutIcon, UserCircle } from "lucide-react";

export default function MobileTabs() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/sign-in';
  };

  return (
   <>
   <div>
    <Player />
   </div>
   <nav className="fixed bottom-0 inset-x-0 bg-background border-t flex justify-around items-center h-14 md:hidden z-50">
     {[
       { icon: <IconHome />, label: "Home", href: "/" },
       { icon: <IconMicrophoneFilled />, label: "Artist", href: "/artists" },
       { icon: <IconLibrary />, label: "Library", href: "/albums" },
       { icon: <IconSearch />, label: "Search", href: "/genres" },
     ].map((tab) => (
       <Link
        key={tab.label} 
        href={tab.href} 
        className={cn(
          "flex flex-col items-center text-xs",
          pathname === tab.href ? "text-pink-500 font-semibold" : "font-normal"
          
        )}
       >
         {tab.icon}
         {tab.label}
       </Link>
     ))}
        {user?.id ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-13 h-13 rounded-full">
                {user.avatar_url ? (
                  <AvatarImage
                   src={user.avatar_url} 
                   alt={user.fullName} 
                   className="w-12 h-12 rounded-full border-gray-300" 
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
                  <Avatar className="h-10 w-10 rounded-full">
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
   </nav>
   </>
  );
}
