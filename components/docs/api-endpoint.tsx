import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon } from "@hugeicons/core-free-icons"

interface ApiEndpointProps {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  path: string
  description?: string
  children?: ReactNode
  className?: string
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  POST: "bg-green-500/10 text-green-600 border-green-500/20",
  PATCH: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  PUT: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function ApiEndpoint({ method, path, description, children, className }: ApiEndpointProps) {
  return (
    <div className={cn("flex flex-col gap-4 my-8", className)}>
      <div className="flex items-center gap-3">
        <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider", methodColors[method])}>
          {method}
        </span>
        <code className="font-mono text-sm font-semibold tracking-tight text-foreground/80">{path}</code>
      </div>
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      {children && <div className="space-y-6 mt-2">{children}</div>}
    </div>
  )
}

interface ParamRowProps {
  name: string
  type: string
  required?: boolean
  description: string
  defaultValue?: string
}

export function ParamsTable({ params, title = "Parameters" }: { params: ParamRowProps[]; title?: string }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{title}</h4>
      <div className="overflow-hidden rounded-lg border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {params.map((p) => (
                <tr key={p.name} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <code className="font-mono font-bold text-primary">{p.name}</code>
                      {p.required && (
                        <span className="text-[10px] font-bold text-red-500/80 uppercase">Required</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <code className="text-muted-foreground/80 font-mono">{p.type}</code>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-muted-foreground leading-relaxed max-w-sm">{p.description}</p>
                    {p.defaultValue && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Default: <code className="bg-muted px-1 rounded">{p.defaultValue}</code>
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface ResponseExampleProps {
  status: number
  label?: string
  body: string
}

export function ResponseExample({ status, label, body }: ResponseExampleProps) {
  const isSuccess = status >= 200 && status < 300
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Response</span>
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
          isSuccess ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          <span className={cn("size-1.5 rounded-full", isSuccess ? "bg-green-500 animate-pulse" : "bg-red-500")} />
          {status} {label}
        </div>
      </div>
      <div className="relative group">
        <pre className="rounded-lg border bg-zinc-950 p-4 font-mono text-xs text-zinc-300 overflow-x-auto shadow-lg">
          <code>{body}</code>
        </pre>
        <button className="absolute right-4 top-4 p-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-700/50">
          <HugeiconsIcon icon={Copy01Icon} className="size-3" />
        </button>
      </div>
    </div>
  )
}
