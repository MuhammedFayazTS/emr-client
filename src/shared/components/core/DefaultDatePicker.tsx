"use client"

import { Controller, type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { cn } from "@/shared/utils/utils";
import { Calendar } from "../ui/calendar";
import { DefaultTimePicker } from "./DefaultTimePicker";

interface IDefaultDatePickerProps<TFormValues extends FieldValues> {
    name: Path<TFormValues>;
    control: UseFormReturn<TFormValues>["control"];
    label?: string;
    placeholder?: string;
    width?: number | string;
    readOnly?: boolean;
    withTime?: boolean;
}

const DefaultDatePicker = <TFormValues extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Pick a date",
    width,
    readOnly = false,
    withTime = false,
}: IDefaultDatePickerProps<TFormValues>) => {

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {
                const date = field.value ? new Date(field.value) : undefined;
                return (
                    <Field style={{ width: width || "100%" }}>
                        {label && <FieldLabel className="dark:text-[#f1f7feb5] text-sm">{label}</FieldLabel>}
                        <Popover>
                            <PopoverTrigger
                                render={<Button variant="outline" />}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground",
                                    readOnly && "cursor-not-allowed opacity-50"
                                )}
                                disabled={readOnly}
                            >
                                <CalendarIcon className="mr-2" />
                                {date ? (
                                    withTime ? (
                                        `${format(date, "PPP p")}`
                                    ) : (
                                        `${format(date, "PPP")}`
                                    )
                                ) : (
                                    <span>{placeholder}</span>
                                )}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2 space-y-2" align="start">
                                <Calendar
                                    mode="single"
                                    defaultMonth={date}
                                    selected={date}
                                    onSelect={(selected) => {
                                        field.onChange(selected);
                                    }}
                                />

                                {withTime && (
                                    <div className="p-3 border-t border-border">
                                        <DefaultTimePicker
                                            setDate={field.onChange}
                                            date={field.value}
                                        />
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                        <FieldError>{error?.message}</FieldError>
                    </Field>
                );
            }}
        />
    );
};

export default DefaultDatePicker;
