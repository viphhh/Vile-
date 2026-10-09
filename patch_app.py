import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add viewMode state
if "const [viewMode, setViewMode]" not in content:
    content = content.replace("const [showScrollTop, setShowScrollTop] = useState(false);", "const [showScrollTop, setShowScrollTop] = useState(false);\n  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');")

# Add Map import
if "ExploreMap" not in content:
    content = content.replace("import { HotelDetailModal } from './components/HotelDetailModal';", "import { HotelDetailModal } from './components/HotelDetailModal';\nimport { ExploreMap } from './components/ExploreMap';")

# Replace result header
old_header = """                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
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
                    </div>"""

new_header = """                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-4 text-slate-300 font-bold">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-amber-500" />
                          <span>النتائج: <span className="text-white">{publicHotels.length}</span></span>
                        </div>
                        <div className="h-6 w-px bg-slate-800"></div>
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              viewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Menu className="w-4 h-4" />
                            <span>قائمة</span>
                          </button>
                          <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              viewMode === 'map' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Map className="w-4 h-4" />
                            <span>خريطة</span>
                          </button>
                        </div>
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
                    </div>"""

content = content.replace(old_header, new_header)

# Map icons in App.tsx
if "Map," not in content and "import { Map" not in content:
    content = content.replace("ArrowUpDown, Filter", "ArrowUpDown, Filter, Map, Menu")


# Modify the view rendering
old_results = """                    {loadingHotels ? (
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
                              searchQuery: ''
                            })
                          }
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
                        >
                          مسح جميع الفلاتر
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {publicHotels.map(hotel => (
                          <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={() => setSelectedHotel(hotel)}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(hotel.id)}
                            onBook={(room) => {
                              setSelectedHotel(hotel);
                              setTimeout(() => {
                                handleBookRoom(hotel, room);
                              }, 100);
                            }}
                          />
                        ))}
                      </div>
                    )}"""

new_results = """                    {loadingHotels ? (
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
                              searchQuery: ''
                            })
                          }
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
                        >
                          مسح جميع الفلاتر
                        </button>
                      </div>
                    ) : viewMode === 'map' ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ExploreMap 
                          hotels={publicHotels} 
                          onHotelClick={(hotel) => setSelectedHotel(hotel)} 
                        />
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {publicHotels.map(hotel => (
                          <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={() => setSelectedHotel(hotel)}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(hotel.id)}
                            onBook={(room) => {
                              setSelectedHotel(hotel);
                              setTimeout(() => {
                                handleBookRoom(hotel, room);
                              }, 100);
                            }}
                          />
                        ))}
                      </div>
                    )}"""

content = content.replace(old_results, new_results)

with open("src/App.tsx", "w") as f:
    f.write(content)
