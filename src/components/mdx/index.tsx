
import type { MDXComponents } from "mdx/types";
import { Image, type ImageProps } from "@/components/customs/image";

import { Twemoji } from "@/components/customs/twemoji";
import { CodeTitle } from "./code-title";
import { Pre } from "./pre";
import { TableWrapper } from "./table-wrapper";
import Link from "next/link";
import SOFA2Calculator from "@/components/tools/SOFA2Calculator";
import dynamic from "next/dynamic";

const Zoom = dynamic(
  () => import("@/components/customs/image").then((mod) => mod.Zoom),
  {
    ssr: false,
  },
);

export const MDX_COMPONENTS: MDXComponents = {
  Image: ({ alt, ...rest }: ImageProps) => {
    return (
      <Zoom>
        <Image alt={alt} {...rest} />
      </Zoom>
    );
  },
  Twemoji,
  CodeTitle,
  a: Link,
  pre: Pre,
  table: TableWrapper,
  SOFA2Calculator: SOFA2Calculator,
};
