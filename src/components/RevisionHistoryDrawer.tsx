import * as Dialog from '@radix-ui/react-dialog'
import { Clock3, FileClock, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type RevisionHistory = {
  schemaVersion: 1
  transcript: {
    path: string
    adapter: string
  }
  versions: RevisionVersion[]
}

type RevisionVersion = {
  id: string
  label: string
  timestamp?: string
  snapshot: string
  diff: string
  changes?: RevisionChange[]
  provenance: {
    eventIds: string[]
    toolCallIds: string[]
  }
}

type RevisionChange = {
  summary?: string
}

type RevisionHistoryDrawerProps = {
  source: string
  title: string
  triggerLabel?: string
  triggerPosition?: 'inline' | 'fixed'
}

type DiffLine = {
  id: string
  kind: 'added' | 'removed' | 'context'
  text: string
}

type DiffStats = {
  added: number
  removed: number
}

type ChangedDiffLine = {
  kind: 'added' | 'removed'
  raw: string
  text: string
}

type RevisionSummary = {
  detail: string
  stats: DiffStats
  title: string
}

export default function RevisionHistoryDrawer({
  source,
  title,
  triggerLabel = 'View edits',
  triggerPosition = 'inline',
}: RevisionHistoryDrawerProps) {
  const [history, setHistory] = useState<RevisionHistory | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      try {
        const response = await fetch(source)
        if (!response.ok)
          throw new Error(`Unable to load revision history (${response.status})`)
        const nextHistory = (await response.json()) as RevisionHistory
        if (!cancelled) {
          setHistory(nextHistory)
          setSelectedIndex(0)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load revision history',
          )
        }
      }
    }

    loadHistory()
    return () => {
      cancelled = true
    }
  }, [source])

  const selectedVersion = history?.versions[selectedIndex]
  const diffLines = useMemo(
    () => (selectedVersion ? parseDiff(selectedVersion.diff) : []),
    [selectedVersion],
  )

  return (
    <Dialog.Root>
      <Dialog.Trigger className={`revision-trigger revision-trigger--${triggerPosition}`}>
        <FileClock aria-hidden="true" size={16} strokeWidth={1.8} />
        {triggerLabel}
        {history ? ` (${history.versions.length})` : null}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="revision-overlay" />
        <Dialog.Content className="revision-drawer">
          <header className="revision-header">
            <div>
              <Dialog.Title className="revision-title">
                Edit history
                {history ? ` (${history.versions.length})` : null}
              </Dialog.Title>
              <Dialog.Description className="revision-description">
                Based on the chat transcript from the session where this post was written.
              </Dialog.Description>
            </div>
            <Dialog.Close className="revision-close" aria-label="Close edit history">
              <X aria-hidden="true" size={18} strokeWidth={1.8} />
            </Dialog.Close>
          </header>

          <div className="revision-body">
            {error && <p className="revision-state">{error}</p>}
            {!error && !history && <p className="revision-state">Loading revisions...</p>}

            {history && (
              <>
                <div className="revision-list" aria-label="Versions">
                  {history.versions.map((version, index) => {
                    const isSelected = index === selectedIndex
                    const summary = summarizeRevision(version)
                    const diffId = `revision-diff-${version.id}`

                    return (
                      <div className="revision-card-shell" key={version.id}>
                        <button
                          aria-controls={diffId}
                          aria-expanded={isSelected}
                          className={
                            isSelected ? 'revision-card active' : 'revision-card'
                          }
                          onClick={() => setSelectedIndex(index)}
                          type="button"
                        >
                          <span className="revision-card-topline">
                            <span className="revision-card-title">
                              {index === history.versions.length - 1
                                ? 'Current edit'
                                : `Edit ${index + 1}`}
                            </span>
                            <span className="revision-card-stats">
                              <span>+{summary.stats.added}</span>
                              <span>-{summary.stats.removed}</span>
                            </span>
                          </span>
                          <span className="revision-card-summary">{summary.title}</span>
                          <span className="revision-card-label">{summary.detail}</span>
                          <span className="revision-card-meta">
                            <Clock3 aria-hidden="true" size={13} strokeWidth={1.8} />
                            {formatTimestamp(version.timestamp)}
                          </span>
                        </button>

                        {isSelected && selectedVersion && (
                          <section
                            className="revision-diff"
                            id={diffId}
                            aria-label={`Diff for ${summary.title}`}
                          >
                            <pre className="revision-diff-lines">
                              {diffLines.map((line) => (
                                <span
                                  className={`revision-line ${line.kind}`}
                                  key={line.id}
                                >
                                  {line.text || ' '}
                                </span>
                              ))}
                            </pre>
                          </section>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function summarizeRevision(version: RevisionVersion): RevisionSummary {
  const stats = countDiffChanges(version.diff)
  const changedLines = getChangedDiffLines(version.diff)
  const changedText = changedLines.map((line) => line.text).filter(Boolean)

  return {
    detail: chooseRevisionDetail(changedText) || cleanRevisionLabel(version.label),
    stats,
    title: chooseRevisionTitle(version, changedLines),
  }
}

function countDiffChanges(diff: string): DiffStats {
  return diff.split('\n').reduce(
    (stats, line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return stats
      if (line.startsWith('+')) stats.added += 1
      if (line.startsWith('-')) stats.removed += 1
      return stats
    },
    { added: 0, removed: 0 },
  )
}

function parseDiff(diff: string): DiffLine[] {
  return diff
    .split('\n')
    .filter((line) => {
      if (!line) return false
      if (line.startsWith('Index:')) return false
      if (line.startsWith('===')) return false
      if (line.startsWith('---')) return false
      if (line.startsWith('+++')) return false
      if (line.startsWith('@@')) return false
      return line.startsWith('+') || line.startsWith('-') || line.startsWith(' ')
    })
    .slice(0, 220)
    .map((line, index) => ({
      id: `${index}-${line}`,
      kind: line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'context',
      text: line,
    }))
}

function getChangedDiffLines(diff: string): ChangedDiffLine[] {
  return diff
    .split('\n')
    .filter((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return false
      return line.startsWith('+') || line.startsWith('-')
    })
    .map((line) => ({
      kind: line.startsWith('+') ? 'added' : 'removed',
      raw: line,
      text: cleanDiffLine(line),
    }))
}

function cleanDiffLine(line: string): string {
  return line
    .replace(/^[+-]/, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function chooseRevisionTitle(
  version: RevisionVersion,
  changedLines: ChangedDiffLine[],
): string {
  const generatedSummary = version.changes?.find((change) =>
    isSpecificChangeSummary(change.summary),
  )?.summary
  if (generatedSummary) return generatedSummary

  return summarizeChangedLines(changedLines)
}

function isSpecificChangeSummary(summary: string | undefined): summary is string {
  if (!summary) return false
  return !new Set([
    'Updated document content',
    'Created document snapshot',
    'Removed document content',
  ]).has(summary)
}

function summarizeChangedLines(changedLines: ChangedDiffLine[]): string {
  const raw = changedLines.map((line) => line.raw.replace(/^[+-]/, '')).join('\n')
  const addedText = changedLines
    .filter((line) => line.kind === 'added')
    .map((line) => line.text)
    .filter(Boolean)

  if (!raw.trim()) return 'Edited document'
  if (/^title:\s/m.test(raw)) return 'Updated title metadata'
  if (/^(description|published|tags|author|revisionHistory):\s/m.test(raw))
    return 'Updated post metadata'
  if (/^import\s/m.test(raw)) return 'Updated media import'
  if (/<img\b/.test(raw) || /\bsrc=/.test(raw)) return 'Updated image'
  if (/<figcaption\b/.test(raw) || /<\/figcaption>/.test(raw))
    return 'Updated image caption'
  if (/^#{1,6}\s/m.test(raw)) return 'Updated section heading'
  if (/:::\w*/.test(raw)) return 'Updated callout'
  if (/^\s*[-*]\s+/m.test(raw)) return 'Updated list item'
  if (addedText.length === 0) return 'Removed text'
  if (addedText.length === 1 && addedText[0].length < 120) return 'Edited a line'
  return 'Updated paragraph text'
}

function chooseRevisionDetail(changedText: string[]): string {
  const candidate = changedText.find((line) => {
    if (line.startsWith('import ')) return false
    if (line.startsWith('title:')) return true
    if (line.startsWith('src=')) return false
    if (line.length < 18) return false
    return true
  })

  return candidate ? truncate(candidate, 150) : ''
}

function cleanRevisionLabel(label: string): string {
  return truncate(
    label
      .replace(/^# Browser comments:\s*/i, '')
      .replace(/^# In app browser:\s*/i, '')
      .replace(/## Comment \d+\s*/i, '')
      .replace(/File:\s*browser:/i, '')
      .replace(/\s+/g, ' ')
      .trim(),
    150,
  )
}

function formatTimestamp(timestamp: string | undefined): string {
  if (!timestamp) return 'Session edit'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trim()}…`
}
