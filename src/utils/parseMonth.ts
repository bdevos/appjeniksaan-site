export type ByMonth<T> = {
  [month: string]: T[]
}

export const parseMonth = (date: string) => date.substring(0, 7) // Returns the YYYY-MM part
