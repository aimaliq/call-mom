export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  schedule: Schedule;
  lastCalled?: string;
  callCount: number;
}

export interface Schedule {
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  time: string; // "09:00"
}