"use client"

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-[28px] text-coal mt-10 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl text-coal mt-8 mb-2.5">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="font-body text-[15px] leading-relaxed text-coal/85 mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-display text-lg text-orange border-l-[3px] border-orange pl-5 my-6 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 font-body text-[15px] text-coal/85">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2 font-body text-[15px] text-coal/85">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : ""
      if (!href) return <>{children}</>
      return (
        <a
          href={href}
          className="text-orange border-b border-orange/35 hover:border-orange transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
  },
}

export function EventBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />
}
