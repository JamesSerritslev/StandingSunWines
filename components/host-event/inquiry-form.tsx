"use client"

import { useState } from "react"
import { HostSelect } from "@/components/host-event/host-select"

const EVENT_OPTIONS = [
  { value: "birthday", label: "Birthday Party" },
  { value: "listening-party", label: "Listening Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "anniversary", label: "Anniversary" },
  { value: "album-release", label: "Album Release" },
  { value: "other", label: "Other" },
] as const

const GUEST_OPTIONS = [
  { value: "1-10", label: "1–10 guests" },
  { value: "11-20", label: "11–20 guests" },
  { value: "21-30", label: "21–30 guests" },
  { value: "31-40", label: "31–40 guests" },
  { value: "40+", label: "40+ guests" },
] as const

const TIME_OPTIONS = [
  { value: "afternoon", label: "Afternoon (12pm–4pm)" },
  { value: "evening", label: "Evening (5pm–9pm)" },
  { value: "late", label: "Late Night (9pm+)" },
  { value: "flexible", label: "Flexible" },
] as const

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [eventType, setEventType] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [formError, setFormError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!eventType || !guestCount) {
      setFormError("Please select an event type and guest count.")
      return
    }
    setFormError("")

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      eventType,
      guestCount,
      preferredDate: String(fd.get("preferredDate") ?? "").trim(),
      preferredTime,
      message: String(fd.get("message") ?? "").trim(),
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/host-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as {
        error?: string
        missingEnv?: string[]
        hint?: string
      }

      if (!res.ok) {
        let msg = data.error || "Something went wrong. Please try again."
        if (
          process.env.NODE_ENV === "development" &&
          Array.isArray(data.missingEnv) &&
          data.missingEnv.length > 0
        ) {
          msg += ` Missing env: ${data.missingEnv.join(", ")}.`
          if (data.hint) msg += ` ${data.hint}`
        }
        setFormError(msg)
        setIsSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch {
      setFormError("Network error. Please check your connection and try again.")
    }

    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p className="font-display mb-4 text-2xl text-cream">Thank You!</p>
        <p className="font-body text-[15px] text-cream/70">
          We&apos;ve received your inquiry and will be in touch within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-0 max-w-full flex-col gap-3.5"
    >
      <input type="hidden" name="eventType" value={eventType} />
      <input type="hidden" name="guestCount" value={guestCount} />
      <input type="hidden" name="preferredTime" value={preferredTime} />

      <div className="grid min-w-0 grid-cols-1 gap-3.5 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="min-h-11 w-full border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:text-[13px]"
            placeholder="First Name"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="min-h-11 w-full border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:text-[13px]"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3.5 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="min-h-11 w-full border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:text-[13px]"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className="min-h-11 w-full border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:text-[13px]"
            placeholder="(555) 555-5555"
          />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3.5 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <label
            id="event-type-label"
            className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase"
          >
            Event Type
          </label>
          <HostSelect
            labelId="event-type-label"
            placeholder="Select an event type"
            value={eventType}
            onChange={(v) => {
              setEventType(v)
              setFormError("")
            }}
            options={EVENT_OPTIONS}
          />
        </div>
        <div>
          <label
            id="guest-count-label"
            className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase"
          >
            Guest Count
          </label>
          <HostSelect
            labelId="guest-count-label"
            placeholder="Estimated guests"
            value={guestCount}
            onChange={(v) => {
              setGuestCount(v)
              setFormError("")
            }}
            options={GUEST_OPTIONS}
          />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3.5 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferredDate"
            className="min-h-11 min-w-0 max-w-full box-border w-full border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:text-[13px]"
          />
        </div>
        <div>
          <label
            id="preferred-time-label"
            className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase"
          >
            Preferred Time
          </label>
          <HostSelect
            labelId="preferred-time-label"
            placeholder="Select a time"
            value={preferredTime}
            onChange={setPreferredTime}
            options={TIME_OPTIONS}
          />
        </div>
      </div>

      <div className="min-w-0">
        <label className="mb-1.5 block font-label text-[9px] tracking-[0.3em] text-orange uppercase">
          Tell Us About Your Event
        </label>
        <textarea
          name="message"
          rows={4}
          className="min-h-[5.5rem] w-full resize-y border border-cream/18 bg-cream/4 px-4 py-3 font-body text-base text-cream outline-none transition-colors focus:border-orange sm:min-h-0 sm:text-[13px]"
          placeholder="What's the occasion? Any special requests?"
        />
      </div>

      {formError ? (
        <p className="font-body text-sm text-orange" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full bg-orange px-8 py-4 font-label text-[11px] tracking-[0.28em] text-cream uppercase transition-colors hover:bg-spanish disabled:cursor-not-allowed disabled:opacity-50 sm:tracking-[0.3em]"
        >
          {isSubmitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  )
}
