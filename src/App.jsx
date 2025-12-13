import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Components
import AuthChecker from './components/AuthChecker'

// Layouts
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'

// Pages
import Home from './pages/Home'
import TestHome from './pages/TestHome'
import TestConnection from './pages/TestConnection'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Colonies from './pages/Colonies'
import ColonyDetails from './pages/ColonyDetails'
import PropertyDetails from './pages/PropertyDetails'
import PlotDetails from './pages/PlotDetails'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import Referral from './pages/Referral'
import Notifications from './pages/Notifications'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import Contact from './pages/Contact'
import Settings from './pages/Settings'
import AgentDashboard from './pages/AgentDashboard'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <AuthChecker>
      <Routes>
      {/* Auth Routes - Always accessible */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
      </Route>

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/properties" element={<Colonies />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/colonies" element={<Colonies />} /> {/* Redirect old route */}
        <Route path="/colonies/:id" element={<PropertyDetails />} /> {/* Redirect old route */}
        <Route path="/plots/:id" element={<PlotDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route element={<MainLayout />}>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
        </Route>
      ) : null}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthChecker>
  )
}

export default App
