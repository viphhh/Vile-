import re

with open("src/components/AdminDashboard.tsx", "r") as f:
    content = f.read()

# 1. Add Calendar, BarChart3 to lucide-react if not there
if "Calendar" not in content and "BarChart3" not in content:
    content = content.replace("import {", "import { Calendar, BarChart as BarChartIcon, ", 1)

# 2. Add state
state_injection = "  const [activeMenu, setActiveMenu] = useState<MenuSection>(initialMenu || 'dashboard');\n  const [dashboardView, setDashboardView] = useState<'charts' | 'calendar'>('charts');"
content = content.replace("  const [activeMenu, setActiveMenu] = useState<MenuSection>(initialMenu || 'dashboard');", state_injection)

# 3. Wrap charts section
old_charts = """            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Chart */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-white">اتجاهات الإيرادات (ريال سعودي)</h3>
                  <p className="text-xs text-slate-400">إحصائيات الإيرادات الشهرية</p>
                </div>
                <div className="h-64 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                        itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        cursor={{ fill: '#1e293b' }}
                      />
                      <Bar dataKey="revenue" name="الإيرادات" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bookings Chart */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-white">اتجاهات الحجوزات</h3>
                  <p className="text-xs text-slate-400">إحصائيات الحجوزات الشهرية</p>
                </div>
                <div className="h-64 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="bookings" name="الحجوزات" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>"""

new_charts = """            {/* Charts & Calendar Toggle Header */}
            <div className="flex items-center justify-between mt-8 mb-4">
              <h3 className="text-lg font-black text-white">نظرة عامة على الأداء</h3>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDashboardView('charts')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    dashboardView === 'charts' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">الرسوم البيانية</span>
                </button>
                <button
                  onClick={() => setDashboardView('calendar')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    dashboardView === 'calendar' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">تقويم الحجوزات</span>
                </button>
              </div>
            </div>

            {dashboardView === 'charts' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Chart */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white">اتجاهات الإيرادات (ريال سعودي)</h3>
                    <p className="text-xs text-slate-400">إحصائيات الإيرادات الشهرية</p>
                  </div>
                  <div className="h-64 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                          cursor={{ fill: '#1e293b' }}
                        />
                        <Bar dataKey="revenue" name="الإيرادات" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bookings Chart */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white">اتجاهات الحجوزات</h3>
                    <p className="text-xs text-slate-400">إحصائيات الحجوزات الشهرية</p>
                  </div>
                  <div className="h-64 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Line type="monotone" dataKey="bookings" name="الحجوزات" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full animate-fade-in">
                <AdminHotelCalendar
                  hotels={localHotels}
                  bookings={filteredBookings}
                  onUpdateHotel={handleSaveHotelForm}
                  selectedHotelId={selectedCalendarHotelId}
                />
              </div>
            )}"""

content = content.replace(old_charts, new_charts)

with open("src/components/AdminDashboard.tsx", "w") as f:
    f.write(content)

