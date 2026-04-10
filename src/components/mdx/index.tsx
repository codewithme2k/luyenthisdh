import type { MDXComponents } from "mdx/types";
import { Image, Zoom, type ImageProps } from "@/components/customs/image";

import { Twemoji } from "@/components/customs/twemoji";
import { CodeTitle } from "./code-title";
import { Pre } from "./pre";
import { TableWrapper } from "./table-wrapper";
import Link from "next/link";
import SOFA2Calculator from "@/components/tools/SOFA2Calculator";

const ZoomedImage = ({ alt, ...rest }: ImageProps) => {
  return (
    <Zoom>
      <Image alt={alt} {...rest} />
    </Zoom>
  );
};

export const MDX_COMPONENTS: MDXComponents = {
  Image: ZoomedImage,
  img: ZoomedImage,
  Twemoji,
  CodeTitle,
  a: Link,
  pre: Pre,
  table: TableWrapper,
  SOFA2Calculator: SOFA2Calculator,
};
