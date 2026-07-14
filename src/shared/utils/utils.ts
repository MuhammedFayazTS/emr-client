import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SelectOption } from "../components/core/DefaultSelect";

interface RawOption {
  name: string;
  _id?: string;
  id?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOption = (item: RawOption): SelectOption | undefined => {
  const value = item._id ?? item.id;
  if (!item || !value) return undefined;

  return {
    label: item.name,
    value,
  };
};

export const formatOptions = (data: RawOption[] | undefined | null): SelectOption[] => {
  if (!data) return [];

  return data.reduce<SelectOption[]>((acc, item) => {
    const option = formatOption(item);
    if (option) acc.push(option);
    return acc;
  }, []);
};
