/** Seed data — split into pageImages + pageText documents for Studio. */

function image(label, imageKey, alt = "", sourceFile = "") {
  return {
    _type: "pageImage",
    _key: imageKey,
    label,
    key: imageKey,
    alt,
    /** Local path under `public/` — used by seed script to upload assets. */
    sourceFile,
  }
}

function paragraph(label, paragraphKey, text) {
  return {
    _type: "pageParagraph",
    _key: paragraphKey,
    label,
    key: paragraphKey,
    text,
  }
}

function imagesDoc(pageKey, pageTitle, images) {
  return {
    _id: `images-${pageKey}`,
    _type: "pageImages",
    pageKey,
    pageTitle,
    images,
  }
}

function textDoc(pageKey, pageTitle, paragraphs) {
  return {
    _id: `text-${pageKey}`,
    _type: "pageText",
    pageKey,
    pageTitle,
    paragraphs,
  }
}

const HOME_IMAGES = [
  image(
    "Header logo (all pages)",
    "nav-logo",
    "Standing Sun Wines",
    "images/ssw/ssw-3a30683668704b66.png",
  ),
  image(
    "Footer logo (all pages)",
    "footer-logo",
    "Standing Sun Wines",
    "images/ssw/ssw-d553bb7215e2dee2.png",
  ),
  image(
    "Hero — logo",
    "hero-logo",
    "Standing Sun Wines",
    "images/ssw/ssw-d553bb7215e2dee2.png",
  ),
  image(
    "Where Wine Meets Art — photo",
    "winery-section-photo",
    "",
    "images/ssw/ssw-b4995a73fbb28fb4.jpg",
  ),
  image(
    "Winemaker in Residence — photo",
    "winemaker-section-photo",
    "",
    "images/ssw/ssw-bcb9952c58238c19.jpg",
  ),
  image(
    "Private Events — background",
    "private-events-bg",
    "",
    "images/ssw/ssw-589384843857d0ab.jpg",
  ),
]

const HOME_PARAGRAPHS = [
  paragraph(
    "About — first paragraph",
    "about-intro-1",
    "Standing Sun Wines is a custom crush winery and live event destination located at the gateway to the Santa Ynez Valley in Buellton, California. Founded on the belief that wine, art, and music belong together, we've built a space where the craft of winemaking lives alongside creative expression, a 4,000 square foot industrial winery that doubles as a concert hall, event venue, and community gathering place.",
  ),
  paragraph(
    "About — second paragraph",
    "about-intro-2",
    "Whether you're a winemaker looking for a world-class custom crush facility, a couple searching for a one-of-a-kind wedding venue, or a music lover seeking an intimate live experience, Standing Sun is your place in the valley.",
  ),
  paragraph(
    "Where Wine Meets Art — first paragraph",
    "winery-text-1",
    "Located at the gateway to Santa Ynez Valley, Standing Sun Wines is an industrial winery unlike any other. Stainless steel tanks, oak barrels, and original murals share a 4,000 square foot space that pulses with creative energy, a working winery that doubles as a live music venue and private event destination.",
  ),
  paragraph(
    "Where Wine Meets Art — second paragraph",
    "winery-text-2",
    "We make wine here. We host concerts here. We celebrate weddings, corporate retreats, and milestone moments here. The barrels and tanks are never far from the table.",
  ),
  paragraph(
    "Winemaker in Residence — first paragraph",
    "winemaker-text-1",
    "Standing Sun Wines is a fully equipped custom crush facility actively accepting clients for our Winemaker in Residence program. Whether you're an established brand looking for production space or an aspiring winemaker ready to bring your vision to life, our winemaker works alongside you every step of the way.",
  ),
  paragraph(
    "Winemaker in Residence — second paragraph",
    "winemaker-text-2",
    "From harvest through bottling, we provide the facility, equipment, and expertise, you bring the grapes and the dream.",
  ),
  paragraph(
    "Standing Sun Live — intro",
    "events-intro",
    "Intimate concerts in a 4,000 sq ft working winery, surrounded by barrels, tanks, and original art. There's no venue quite like it in the Santa Ynez Valley.",
  ),
  paragraph(
    "Private Events — body",
    "private-body",
    "Located at the gateway to Santa Ynez Valley in Buellton, CA, Standing Sun Wines offers an intimate, unique industrial venue for weddings, corporate retreats, and private events.",
  ),
  paragraph(
    "Private Events — quote",
    "private-quote",
    "\"This venue boasts a 4,000 square foot industrial winery, barrels, steel tanks, and modern art as the perfect backdrop for your private event.\"",
  ),
]

export const PAGE_IMAGE_DOCUMENTS = [
  imagesDoc("home", "Home", HOME_IMAGES),
  imagesDoc("winery", "Winery", [
    image("Hero — background", "hero-bg", "", "images/ssw/ssw-7b0b523d18ffc7d9.jpg"),
    image(
      "The Facility — barrel room photo",
      "facility-barrels",
      "Barrel room at Standing Sun Wines",
      "images/ssw/ssw-67c2bb35d829e300.jpg",
    ),
    image(
      "Built for Serious Wine — tanks photo",
      "facility-tanks",
      "Fermentation tanks at Standing Sun",
      "images/ssw/ssw-9b5f0aa1a151d4b4.jpg",
    ),
  ]),
  imagesDoc("private-events", "Private Events", [
    image("Hero — background", "hero-bg", "", "images/ssw/ssw-797653112b4abb9b.jpg"),
    image(
      "Gallery — photo 1",
      "gallery-1",
      "Private dinner setting",
      "images/ssw/ssw-f761657ed601c52f.jpg",
    ),
    image(
      "Gallery — photo 2",
      "gallery-2",
      "Wedding setup",
      "images/ssw/ssw-762bf2146f30e5a9.jpg",
    ),
    image(
      "Gallery — photo 3",
      "gallery-3",
      "Round table reception",
      "images/ssw/ssw-b3797883eeb87b92.jpg",
    ),
    image(
      "Gallery — photo 4",
      "gallery-4",
      "Event setup",
      "images/ssw/ssw-d14560398aa5afe3.jpg",
    ),
    image(
      "The Space — photo",
      "space-photo",
      "Standing Sun event setup",
      "images/ssw/ssw-6604082a65f673c1.jpg",
    ),
  ]),
  imagesDoc("contact", "Contact", [
    image("Hero — background", "hero-bg", "", "images/ssw/ssw-7b0b523d18ffc7d9.jpg"),
  ]),
]

export const PAGE_TEXT_DOCUMENTS = [
  textDoc("home", "Home", HOME_PARAGRAPHS),
  textDoc("winery", "Winery", [
    paragraph(
      "Hero — intro",
      "hero-body",
      "A 4,000 square foot industrial winery at the gateway to Santa Ynez Valley, where wine is made, music is played, and creative energy lives in every corner.",
    ),
    paragraph(
      "The Facility — first paragraph",
      "facility-text-1",
      "Standing Sun Wines occupies a 4,000 square foot industrial space in the heart of Buellton, California. Steel tanks, oak barrels, concrete floors, and original murals coexist in a setting that is at once a working winery and a living gallery.",
    ),
    paragraph(
      "The Facility — second paragraph",
      "facility-text-2",
      "The facility is fully equipped for every stage of the winemaking process, from crush and fermentation through barrel aging, blending, and bottling. It is one of the most versatile custom crush operations in Santa Barbara County.",
    ),
    paragraph(
      "Built for Serious Wine — first paragraph",
      "serious-wine-text-1",
      "Our facility features state-of-the-art stainless steel fermentation tanks, temperature-controlled barrel storage, a full crush pad, and a dedicated bottling line, everything a serious winemaker needs to produce world-class wine from Santa Barbara County fruit.",
    ),
    paragraph(
      "Built for Serious Wine — second paragraph",
      "serious-wine-text-2",
      "Beyond the equipment, Standing Sun offers something no other facility can: an environment that inspires. The murals, the music, the community, it all feeds into the wine.",
    ),
    paragraph(
      "Winemaker in Residence — first paragraph",
      "winery-wir-text-1",
      "Standing Sun Wines is a fully equipped custom crush facility actively accepting clients for our Winemaker in Residence program. Whether you're an established label looking for production space or an aspiring winemaker ready to bring your vision to life, we work alongside you every step of the way.",
    ),
    paragraph(
      "Winemaker in Residence — second paragraph",
      "winery-wir-text-2",
      "From harvest through bottling, we provide the facility, the equipment, and the expertise. You bring the grapes and the dream.",
    ),
  ]),
  textDoc("private-events", "Private Events", [
    paragraph(
      "Hero — intro",
      "hero-body",
      "A 4,000 square foot industrial winery for weddings, corporate retreats, and private parties. Surrounded by barrels, tanks, and original art at the gateway to Santa Ynez Valley.",
    ),
    paragraph(
      "Event Types — intro",
      "types-intro",
      "From the most intimate gatherings to large celebrations, our space transforms to fit your vision.",
    ),
    paragraph(
      "The Space — first paragraph",
      "space-text-1",
      "Steel tanks, oak barrels, original murals, string lights, and a working winery floor. Standing Sun is unlike any traditional event venue. The industrial character paired with thoughtful styling creates a setting that's at once dramatic and intimate.",
    ),
    paragraph(
      "The Space — second paragraph",
      "space-text-2",
      "Our team works closely with you and your planner to bring your vision to life, from quiet candlelit dinners to celebrations under the lights.",
    ),
    paragraph(
      "Quote strip",
      "quote",
      "\"This venue boasts a 4,000 square foot industrial winery, barrels, steel tanks, and original art as the perfect backdrop for your private event.\"",
    ),
  ]),
  textDoc("contact", "Contact", []),
]
