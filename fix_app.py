import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# First, remove everything between `      <main className="flex-1">` and `      </main>` 
# Wait, that's a lot. Let's just do a regex replace.
start_marker = '      <main className="flex-1">'
end_marker = '      </main>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    old_main = content[start_idx:end_idx + len(end_marker)]

    new_main = """      <main className="flex-1">
        {/* DYNAMIC PAGE VIEWER */}
        <AnimatePresence mode="wait">
          {activePageSlug ? (
            <motion.div key="page-viewer" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <PageViewer 
                page={pages.find(p => p.slug === activePageSlug)} 
                onBack={() => setActivePageSlug(null)} 
              />
            </motion.div>
          ) : activeTab === 'home' ? (
            <motion.div key="home-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="space-y-10">
              <HeroSearch
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchHotels}
                onOpenAi={() => setAiModalOpen(true)}
              />
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/4">
                    <SidebarFilters filters={filters} setFilters={setFilters} />
                  </div>
                  <div className="w-full lg:w-3/4 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-2 text-slate-300 font-bold">
                        <Building2 className="w-5 h-5 text-amber-500" />
                        <span>النتائج: <span className="text-white">{publicHotels.length}</span> مكان إقامة</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <ArrowUpDown className="w-4 h-4 text-slate-400" />
                        <select
                          className="bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 flex-1 sm:flex-none font-bold"
                          value={filters.sortBy}
                          onChange={(e) => {
                            setFilters({ ...filters, sortBy: e.target.value as any });
                            fetchHotels();
                          }}
                        >
                          <option value="recommended">الأكثر توصية (ذكاء اصطناعي)</option>
                          <option value="price_asc">الأقل سعراً</option>
                          <option value="price_desc">الأعلى سعراً</option>
                          <option value="rating">الأعلى تقييماً</option>
                        </select>
                      </div>
                    </div>
                    {isFetching ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Sparkles className="w-10 h-10 text-amber-500 animate-pulse mb-4" />
                        <p className="text-slate-400 font-bold">جاري البحث بذكاء...</p>
                      </div>
                    ) : publicHotels.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-950 rounded-3xl border border-slate-800">
                        <Filter className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-black text-white mb-2">لا توجد نتائج مطابقة</h3>
                        <p className="text-sm text-slate-400 mb-6 max-w-md">لم نتمكن من العثور على فنادق تطابق معايير البحث الدقيقة. جرب تخفيف الفلاتر.</p>
                        <button
                          onClick={() =>
                            setFilters({
                              city: 'all',
                              checkIn: '',
                              checkOut: '',
                              guests: 1,
                              rooms: 1,
                              minPrice: 0,
                              maxPrice: 5000,
                              starRatings: [],
                              amenities: [],
                              sortBy: 'recommended',
                              searchQuery: '',
                            })
                          }
                          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                        >
                          عرض كافة الفنادق
                        </button>
                      </div>
                    ) : (
                      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                          {publicHotels.map((hotel, index) => (
                            <motion.div
                              key={hotel.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                              <HotelCard
                                hotel={hotel}
                                isFavorite={favorites.includes(hotel.id)}
                                hasPriceAlert={priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled)}
                                onToggleFavorite={toggleFavorite}
                                onSelectHotel={(h) => setSelectedHotel(h)}
                                onInquire={handleOpenInquiry}
                                onOpenPriceAlert={handleOpenPriceAlert}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center">
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">ضمان أفضل سعر</h4>
                    <p className="text-xs text-slate-400">أسعار تنافسية ومباشرة بدون عمولات خفية</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">تأكيد حجز فورى</h4>
                    <p className="text-xs text-slate-400">تصلك التذكرة والوصل فوراً برمز الحجز QR</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">مستشار حجز ذكي</h4>
                    <p className="text-xs text-slate-400">توصيات مخصصة بذكاء الاصطناعي لرحلتك</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'cities' ? (
            <motion.div key="cities-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <CityExplore
                onSelectCity={(cityName) => {
                  setFilters((prev) => ({ ...prev, city: cityName }));
                  setActiveTab('home');
                }}
                onOpenAi={() => setAiModalOpen(true)}
              />
            </motion.div>
          ) : activeTab === 'dashboard' ? (
            <motion.div key="dashboard-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              {user?.role === 'host' ? (
                <AdminDashboard
                  hotels={hotels}
                  bookings={bookings}
                  usersList={usersList}
                  onAddHotel={handleAddHotel}
                  onUpdateHotel={handleUpdateHotel}
                  onDeleteHotel={handleDeleteHotel}
                  onLogout={handleLogout}
                  user={user}
                />
              ) : (
                <CustomerDashboard
                  user={user}
                  bookings={bookings}
                  inquiries={inquiries}
                  favorites={favorites}
                  hotels={publicHotels}
                  priceAlerts={priceAlerts}
                  onLogout={handleLogout}
                  onNavigateHome={() => setActiveTab('home')}
                  onRemoveFavorite={toggleFavorite}
                  onCancelBooking={handleCancelBooking}
                  onSimulateEmail={setSimulatedEmailBooking}
                  onSelectHotel={(h) => setSelectedHotel(h)}
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>"""

    content = content.replace(old_main, new_main)
    with open("src/App.tsx", "w") as f:
        f.write(content)

