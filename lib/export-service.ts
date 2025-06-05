export interface ExportOptions {
  format: "csv" | "excel" | "pdf"
  dateRange?: {
    start: Date
    end: Date
  }
  filters?: Record<string, any>
}

export interface ExportData {
  headers: string[]
  rows: any[][]
  title?: string
  metadata?: Record<string, any>
}

export class ExportService {
  static async exportToCSV(data: ExportData): Promise<void> {
    const csvContent = this.convertToCSV(data)
    this.downloadFile(csvContent, `${data.title || "export"}.csv`, "text/csv")
  }

  static async exportToExcel(data: ExportData): Promise<void> {
    // Simulate Excel export - in real implementation, use libraries like xlsx
    const csvContent = this.convertToCSV(data)
    this.downloadFile(
      csvContent,
      `${data.title || "export"}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
  }

  static async exportToPDF(data: ExportData): Promise<void> {
    // Simulate PDF export - in real implementation, use libraries like jsPDF
    const htmlContent = this.convertToHTML(data)
    console.log("PDF export would generate:", htmlContent)

    // For demo purposes, create a simple text file
    this.downloadFile(htmlContent, `${data.title || "export"}.html`, "text/html")
  }

  private static convertToCSV(data: ExportData): string {
    const { headers, rows } = data
    const csvRows = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))]
    return csvRows.join("\n")
  }

  private static convertToHTML(data: ExportData): string {
    const { headers, rows, title } = data
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || "Export"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${title || "Export"}</h1>
        <table>
          <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export specific data types
  static async exportExpenses(options: ExportOptions): Promise<void> {
    const data: ExportData = {
      title: "Expense Report",
      headers: ["Date", "Description", "Category", "Amount", "Status", "Employee"],
      rows: [
        ["2024-06-15", "Flight to NYC", "Travel", "$1,500.00", "Approved", "John Doe"],
        ["2024-06-14", "Hotel in Manhattan", "Accommodation", "$890.00", "Pending", "John Doe"],
        ["2024-06-13", "Dinner with client", "Meals", "$125.00", "Approved", "John Doe"],
        ["2024-06-12", "Taxi to airport", "Transportation", "$45.00", "Approved", "John Doe"],
      ],
    }

    await this.exportData(data, options.format)
  }

  static async exportFlights(options: ExportOptions): Promise<void> {
    const data: ExportData = {
      title: "Flight Bookings",
      headers: ["Date", "Route", "Airline", "Flight Number", "Price", "Status"],
      rows: [
        ["2024-06-15", "MAD → NYC", "Iberia", "IB6275", "$1,500.00", "Confirmed"],
        ["2024-06-10", "MAD → LHR", "British Airways", "BA456", "$320.00", "Confirmed"],
        ["2024-06-05", "MAD → CDG", "Air France", "AF1000", "$210.00", "Completed"],
      ],
    }

    await this.exportData(data, options.format)
  }

  static async exportHotels(options: ExportOptions): Promise<void> {
    const data: ExportData = {
      title: "Hotel Bookings",
      headers: ["Check-in", "Check-out", "Hotel", "Location", "Room Type", "Price", "Status"],
      rows: [
        ["2024-06-15", "2024-06-18", "Grand Hyatt", "New York", "Executive King", "$960.00", "Confirmed"],
        ["2024-06-10", "2024-06-12", "Marriott Downtown", "New York", "Deluxe Queen", "$560.00", "Confirmed"],
        ["2024-06-05", "2024-06-08", "Novotel Centre", "Paris", "Superior Double", "$630.00", "Completed"],
      ],
    }

    await this.exportData(data, options.format)
  }

  private static async exportData(data: ExportData, format: "csv" | "excel" | "pdf"): Promise<void> {
    switch (format) {
      case "csv":
        await this.exportToCSV(data)
        break
      case "excel":
        await this.exportToExcel(data)
        break
      case "pdf":
        await this.exportToPDF(data)
        break
    }
  }
}
