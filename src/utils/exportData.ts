import tinkitSymbol from '@/assets/brand/tinkit-symbol-ink.png?inline'

export interface ExportColumn {
  key: string
  label: string
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 1. Export data to CSV (.csv) with UTF-8 BOM so Excel opens Indonesian characters cleanly
 */
export function exportToCSV<T extends Record<string, any>>(
  columns: ExportColumn[],
  rows: T[],
  filename = 'tinkit-export',
) {
  if (!rows.length) return

  const headerLine = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',')
  const dataLines = rows.map((row) =>
    columns
      .map((col) => `"${String(row[col.key] ?? '').replace(/"/g, '""')}"`)
      .join(','),
  )

  const csvString = '\uFEFF' + [headerLine, ...dataLines].join('\r\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${filename}-${formatTimestamp()}.csv`)
}

/**
 * 2. Export data to Microsoft Excel SpreadsheetML (.xlsx / XML Workbook)
 * Zero external library bloat — generates a styled Excel workbook with header fill,
 * borders, auto-fit columns, and proper data types.
 */
export function exportToXLSX<T extends Record<string, any>>(
  columns: ExportColumn[],
  rows: T[],
  options?: {
    filename?: string
    sheetName?: string
    title?: string
  },
) {
  if (!rows.length) return

  const filename = options?.filename ?? 'tinkit-data'
  const sheetName = options?.sheetName ?? 'Data Export'
  const reportTitle = options?.title ?? 'Tinkit Enterprise Data Report'

  const headerCellsXml = columns
    .map(
      (col) =>
        `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${escapeHtml(col.label)}</Data></Cell>`,
    )
    .join('')

  const bodyRowsXml = rows
    .map((row, rIdx) => {
      const styleId = rIdx % 2 === 1 ? 'sRowAlt' : 'sRow'
      const cells = columns
        .map((col) => {
          const rawVal = row[col.key]
          const isNum = typeof rawVal === 'number' && !Number.isNaN(rawVal)
          const dataType = isNum ? 'Number' : 'String'
          return `<Cell ss:StyleID="${styleId}"><Data ss:Type="${dataType}">${escapeHtml(rawVal)}</Data></Cell>`
        })
        .join('')
      return `<Row ss:Height="22">${cells}</Row>`
    })
    .join('\n')

  const colWidthsXml = columns
    .map(() => `<Column ss:AutoFitWidth="1" ss:Width="135"/>`)
    .join('')

  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#222831"/>
  </Style>
  <Style ss:ID="sTitle">
   <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#222831"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="sHeader">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#222831" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Left"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#4E54D4"/>
   </Borders>
  </Style>
  <Style ss:ID="sRow">
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E6E7EC"/>
   </Borders>
  </Style>
  <Style ss:ID="sRowAlt">
   <Interior ss:Color="#F7F7F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E6E7EC"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeHtml(sheetName)}">
  <Table>
   ${colWidthsXml}
   <Row ss:Height="28">
    <Cell ss:StyleID="sTitle" ss:MergeAcross="${Math.max(0, columns.length - 1)}">
     <Data ss:Type="String">${escapeHtml(reportTitle)} — Exported ${new Date().toLocaleDateString('id-ID')}</Data>
    </Cell>
   </Row>
   <Row ss:Height="26">
    ${headerCellsXml}
   </Row>
   ${bodyRowsXml}
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([workbookXml], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
  })
  triggerDownload(blob, `${filename}-${formatTimestamp()}.xlsx`)
}

/**
 * 3. Export data to PDF (Opens a clean, print-ready Enterprise PDF Report view & triggers Save as PDF)
 */
export function exportToPDF<T extends Record<string, any>>(
  columns: ExportColumn[],
  rows: T[],
  options?: {
    title?: string
    subtitle?: string
  },
) {
  if (!rows.length) return

  const title = options?.title ?? 'Tinkit Enterprise Data Report'
  const subtitle =
    options?.subtitle ??
    `Dicetak pada ${new Date().toLocaleString('id-ID')} • Total ${rows.length} baris data`

  const theadHtml = columns
    .map((c) => `<th>${escapeHtml(c.label)}</th>`)
    .join('')

  const tbodyHtml = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((c) => `<td>${escapeHtml(row[c.key])}</td>`)
          .join('')}</tr>`,
    )
    .join('')

  const reportFont = typeof document === 'undefined'
    ? "'Inter', system-ui, sans-serif"
    : getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim()
      || "'Inter', system-ui, sans-serif"

  const htmlDoc = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4 landscape; margin: 14mm; }
    * { box-sizing: border-box; font-family: ${reportFont}; }
    body { margin: 0; color: #222831; background: #fff; font-size: 12px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #222831; padding-bottom: 12px; margin-bottom: 16px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-symbol { width: 46px; height: 28px; object-fit: contain; }
    h1 { margin: 0; font-size: 18px; font-weight: 700; color: #222831; }
    p.sub { margin: 3px 0 0; font-size: 11px; color: #6d728a; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f3f4f8; color: #222831; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.05em; font-weight: 700; text-align: left; padding: 9px 10px; border-bottom: 1.5px solid #d8dae5; }
    td { padding: 8px 10px; border-bottom: 1px solid #eceef4; color: #3b4056; font-size: 11.5px; }
    tr:nth-child(even) td { background: #fafafd; }
    .footer { margin-top: 16px; font-size: 11px; color: #56606d; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img class="brand-symbol" src="${tinkitSymbol}" alt="" />
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p class="sub">${escapeHtml(subtitle)}</p>
      </div>
    </div>
    <div style="text-align:right;font-size:11px;color:#6d728a;">
      <strong>Tinkit Workspace</strong><br/>CONFIDENTIAL REPORT
    </div>
  </div>
  <table>
    <thead><tr>${theadHtml}</tr></thead>
    <tbody>${tbodyHtml}</tbody>
  </table>
  <div class="footer">
    <span>Generated by Tinkit Enterprise UI</span>
    <span>Total Records: ${rows.length}</span>
  </div>
  <script>
    window.onload = async function() {
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise(function(resolve) { setTimeout(resolve, 250); }),
      ]);
      window.print();
    };
  </script>
</body>
</html>`

  const printWin = window.open('', '_blank', 'width=1024,height=768')
  if (printWin) {
    printWin.document.open()
    printWin.document.write(htmlDoc)
    printWin.document.close()
  }
}

function formatTimestamp(): string {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
