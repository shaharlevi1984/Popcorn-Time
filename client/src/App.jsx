import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import AdminPage from './pages/Admin'
import './App.css'


function App() {

  return (
    <>
     <div>
        <Router>
          <NavBar />
          <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
