/* eslint-disable @typescript-eslint/no-explicit-any */

import { EOrderStatus } from "@/generated/prisma/enums";

export const POSTS_PER_PAGE = 9;

// export const example_image_upload_handler = (
//   blobInfo: { blob: () => Blob; filename: () => string | undefined },
//   progress: (arg0: number) => void
// ) =>
//   new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = false;
//     xhr.open("POST", "testupload");

//     xhr.upload.onprogress = (e) => {
//       progress((e.loaded / e.total) * 100);
//     };

//     xhr.onload = () => {
//       if (xhr.status === 403) {
//         reject({ message: "HTTP Error: " + xhr.status, remove: true });
//         return;
//       }

//       if (xhr.status < 200 || xhr.status >= 300) {
//         reject("HTTP Error: " + xhr.status);
//         return;
//       }

//       const json = JSON.parse(xhr.responseText);

//       if (!json || typeof json.location != "string") {
//         reject("Invalid JSON: " + xhr.responseText);
//         return;
//       }

//       resolve(json.location);
//     };

//     xhr.onerror = () => {
//       reject(
//         "Image upload failed due to a XHR Transport error. Code: " + xhr.status
//       );
//     };

//     const formData = new FormData();
//     formData.append("file", blobInfo.blob(), blobInfo.filename());

//     xhr.send(formData);
//   });

export const editorOptions = (field: any, theme: any) => ({
  initialValue: "",
  onBlur: field.onBlur,
  onEditorChange: (content: any) => field.onChange(content),
  init: {
    // images_upload_handler: example_image_upload_handler,
    codesample_global_prismjs: true,
    skin: theme === "dark" ? "oxide-dark" : "oxide",
    height: 500,
    menubar: true,
    selector: "textarea",

    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      // "file-manager",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "codesample",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "importword",
      // "heading",
    ],
    // Flmngr: {
    //   // apiKey: process.env.FLMNGR_KEY,
    //   apiKey: "C6kn32p9NALO0e8kBs4m16Dy",
    // },
    toolbar:
      "undo redo | " +
      "code codesample | bold italic forecolor alignleft aligncenter alignright alignjustify |" +
      " | bullist numlist |" +
      "image importword |" +
      "h1 h2 h3 h4 h5 h6 | preview | fullscreen |" +
      "link",
    content_style: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');body { font-family: Manrope,Helvetica,Arial,sans-serif; font-size:14px; line-height: 2; padding-bottom: 32px; } img { max-width: 100%; height: auto; display: block; margin: 0 auto; };`,
  },
});
export const OrderStatus: Record<
  EOrderStatus,
  {
    text: string;
    className: string;
  }
> = {
  SUCCESS: {
    text: "Đã thanh toán",
    className: "bg-primary text-foreground",
  },

  PENDING: {
    text: "Đang đợi",
    className: "bg-orange-600 text-foreground",
  },
  FAILED: {
    text: "Lỗi",
    className: "bg-red-600 text-foreground",
  },
  // REFUNDED: {
  //   text: "Đã trả",
  //   className: "bg-red-600 text-foreground",
  // },
};
export const baseButtonClassName =
  "rounded-lg p-2 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0";

export const primaryButtonClassName = `bg-primary text-white dark:bg-primary button-styles ${baseButtonClassName}`;
export const commonButtonClassName = `${baseButtonClassName} w-[140px] ml-auto bg-primary dark:bg-foreground hover:bg-destructive dark:hover:bg-primary"`;
