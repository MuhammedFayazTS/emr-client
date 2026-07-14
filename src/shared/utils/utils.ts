import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOption = (item: { name: string; _id?: string; id?: string }) => {
  if (!item?.id && !item?._id) return;
  return {
    label: item.name,
    value: item._id || item.id,
  };
};

export const formatOptions = (data: { name: string; _id?: string; id?: string }[]) => {
  return data?.map((item) => {
    return formatOption(item);
  });
};
