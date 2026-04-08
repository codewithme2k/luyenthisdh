"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { MenuItem, MenuSection, menuData } from "@/shared/constants/menu";
import { useSidebar } from "./SidebarProvider";

import { SITE_METADATA } from "@/shared/site-metadata";
import { Logo } from "./logo";
import { EUserRole } from "@/generated/prisma/enums";

function filterMenuByRole(menu: MenuSection[], role: EUserRole): MenuSection[] {
  return menu
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => ({
          ...item,
          children: item.children?.filter(
            (child) => !child.roles || child.roles.includes(role),
          ),
        }))
        .filter((item) => !item.children || item.children.length > 0),
    }))
    .filter((section) => section.items.length > 0);
}

// Main sidebar component
export function Sidebar({ role }: { role: EUserRole }) {
  const pathname = usePathname();
  const { isOpen, isMobile, closeSidebar, toggleSidebar } = useSidebar();
  const filteredMenu = filterMenuByRole(menuData, role);

  const handleNavClick = () => {
    if (isMobile) closeSidebar();
  };

  // Mini sidebar
  if (!isOpen && !isMobile) {
    return (
      <aside className="fixed inset-y-0 left-0 z-20 w-16 border-r bg-background">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isOpen ? <Logo /> : ""}

          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-muted bg-background"
            aria-label="Mở sidebar"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 py-4">
          {filteredMenu.flatMap((section) =>
            section.items.map((item, index) =>
              item.icon ? (
                <item.icon
                  key={`${section.title}-${index}`}
                  className="h-5 w-5 text-muted-foreground"
                />
              ) : null,
            ),
          )}
        </div>
      </aside>
    );
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 border-r bg-background transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-medium">{SITE_METADATA.headerTitle}</span>
          </div>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded p-1 hover:bg-muted"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto py-2">
          {filteredMenu.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              pathname={pathname}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </aside>
      <div className={cn("w-0 flex-shrink-0 md:w-64", !isOpen && "md:w-16")} />
    </>
  );
}

// Section component
function NavSection({
  section,
  pathname,
  onClick,
}: {
  section: MenuSection;
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <div className="py-2">
      <h3 className="mb-2 px-3 text-md font-semibold text-muted-foreground text-green-600">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <NavItem
              key={index}
              item={item}
              isActive={isActive}
              pathname={pathname}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
}

// Nav item (with optional children)
function NavItem({
  item,
  isActive,
  pathname,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  pathname: string;
  onClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  return (
    <div className="relative">
      <Link
        href={hasChildren ? "#" : item.href}
        onClick={toggleOpen}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span>{item.title}</span>
        </div>
        {hasChildren && (
          <div className="text-muted-foreground">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </Link>
      {hasChildren && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child, index) => (
            <SubNavItem
              key={index}
              item={child}
              isActive={pathname === child.href}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-item
function SubNavItem({
  item,
  isActive,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {item.title}
    </Link>
  );
}
