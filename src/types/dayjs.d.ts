import { Dayjs } from 'dayjs';

declare module 'dayjs' {
  export function unix(timestamp: number): Dayjs;
}
