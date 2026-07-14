import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel, FieldError } from "../ui/field";

interface IDefaultCheckboxProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  description?: string;
  disabled?: boolean;
  control: UseFormReturn<TFormValues>["control"];
}

export const DefaultCheckbox = <TFormValues extends FieldValues>({
  name,
  label,
  description,
  disabled = false,
  control,
}: IDefaultCheckboxProps<TFormValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Field className="flex flex-row items-start space-x-3 space-y-0">
          <Checkbox disabled={disabled} checked={field.value} onCheckedChange={field.onChange} />
          <div className="grid gap-1.5 leading-none">
            <FieldLabel>{label}</FieldLabel>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <FieldError>{error?.message}</FieldError>
        </Field>
      )}
    />
  );
};
