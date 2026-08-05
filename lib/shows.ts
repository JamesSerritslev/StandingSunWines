/**
 * Show landing pages (Standing Sun Live).
 *
 * Each entry drives a full promo page: hero, story copy, details, gallery,
 * and the Ticket Tailor checkout embed. To add a future show, copy an entry,
 * change the copy/images/ticket URL, and create a route that renders
 * <ShowLandingContent show={SHOWS.yourShow} />.
 */

export type ShowDetail = {
  label: string
  value: string
}

export type ShowImage = {
  src: string
  alt: string
  /** object-position, for tall photos that need a specific band kept in frame */
  focus?: string
}

export type Show = {
  /** Small uppercase line above the title */
  eyebrow: string
  /** Artist / show name */
  title: string
  /** Italic accent appended after the title */
  titleAccent?: string
  /** e.g. "Friday, September 12, 2026" — leave empty to hide */
  dateLine: string
  /** e.g. "Doors 6:00 PM · Show 7:30 PM" — leave empty to hide */
  timeLine: string
  /** ISO 8601 with offset, e.g. "2026-09-12T19:30:00-07:00". Required for Google's event rich results; omit and the JSON-LD is skipped. */
  startDateISO?: string
  /** Performer name for structured data */
  performer: string
  /** Full-bleed hero background — venue atmosphere, darkened behind the text */
  heroImage: string
  /**
   * background-position for the hero. A wide hero crops a tall photo down to a
   * narrow horizontal band, so this picks which band survives the crop.
   */
  heroFocus?: string
  /** Artist portrait shown beside the hero title */
  artistImage: ShowImage
  /** Short line under the title in the hero */
  heroSubhead: string
  /** Main experience copy — each string is a paragraph */
  story: string[]
  /** Right-hand image beside the story copy */
  storyImage: ShowImage
  /** Quick facts shown as a grid (seating, wine, food, parking) */
  details: ShowDetail[]
  /** Venue photo strip */
  gallery: ShowImage[]
  /** Ticket Tailor single-event URL (Promote → Share → embed) */
  ticketUrl: string
  /** Heading above the ticket widget */
  ticketsHeading: string
  ticketsAccent: string
  ticketsIntro: string
  /** SEO */
  metaTitle: string
  metaDescription: string
  canonicalPath: string
  /** Landscape image for social cards and structured data */
  ogImage: string
}

export const SHAWN_MULLINS: Show = {
  eyebrow: "Standing Sun Live · Buellton, California",
  title: "Shawn",
  titleAccent: "Mullins",
  // TODO: fill these in once the date is confirmed. Empty values are hidden on the
  // page, and startDateISO is what unlocks the Google event rich result.
  dateLine: "",
  timeLine: "",
  startDateISO: undefined,
  performer: "Shawn Mullins",
  heroImage: "/images/shows/standing-sun-stage.jpg",
  // Keeps the stage itself in frame — murals, barrel alcove, guitars, and the
  // riser — instead of the tent ceiling above it or the floor below.
  heroFocus: "center 57%",
  artistImage: {
    src: "/images/shows/shawn-mullins-portrait.png",
    alt: "Shawn Mullins seated with his acoustic guitar",
  },
  heroSubhead:
    "Experience an evening with the Grammy-nominated singer-songwriter, live at Standing Sun.",
  story: [
    "Join us at Standing Sun Live for an intimate evening with Grammy-nominated artist Shawn Mullins as he works his way up the California coast.",
    "Standing Sun is a working winery in Buellton that transforms into a live music venue a few times a year for incredible artists like Shawn Mullins. Stainless steel tanks, oak barrels, and original murals become the backdrop, and the room is set up so you are never more than 30 to 40 feet from the stage.",
    "Grab a front-row seat at a table for up to six, or pick seats a couple of rows back in our theater-style section. Come in, take your seat, pour a glass of Santa Barbara County wine, and grab a bite from the food truck before the show. See you there.",
  ],
  storyImage: {
    src: "/images/shows/shawn-mullins-hero.png",
    alt: "Shawn Mullins with a vintage archtop guitar",
  },
  details: [
    { label: "The Room", value: "4,000 sq ft working winery, no seat more than 30–40 feet from the stage" },
    { label: "Seating", value: "Front-row tables for up to six, plus theater-style rows behind" },
    { label: "Wine", value: "Standing Sun wines poured by the glass all evening" },
    { label: "Food", value: "Food truck on site before the show" },
    { label: "Where", value: "92 2nd Street, Buellton, CA — gateway to the Santa Ynez Valley" },
    { label: "Parking", value: "Free onsite parking for guests" },
  ],
  gallery: [
    { src: "/images/ssw/ssw-d14560398aa5afe3.jpg", alt: "Tables set for a Standing Sun Live show" },
    { src: "/images/ssw/ssw-6604082a65f673c1.jpg", alt: "The winery floor arranged for a concert" },
    {
      src: "/images/shows/standing-sun-stage.jpg",
      alt: "The Standing Sun Wines stage set with guitars and monitors",
      focus: "center 58%",
    },
    { src: "/images/ssw/ssw-b3797883eeb87b92.jpg", alt: "Guests seated at Standing Sun Wines" },
  ],
  ticketUrl:
    "https://www.tickettailor.com/checkout/new-session/id/8816474/chk/2cbe412199f5b109f249848abb6ac306/?ref=website_widget",
  ticketsHeading: "Reserve Your",
  ticketsAccent: "Seat",
  ticketsIntro:
    "Tables and theater seating are limited. Pick your quantity below and check out securely.",
  metaTitle: "Shawn Mullins Live at Standing Sun Wines · Buellton",
  metaDescription:
    "See Grammy-nominated singer-songwriter Shawn Mullins live at Standing Sun Wines in Buellton, California. An intimate winery concert in the Santa Ynez Valley with table and theater seating, wine by the glass, and a food truck on site.",
  canonicalPath: "/shawnmullins",
  ogImage: "/images/shows/shawn-mullins-hero.png",
}

export const SHOWS = {
  shawnMullins: SHAWN_MULLINS,
} as const
