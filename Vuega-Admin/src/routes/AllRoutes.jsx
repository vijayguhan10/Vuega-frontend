import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import LoginSignup from '../components/Auth/LoginSignup'
import Dashboard from '../pages/Dashboard/Dashboard'
import BusApprovals from '../pages/BusApprovals/BusApprovals'
import CompanyManagement from '../pages/Companies/CompanyManagement'
import PlatformAnalytics from '../pages/Analytics/PlatformAnalytics'
import RouteApprovals from '../pages/RouteApprovals/RouteApprovals'

const AllRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route path='/' element={<LoginSignup />} />

            {/* Protected routes with shared layout */}
            <Route element={<AdminLayout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/companies' element={<CompanyManagement />} />
                <Route path='/bus-approvals' element={<BusApprovals />} />
                <Route path='/route-approvals' element={<RouteApprovals />} />
                <Route path='/analytics' element={<PlatformAnalytics />} />
            </Route>

            {/* Catch-all */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    )
}

export default AllRoutes
