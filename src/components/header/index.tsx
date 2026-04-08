"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { KbarSearchTrigger } from "@/components/search/kbar-trigger";
import { GrowingUnderline } from "@/components/customs/growing-underline";
import { SITE_METADATA } from "@/shared/site-metadata";
import { Container } from "../customs/Container";
import { Logo } from "./logo";
import { ThemeSwitcher } from "../theme-switcher";
import { MobileNav } from "./mobile-nav";
import { HEADER_NAV_LINKS } from "@/shared/constants/menu";
import Link from "next/link";
import { MoreLinks } from "./more-link";
import { AuthButtons } from "./auth-buttons";

let logged = false;
function logASCIItext() {
  if (logged) return;
  console.info(`
  _                _____                    
 | |              |  __ \\                   
 | |     ___  ___ | |  | | ___   __ _ _ __  
 | |    / _ \\/ _ \\| |  | |/ _ \\ / _\` | '_ \\ 
 | |___|  __/ (_) | |__| | (_) | (_| | | | |
 |______\\___|\\___/|_____/ \\___/ \\__,_|_| |_|
  `);
  console.log("🧑‍💻 View source:", SITE_METADATA.siteRepo);
  console.log(`🙌 Let's connect:`, SITE_METADATA.x);
  logged = true;
}

export function Header() {
  const pathname = usePathname();

  // Gọi hàm log một lần duy nhất khi mount
  useEffect(() => {
    logASCIItext();
  }, []);

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <Container
      className={clsx(
        "dark:bg-dark/75 bg-background py-2 backdrop-blur-sm",
        "shadow-xs saturate-100 md:rounded-2xl",
        SITE_METADATA.stickyNav
          ? "sticky top-2 z-50 lg:top-3"
          : "relative mt-2 lg:mt-3",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden gap-1.5 sm:flex">
            {HEADER_NAV_LINKS.map(({ title, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={title}
                  href={href}
                  className="px-3 py-1 font-medium no-underline"
                >
                  <GrowingUnderline
                    className={clsx(isActive && "bg-size-[100%_100%]")}
                    data-umami-event={`nav-${href.replace("/", "")}`}
                  >
                    {title}
                  </GrowingUnderline>
                </Link>
              );
            })}
            <MoreLinks />
          </div>

          <div
            data-orientation="vertical"
            role="separator"
            className="hidden h-4 w-px shrink-0 bg-gray-200 md:block dark:bg-gray-600"
          />

          <div className="flex items-center gap-2">
            <AuthButtons
              loginOpen={loginOpen}
              setLoginOpen={setLoginOpen}
              signupOpen={signupOpen}
              setSignupOpen={setSignupOpen}
            />
            <ThemeSwitcher />
            <KbarSearchTrigger />
            <MobileNav />
          </div>
        </div>
      </div>
    </Container>
  );
}
