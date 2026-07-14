"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Controller, type UseFormReturn, type FieldValues, type Path } from "react-hook-form";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { cn } from "@/shared/utils/utils";

interface IDefaultDateRangePickerProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: UseFormReturn<TFormValues>["control"];
  label?: string;
  placeholder?: string;
  width?: number | string;
  readOnly?: boolean;
  onChange: (from: Date | null, to: Date | null) => void;
}

const DefaultDateRangePicker = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Pick a date range",
  width,
  readOnly = false,
  onChange,
}: IDefaultDateRangePickerProps<TFormValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const dateRange = field.value as DateRange | undefined;

        const handleDateChange = (selected: DateRange | undefined) => {
          if (selected) {
            onChange(selected.from ?? null, selected.to ?? null);
          }
        };

        return (
          <Field style={{ width: width || "100%" }}>
            {label && <FieldLabel className="dark:text-[#f1f7feb5] text-sm">{label}</FieldLabel>}
            <Popover>
              <PopoverTrigger
                render={<Button variant="outline" />}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && !dateRange?.to && "text-muted-foreground",
                  readOnly && "cursor-not-allowed opacity-50",
                )}
                disabled={readOnly}
              >
                <CalendarIcon className="mr-2" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>{placeholder}</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FieldError>{error?.message}</FieldError>
          </Field>
        );
      }}
    />
  );
};

export default DefaultDateRangePicker;
