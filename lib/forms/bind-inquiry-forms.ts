import { attachFormLocationListeners } from "@/lib/forms/location"
import { isNewsletterSignup } from "@/lib/forms/newsletter-signup"
import { formDataToFields, submitInquiry } from "@/lib/forms/submit-inquiry"

export type FormBindStatus = "idle" | "sending" | "ok" | "err"

type Options = {
  pageSource: string
  onStatus: (status: FormBindStatus, message: string | null) => void
}

function isInquiryForm(form: HTMLFormElement, root: HTMLElement): boolean {
  if (!root.contains(form)) return false
  if (form.classList.contains("ssw-inquiry-form")) return true
  const action = form.getAttribute("action") ?? ""
  return action.includes("web3forms")
}

function setSubmitBusy(form: HTMLFormElement, busy: boolean): void {
  form.querySelectorAll<HTMLButtonElement>('button[type="submit"]').forEach((btn) => {
    btn.disabled = busy
    if (busy) {
      btn.dataset.sswPrevLabel = btn.textContent ?? ""
      btn.textContent = "Sending…"
    } else if (btn.dataset.sswPrevLabel) {
      btn.textContent = btn.dataset.sswPrevLabel
      delete btn.dataset.sswPrevLabel
    }
  })
}

function setInlineFeedback(
  form: HTMLFormElement,
  kind: FormBindStatus,
  text: string | null,
): void {
  let el = form.querySelector<HTMLElement>(".ssw-form-feedback")
  if (!text) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement("p")
    el.className = "ssw-form-feedback"
    el.setAttribute("role", "status")
    form.insertBefore(el, form.firstChild)
  }
  el.textContent = text
  el.dataset.state = kind
  el.style.cssText = [
    "margin:0 0 16px",
    "padding:12px 16px",
    "font-size:13px",
    "line-height:1.45",
    "font-family:Montserrat,sans-serif",
    kind === "ok"
      ? "background:#1a3d1a;color:#f9f5e5"
      : kind === "err"
        ? "background:#3d1a1a;color:#f9f5e5"
        : "background:#2a2a2a;color:#f9f5e5",
  ].join(";")
}

function formFromSubmitEvent(e: Event): HTMLFormElement | null {
  const t = e.target
  if (t instanceof HTMLFormElement) return t
  if (t instanceof HTMLElement) return t.closest("form")
  return null
}

/** Bind all inquiry forms under `root` — capture phase prevents native navigation. */
export function bindInquiryForms(root: HTMLElement, opts: Options): () => void {
  const locationCleanups: Array<() => void> = []

  root.querySelectorAll<HTMLFormElement>("form.ssw-inquiry-form, form[action*='web3forms']").forEach((form) => {
    form.setAttribute("action", "#")
    form.setAttribute("method", "post")
    form.classList.add("ssw-inquiry-form")
    locationCleanups.push(attachFormLocationListeners(form))
  })

  const onSubmit = (e: Event) => {
    const form = formFromSubmitEvent(e)
    if (!form || !isInquiryForm(form, root)) return

    e.preventDefault()
    e.stopPropagation()

    void (async () => {
      setSubmitBusy(form, true)
      const fields = formDataToFields(form)
      const isNewsletter = isNewsletterSignup(opts.pageSource, fields)
      setInlineFeedback(
        form,
        "sending",
        isNewsletter ? "Subscribing…" : "Sending your message…",
      )
      opts.onStatus("sending", null)

      const result = await submitInquiry(opts.pageSource, fields)

      setSubmitBusy(form, false)

      if (!result.ok) {
        setInlineFeedback(form, "err", result.error)
        opts.onStatus("err", result.error)
        return
      }

      const okMsg = isNewsletter
        ? "Thanks — you're on the list. We'll be in touch soon."
        : "Thanks — we received your message. We'll be in touch soon."
      setInlineFeedback(form, "ok", okMsg)
      opts.onStatus("ok", isNewsletter ? "Thanks — you're on the list." : "Thanks — we received your message.")
      form.reset()
    })()
  }

  root.addEventListener("submit", onSubmit, true)

  return () => {
    root.removeEventListener("submit", onSubmit, true)
    locationCleanups.forEach((fn) => fn())
  }
}
