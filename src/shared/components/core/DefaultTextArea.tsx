import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface IDefaultTextAreaProps<TFormValues extends FieldValues> {
    name: Path<TFormValues>;
    control: UseFormReturn<TFormValues>["control"];
    label?: string;
    inputClassName?: string;
    placeholder?: string;
    autoComplete?: 'off' | 'on';
    width?: number | string;
    readOnly?: boolean;
}

const DefaultTextArea = <TFormValues extends FieldValues>({
    control,
    name,
    label,
    inputClassName,
    placeholder,
    autoComplete,
    width,
    readOnly = false,
}: IDefaultTextAreaProps<TFormValues>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <Field style={{ width: width || '100%' }}>
                    {label && <FieldLabel className="dark:text-[#f1f7feb5] text-sm">{label}</FieldLabel>}
                    <Textarea
                        className={inputClassName}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        readOnly={readOnly}
                        {...field}
                    />
                    <FieldError>{error?.message}</FieldError>
                </Field>
            )}
        />
    );
};

export default DefaultTextArea;
