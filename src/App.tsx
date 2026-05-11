import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ArchivePage } from './pages/ArchivePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </Router>
  )
}

export default App