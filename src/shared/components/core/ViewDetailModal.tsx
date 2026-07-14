import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";

export interface ViewDetailField {
  label: string;
  value: React.ReactNode;
}

interface ViewDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: ViewDetailField[];
}

export function ViewDetailModal({
  open,
  onOpenChange,
  title,
  description,
  fields,
}: ViewDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Separator />
        <dl className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field.label}
              </dt>
              <dd className="text-sm text-foreground">{field.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
