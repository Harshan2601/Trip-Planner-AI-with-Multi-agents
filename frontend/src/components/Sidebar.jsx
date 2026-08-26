import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Plane,
  Building2,
  ListOrdered,
  ChevronDown,
  Download,
  Loader2,
  Copy,
  Check,
  Compass,
} from 'lucide-react'

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? (
      <strong key={i} className="font-semibold text-night">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      chunk
    )
  )
}

function renderLine(line, key) {
  const trimmed = line.trim()
  const heading = trimmed.match(/^#{1,6}\s+(.+)$/)
  const isNumberedHeading = /^\d+\.\s/.test(trimmed)

  if (heading || isNumberedHeading) {
    return (
      <h3 key={key} className="mt-4 font-display text-base font-medium text-night first:mt-0">
        {renderInline(heading ? heading[1] : trimmed)}
      </h3>
    )
  }
  if (trimmed === '') return null
  return (
    <p key={key} className="mt-1.5 text-[13px] leading-relaxed text-night/75">
      {renderInline(trimmed.replace(/^[-*]\s+/, '• '))}
    </p>
  )
}

function isTableSeparator(line) {
  return /^\s*\|?[\s:-]+(?:\|[\s:-]+)+\|?\s*$/.test(line)
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function renderAnswer(answer) {
  const lines = answer.split(/\r?\n/)
  const output = []
  let index = 0

  while (index < lines.length) {
    if (index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1])) {
      const headers = parseTableRow(lines[index])
      const rows = []
      index += 2

      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(parseTableRow(lines[index]))
        index += 1
      }

      output.push(
        <div key={`table-${index}`} className="mt-3 overflow-hidden rounded-lg border border-night/15">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead className="bg-night/5">
              <tr>
                {headers.map((header, cellIndex) => (
                  <th
                    key={cellIndex}
                    className="border-b border-night/15 px-2 py-1.5 font-semibold text-night"
                  >
                    {renderInline(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-night/[0.025]">
                  {headers.map((_, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-b border-night/10 px-2 py-1.5 align-top text-night/75 last:border-b-0"
                    >
                      {renderInline(row[cellIndex] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    output.push(renderLine(lines[index], index))
    index += 1
  }

  return output
}

function RawSection({ title, Icon, content }) {
  const [open, setOpen] = useState(false)
  if (!content) return null

  return (
    <div className="rounded-xl border border-night-line bg-night-elev">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-cream">
          <Icon size={13} className="text-amber" />
          {title}
        </span>
        <ChevronDown
          size={14}
          className="text-muted transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="border-t border-night-line px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-muted whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-night-line">
        <Compass size={18} className="text-muted" />
      </div>
      <p className="mt-4 max-w-[220px] text-sm text-muted">
        Your generated report will appear here.
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <Loader2 size={20} className="animate-spin text-amber" />
      <p className="mt-4 text-sm text-muted">Generating your report…</p>
    </div>
  )
}

export default function Sidebar({ result, status }) {
  const [pdfStatus, setPdfStatus] = useState('idle')
  const [copied, setCopied] = useState(false)
  const printableRef = useRef(null)

  async function handleDownloadPdf() {
    if (!printableRef.current || pdfStatus === 'working') return
    setPdfStatus('working')
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: 0.5,
          filename: 'ai-travel-plan.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(printableRef.current)
        .save()
      setPdfStatus('idle')
    } catch {
      setPdfStatus('error')
      setTimeout(() => setPdfStatus('idle'), 2500)
    }
  }

  function handleCopy() {
    if (!result?.answer) return
    navigator.clipboard.writeText(result.answer).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <aside className="flex h-full w-full flex-col border-l border-night-line bg-night-elev/40 lg:w-[420px] xl:w-[460px]">
      <div className="flex shrink-0 items-center justify-between border-b border-night-line px-5 py-3.5">
        <span className="flex items-center gap-2 text-sm font-medium text-cream">
          <FileText size={14} className="text-amber" />
          Report
        </span>
        {result && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-full border border-night-line px-2.5 py-1 text-[11px] font-medium text-cream transition-colors hover:border-teal hover:text-teal"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfStatus === 'working'}
              className="flex items-center gap-1 rounded-full bg-coral px-2.5 py-1 text-[11px] font-semibold text-night transition-colors hover:bg-coral-hover disabled:opacity-60"
            >
              {pdfStatus === 'working' ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Download size={11} />
              )}
              PDF
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {status === 'loading' ? (
            <motion.div key="loading" className="h-full" exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4"
            >
              <div ref={printableRef} className="rounded-xl bg-paper p-4 text-night">
                <div className="flex items-center justify-between border-b border-night/10 pb-2.5">
                  <span className="font-mono text-[10px] text-night/50">TRIP PLAN</span>
                  <span className="rounded-full bg-teal/15 px-2 py-0.5 font-mono text-[10px] text-teal">
                    {result.llm_calls} agent calls
                  </span>
                </div>
                <div className="mt-2">
                  {renderAnswer(result.answer)}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <RawSection title="Flight results" Icon={Plane} content={result.flight_results} />
                <RawSection title="Hotel results" Icon={Building2} content={result.hotel_results} />
                <RawSection title="Itinerary draft" Icon={ListOrdered} content={result.itinerary} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="h-full" exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
