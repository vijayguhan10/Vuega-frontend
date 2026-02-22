import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import LoginSignup from '../components/Auth/LoginSignup'

// Pages
import Dashboard from '../pages/Dashboard/Dashboard'
import Buses from '../pages/buses/Buses'
import BusDetail from '../pages/buses/BusDetail'
import TripSchedule from '../pages/Schedule/TripSchedule'
import CreateLayoutTemplate from '../pages/layout-templates/CreateLayoutTemplate'

// Routes module
import RoutesList from '../pages/routes/RoutesList'
import CreateRoute from '../pages/routes/CreateRoute'
import RouteDetail from '../pages/routes/RouteDetail'

// Placeholder for pages we'll build
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-12 h-12 rounded-full bg-v-accent flex items-center justify-center mb-4">
      <span className="text-v-text-muted text-xl">🚧</span>
    </div>
    <h2 className="text-lg font-semibold text-v-text">{title}</h2>
    <p className="text-sm text-v-text-muted mt-1">This section is under development</p>
  </div>
)

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public route — Login */}
      <Route path='/' element={<LoginSignup />} />

      {/* Protected routes with shared layout */}
      <Route element={<AdminLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/buses' element={<Buses />} />
        <Route path='/buses/:busId' element={<BusDetail />} />
        <Route path='/routes' element={<RoutesList />} />
        <Route path='/routes/create' element={<CreateRoute />} />
        <Route path='/routes/:routeId' element={<RouteDetail />} />
        <Route path='/trips' element={<TripSchedule />} />
        <Route path='/maintenance' element={<ComingSoon title="Maintenance" />} />
        <Route path='/layout-templates/create' element={<CreateLayoutTemplate />} />
      </Route>

      {/* Catch-all */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default AllRoutes