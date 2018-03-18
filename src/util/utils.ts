import { MILLISECONDS_IN_MINUTES } from './constants';

export const toScheduleFormat = (date: Date) => ({
  schedules: [
    {
      h: [date.getHours()],
      m: [date.getMinutes()],
      s: [date.getSeconds()],
      D: [date.getDate()],
      M: [date.getMonth() + 1],
      Y: [date.getFullYear()],
    },
  ],
});

export const minutesToMilliSeconds = (minutes: number) => minutes * MILLISECONDS_IN_MINUTES;
