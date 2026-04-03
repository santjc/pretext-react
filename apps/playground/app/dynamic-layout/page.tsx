"use client"

import dynamic from "next/dynamic"
import { SiteShell } from "@/components/site-shell"

const DynamicLayoutSection = dynamic(
  () => import("@/components/sections/dynamic-layout").then((mod) => mod.DynamicLayoutSection),
  { ssr: false },
)

export default function DynamicLayoutPage() {
  return (
    <SiteShell>
      <DynamicLayoutSection />
    </SiteShell>
  )
}
