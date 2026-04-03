"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "Overview" },
  { href: "/core", label: "Core" },
  { href: "/cards", label: "Cards" },
  { href: "/dynamic-layout", label: "Dynamic Layout" },
  { href: "/editorial-engine", label: "Editorial Engine" },
  { href: "/editorial", label: "Editorial" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="mt-10 flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            pathname === tab.href
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {pathname === tab.href && (
            <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
          )}
        </Link>
      ))}
    </nav>
  )
}
