import {
  getCachedFormLocation,
  resolveLocationFieldForSubmit,
  requestFormLocation,
} from "@/lib/forms/location"

export type InquirySubmitResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitInquiry(
  page: string,
  fields: Record<string, string>,
): Promise<InquirySubmitResult> {
  const cached = getCachedFormLocation()
  const locResult = cached ?? (await requestFormLocation())
  const locFields = await resolveLocationFieldForSubmit(locResult)

  const payload = {
    page,
    fields: {
      ...fields,
      ...(locFields ? { location: locFields.location } : {}),
    },
  }

  try {
    const res = await fetch("/api/ssw-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => ({}))) as {
      error?: string
      missing?: string[]
    }
    if (!res.ok) {
      const detail =
        data.missing?.length ?
          `${data.error ?? "Something went wrong."} (Missing: ${data.missing.join(", ")})`
        : (data.error ?? "Something went wrong.")
      return { ok: false, error: detail }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: "Network error. Please try again." }
  }
}

export function formDataToFields(form: HTMLFormElement): Record<string, string> {
  const fd = new FormData(form)
  const fields: Record<string, string> = {}
  fd.forEach((v, k) => {
    if (typeof v === "string") fields[k] = v
  })
  return fields
}
