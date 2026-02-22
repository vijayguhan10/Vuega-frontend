
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './routes/AllRoutes'

function App() {
  return (
    <div>
      <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
    </div>
  )
}

export default App
