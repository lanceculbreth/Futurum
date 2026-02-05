import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import InsightsPage from './pages/InsightsPage'
import AccountPage from './pages/AccountPage'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      {/* Redirect login/register to home */}
      <Route path="/login" element={<Navigate to="/home" replace />} />
      <Route path="/register" element={<Navigate to="/home" replace />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/:conversationId" element={<ChatPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
