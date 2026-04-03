"use client"

import dynamic from "next/dynamic"
import { SiteShell } from "@/components/site-shell"

const EditorialSection = dynamic(
  () => import("@/components/sections/editorial").then((mod) => mod.EditorialSection),
  { ssr: false },
)

export default function EditorialPage() {
  return (
    <SiteShell>
      <EditorialSection />
    </SiteShell>
  )
}
