/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ShoppingCart,
  BadgeDollarSign,
  CreditCard,
  Layers,
  Hexagon,
  Tag,
  Package,
  User,
} from "lucide-react";

import { SITE_METADATA } from "../site-metadata";
import { EUserRole } from "@/generated/prisma";

export interface MenuItem {
  title: string;
  href: string;
  icon: any;
  roles?: EUserRole[];
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuData: MenuSection[] = [
  {
    title: "Content Management",
    items: [
      {
        title: "Quản lý môn học",
        href: "/admin/subject",
        icon: Hexagon,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Thêm môn học",
            href: "/admin/subject/create",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
          {
            title: "Danh sách môn học",
            href: "/admin/subject",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },

      {
        title: "Quản lý khoá học",
        href: "/admin/course",
        icon: Package,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Danh sách khoá học",
            href: "/admin/course",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
          {
            title: "Thêm khoá học",
            href: "/admin/course/create",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },
      {
        title: "Quản lý bài thi",
        href: "/admin/test",
        icon: Layers,
        roles: [EUserRole.MANAGER, EUserRole.ADMIN],
        children: [
          {
            title: "Tất cả bài thi",
            href: "/admin/test",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
          {
            title: "Thêm bài thi",
            href: "/admin/test/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
      {
        title: "Category",
        href: "/admin/category",
        icon: Hexagon,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Thêm category",
            href: "/admin/category/create",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
          {
            title: "Danh sách category",
            href: "/admin/category",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },

      {
        title: "Tag",
        href: "/admin/tag",
        icon: Tag,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Tag List",
            href: "/admin/tag",
            icon: null,
            roles: [EUserRole.MANAGER, EUserRole.ADMIN],
          },
          {
            title: "Create Tag",
            href: "/admin/tag/create",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },
      {
        title: "Bài viết",
        href: "/admin/blog",
        icon: Package,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Danh sách bài viết",
            href: "/admin/blog",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
          {
            title: "Thêm bài viết",
            href: "/admin/blog/create",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },
      {
        title: "Coupon",
        href: "/admin/coupon",
        icon: BadgeDollarSign,
        roles: [EUserRole.ADMIN],
        children: [
          {
            title: "Thêm coupon",
            href: "/admin/coupon/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
          {
            title: "Danh sách coupon",
            href: "/admin/coupon",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
      {
        title: "Đơn hàng",
        href: "/admin/order",
        icon: CreditCard,
        roles: [EUserRole.ADMIN],
        children: [
          {
            title: "Thêm đơn hàng",
            href: "/admin/order/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
          {
            title: "Danh sách đơn hàng",
            href: "/admin/order",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Thành viên",
        href: "/admin/user",
        icon: User,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER],
        children: [
          {
            title: "Thêm thành viên",
            href: "/admin/user/create",
            icon: User,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
          {
            title: "Danh sách thành viên",
            href: "/admin/user",
            icon: null,
            roles: [EUserRole.ADMIN, EUserRole.MANAGER],
          },
        ],
      },
      {
        title: "Vai trò",
        href: "/admin/role",
        icon: Layers,
        roles: [EUserRole.MANAGER, EUserRole.ADMIN],
        children: [
          {
            title: "Tất cả vai trò",
            href: "/admin/role",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
          {
            title: "Thêm vai trò",
            href: "/admin/role/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
    ],
  },
  {
    title: "System Settings",
    items: [
      {
        title: "System Settings",
        href: "/admin/system",
        icon: Hexagon,
        roles: [EUserRole.ADMIN],
        children: [
          {
            title: "Thêm banner",
            href: "/admin/banner/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
          {
            title: "Danh sách banner",
            href: "/admin/banner",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
      {
        title: "Notification Management",
        href: "/admin/submission",
        icon: Hexagon,
        roles: [EUserRole.ADMIN],
        children: [
          {
            title: "Danh sách submission",
            href: "/admin/submission",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
      {
        title: "Analytics & Reports",
        href: "/admin/analytics",
        icon: Hexagon,
        roles: [EUserRole.ADMIN],
        children: [
          {
            title: "Thêm banner",
            href: "/admin/banner/create",
            icon: null,
            roles: [EUserRole.ADMIN],
          },
        ],
      },
    ],
  },

  {
    title: "Menu",
    items: [
      {
        title: "Thay đổi thông tin",
        href: "/dashboard/edit-profile",
        icon: Layers,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER, EUserRole.USER],
      },
      {
        title: "Khoá học đã mua",
        href: "/dashboard/course",
        icon: ShoppingCart,
        roles: [EUserRole.ADMIN, EUserRole.MANAGER, EUserRole.USER],
      },
    ],
  },
];

export const HEADER_NAV_LINKS = [
  { href: "/blog", title: "Blog", emoji: "writing-hand" },
  { href: "/tools", title: "Tools", emoji: "dna" },
  { href: "/courses", title: "Courses", emoji: "man-technologist" },
  { href: "/about", title: "About", emoji: "billed-cap" },
];

export const MORE_NAV_LINKS = [
  { href: "/books", title: "Books", emoji: "books" },
  { href: "/movies", title: "Movies", emoji: "film-frames" },
  { href: "/tags", title: "Tags", emoji: "label" },
];

export const FOOTER_NAV_LINKS = [
  { href: "/blog", title: "Blog" },
  { href: "/tools", title: "Tools" },
  { href: "/projects", title: "Projects" },
  { href: "/tags", title: "Tags" },
  { href: "/feed.xml", title: "RSS Feed" },
];

export const FOOTER_PERSONAL_STUFF = [
  { href: "/about", title: "About" },
  { href: "/static/resume.pdf", title: "Resume" },
  { href: "/books", title: "Books" },
  { href: "/movies", title: "Movies" },
  { href: SITE_METADATA.analytics.umamiAnalytics.shareUrl, title: "Analytics" },
];
