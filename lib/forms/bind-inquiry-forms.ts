import { attachFormLocationListeners } from "@/lib/forms/location"
import {
  EVENT_INQUIRY_VALUES,
  inquiryTypeLabel,
} from "@/lib/forms/inquiry-options"
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

function findFormFeedbackWrap(form: HTMLFormElement): HTMLElement | null {
  const next = form.nextElementSibling
  return next instanceof HTMLElement &&
    next.classList.contains("ssw-form-feedback-wrap")
    ? next
    : null
}

function findFormFeedback(form: HTMLFormElement): HTMLElement | null {
  const wrap = findFormFeedbackWrap(form)
  if (wrap) {
    return wrap.querySelector<HTMLElement>(".ssw-form-feedback")
  }
  const legacy =
    form.nextElementSibling instanceof HTMLElement &&
    form.nextElementSibling.classList.contains("ssw-form-feedback")
      ? form.nextElementSibling
      : null
  return legacy ?? form.querySelector<HTMLElement>(".ssw-form-feedback")
}

function setInlineFeedback(
  form: HTMLFormElement,
  kind: FormBindStatus,
  text: string | null,
): void {
  let wrap = findFormFeedbackWrap(form)
  let el = findFormFeedback(form)

  if (!text) {
    wrap?.remove()
    if (!wrap) el?.remove()
    return
  }

  if (!wrap) {
    wrap = document.createElement("div")
    wrap.className = "ssw-form-feedback-wrap"
    if (!el) {
      el = document.createElement("p")
      el.className = "ssw-form-feedback"
    } else {
      el.remove()
    }
    wrap.appendChild(el)
    form.after(wrap)
  } else if (!el) {
    el = document.createElement("p")
    el.className = "ssw-form-feedback"
    wrap.appendChild(el)
  }

  el.textContent = text
  el.dataset.state = kind
  el.setAttribute("role", kind === "err" ? "alert" : "status")
}

function formFromSubmitEvent(e: Event): HTMLFormElement | null {
  const t = e.target
  if (t instanceof HTMLFormElement) return t
  if (t instanceof HTMLElement) return t.closest("form")
  return null
}

function syncInquiryTypeFields(root: HTMLElement, value: string): void {
  const hiddenEventType = root.querySelector<HTMLInputElement>(
    'input[name="event_type"][type="hidden"]',
  )
  if (hiddenEventType) {
    hiddenEventType.value = EVENT_INQUIRY_VALUES.has(value)
      ? inquiryTypeLabel(value)
      : ""
  }
}

function applyInquiryTypeChange(root: HTMLElement, value: string): void {
  root.querySelectorAll<HTMLElement>(".conditional-fields").forEach((el) => {
    el.classList.remove("active")
  })

  if (value === "custom-crush") {
    root.querySelector("#fields-custom-crush")?.classList.add("active")
  } else if (EVENT_INQUIRY_VALUES.has(value)) {
    root.querySelector("#fields-event")?.classList.add("active")
  } else if (value === "general") {
    root.querySelector("#fields-general")?.classList.add("active")
  }

  syncInquiryTypeFields(root, value)
}

/** Wire contact form inquiry_type dropdown and conditional field panels. */
function bindInquiryTypeSelect(root: HTMLElement): () => void {
  const select = root.querySelector<HTMLSelectElement>("#inquiry-type")
  if (!select) return () => {}

  const form = select.closest("form")
  const onChange = () => applyInquiryTypeChange(root, select.value)
  select.addEventListener("change", onChange)
  form?.addEventListener("reset", onChange)
  onChange()

  return () => {
    select.removeEventListener("change", onChange)
    form?.removeEventListener("reset", onChange)
  }
}

/** Bind all inquiry forms under `root` — capture phase prevents native navigation. */
export function bindInquiryForms(root: HTMLElement, opts: Options): () => void {
  const locationCleanups: Array<() => void> = []
  const inquiryTypeCleanup = bindInquiryTypeSelect(root)

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
        ? "Thanks, you're on the list. We'll keep you updated on new releases and events."
        : "Thanks, we received your message. We'll be in touch soon."
      setInlineFeedback(form, "ok", okMsg)
      opts.onStatus(
        "ok",
        isNewsletter ? null : "Thanks, we received your message.",
      )
      form.reset()
    })()
  }

  root.addEventListener("submit", onSubmit, true)

  return () => {
    root.removeEventListener("submit", onSubmit, true)
    locationCleanups.forEach((fn) => fn())
    inquiryTypeCleanup()
  }
}
