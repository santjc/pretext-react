interface SectionHeaderProps {
  label: string
  title?: string
  description?: string
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {title && (
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}
