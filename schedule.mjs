export const timezone = 'Asia/Ho_Chi_Minh';
const windows = [[6, 8], [10, 12], [16, 18], [19, 20], [20, 22]];
const hhmm = (minute) =>
  [Math.floor(minute / 60), minute % 60].map((part) => String(part).padStart(2, '0')).join(':');

export const postingSlots = windows.flatMap(([start, end]) => {
  const interval = ((end - start) * 60) / 4;
  return Array.from({length: 4}, (_, index) =>
    hhmm(start * 60 + Math.floor(interval * (index + 0.5))));
});

