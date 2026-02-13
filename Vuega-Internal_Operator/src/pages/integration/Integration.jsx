import React, { useState } from 'react'

const Integration = () => {
  const [searchPartner, setSearchPartner] = useState('')
  const [filterLogs, setFilterLogs] = useState('')

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f4] font-sans">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#1a202c] border-r border-[#2d3748] h-full shrink-0">
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex flex-col px-2 pt-2">
              <h1 className="text-white text-lg font-bold leading-normal">Mediator Platform</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Bus Ticketing Ops</p>
            </div>
            {/* Nav */}
            <div className="flex flex-col gap-1 mt-2">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2d3748] transition-colors group" href="#">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-[20px]">dashboard</span>
                <p className="text-gray-400 group-hover:text-white text-sm font-medium leading-normal">Dashboard</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E8612C]/10 text-[#E8612C]" href="#">
                <span className="material-symbols-outlined text-[#E8612C] text-[20px] icon-filled">hub</span>
                <p className="text-[#E8612C] text-sm font-medium leading-normal">Integrations</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2d3748] transition-colors group" href="#">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-[20px]">terminal</span>
                <p className="text-gray-400 group-hover:text-white text-sm font-medium leading-normal">Logs</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2d3748] transition-colors group" href="#">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-[20px]">settings</span>
                <p className="text-gray-400 group-hover:text-white text-sm font-medium leading-normal">Settings</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2d3748] transition-colors group" href="#">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-white text-[20px]">description</span>
                <p className="text-gray-400 group-hover:text-white text-sm font-medium leading-normal">API Docs</p>
              </a>
            </div>
          </div>
          {/* User Profile */}
          <div className="px-2">
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-[#2d3748] bg-[#2d3748]/50">
              <div className="w-8 h-8 rounded-full bg-[#E8612C] flex items-center justify-center text-white text-xs font-bold shrink-0">JD</div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Jane Doe</p>
                <p className="text-xs text-gray-400 truncate">Head of Tech</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f0f2f4]">
        {/* Page Header */}
        <div className="px-6 pt-8 pb-4">
          <div className="flex flex-wrap justify-between gap-3 items-end">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111318] text-3xl font-black leading-tight tracking-[-0.033em]">Channel Integrations</h1>
              <p className="text-[#616f89] text-base font-normal leading-normal max-w-2xl">
                Manage OTA partners, configure API keys, and monitor real-time connectivity status.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#E8612C] hover:bg-[#D4551F] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-orange-200">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add New Channel
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#dbdfe6] bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-[#616f89] text-sm font-medium">Active Channels</p>
                <span className="material-symbols-outlined text-[#616f89] text-[20px]">hub</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111318] text-2xl font-bold leading-tight">12</p>
                <span className="text-[#07883b] bg-[#07883b]/10 px-1.5 py-0.5 rounded text-xs font-medium mb-1">+2%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#dbdfe6] bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-[#616f89] text-sm font-medium">Failed Requests (24h)</p>
                <span className="material-symbols-outlined text-[#616f89] text-[20px]">error</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111318] text-2xl font-bold leading-tight">48</p>
                <span className="text-[#e73908] bg-[#e73908]/10 px-1.5 py-0.5 rounded text-xs font-medium mb-1">+0.5%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#dbdfe6] bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-[#616f89] text-sm font-medium">Avg. Latency</p>
                <span className="material-symbols-outlined text-[#616f89] text-[20px]">speed</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-[#111318] text-2xl font-bold leading-tight">180ms</p>
                <span className="text-[#07883b] bg-[#07883b]/10 px-1.5 py-0.5 rounded text-xs font-medium mb-1">-12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Platforms + Keys | Live Traffic */}
        <div className="flex flex-col xl:flex-row px-6 pb-8 gap-6 flex-1">
          {/* Left Column */}
          <div className="flex flex-col flex-1 gap-6 min-w-0">
            {/* Connected Platforms */}
            <div className="flex flex-col rounded-xl border border-[#dbdfe6] bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#dbdfe6] flex justify-between items-center">
                <h2 className="text-[#111318] text-lg font-bold">Connected Platforms</h2>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#616f89] text-[20px]">search</span>
                  <input
                    className="pl-9 pr-4 py-1.5 text-sm border border-[#dbdfe6] rounded-lg bg-[#f0f2f4] focus:outline-none focus:ring-2 focus:ring-[#E8612C]/50 focus:border-[#E8612C] transition-all"
                    placeholder="Search partners..."
                    type="text"
                    value={searchPartner}
                    onChange={(e) => setSearchPartner(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#dbdfe6]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#616f89] uppercase tracking-wider">Partner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#616f89] uppercase tracking-wider">Environment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#616f89] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#616f89] uppercase tracking-wider">Last Sync</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#616f89] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dbdfe6]">
                    {/* RedBus */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                            <span className="font-bold text-red-600 text-xs">RB</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#111318]">RedBus</span>
                            <span className="text-xs text-[#616f89]">v2.4 API</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          Production
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          <span className="text-sm text-[#111318]">Healthy</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616f89]">2 mins ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#E8612C] hover:text-[#D4551F] font-semibold">Configure</button>
                      </td>
                    </tr>
                    {/* Expedia */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                            <span className="font-bold text-yellow-600 text-xs">EX</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#111318]">Expedia</span>
                            <span className="text-xs text-[#616f89]">v1.1 API</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          Production
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                          <span className="text-sm text-[#111318]">Healthy</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616f89]">15 mins ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#E8612C] hover:text-[#D4551F] font-semibold">Configure</button>
                      </td>
                    </tr>
                    {/* MakeMyTrip */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                            <span className="font-bold text-red-500 text-xs">MT</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#111318]">MakeMyTrip</span>
                            <span className="text-xs text-[#616f89]">Sandbox Test</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                          Sandbox
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]"></div>
                          <span className="text-sm text-[#111318]">Maintenance</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616f89]">1 hr ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#E8612C] hover:text-[#D4551F] font-semibold">Configure</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Key Vault */}
            <div className="flex flex-col rounded-xl border border-[#dbdfe6] bg-white shadow-sm">
              <div className="p-4 border-b border-[#dbdfe6]">
                <h2 className="text-[#111318] text-lg font-bold">API Key Vault</h2>
                <p className="text-sm text-[#616f89] mt-1">Manage secrets for your connected channels. Keys are masked by default.</p>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {/* RedBus Key */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-lg bg-[#f0f2f4] border border-[#dbdfe6]">
                  <div className="flex items-center gap-3 md:w-1/4">
                    <span className="material-symbols-outlined text-[#616f89] text-[20px]">key</span>
                    <span className="text-sm font-medium text-[#111318]">RedBus Prod</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <code className="font-mono text-xs bg-white px-3 py-2 rounded border border-[#dbdfe6] text-[#616f89] flex-1 tracking-wider">●●●●●●●●●●●●●●●●●●●●●●●●</code>
                    <button className="p-1.5 rounded hover:bg-orange-50 text-[#616f89] hover:text-[#E8612C] transition-colors" title="Reveal">
                      <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-orange-50 text-[#616f89] hover:text-[#E8612C] transition-colors" title="Copy">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded border border-orange-100 transition-colors">Revoke</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-white border border-orange-200 hover:bg-orange-50 rounded transition-colors">Regenerate</button>
                  </div>
                </div>
                {/* Expedia Key */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-lg bg-[#f0f2f4] border border-[#dbdfe6]">
                  <div className="flex items-center gap-3 md:w-1/4">
                    <span className="material-symbols-outlined text-[#616f89] text-[20px]">key</span>
                    <span className="text-sm font-medium text-[#111318]">Expedia Prod</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <code className="font-mono text-xs bg-white px-3 py-2 rounded border border-[#dbdfe6] text-[#616f89] flex-1 tracking-wider">●●●●●●●●●●●●●●●●●●●●●●●●●●●●</code>
                    <button className="p-1.5 rounded hover:bg-orange-50 text-[#616f89] hover:text-[#E8612C] transition-colors" title="Reveal">
                      <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-orange-50 text-[#616f89] hover:text-[#E8612C] transition-colors" title="Copy">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded border border-orange-100 transition-colors">Revoke</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-white border border-orange-200 hover:bg-orange-50 rounded transition-colors">Regenerate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Live Traffic Panel ── */}
          <div className="flex flex-col w-full xl:w-[420px] shrink-0 h-[600px] xl:h-auto rounded-xl border border-[#dbdfe6] bg-[#101622] shadow-sm overflow-hidden text-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-[#161e2e] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E8612C] text-[18px] animate-pulse">circle</span>
                <h2 className="text-white font-bold tracking-wide">Live Traffic</h2>
              </div>
              <div className="flex gap-3">
                <button className="text-xs text-gray-400 hover:text-white uppercase font-mono tracking-wider">Clear</button>
                <button className="text-xs text-gray-400 hover:text-white uppercase font-mono tracking-wider">Pause</button>
              </div>
            </div>
            {/* Log Entries */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs flex flex-col gap-4 bg-[#0d1117]">
              {/* Entry 1 - 200 OK */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:02:45</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-blue-400 font-bold">POST</span>
                    <span className="text-[#4ade80] bg-[#4ade80]/10 px-1.5 rounded text-[11px]">200 OK</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/booking/confirm</span>
                </div>
              </div>
              {/* Entry 2 - 400 Bad Request */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:02:42</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-blue-400 font-bold">POST</span>
                    <span className="text-[#fb7185] bg-[#fb7185]/10 px-1.5 rounded text-[11px]">400 Bad Request</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/inventory/search</span>
                  <span className="text-[#fda4af] italic mt-0.5 text-[11px]">"Invalid date format"</span>
                </div>
              </div>
              {/* Entry 3 - 200 OK */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:02:30</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[#c084fc] font-bold">GET</span>
                    <span className="text-[#4ade80] bg-[#4ade80]/10 px-1.5 rounded text-[11px]">200 OK</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/availability/check</span>
                </div>
              </div>
              {/* Entry 4 - 201 Created */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:02:15</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-blue-400 font-bold">POST</span>
                    <span className="text-[#4ade80] bg-[#4ade80]/10 px-1.5 rounded text-[11px]">201 Created</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/booking/initiate</span>
                </div>
              </div>
              {/* Entry 5 - 200 OK */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:01:55</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[#c084fc] font-bold">GET</span>
                    <span className="text-[#4ade80] bg-[#4ade80]/10 px-1.5 rounded text-[11px]">200 OK</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/seats/status</span>
                </div>
              </div>
              {/* Entry 6 - 500 Server Error */}
              <div className="flex gap-3 text-gray-400 hover:bg-white/5 p-1.5 rounded cursor-pointer transition-colors group">
                <span className="text-gray-500 shrink-0 pt-0.5">14:01:42</span>
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-blue-400 font-bold">POST</span>
                    <span className="text-[#f87171] bg-[#f87171]/10 px-1.5 rounded text-[11px]">500 Server Error</span>
                  </div>
                  <span className="text-gray-300 break-all">/api/v1/payment/webhook</span>
                  <span className="text-[#fda4af] italic mt-0.5 text-[11px]">"Timeout upstream"</span>
                </div>
              </div>
            </div>
            {/* Filter */}
            <div className="p-3 bg-[#161e2e] border-t border-gray-700">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
                <input
                  className="w-full bg-[#0d1117] text-gray-300 text-xs rounded-lg pl-8 pr-3 py-2 border border-gray-600 focus:border-[#E8612C] focus:outline-none focus:ring-1 focus:ring-[#E8612C] font-mono"
                  placeholder="Filter logs..."
                  type="text"
                  value={filterLogs}
                  onChange={(e) => setFilterLogs(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Integration