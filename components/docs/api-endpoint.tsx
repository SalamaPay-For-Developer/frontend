import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ApiEndpointProps {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  path: string
  description?: string
  children?: ReactNode
  className?: string
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  POST: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  PUT: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
}

export function ApiEndpoint({ method, path, description, children, className }: ApiEndpointProps) {
  return (
    <div className={cn("rounded-lg border overflow-hidden my-4", className)}>
      <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
        <span className={cn("rounded px-2 py-0.5 text-xs font-bold", methodColors[method])}>
          {method}
        </span>
        <code className="font-mono text-sm font-medium">{path}</code>
      </div>
      {description && <p className="px-4 py-2 text-sm text-muted-foreground">{description}</p>}
      {children && <div className="px-4 py-3">{children}</div>}
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
    <div className="my-4">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-4 py-2 text-left font-medium">Required</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {params.map((p) => (
              <tr key={p.name}>
                <td className="px-4 py-2 font-mono text-xs">{p.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.type}</td>
                <td className="px-4 py-2">
                  {p.required ? (
                    <span className="text-xs font-medium text-red-500">Yes</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const statusColor =
    status >= 200 && status < 300
      ? "text-green-600"
      : status >= 400 && status < 500
      ? "text-orange-600"
      : status >= 500
      ? "text-red-600"
      : "text-muted-foreground"

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
      </div>
      <pre className="rounded-lg border bg-muted/50 p-4 overflow-x-auto text-sm">
        <code className="font-mono">{body}</code>
      </pre>
    </div>
  )
}
