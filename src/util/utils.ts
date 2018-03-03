export const toScheduleFormat = (date: Date) => {
  return {
    schedules: [{
      h: [ date.getHours() ],
      m: [ date.getMinutes() ],
      s: [ date.getSeconds() ],
      D: [ date.getDate() ],
      M: [ date.getMonth() + 1 ],
      Y: [ date.getFullYear() ],
    }],
  };
}