export type OrderingReminderEvent = {
  key: string;
  deadlineAt: string;
  deadlineDate: Date;
  reminderDate: Date;
};

export type OrderingReminderStorage = {
  shown: Record<string, number>;
  confirmed: Record<string, number>;
};

export type OrderingReminderToastState = {
  id: number;
  deadlineTimes: string[];
};

export type OrderingReminderPanelItem = {
  key: string;
  deadlineAt: string;
  remainingMinutes: number;
};
