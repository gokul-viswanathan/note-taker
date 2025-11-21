import { DiffSegment } from "@/types/version"

const splitLines = (value: string) => value.replace(/\r\n/g, "\n").split("\n")

export const diffLines = (left: string, right: string): DiffSegment[] => {
  const leftLines = splitLines(left)
  const rightLines = splitLines(right)
  const rows = leftLines.length
  const cols = rightLines.length
  const lcs: number[][] = Array.from({ length: rows + 1 }, () =>
    Array(cols + 1).fill(0),
  )

  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      if (leftLines[i] === rightLines[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1])
      }
    }
  }

  const result: DiffSegment[] = []
  let i = 0
  let j = 0

  while (i < rows && j < cols) {
    if (leftLines[i] === rightLines[j]) {
      result.push({ type: "unchanged", value: leftLines[i] })
      i += 1
      j += 1
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: "removed", value: leftLines[i] })
      i += 1
    } else {
      result.push({ type: "added", value: rightLines[j] })
      j += 1
    }
  }

  while (i < rows) {
    result.push({ type: "removed", value: leftLines[i] })
    i += 1
  }

  while (j < cols) {
    result.push({ type: "added", value: rightLines[j] })
    j += 1
  }

  return result
}
