/** Homepage `#contact` newsletter form — Mailchimp only, no inquiry email. */
export function isNewsletterSignup(
  page: string,
  fields: Record<string, unknown>,
): boolean {
  const interest =
    typeof fields.interest === "string" ? fields.interest.trim().toLowerCase() : ""
  return page.trim().toLowerCase() === "home" && interest === "newsletter"
}
