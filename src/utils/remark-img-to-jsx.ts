import { visit } from "unist-util-visit";
import { Node, Parent, Literal } from "unist";
import fs from "node:fs";
import path from "node:path";
import { sync as sizeOf } from "probe-image-size";

export type ImageNode = Node & {
  url: string;
  alt: string;
  name: string;
  attributes: (Literal & { name: string; value: any })[];
};

export default function remarkImgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      (node: Node): node is Parent =>
        node.type === "paragraph" &&
        "children" in node &&
        (node as Parent).children.some((n) => n.type === "image"),
      (node: Parent) => {
        const imageNodeIndex = node.children.findIndex(
          (n) => n.type === "image",
        );
        const imageNode = node.children[imageNodeIndex] as ImageNode;

        const imagePath = path.join(process.cwd(), "public", imageNode.url);

        imageNode.type = "mdxJsxFlowElement";
        imageNode.name = "Image";
        imageNode.attributes = [
          { type: "mdxJsxAttribute", name: "alt", value: imageNode.alt || "" },
          { type: "mdxJsxAttribute", name: "src", value: imageNode.url },
        ];

        if (fs.existsSync(imagePath)) {
          try {
            const dimensions = sizeOf(fs.readFileSync(imagePath));
            if (dimensions && dimensions.width && dimensions.height) {
              imageNode.attributes.push(
                {
                  type: "mdxJsxAttribute",
                  name: "width",
                  value: dimensions.width,
                },
                {
                  type: "mdxJsxAttribute",
                  name: "height",
                  value: dimensions.height,
                },
              );
            }
          } catch (error) {
            console.error(
              `Error processing image size for: ${imagePath}`,
              error,
            );
          }
        }

        node.type = "div";
        node.children[imageNodeIndex] = imageNode;
      },
    );
  };
}
