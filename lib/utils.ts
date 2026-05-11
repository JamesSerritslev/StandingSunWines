import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanity `date` fields are calendar strings `YYYY-MM-DD` (no timezone).
 * `new Date("YYYY-MM-DD")` is parsed as UTC midnight, which renders as the **previous calendar day**
 * for users west of UTC (e.g. US). Parse as local civil date instead.
 */
export function parseCalendarDate(value: string): Date | null {
  const trimmed = value.trim()
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!m) return null
  const y = Number(m[1])
  const monthIndex = Number(m[2]) - 1
  const d = Number(m[3])
  const date = new Date(y, monthIndex, d)
  if (date.getFullYear() !== y || date.getMonth() !== monthIndex || date.getDate() !== d) {
    return null
  }
  return date
}
