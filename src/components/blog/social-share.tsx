"use client";
import { clsx } from "clsx";
import {
  Facebook,
  Link,
  Linkedin,
  Share2,
  Check,
  MessageCircle,
  Github,
} from "lucide-react";
import { useState } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";

// Import các thành phần của shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { SITE_METADATA } from "@/shared/site-metadata";

type SocialButtonsProps = {
  postUrl: string;
  filePath: string;
  title: string;
  className?: string;
};

export function SocialShare({
  postUrl,
  filePath,
  title,
  className,
}: SocialButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      {/* 1. Trigger dùng Button của shadcn */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={clsx(
            "h-8 gap-1.5 text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <span>Share</span>
          <Share2 className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>

      {/* 2. Content Menu */}
      <DropdownMenuContent align="end" className="w-56">
        {/* Copy Link */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer gap-2.5"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link className="h-4 w-4" />
          )}
          <span className="flex-1">{copied ? "Copied" : "Copy link"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Social Buttons - Dùng asChild để giữ logic của react-share */}
        <DropdownMenuItem asChild>
          <TwitterShareButton
            url={postUrl}
            title={title}
            via={SITE_METADATA.x}
            className="flex w-full items-center gap-2.5 !bg-transparent px-2 py-1.5 text-sm outline-none hover:bg-accent"
          >
            <XIcon className="h-4 w-4" fill="currentColor" />
            <span>Share on X</span>
          </TwitterShareButton>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <LinkedinShareButton
            url={postUrl}
            className="flex w-full items-center gap-2.5 !bg-transparent px-2 py-1.5 text-sm outline-none hover:bg-accent"
          >
            <Linkedin className="h-4 w-4" />
            <span>Share on LinkedIn</span>
          </LinkedinShareButton>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <FacebookShareButton
            url={postUrl}
            className="flex w-full items-center gap-2.5 !bg-transparent px-2 py-1.5 text-sm outline-none hover:bg-accent"
          >
            <Facebook className="h-4 w-4" />
            <span>Share on Facebook</span>
          </FacebookShareButton>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Các liên kết bổ sung */}
        <DropdownMenuItem className="cursor-pointer gap-2.5 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>Discuss on X</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer gap-2.5 text-muted-foreground">
          <Github className="h-4 w-4" />
          <span>Edit on GitHub</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
