import { toast } from "sonner";
import type { ApiError } from "@/shared/api/types";

interface NotifyOptions {
    description?: string;
    duration?: number;
}

function extractErrorMessage(error: unknown, fallback: string): string {
    if (isApiError(error)) return error.message ?? fallback;
    if (error instanceof Error) return error.message;
    return fallback;
}

function isApiError(error: unknown): error is ApiError {
    return typeof error === "object" && error !== null && "message" in error;
}

export const notify = {
    success: (message: string, options?: NotifyOptions) => {
        toast.success(message, options);
    },

    error: (error: unknown, fallback = "Something went wrong", options?: NotifyOptions) => {
        toast.error(extractErrorMessage(error, fallback), options);
    },

    info: (message: string, options?: NotifyOptions) => {
        toast.info(message, options);
    },

    warning: (message: string, options?: NotifyOptions) => {
        toast.warning(message, options);
    },

    // Entity-action helpers — this is the part that scales well.
    // As you add more resources, you just call these with the entity name.
    created: (entity: string, options?: NotifyOptions) => {
        toast.success(`${entity} created successfully`, options);
    },

    updated: (entity: string, options?: NotifyOptions) => {
        toast.success(`${entity} updated successfully`, options);
    },

    deleted: (entity: string, options?: NotifyOptions) => {
        toast.success(`${entity} deleted successfully`, options);
    },

    promise: toast.promise, // re-export for async flows, e.g. file uploads
};