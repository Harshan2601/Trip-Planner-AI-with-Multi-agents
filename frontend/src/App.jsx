import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import AgentPipeline from './components/AgentPipeline.jsx'
import ResultsPreview from './components/ResultsPreview.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-night bg-grain">
      <Navbar />
      <main>
        <Hero />
        <AgentPipeline />
        <div id="preview">
          <ResultsPreview />
        </div>
      </main>
      <Footer />
    </div>
  )
}
