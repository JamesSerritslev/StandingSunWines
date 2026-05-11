"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type HostSelectOption = { value: string; label: string }

type HostSelectProps = {
  labelId: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: readonly HostSelectOption[]
  /** Merged onto trigger */
  className?: string
}

const triggerClass =
  "flex min-h-11 h-auto w-full items-center justify-between gap-2 rounded-none border border-cream/18 bg-cream/4 px-4 py-3 text-left font-body text-[13px] text-cream shadow-none transition-colors hover:bg-cream/6 focus-visible:border-orange focus-visible:outline-none focus-visible:ring-0 sm:text-[13px]"

const listClass =
  "absolute left-0 right-0 top-full z-[120] mt-1 max-h-[18rem] overflow-y-auto rounded-none border border-cream/20 bg-coal py-1 shadow-xl"

const optionClass =
  "w-full cursor-pointer border-0 bg-transparent px-3 py-2.5 text-left font-body text-[13px] text-cream/90 outline-none hover:bg-orange/15 focus-visible:bg-orange/15 aria-selected:bg-orange/20"

/**
 * Custom listbox for host-event only — avoids Radix Select’s react-remove-scroll
 * (body margin + overflow lock) which caused layout shift / phantom right margin.
 */
export function HostSelect({
  labelId,
  placeholder,
  value,
  onChange,
  options,
  className,
}: HostSelectProps) {
  const autoId = useId()
  const listId = `${autoId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node | null
      if (t && rootRef.current?.contains(t)) return
      setOpen(false)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(triggerClass, className)}
      >
        <span className={cn("min-w-0 flex-1 truncate", !value && "text-cream/45")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-cream/60 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          tabIndex={-1}
          className={listClass}
        >
          {options.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={optionClass}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
