import { Op } from "quill-delta"

export const parseContentToOps = (
  rawContent?: string | Op[] | null,
): Op[] | null => {
  if (!rawContent) return null
  if (Array.isArray(rawContent)) return rawContent

  try {
    const parsed = JSON.parse(rawContent) as Op[]
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    // fall through to treat as plain string
  }

  return [
    {
      insert: typeof rawContent === "string" ? rawContent : "",
    },
  ]
}

export const opsToPlainText = (ops?: Op[] | null): string => {
  if (!ops || !Array.isArray(ops)) return ""
  return ops
    .map((op) => (typeof op.insert === "string" ? op.insert : ""))
    .join("")
}
