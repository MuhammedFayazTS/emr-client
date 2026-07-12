export const slotKeys = {
    all: ['slots'] as const,
    lists: () => [...slotKeys.all, 'list'] as const,
    list: (doctorId: string, date: string) => [...slotKeys.lists(), doctorId, date] as const,
};
