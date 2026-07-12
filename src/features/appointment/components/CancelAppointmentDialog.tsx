import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/components/ui/dialog';
import { FieldGroup } from '@/shared/components/ui/field';
import DefaultTextArea from '@/shared/components/core/DefaultTextArea';
import { cancelAppointmentSchema, type CancelAppointmentInput } from '../validation/appointment.schema';
import type { Appointment } from '../types/appointment.types';
import { resolveEntityLabel } from '../utils/appointment.utils';

interface CancelAppointmentDialogProps {
    appointment: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (values: CancelAppointmentInput) => void;
    isPending?: boolean;
}

export function CancelAppointmentDialog({
    appointment,
    open,
    onOpenChange,
    onConfirm,
    isPending,
}: CancelAppointmentDialogProps) {
    const form = useForm<CancelAppointmentInput>({
        resolver: zodResolver(cancelAppointmentSchema),
        defaultValues: { cancelReason: '' },
    });

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) form.reset({ cancelReason: '' });
        onOpenChange(nextOpen);
    };

    const onSubmit = (values: CancelAppointmentInput) => {
        onConfirm(values);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                        {appointment
                            ? `Cancel appointment ${appointment.appointmentNumber} for ${resolveEntityLabel(appointment.patientId)}?`
                            : 'Provide a reason for cancellation.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <FieldGroup>
                        <DefaultTextArea
                            control={form.control}
                            name="cancelReason"
                            label="Cancel Reason"
                            placeholder="Why is this appointment being cancelled?"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isPending}
                            >
                                Close
                            </Button>
                            <Button type="submit" variant="destructive" disabled={isPending}>
                                {isPending ? 'Cancelling...' : 'Cancel Appointment'}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
