import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Switch } from "../ui/switch";

interface IDefaultSwitchInputProps<TFormValues extends FieldValues> {
    name: Path<TFormValues>;
    control: UseFormReturn<TFormValues>["control"];
    label?: string;
    description?: string;
    width?: number | string;
    disabled?: boolean;
    onChangeCallback?: (value: boolean) => void;
}

const DefaultSwitchInput = <TFormValues extends FieldValues>({
    control,
    name,
    label,
    description,
    width,
    disabled = false,
    onChangeCallback,
}: IDefaultSwitchInputProps<TFormValues>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <Field style={{ width: width || "100%" }}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            {label && (
                                <FieldLabel className="dark:text-[#f1f7feb5] text-sm">
                                    {label}
                                </FieldLabel>
                            )}
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                        <Switch
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                                onChangeCallback?.(checked);
                            }}
                            disabled={disabled}
                        />
                    </div>
                    <FieldError>{error?.message}</FieldError>
                </Field>
            )}
        />
    );
};

export default DefaultSwitchInput;