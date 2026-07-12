import { useFieldArray, useWatch, type Control, type FieldValues, type Path, type ArrayPath, useController } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { FieldError } from "../ui/field";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface WeeklyScheduleEditorProps<TFormValues extends FieldValues> {
    control: Control<TFormValues>;
    name: ArrayPath<TFormValues>; // e.g. "workingDays"
}

export function WeeklyScheduleEditor<TFormValues extends FieldValues>({
    control,
    name,
}: WeeklyScheduleEditorProps<TFormValues>) {
    const { fields } = useFieldArray({ control, name });

    return (
        <div className="space-y-3">
            {fields.map((field, dayIndex) => (
                <DayRow
                    key={field.id}
                    control={control}
                    name={name}
                    dayIndex={dayIndex}
                />
            ))}
        </div>
    );
}

function DayRow<TFormValues extends FieldValues>({
    control,
    name,
    dayIndex,
}: {
    control: Control<TFormValues>;
    name: ArrayPath<TFormValues>;
    dayIndex: number;
}) {
    const dayPath = `${name}.${dayIndex}` as Path<TFormValues>;
    const isWorkingPath = `${dayPath}.isWorking` as Path<TFormValues>;
    const sessionsPath = `${dayPath}.sessions` as ArrayPath<TFormValues>;
    const dayLabel = useWatch({ control, name: `${dayPath}.dayOfWeek` as Path<TFormValues> }) as string;
    const isWorking = useWatch({ control, name: isWorkingPath }) as boolean;

    const { fields: sessionFields, append, remove } = useFieldArray({ control, name: sessionsPath });

    return (
        <div className={cn(
            "rounded-lg border p-3 transition-opacity",
            !isWorking && "opacity-60"
        )}>
            <div className="flex items-center justify-between">
                <span className="font-medium text-sm w-28">{formatDayLabel(dayLabel)}</span>
                <SwitchField control={control} name={isWorkingPath} />
            </div>

            {isWorking && (
                <div className="mt-3 space-y-2">
                    {sessionFields.map((session, sessionIndex) => (
                        <div key={session.id} className="flex items-center gap-2">
                            <NameField
                                control={control}
                                name={`${sessionsPath}.${sessionIndex}.name` as Path<TFormValues>}
                            />
                            <TimeField control={control} name={`${sessionsPath}.${sessionIndex}.startTime` as Path<TFormValues>} />
                            <span className="text-muted-foreground text-sm">to</span>
                            <TimeField control={control} name={`${sessionsPath}.${sessionIndex}.endTime` as Path<TFormValues>} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => remove(sessionIndex)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Remove session"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        // @ts-ignore
                        onClick={() => append({ name: "", startTime: "09:00", endTime: "17:00" })}
                    >
                        <Plus className="size-4 mr-1" />
                        Add session
                    </Button>

                    <FieldError>
                        {/* Controller-less array error surfaces via form.formState at the parent level; see DoctorScheduleForm */}
                    </FieldError>
                </div>
            )}
        </div>
    );
}

// "MONDAY" -> "Monday" for display
function formatDayLabel(day: string | undefined): string {
    if (!day) return "";
    return day.charAt(0) + day.slice(1).toLowerCase();
}

// Minimal inline field helpers (kept local since they're single-purpose here)
function SwitchField<TFormValues extends FieldValues>({ control, name }: { control: Control<TFormValues>; name: Path<TFormValues> }) {
    const { field } = useController({ control, name });
    return <Switch checked={field.value} onCheckedChange={field.onChange} />;
}

function NameField<TFormValues extends FieldValues>({ control, name }: { control: Control<TFormValues>; name: Path<TFormValues> }) {
    const { field, fieldState: { error } } = useController({ control, name });
    return (
        <div>
            <Input
                type="text"
                placeholder="Session name"
                className="w-36"
                {...field}
            />
            {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
        </div>
    );
}

function TimeField<TFormValues extends FieldValues>({ control, name }: { control: Control<TFormValues>; name: Path<TFormValues> }) {
    const { field, fieldState: { error } } = useController({ control, name });
    return (
        <div>
            <Input type="time" className="w-32" {...field} />
            {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
        </div>
    );
}