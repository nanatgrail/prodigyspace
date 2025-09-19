export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string, headers?: string[]): void {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    csvHeaders.join(","), // Header row
    ...data.map((row) =>
      csvHeaders
        .map((header) => {
          const value = row[header]
          // Handle values that might contain commas or quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ""
        })
        .join(","),
    ),
  ].join("\n")

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim())
  const data: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })

    data.push(row)
  }

  return data
}
