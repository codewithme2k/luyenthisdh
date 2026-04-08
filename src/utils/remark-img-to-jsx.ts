import { visit } from "unist-util-visit";
import { Node, Parent } from "unist";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";

// Định nghĩa interface cho Image Node để tránh lỗi "property does not exist"
interface ImageNode extends Node {
  url: string;
  alt?: string;
  name?: string;
  attributes?: any[];
  type: "image" | "mdxJsxFlowElement";
}

export default function remarkImgToJsx() {
  return (tree: Node) => {
    // Sử dụng 'image' để lọc đúng các node là hình ảnh
    visit(tree, "image", (node: ImageNode) => {
      // Xác định đường dẫn vật lý của ảnh (thường nằm trong thư mục public)
      const imagePath = path.join(process.cwd(), "public", node.url);

      // 1. Kiểm tra file có tồn tại không để tránh crash build
      if (fs.existsSync(imagePath)) {
        try {
          // 2. Lấy kích thước ảnh
          const dimensions = sizeOf(imagePath as any);

          // 3. Kiểm tra dimensions không null (Sửa lỗi "possibly null")
          if (dimensions && dimensions.width && dimensions.height) {
            // Chuyển đổi node image markdown thành mdxJsxFlowElement (để dùng với Next Image)
            node.type = "mdxJsxFlowElement";
            node.name = "img";
            node.attributes = [
              { type: "mdxJsxAttribute", name: "alt", value: node.alt || "" },
              { type: "mdxJsxAttribute", name: "src", value: node.url },
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
            ];
          }
        } catch (error) {
          console.error(`Error processing image size for: ${imagePath}`, error);
        }
      }
    });
  };
}
