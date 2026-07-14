import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";

type InputType = "text" | "email" | "password" | "number";

interface IDefaultTextInputProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: UseFormReturn<TFormValues>["control"];
  label?: string;
  type?: InputType;
  placeholder?: string;
  autoComplete?: "off" | "on";
  width?: number | string;
  readOnly?: boolean;
  inputClassName?: string;
  onChangeCallback?: (value: string) => void;
}

const DefaultTextInput = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  width,
  readOnly = false,
  inputClassName,
  onChangeCallback,
}: IDefaultTextInputProps<TFormValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Field style={{ width: width || "100%" }}>
          {label && <FieldLabel className="dark:text-[#f1f7feb5] text-sm">{label}</FieldLabel>}
          <Input
            className={inputClassName}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            readOnly={readOnly}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChangeCallback?.(e.target.value);
            }}
          />
          <FieldError>{error?.message}</FieldError>
        </Field>
      )}
    />
  );
};

export default DefaultTextInput;
