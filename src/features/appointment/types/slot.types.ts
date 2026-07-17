export interface ISlot {
  startTime: string;
  endTime: string;
  date: string;
  doctorId: string;
  isBooked: boolean;
}

export type GroupedSlots = Record<string, ISlot[]>;

export interface ISessionSlots {
  session: {
    startTime: string;
    endTime: string;
  };
  slots: ISlot[];
}
