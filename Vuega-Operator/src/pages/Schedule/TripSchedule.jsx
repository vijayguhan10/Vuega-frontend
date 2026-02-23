import React from 'react'

const TripSchedule = () => {
 const trips = [
 {
 route: 'Bangalore → Hyderabad',
 id: '#TR-8821',
 bus: 'Volvo Multi-Axle A/C',
 plate: 'KA-01-AB-1234',
 date: 'Oct 24, 22:00',
 day: 'Thursday',
 seats: '24/40 Seats',
 pct: 60,
 status: 'Scheduled',
 },
 {
 route: 'Chennai → Bangalore',
 id: '#TR-8825',
 bus: 'Scania Sleeper',
 plate: 'TN-09-XY-9876',
 date: 'Oct 24, 23:30',
 day: 'Thursday',
 seats: '38/40 Seats',
 pct: 95,
 status: 'Filling Fast',
 },
 {
 route: 'Mumbai → Pune',
 id: '#TR-8901',
 bus: 'Mercedes Benz Seater',
 plate: 'MH-12-PQ-5555',
 date: 'Oct 25, 06:00',
 day: 'Friday',
 seats: '10/45 Seats',
 pct: 22,
 status: 'Scheduled',
 },
 {
 route: 'Hyderabad → Vijayawada',
 id: '#TR-8905',
 bus: 'Volvo B9R',
 plate: 'TS-08-ZZ-1111',
 date: 'Oct 25, 09:00',
 day: 'Friday',
 seats: '40/40 Seats',
 pct: 100,
 status: 'Sold Out',
 },
 {
 route: 'Bangalore → Mysore',
 id: '#TR-8910',
 bus: 'Electric AC Bus',
 plate: 'KA-51-EV-0001',
 date: 'Oct 25, 14:00',
 day: 'Friday',
 seats: '23/45 Seats',
 pct: 51,
 status: 'Scheduled',
 },
 ]

 const statusBadge = (status) => {
 switch (status) {
 case 'Filling Fast':
 return 'bg-amber-50 text-amber-700 ring-amber-600/20'
 case 'Sold Out':
 return 'bg-slate-100 text-slate-600 ring-slate-500/10'
 default:
 return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
 }
 }

 return (
 <div className="min-h-screen bg-white font-sans">
 {/* ══════════ Top Navbar ══════════ */}
 <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
 <div className="max-w-[1440px] mx-auto px-8">
 <div className="flex h-16 items-center justify-between">
 {/* Logo */}
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center w-8 h-8 text-orange-500">
 <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
 <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
 <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd" />
 </svg>
 </div>
 <h2 className="text-slate-900 font-bold leading-tight tracking-[-0.015em]">BusConnect Admin</h2>
 </div>

 {/* Nav Links */}
 <nav className="flex items-center gap-9">
 <a className="text-slate-500 hover:text-orange-500 transition-colors font-medium border-b-2 border-transparent pb-1" href="#">Dashboard</a>
 <a className="text-slate-500 hover:text-orange-500 transition-colors font-medium border-b-2 border-transparent pb-1" href="#">Inventory</a>
 <a className="text-slate-900 font-semibold border-b-2 border-orange-500 pb-1" href="#">Trips</a>
 <a className="text-slate-500 hover:text-orange-500 transition-colors font-medium border-b-2 border-transparent pb-1" href="#">Bookings</a>
 <a className="text-slate-500 hover:text-orange-500 transition-colors font-medium border-b-2 border-transparent pb-1" href="#">Reports</a>
 </nav>

 {/* Right: Bell + Avatar */}
 <div className="flex items-center gap-4">
 <button className="text-slate-400 hover:text-slate-600">
 <span className="material-symbols-outlined">notifications</span>
 </button>
 <div
 className="bg-center bg-no-repeat bg-cover rounded-full w-9 h-9 ring-2 ring-slate-100"
 style={{
 backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJehvDaDwnya4zHpl0m0G_KAktBF4Q5N2mSIeAGenevf3dBSugwlDX3HRRSzXHwZH_hq8HeLj9Hp4-Wjr17R2PG88i34DuCbs2VWfUqx_0AXZFkgBPkG1oBD84nSAgfl8MEKmIGwLM9VVfRnRiHzeQsjbDMPh9rgwj-NGMOY-vq2EXxgTFORQyzHb82EEZSQNwanoTuJz7bYDuikYC56fzUASr7wH2vOsTf5Dpf_17beO8zPVfr7A0HCgQQFMT5kV8upvavV_qv5pZ")',
 }}
 />
 </div>
 </div>
 </div>
 </header>

 {/* ══════════ Main Content ══════════ */}
 <main className="flex justify-center py-6 px-8">
 <div className="flex flex-col max-w-[1200px] flex-1 w-full gap-6">
 {/* Title Row */}
 <div className="flex items-end justify-between gap-4">
 <div className="flex flex-col gap-1">
 <h1 className="text-slate-900 font-black leading-tight tracking-[-0.033em]">Trip Schedules</h1>
 <p className="text-slate-500 font-normal">Manage your upcoming bus trips and inventory across all channels.</p>
 </div>
 <button className="flex items-center justify-center gap-2 cursor-pointer rounded-lg h-10 px-5 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold shadow-sm">
 <span className="material-symbols-outlined ">add</span>
 <span>Create New Trip</span>
 </button>
 </div>

 {/* Filter Bar */}
 <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
 <div className="flex gap-4 justify-between items-center">
 <div className="flex gap-3">
 {/* Search */}
 <div className="relative w-64">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
 <span className="material-symbols-outlined ">search</span>
 </div>
 <input
 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400 transition-shadow outline-none"
 placeholder="Search route or bus ID..."
 type="text"
 />
 </div>
 {/* Date */}
 <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-slate-700 hover:bg-gray-50 transition-colors">
 <span className="material-symbols-outlined ">calendar_month</span>
 Date
 </button>
 {/* Bus Type */}
 <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-slate-700 hover:bg-gray-50 transition-colors">
 <span className="material-symbols-outlined ">directions_bus</span>
 Bus Type
 </button>
 {/* Filter Icon */}
 <button className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors" title="More Filters">
 <span className="material-symbols-outlined ">filter_list</span>
 </button>
 </div>
 {/* Export */}
 <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
 <span className="material-symbols-outlined ">download</span>
 Export Data
 </button>
 </div>
 </div>

 {/* ── Trip Table ── */}
 <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-50 border-b border-gray-200">
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500">Route</th>
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500">Bus Details</th>
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500">Departure</th>
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500 min-w-[160px]">Occupancy</th>
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500">Status</th>
 <th className="whitespace-nowrap px-6 py-4 font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200">
 {trips.map((t) => (
 <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
 {/* Route */}
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className=" font-semibold text-slate-900">{t.route}</span>
 <span className=" text-slate-500 mt-1">ID: {t.id}</span>
 </div>
 </td>
 {/* Bus Details */}
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className=" text-slate-700">{t.bus}</span>
 <span className=" font-mono text-slate-500 mt-1">{t.plate}</span>
 </div>
 </td>
 {/* Departure */}
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded bg-blue-50 text-blue-600">
 <span className="material-symbols-outlined ">schedule</span>
 </div>
 <div className="flex flex-col">
 <span className=" font-medium text-slate-900">{t.date}</span>
 <span className=" text-slate-500">{t.day}</span>
 </div>
 </div>
 </td>
 {/* Occupancy */}
 <td className="px-6 py-4">
 <div className="flex flex-col gap-2">
 <div className="flex justify-between font-medium">
 <span className="text-slate-700">{t.seats}</span>
 <span className="text-orange-500">{t.pct}%</span>
 </div>
 <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
 <div
 className="h-full rounded-full bg-orange-500"
 style={{ width: `${t.pct}%` }}
 />
 </div>
 </div>
 </td>
 {/* Status */}
 <td className="px-6 py-4">
 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset ${statusBadge(t.status)}`}>
 {t.status}
 </span>
 </td>
 {/* Actions */}
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="text-slate-500 hover:text-orange-500 transition-colors p-1.5 hover:bg-gray-100 rounded-md" title="View Seats">
 <span className="material-symbols-outlined ">airline_seat_recline_normal</span>
 </button>
 <button className="text-slate-500 hover:text-orange-500 transition-colors p-1.5 hover:bg-gray-100 rounded-md" title="Manage Trip">
 <span className="material-symbols-outlined ">edit_square</span>
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* ── Pagination ── */}
 <div className="flex items-center justify-between px-2 py-3">
 <p className=" text-slate-500">
 Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">10</span> of <span className="font-medium text-slate-900">97</span> results
 </p>
 <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
 <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">
 <span className="sr-only">Previous</span>
 <span className="material-symbols-outlined ">chevron_left</span>
 </a>
 <a aria-current="page" className="relative z-10 inline-flex items-center bg-orange-500 px-4 py-2 font-semibold text-white focus:z-20" href="#">1</a>
 <a className="relative inline-flex items-center px-4 py-2 font-semibold text-slate-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">2</a>
 <a className="relative inline-flex items-center px-4 py-2 font-semibold text-slate-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">3</a>
 <span className="relative inline-flex items-center px-4 py-2 font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>
 <a className="relative inline-flex items-center px-4 py-2 font-semibold text-slate-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">8</a>
 <a className="relative inline-flex items-center px-4 py-2 font-semibold text-slate-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">9</a>
 <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20" href="#">
 <span className="sr-only">Next</span>
 <span className="material-symbols-outlined ">chevron_right</span>
 </a>
 </nav>
 </div>
 </div>
 </main>
 </div>
 )
}

export default TripSchedule