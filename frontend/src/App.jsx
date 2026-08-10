import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import PromptPanel from './components/PromptPanel.jsx'
import Sidebar from './components/Sidebar.jsx'

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [threadId, setThreadId] = useState(null)

  async function handleSubmit() {
    if (!prompt.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, thread_id: threadId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong generating your trip plan.')
      }

      setResult(data)
      setThreadId(data.thread_id)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reach the travel planner API.')
      setStatus('error')
    }
  }

  return (
    <div id="top" className="flex h-screen flex-col bg-night bg-grain">
      <Navbar />
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex-1 overflow-y-auto">
          <PromptPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
            status={status}
            errorMsg={errorMsg}
          />
        </div>
        <Sidebar result={result} status={status} />
      </main>
    </div>
  )
}
