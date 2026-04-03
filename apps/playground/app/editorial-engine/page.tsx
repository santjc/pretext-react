"use client"

import dynamic from "next/dynamic"
import { SiteShell } from "@/components/site-shell"

const EditorialEngineSection = dynamic(
  () => import("@/components/sections/editorial-engine").then((mod) => mod.EditorialEngineSection),
  { ssr: false },
)

export default function EditorialEnginePage() {
  return (
    <SiteShell>
      <EditorialEngineSection />
    </SiteShell>
  )
}
