import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add CompareModal import
if "import { CompareModal }" not in content:
    content = content.replace("import { HotelDetailModal } from './components/HotelDetailModal';", "import { HotelDetailModal } from './components/HotelDetailModal';\nimport { CompareModal } from './components/CompareModal';")

# Add Compare state
if "const [compareList, setCompareList]" not in content:
    content = content.replace("  const [showScrollTop, setShowScrollTop] = useState(false);", "  const [showScrollTop, setShowScrollTop] = useState(false);\n  const [compareList, setCompareList] = useState<Hotel[]>([]);\n  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);")

# Add Scale icon
if "Scale" not in content:
    content = content.replace("Menu", "Menu, Scale")

# Add toggle compare function
toggle_func = """  const handleBookRoom = (hotel: Hotel, room: RoomType) => {
    setBookingData({ hotel, room });
    setIsBookingModalOpen(true);
  };

  const toggleCompare = (hotel: Hotel) => {
    setCompareList(prev => {
      const exists = prev.some(h => h.id === hotel.id);
      if (exists) return prev.filter(h => h.id !== hotel.id);
      if (prev.length >= 4) {
        // Maybe show an alert or just ignore
        return prev;
      }
      return [...prev, hotel];
    });
  };"""

content = content.replace("""  const handleBookRoom = (hotel: Hotel, room: RoomType) => {
    setBookingData({ hotel, room });
    setIsBookingModalOpen(true);
  };""", toggle_func)

# Pass onCompare to HotelCard in App.tsx
old_hotel_card = """                          <HotelCard
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
                          />"""

new_hotel_card = """                          <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onClick={() => setSelectedHotel(hotel)}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(hotel.id)}
                            isCompareSelected={compareList.some(h => h.id === hotel.id)}
                            onCompare={toggleCompare}
                            onBook={(room) => {
                              setSelectedHotel(hotel);
                              setTimeout(() => {
                                handleBookRoom(hotel, room);
                              }, 100);
                            }}
                          />"""

content = content.replace(old_hotel_card, new_hotel_card)

# Need to render floating compare button and CompareModal
old_end = """        </main>
      </div>

      <Footer />"""

new_end = """        </main>
      </div>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsCompareModalOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-colors border-2 border-slate-950"
          >
            <Scale className="w-5 h-5" />
            <span>قارن بين {compareList.length} فنادق</span>
          </motion.button>
        )}
      </AnimatePresence>

      <CompareModal
        hotels={compareList}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={(id) => setCompareList(prev => prev.filter(h => h.id !== id))}
        onBook={(hotel) => {
          setIsCompareModalOpen(false);
          setSelectedHotel(hotel);
        }}
      />

      <Footer />"""

content = content.replace(old_end, new_end)

with open("src/App.tsx", "w") as f:
    f.write(content)
