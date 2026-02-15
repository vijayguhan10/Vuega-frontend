import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import LoginSignup from '../components/Auth/LoginSignup'
import Dashboard from '../pages/Dashboard/Dashboard'
import TripSchedule from '../pages/Schedule/TripSchedule'
import Inventory from '../pages/seatInventory/Inventory'

const AllRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route path='/' element={<LoginSignup />} />

            {/* Protected routes with shared layout */}
            <Route element={<AdminLayout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/companies' element={<div className="text-slate-500 text-sm">Companies page — coming soon</div>} />
                <Route path='/bus-approvals' element={<div className="text-slate-500 text-sm">Bus Approvals page — coming soon</div>} />
                <Route path='/analytics' element={<div className="text-slate-500 text-sm">Analytics page — coming soon</div>} />
                <Route path='/tripSchedule' element={<TripSchedule />} />
                <Route path='/inventory' element={<Inventory />} />
            </Route>

            {/* Catch-all */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    )
}

export default AllRoutes
