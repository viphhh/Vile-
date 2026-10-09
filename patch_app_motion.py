import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add motion import
if "motion/react" not in content:
    content = content.replace("import { Sparkles", "import { motion, AnimatePresence } from 'motion/react';\nimport { Sparkles")

# Wrap publicHotels mapping with motion
old_grid = """                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicHotels.map((hotel, index) => (
                    <HotelCard
                      key={`${hotel.id}-${index}`}
                      hotel={hotel}
                      isFavorite={favorites.includes(hotel.id)}
                      hasPriceAlert={priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled)}
                      onToggleFavorite={toggleFavorite}
                      onSelectHotel={(h) => setSelectedHotel(h)}
                      onInquire={handleOpenInquiry}
                      onOpenPriceAlert={handleOpenPriceAlert}
                    />
                  ))}
                </div>"""

new_grid = """                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </motion.div>"""

content = content.replace(old_grid, new_grid)

# Also wrap the main Views with AnimatePresence to transition tabs nicely
# Currently activeTab switches views
# VIEW 1: HOME
old_view1 = """        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <>
            {/* Hero Section & Search */}"""

new_view1 = """        <AnimatePresence mode="wait">
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Hero Section & Search */}"""
content = content.replace(old_view1, new_view1)

old_view1_end = """        {/* VIEW 2: CITY EXPLORE */}"""
new_view1_end = """          </motion.div>
        )}

        {/* VIEW 2: CITY EXPLORE */}"""
content = content.replace("          </>\n        )}\n\n        {/* VIEW 2: CITY EXPLORE */}", new_view1_end) # need to be careful here... let's just use string replace carefully

with open("src/App.tsx", "w") as f:
    f.write(content)

