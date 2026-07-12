import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import type { GroupedSlots, ISlot } from "@/features/appointment/types/slot.types";

interface SlotGridProps<TFormValues extends FieldValues> {
    control: Control<TFormValues>;
    name: Path<TFormValues>;
    groupedSlots: GroupedSlots;
    isLoading?: boolean;
}

// Two slots are "the same" if start/end/date all match — used to
// determine which button is selected, since slot objects from the
// server won't be referentially equal to the one stored in form state.
function isSameSlot(a: ISlot | undefined, b: ISlot): boolean {
    if (!a) return false;
    return a.startTime === b.startTime && a.endTime === b.endTime && a.date === b.date;
}

export function SlotGrid<TFormValues extends FieldValues>({
    control,
    name,
    groupedSlots,
    isLoading,
}: SlotGridProps<TFormValues>) {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ control, name });

    const sessionNames = Object.keys(groupedSlots);
    const hasSlots = sessionNames.some((session) => groupedSlots[session].length > 0);

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-md bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (!hasSlots) {
        return (
            <p className="text-sm text-muted-foreground py-6 text-center">
                No slots available for this date.
            </p>
        );
    }

    return (
        <div className="space-y-5">
            {sessionNames.map((sessionName) => {
                const slots = groupedSlots[sessionName];
                if (slots.length === 0) return null;

                return (
                    <div key={sessionName}>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            {sessionName.trim()}
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {slots?.map((slot: ISlot) => {
                                const selected = isSameSlot(value, slot);

                                return (
                                    <Button
                                        key={`${slot.date}-${slot.startTime}`}
                                        type="button"
                                        variant={selected ? "default" : "outline"}
                                        size="sm"
                                        disabled={slot.isBooked}
                                        onClick={() => onChange(slot)}
                                        className={cn(
                                            "font-normal",
                                            slot.isBooked && "line-through opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {slot.startTime}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {error && <p className="text-xs text-destructive mt-2">{error.message}</p>}
        </div>
    );
}