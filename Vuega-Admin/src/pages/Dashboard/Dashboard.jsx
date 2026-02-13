import React, { useState } from 'react'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light font-sans">

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background-light scroll-smooth">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">

            {/* ── Header Row ── */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Today's Overview</h2>
                <p className="text-slate-400 text-sm">Monitor your fleet performance and sales channels in real-time.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Updates
                </span>
                <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>Oct 24, 2023</span>
                </button>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span className="hidden sm:inline">Add Trip</span>
                </button>
              </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue */}
              <div className="flex flex-col gap-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-aesthetic-teal"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-slate-900 text-2xl font-bold mt-1">₹45,200</h3>
                  </div>
                  <div className="bg-teal-50 p-2 rounded-lg text-aesthetic-teal">
                    <span className="material-symbols-outlined text-[22px]">payments</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center text-xs font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                    12%
                  </span>
                  <span className="text-xs text-slate-400">vs yesterday</span>
                </div>
              </div>
              {/* Tickets */}
              <div className="flex flex-col gap-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-aesthetic-lavender"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Tickets Sold</p>
                    <h3 className="text-slate-900 text-2xl font-bold mt-1">124</h3>
                  </div>
                  <div className="bg-violet-50 p-2 rounded-lg text-aesthetic-lavender">
                    <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center text-xs font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                    5%
                  </span>
                  <span className="text-xs text-slate-400">vs yesterday</span>
                </div>
              </div>
              {/* Active Trips */}
              <div className="flex flex-col gap-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-aesthetic-teal"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Active Trips</p>
                    <h3 className="text-slate-900 text-2xl font-bold mt-1">8</h3>
                  </div>
                  <div className="bg-teal-50 p-2 rounded-lg text-aesthetic-teal">
                    <span className="material-symbols-outlined text-[22px]">directions_bus</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-400">All running on schedule</span>
                </div>
              </div>
              {/* Occupancy Rate */}
              <div className="flex flex-col gap-1 p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-aesthetic-lavender"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Occupancy Rate</p>
                    <h3 className="text-slate-900 text-2xl font-bold mt-1">78%</h3>
                  </div>
                  <div className="bg-violet-50 p-2 rounded-lg text-aesthetic-lavender">
                    <span className="material-symbols-outlined text-[22px]">airline_seat_recline_normal</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_down</span>
                    2%
                  </span>
                  <span className="text-xs text-slate-400">vs last week</span>
                </div>
              </div>
            </div>
            {/* ── Charts + Right Column ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2/3 */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Occupancy Trends Chart */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-slate-900 text-lg font-bold">Occupancy Trends (Last 7 Days)</h3>
                    <button className="text-primary hover:text-primary-dark text-sm font-semibold">View Report</button>
                  </div>
                  <div className="grid min-h-[220px] grid-cols-7 gap-3 items-end justify-items-center px-2">
                    {[
                      { day: 'Mon', pct: 30, highlight: false },
                      { day: 'Tue', pct: 55, highlight: false },
                      { day: 'Wed', pct: 48, highlight: false },
                      { day: 'Thu', pct: 65, highlight: false },
                      { day: 'Fri', pct: 80, highlight: true },
                      { day: 'Sat', pct: 90, highlight: false },
                      { day: 'Sun', pct: 85, highlight: false },
                    ].map((item) => (
                      <div key={item.day} className="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                        <div
                          className="w-full max-w-[42px] bg-aesthetic-teal/15 rounded-t-md relative group-hover:bg-aesthetic-teal/25 transition-all"
                          style={{ height: `${item.pct}%` }}
                        >
                          <div className="absolute bottom-0 w-full bg-aesthetic-teal rounded-t-md" style={{ height: '100%' }}></div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.pct}%
                          </div>
                        </div>
                        <p className={`text-xs font-medium ${item.highlight ? 'text-aesthetic-teal font-bold' : 'text-slate-400'}`}>
                          {item.day}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Departures Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-slate-900 text-lg font-bold">Upcoming Departures</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Trips scheduled for the next 6 hours</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary text-sm font-medium transition-colors">
                      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                      Filter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[11px] uppercase text-slate-400 border-b border-slate-200">
                          <th className="px-6 py-3 font-semibold tracking-wider">Route &amp; Bus</th>
                          <th className="px-6 py-3 font-semibold tracking-wider">Departure</th>
                          <th className="px-6 py-3 font-semibold tracking-wider">Occupancy</th>
                          <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                          <th className="px-6 py-3 font-semibold tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {/* Row 1 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">Bangalore <span className="text-slate-300 mx-1">→</span> Chennai</span>
                              <span className="text-[11px] text-slate-400 mt-0.5">KA01 AB 1234 • Volvo AC Multi-Axle</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-slate-300">schedule</span>
                              10:00 PM
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="w-full max-w-[120px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-600">32/40</span>
                                <span className="text-slate-400">80%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200">
                              <span className="size-1.5 rounded-full bg-green-500"></span>
                              On Time
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-slate-600">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">Bangalore <span className="text-slate-300 mx-1">→</span> Hyderabad</span>
                              <span className="text-[11px] text-slate-400 mt-0.5">KA53 MN 8899 • Scania Sleeper</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-slate-300">schedule</span>
                              10:30 PM
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="w-full max-w-[120px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-600">18/30</span>
                                <span className="text-slate-400">60%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 border border-yellow-200">
                              <span className="size-1.5 rounded-full bg-yellow-500"></span>
                              Boarding
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-slate-600">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800">Bangalore <span className="text-slate-300 mx-1">→</span> Mumbai</span>
                              <span className="text-[11px] text-slate-400 mt-0.5">KA02 XY 5555 • AC Seater</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-slate-300">schedule</span>
                              11:15 PM
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="w-full max-w-[120px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-600">42/42</span>
                                <span className="text-slate-400">100%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-aesthetic-teal h-1.5 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200">
                              <span className="size-1.5 rounded-full bg-red-500"></span>
                              Delayed (15m)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-slate-600">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/60 flex justify-center">
                    <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">View All Trips</button>
                  </div>
                </div>
              </div>

              {/* Right 1/3 */}
              <div className="lg:col-span-1 flex flex-col gap-6">

                {/* Channel Health */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-900 text-lg font-bold">Channel Health</h3>
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold text-[11px]">RB</div>
                        <span className="text-sm font-semibold text-slate-700">RedBus</span>
                      </div>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-[11px]">PM</div>
                        <span className="text-sm font-semibold text-slate-700">Paytm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-yellow-600 font-medium">Syncing...</span>
                        <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold text-[11px]">AB</div>
                        <span className="text-sm font-semibold text-slate-700">AbhiBus</span>
                      </div>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-slate-700 flex items-center justify-center text-white font-bold text-[11px]">CN</div>
                        <span className="text-sm font-semibold text-slate-700">Counter</span>
                      </div>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-slate-900 text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-aesthetic-lavender text-[24px]">block</span>
                      <span className="text-xs font-semibold text-slate-600">Block Seats</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-primary text-[24px]">notification_important</span>
                      <span className="text-xs font-semibold text-slate-600">Broadcast Delay</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-aesthetic-teal text-[24px]">add_road</span>
                      <span className="text-xs font-semibold text-slate-600">New Route</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-aesthetic-lavender text-[24px]">support_agent</span>
                      <span className="text-xs font-semibold text-slate-600">Contact Support</span>
                    </button>
                  </div>
                </div>

                {/* Promo Card */}
                <div className="bg-gradient-to-r from-teal-400 to-violet-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-bold text-base mb-1">Get 20% Off Fuel</h4>
                    <p className="text-teal-50 text-xs mb-3">Partner with IndianOil using your BusConnect card.</p>
                    <button className="px-4 py-1.5 bg-white text-teal-700 rounded text-xs font-bold hover:bg-teal-50 transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                    <span className="material-symbols-outlined text-[100px]">local_gas_station</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
  )
}

export default Dashboard