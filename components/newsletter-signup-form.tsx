"use client"

import { useState } from "react"

interface NewsletterSignupFormProps {
  eyebrow?: string
  headline?: string
  submitIdleLabel?: string
}

export function NewsletterSignupForm({
  eyebrow = "Updates",
  headline = "Hear what's spinning",
  submitIdleLabel = "Join the list",
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageIsError, setMessageIsError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setMessageIsError(false)

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, lastName }),
    })

    const data = (await res.json()) as { error?: string }

    if (res.ok) {
      setMessage("You're on the list!")
      setMessageIsError(false)
      setEmail("")
      setFirstName("")
      setLastName("")
    } else {
      setMessage(data.error || "Something went wrong.")
      setMessageIsError(true)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="font-label uppercase text-orange">
        {eyebrow}
      </p>
      <p className="font-display text-lg text-cream">{headline}</p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          placeholder="First name"
          className="min-h-10 w-full border border-cream/20 bg-cream/5 px-3 py-2 font-body text-sm text-cream placeholder:text-cream/40 outline-none focus:border-orange"
        />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          placeholder="Last name"
          className="min-h-10 w-full border border-cream/20 bg-cream/5 px-3 py-2 font-body text-sm text-cream placeholder:text-cream/40 outline-none focus:border-orange"
        />
      </div>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="Email"
        className="min-h-10 w-full border border-cream/20 bg-cream/5 px-3 py-2 font-body text-sm text-cream placeholder:text-cream/40 outline-none focus:border-orange"
      />
      <button
        type="submit"
        disabled={loading}
        className="min-h-10 w-full border border-orange bg-orange px-4 py-2 font-label text-[10px] tracking-[0.28em] text-cream uppercase transition-colors hover:bg-spanish disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Joining…" : submitIdleLabel}
      </button>
      {message ? (
        <p
          className={`font-body text-sm ${messageIsError ? "text-orange" : "text-cream/90"}`}
          role={messageIsError ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
