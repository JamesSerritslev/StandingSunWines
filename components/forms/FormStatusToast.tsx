type Props = {
  message: string | null
  status: "idle" | "sending" | "ok" | "err"
}

export function FormStatusToast({ message, status }: Props) {
  if (!message) return null
  return (
    <p
      className="ssw-form-status"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        padding: "12px 18px",
        background:
          status === "ok"
            ? "rgba(182, 86, 39, 0.95)"
            : "rgba(40, 43, 46, 0.95)",
        border: `1px solid ${status === "ok" ? "rgba(212, 113, 58, 0.5)" : "rgba(239, 68, 68, 0.35)"}`,
        color: "var(--cream, #f9f5e5)",
        fontSize: 13,
        maxWidth: 320,
      }}
      role="status"
    >
      {message}
    </p>
  )
}
