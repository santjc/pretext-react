"use client"

import dynamic from "next/dynamic"
import { SiteShell } from "@/components/site-shell"

const CoreSection = dynamic(
  () => import("@/components/sections/core").then((mod) => mod.CoreSection),
  { ssr: false },
)

export default function CorePage() {
  return (
    <SiteShell>
      <CoreSection />
    </SiteShell>
  )
}
