"use client"

import { useState } from "react"

interface CodeBlockProps {
  code: string
  filename?: string
  language?: string
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative border border-border rounded-lg overflow-hidden bg-[#0a0a0a]">
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {/* Filename */}
          {filename && (
            <span className="text-xs font-mono text-muted-foreground">
              {filename}
            </span>
          )}
        </div>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative">
        {/* Line Numbers Gutter */}
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="font-mono">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 text-right pr-4 text-muted-foreground/40 text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span className="flex-1 text-muted-foreground">
                  {highlightLine(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

function highlightLine(line: string): React.ReactNode {
  // Handle empty lines
  if (!line.trim()) return " "
  
  // Handle comments
  if (line.trim().startsWith('//')) {
    return <span className="text-muted-foreground/50 italic">{line}</span>
  }

  // Tokenize and highlight
  const tokens = line.split(/('.*?'|".*?"|`.*?`|\{|\}|\(|\)|:|\[|\]|,|=>|\.)/g)
  
  return tokens.map((token, i) => {
    // Strings
    if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      return <span key={i} className="text-primary">{token}</span>
    }
    // Keywords
    if (/^(import|from|export|const|let|var|function|return|async|await|if|else|new|true|false|null|undefined)$/.test(token.trim())) {
      return <span key={i} className="text-foreground font-medium">{token}</span>
    }
    // Numbers
    if (/^\d+$/.test(token.trim())) {
      return <span key={i} className="text-primary/80">{token}</span>
    }
    // Punctuation
    if (/^[{}()[\]:,.]$/.test(token)) {
      return <span key={i} className="text-muted-foreground/60">{token}</span>
    }
    // Arrow
    if (token === '=>') {
      return <span key={i} className="text-foreground">{token}</span>
    }
    return token
  })
}
