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
        background: status === "ok" ? "#1a3d1a" : "#3d1a1a",
        color: "#f9f5e5",
        fontSize: 13,
        maxWidth: 320,
      }}
      role="status"
    >
      {message}
    </p>
  )
}
