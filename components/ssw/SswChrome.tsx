import { SswFooter } from "./SswFooter"
import { SswNav } from "./SswNav"

export function SswChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SswNav />
      {children}
      <SswFooter />
    </>
  )
}
