import { Compass } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="shrink-0 border-b border-night-line bg-night/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2 font-display text-base font-medium">
          <Compass size={18} className="text-amber" />
          Waypoint
        </div>
        <span className="font-mono text-[11px] tracking-wide text-muted">
          AI travel planner
        </span>
      </div>
    </header>
  )
}
