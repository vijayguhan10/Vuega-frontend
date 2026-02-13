import React, { useState } from 'react'

const Inventory = () => {
  const [activeDeck, setActiveDeck] = useState('lower')
  const [activeTab, setActiveTab] = useState('properties')

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f5f6f8] font-sans">
      {/* ══════════ Header ══════════ */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <span className="material-icons text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              Trip #8092: Bangalore
              <span className="material-icons text-sm text-gray-400">arrow_forward</span>
              Goa
              <span className="ml-2 px-2.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-600 font-medium">Volvo Multi-Axle AC</span>
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
              <span className="material-icons text-[14px]">calendar_today</span> 14 Oct 2023
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="material-icons text-[14px]">schedule</span> 22:00 PM
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-gray-400 text-xs">Occupancy</span>
              <span className="font-bold text-gray-900">32/44 <span className="text-green-500 text-xs font-normal">(72%)</span></span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400 text-xs">Total Revenue</span>
              <span className="font-bold text-gray-900">₹ 42,800</span>
            </div>
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <span className="material-icons text-sm">print</span> Manifest
          </button>
        </div>
      </header>

      {/* ══════════ Main ══════════ */}
      <main className="flex-1 flex overflow-hidden">
        {/* ── Seat Map Area ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f5f6f8] relative">
          {/* Deck Toggle + Legend */}
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
              <button
                onClick={() => setActiveDeck('lower')}
                className={`px-6 py-2 rounded text-sm font-medium transition-all ${
                  activeDeck === 'lower'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Lower Deck
              </button>
              <button
                onClick={() => setActiveDeck('upper')}
                className={`px-6 py-2 rounded text-sm font-medium transition-all ${
                  activeDeck === 'upper'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Upper Deck
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-white border border-gray-300"></div> Available
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div> Booked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-400 border border-amber-500"></div> Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-50 border border-red-300 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-red-400">
                    <span className="material-icons text-[8px]">lock</span>
                  </div>
                </div> Locked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-pink-50 border border-pink-300"></div> Ladies
              </div>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-4xl relative min-h-[600px]">
              {/* Driver indicator */}
              <div className="absolute right-8 bottom-8 border-l-2 border-gray-200 pl-4 flex flex-col items-center opacity-50">
                <span
                  className="material-icons text-4xl text-gray-300 mb-2"
                  style={{ transform: 'rotate(270deg)' }}
                >
                  steering_wheel
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-300"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Driver
                </span>
              </div>

              {/* Seat Rows */}
              <div className="grid grid-cols-6 gap-y-6 gap-x-4 pr-24">
                {/* Row 1 */}
                <div className="col-span-6 flex gap-4 mb-2">
                  {/* L1 - Booked (RedBus) */}
                  <button className="relative w-16 h-16 rounded-lg bg-gray-100 border border-gray-300 flex flex-col items-center justify-center hover:shadow-md transition-all group">
                    <span className="text-xs font-bold text-gray-500 mb-1">L1</span>
                    <div className="w-full bg-[#d84e55] h-5 absolute bottom-0 rounded-b-lg flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold uppercase tracking-wider">redBus</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="material-icons text-[10px] text-white">check</span>
                    </div>
                  </button>
                  {/* L2 - Available */}
                  <SeatAvailable id="L2" />
                  {/* L3 - Available */}
                  <SeatAvailable id="L3" />
                  {/* Aisle */}
                  <div className="w-10"></div>
                  {/* L4 - Booked (AbhiBus) */}
                  <button className="relative w-16 h-16 rounded-lg bg-gray-100 border border-gray-300 flex flex-col items-center justify-center opacity-90">
                    <span className="text-xs font-bold text-gray-500 mb-1">L4</span>
                    <div className="w-full bg-[#bd1912] h-5 absolute bottom-0 rounded-b-lg flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold uppercase tracking-wider">abhiBus</span>
                    </div>
                  </button>
                  {/* L5 - Selected */}
                  <button className="relative w-16 h-16 rounded-lg bg-amber-400 border-2 border-amber-500 shadow-lg ring-2 ring-amber-400/20 flex flex-col items-center justify-center text-gray-900 scale-105 transition-all">
                    <span className="text-xs font-bold mb-0.5">L5</span>
                    <span className="text-[10px] font-medium opacity-90">₹800</span>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Row 2 */}
                <div className="col-span-6 flex gap-4 mb-2">
                  {/* L6 - Locked */}
                  <button className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-400 cursor-not-allowed">
                    <span className="material-icons text-lg mb-0.5">lock</span>
                    <span className="text-xs font-bold">L6</span>
                  </button>
                  <SeatAvailable id="L7" />
                  <SeatAvailable id="L8" />
                  <div className="w-10"></div>
                  {/* L9 - Ladies */}
                  <button className="relative w-16 h-16 rounded-lg bg-pink-50 border border-pink-300 flex flex-col items-center justify-center text-pink-500">
                    <span className="material-icons text-sm mb-0.5">female</span>
                    <span className="text-xs font-bold">L9</span>
                    <div className="w-full bg-pink-500 h-1 absolute bottom-0 rounded-b-lg"></div>
                  </button>
                  <SeatAvailable id="L10" />
                </div>

                {/* Row 3 */}
                <div className="col-span-6 flex gap-4 mb-2">
                  <SeatAvailable id="L11" />
                  <SeatAvailable id="L12" />
                  <SeatAvailable id="L13" />
                  <div className="w-10"></div>
                  <SeatAvailable id="L14" />
                  <SeatAvailable id="L15" />
                </div>

                {/* Row 4 */}
                <div className="col-span-6 flex gap-4 mb-2">
                  <SeatAvailable id="L16" />
                  <SeatAvailable id="L17" />
                  <SeatAvailable id="L18" />
                  <div className="w-10"></div>
                  <SeatAvailable id="L19" />
                  <SeatAvailable id="L20" />
                </div>

                {/* Row 5 - Last row, 5 seats no aisle */}
                <div className="col-span-6 flex gap-4">
                  <SeatAvailable id="L21" />
                  <SeatAvailable id="L22" />
                  <div className="w-10"></div>
                  <SeatAvailable id="L23" />
                  <SeatAvailable id="L24" />
                  <SeatAvailable id="L25" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="w-[400px] bg-white border-l border-gray-200 shadow-xl flex flex-col z-10 shrink-0">
          {/* Seat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seat L5</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Available for Sale
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">₹ 800</div>
                <div className="text-xs text-gray-400">Base Price</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              History
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Properties */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Deck</span>
                <span className="font-medium text-gray-900">Lower</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type</span>
                <span className="font-medium text-gray-900">Window Seater</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Quota</span>
                <span className="font-medium text-gray-900">General</span>
              </div>
            </div>

            {/* Inventory Actions */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Inventory Actions</h3>
              <div className="space-y-3">
                {/* Counter Booking Form */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Counter Booking</h4>
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
                      placeholder="Passenger Name"
                      type="text"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Age"
                        type="text"
                      />
                      <select className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-700">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <input
                      className="w-full rounded-md border border-gray-300 text-sm px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400"
                      placeholder="Phone Number"
                      type="text"
                    />
                    <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors">
                      Book Seat Now
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-icons text-sm text-gray-400">lock</span>
                    Block for Offline
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full border border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-icons text-sm">female</span>
                    Mark as Ladies Seat
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-icons text-sm text-gray-400">edit</span>
                    Change Price
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 flex justify-between items-center">
            <span>Sync Status: <span className="text-green-500 font-medium">Live</span></span>
            <span>Last updated: 1 min ago</span>
          </div>
        </aside>
      </main>
    </div>
  )
}

/* ── Reusable Available Seat Component ── */
const SeatAvailable = ({ id }) => (
  <button className="w-16 h-16 rounded-lg bg-white border border-gray-300 hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center justify-center group">
    <span className="text-xs font-bold text-gray-500 group-hover:text-amber-600">{id}</span>
    <span className="text-[10px] text-gray-400 mt-0.5">₹800</span>
  </button>
)

export default Inventory