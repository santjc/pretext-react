"use client"

import dynamic from "next/dynamic"
import { SiteShell } from "@/components/site-shell"

const CardsSection = dynamic(
  () => import("@/components/sections/cards").then((mod) => mod.CardsSection),
  { ssr: false },
)

export default function CardsPage() {
  return (
    <SiteShell>
      <CardsSection />
    </SiteShell>
  )
}
