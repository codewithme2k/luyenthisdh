import { formatDistanceToNow } from "date-fns";
import slugify from "slugify";
import { vi } from "date-fns/locale";
export const convertSlug = (str: string): string => {
  return slugify(str, {
    lower: true,
    locale: "vi",
    remove: /[*+~.()'"!:@,?_]/g,
  });
};
export function formatDate(dateInput: Date | string, locale = "en-US") {
  const date = new Date(dateInput);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export const formatThoundsand = (num: number): string => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), {
    addSuffix: true,
    locale: vi,
  });
}
export function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
