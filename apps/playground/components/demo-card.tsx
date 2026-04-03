import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface DemoCardProps {
  number: string
  tag: string
  tagVariant?: "primary" | "accent" | "default" | "secondary" | "muted"
  title: string
  description: string
  action: string
  href: string
}

const tagStyles = {
  primary: "bg-primary/10 text-primary border-primary/20",
  accent: "bg-primary/10 text-primary border-primary/20",
  default: "bg-secondary text-foreground border-border",
  secondary: "bg-secondary text-muted-foreground border-border",
  muted: "bg-secondary text-muted-foreground border-border",
}

export function DemoCard({
  number,
  tag,
  tagVariant = "default",
  title,
  description,
  action,
  href,
}: DemoCardProps) {
  return (
    <Link href={href} className="group block rounded-lg border border-border p-5 transition-colors hover:border-muted-foreground/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono text-muted-foreground">{number}</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded border uppercase tracking-wider",
            tagStyles[tagVariant]
          )}
        >
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {action}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  )
}
