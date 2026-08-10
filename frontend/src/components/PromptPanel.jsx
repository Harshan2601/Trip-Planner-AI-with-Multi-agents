import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

const EXAMPLES = [
  '10 days in Portugal from Berlin, mid-range budget',
  'Weekend trip to Rome from Frankfurt, under €600',
  'Flights and hotels for Tokyo, 2 weeks in April',
]

export default function PromptPanel({
  prompt,
  onPromptChange,
  onSubmit,
  status,
  errorMsg,
}) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex h-full flex-col justify-center px-6 py-10 sm:px-12">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display text-2xl font-medium text-cream sm:text-3xl">
          Where are you headed?
        </h1>
        <p className="mt-2 text-sm text-muted">
          Describe the trip in one go — destination, dates, budget, origin.
          The report generates on the right.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="rounded-2xl border border-night-line bg-night-elev/80 p-3 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)] focus-within:border-amber/60 transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="e.g. 10 days in Portugal from Berlin, mid-range budget, mostly coastal towns"
              className="w-full resize-none bg-transparent text-sm text-cream placeholder:text-muted focus:outline-none"
            />
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] text-muted/70">⌘/Ctrl + Enter to generate</span>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={status === 'loading' || !prompt.trim()}
                className="flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-night transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'loading' ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={15} className="animate-spin" />
                      Generating
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send size={15} />
                      Generate report
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 font-mono text-xs text-coral"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onPromptChange(ex)}
              className="rounded-full border border-night-line px-3 py-1.5 text-left font-mono text-[11px] text-muted transition-colors hover:border-teal hover:text-teal"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
