import {
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Stethoscope,
} from "lucide-react";
import { Fragment } from "react";

import { Twemoji } from "@/components/customs/twemoji";
import { SITE_METADATA } from "@/shared/site-metadata";
import { FacebookIcon } from "react-share";

function getAccountHandle(url = "") {
  const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  const lastPart = cleanUrl.split("/").pop();
  return lastPart || url;
}

const SOCIALS = [
  {
    platform: "github",
    handle: getAccountHandle(SITE_METADATA.github),
    href: SITE_METADATA.github,
    Icon: () => <Github size={19} strokeWidth={1.5} />,
    umamiEvent: "profile-card-github",
  },
  {
    platform: "linkedin",
    handle: getAccountHandle(SITE_METADATA.linkedin),
    href: SITE_METADATA.linkedin,
    Icon: () => <Linkedin size={19} strokeWidth={1.5} />,
    umamiEvent: "profile-card-linkedin",
  },
  {
    platform: "facebook",
    handle: getAccountHandle(SITE_METADATA.facebook),
    href: SITE_METADATA.facebook,
    Icon: () => <Facebook size={19} strokeWidth={1.5} />,
    umamiEvent: "profile-card-facebook",
  },
];

export function ProfileCardInfo() {
  return (
    <div className="hidden py-5 md:block md:px-6">
      {/* Tên - Cỡ XL là vừa đẹp */}
      <h3 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
        Hữu{" "}
        <span className="text-xs font-mono text-gray-400 ml-1 font-normal">
          (huu.dev)
        </span>
      </h3>

      {/* Role - Nhấn nhá màu sắc một chút */}
      <h5 className="py-1.5 text-[14px] font-mono font-medium text-cyan-600 dark:text-cyan-400">
        Doctor | Web Developer
      </h5>

      <div className="mb-1 mt-4 space-y-3.5">
        {/* Nghề nghiệp */}
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Stethoscope
            strokeWidth={1.5}
            size={19}
            className="text-gray-400/80"
          />
          <p className="px-3 text-[15px]">
            ICU Doctor @{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              PNT University
            </span>
          </p>
        </div>

        {/* Địa điểm */}
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <MapPin strokeWidth={1.5} size={19} className="text-gray-400/80" />
          <p className="px-3 text-[15px] flex items-center">
            [::1]:443 - Sai Gon,
            <span className="ml-1.5 inline-flex">
              <Twemoji emoji="flag-vietnam" />
            </span>
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Mail strokeWidth={1.5} size={19} className="text-gray-400/80" />
          <a
            className="px-3 text-[15px] hover:text-cyan-500 transition-colors underline-offset-4"
            href={`mailto:${SITE_METADATA.email}`}
          >
            {SITE_METADATA.email}
          </a>
        </div>

        {/* Socials - Sắp xếp lại gọn gàng */}
        <div className="flex flex-wrap items-center gap-y-2 pt-4 border-t border-gray-100 dark:border-gray-800/50 mt-4">
          {SOCIALS.map(({ platform, handle, href, Icon, umamiEvent }, idx) => (
            <Fragment key={platform}>
              <a
                target="_blank"
                href={href}
                rel="noreferrer"
                className="flex items-center text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                data-umami-event={umamiEvent}
              >
                <Icon />
                <span className="ml-2 font-mono text-xs font-medium">
                  {handle}
                </span>
              </a>
              {idx !== SOCIALS.length - 1 && (
                <span className="mx-3 text-gray-200 dark:text-gray-800">/</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
