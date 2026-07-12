import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { type FieldValues, type Path, type UseFormReturn, Controller } from "react-hook-form";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

export type SelectOption = {
    label: string;
    value: number;
};

interface IDefaultSelectProps<TFormValues extends FieldValues> {
    name: Path<TFormValues>;
    control: UseFormReturn<TFormValues>["control"];
    label?: string;
    placeholder?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    message?: string;
    inputClassName?: string;
    options?: SelectOption[];
    isLoading?: boolean;
    disabled?: boolean;
    onChangeCallback?: (value: number | null) => void;
}

export const DefaultSelect = <TFormValues extends FieldValues>({
    name,
    control,
    label,
    inputClassName,
    placeholder = "Select an option",
    width = "100%",
    minWidth,
    maxWidth,
    message,
    options = [],
    isLoading = false,
    disabled = false,
    onChangeCallback,
}: IDefaultSelectProps<TFormValues>) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const filteredOptions = search
        ? options.filter((option) =>
            option.label.toLowerCase().startsWith(search.toLowerCase())
        ) || []
        : options;

    useEffect(() => {
        const handleFocus = () => {
            inputRef.current?.focus();
        };

        document.addEventListener("mousedown", handleFocus);

        return () => {
            document.removeEventListener("mousedown", handleFocus);
        };
    }, []);

    return (
        <Controller
            control={control}
            name={name}
            disabled={disabled}
            render={({ field, fieldState: { error } }) => {
                const handleValueChange = (value: string | undefined) => {
                    const numberValue = value ? parseInt(value, 10) : null;
                    field.onChange(numberValue);
                    if (onChangeCallback) {
                        onChangeCallback(numberValue);
                    }
                };

                const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target?.value || "";
                    setSearch(value);
                };

                return (
                    <Field
                        className="flex flex-col pt-1"
                        style={{ width, minWidth, maxWidth }}
                    >
                        {label && <FieldLabel className="mb-1">{label}</FieldLabel>}
                        {isLoading ? (
                            <Skeleton
                                className={`h-10 ${width ? `w-${width}` : "w-full"}`}
                            />
                        ) : (
                            <>
                                <Select
                                    onValueChange={handleValueChange}
                                    value={field.value ? field.value.toString() : ""}
                                    onOpenChange={() => {
                                        setSearch("");
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <SelectTrigger className={inputClassName} disabled={disabled}>
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                    <SelectContent side="bottom">
                                        <SelectGroup>
                                            <Input
                                                ref={inputRef}
                                                type="text"
                                                onChange={handleSearch}
                                                placeholder="Search..."
                                            />
                                            <SelectSeparator />
                                        </SelectGroup>
                                        {filteredOptions && filteredOptions?.length > 0 ? (
                                            <SelectGroup>
                                                {filteredOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value?.toString()}
                                                        className="flex justify-between items-center"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No options available
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {message && <FieldDescription>{message}</FieldDescription>}
                                <FieldError>{error?.message}</FieldError>
                            </>
                        )}
                    </Field>
                );
            }}
        />
    );
};
