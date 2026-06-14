import type { StructureResolver } from "sanity/structure"

/** Marketing routes the client can edit (images + text only). */
export const EDITABLE_PAGES = [
  { key: "home", title: "Home" },
  { key: "winery", title: "Winery" },
  { key: "contact", title: "Contact" },
  { key: "private-events", title: "Private Events" },
] as const

export function imagesDocId(pageKey: string) {
  return `images-${pageKey}`
}

export function textDocId(pageKey: string) {
  return `text-${pageKey}`
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Images")
        .icon(() => "🖼️")
        .child(
          S.list()
            .title("Images")
            .items(
              EDITABLE_PAGES.map(({ key, title }) =>
                S.listItem()
                  .title(title)
                  .id(imagesDocId(key))
                  .schemaType("pageImages")
                  .child(
                    S.document()
                      .schemaType("pageImages")
                      .documentId(imagesDocId(key))
                      .title(`${title} — images`),
                  ),
              ),
            ),
        ),

      S.listItem()
        .title("Text")
        .icon(() => "✏️")
        .child(
          S.list()
            .title("Text")
            .items(
              EDITABLE_PAGES.map(({ key, title }) =>
                S.listItem()
                  .title(title)
                  .id(textDocId(key))
                  .schemaType("pageText")
                  .child(
                    S.document()
                      .schemaType("pageText")
                      .documentId(textDocId(key))
                      .title(`${title} — text`),
                  ),
              ),
            ),
        ),
    ])
