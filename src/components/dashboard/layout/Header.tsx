"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

// import { logout } from "@/shared/actions/auth.action";
import { useSidebar } from "./SidebarProvider";

import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOut } from "next-auth/react";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const [notificationCount, setNotificationCount] = useState(1);
  const onClick = () => {
    signOut({ callbackUrl: "/" });
  };
  const user = useCurrentUser();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex items-center gap-3 md:ml-auto">
        <div className="relative md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md pl-8 md:w-auto"
          />
        </div>
        <ThemeSwitcher />
        {/* Country/Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg?height=32&width=32&text=US"
                  alt="US"
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg?height=32&width=32&text=US"
                  alt="US"
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <span>English (US)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1e7.svg?height=20&width=20&text=UK"
                  alt="UK"
                />
                <AvatarFallback>UK</AvatarFallback>
              </Avatar>
              <span>English (UK)</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1f5-1f1eb.svg?height=20&width=20&text=FR"
                  alt="FR"
                />
                <AvatarFallback>FR</AvatarFallback>
              </Avatar>
              <span>French</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <h4 className="font-medium">Notifications</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={() => setNotificationCount(0)}
              >
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div
                className={cn(
                  "flex gap-4 p-3 hover:bg-accent",
                  notificationCount > 0 ? "bg-accent/50" : ""
                )}
              >
                <Avatar>
                  <AvatarImage src="/js-96.png?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">John Doe</span> mentioned you
                    in a comment
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 hover:bg-accent">
                <Avatar>
                  <AvatarImage src="/js-96.png?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Jane Smith</span> assigned you
                    a task
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 hover:bg-accent">
                <Avatar>
                  <AvatarImage src="/js-96.png?height=40&width=40" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">System</span> scheduled
                    maintenance this weekend
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="cursor-pointer justify-center text-center"
            >
              <Link href="/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Appearance</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Help & Documentation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || "/logo.jpg?height=40&width=40"}
                  alt="Avatar"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.image || "/logo.jpg?height=40&width=40"}
                  alt="Angelina Cotelli"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name || "Agen"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "admin-01@ecme.com"}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Setting</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Activity className="mr-2 h-4 w-4" />
              <span>Activity Log</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={onClick} className="cursor-pointer">
                Logout
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
