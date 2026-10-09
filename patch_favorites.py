import re

with open("src/components/FavoritesView.tsx", "r") as f:
    content = f.read()

# Add imports
if "motion/react" not in content:
    content = content.replace("import { Heart", "import { motion, AnimatePresence } from 'motion/react';\nimport { Heart")

# Wrap mapping
old_map = """      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteHotels.map((hotel, idx) => {
          const hasPriceAlert = priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled);
          return (
            <HotelCard
              key={`${hotel.id}-${idx}`}
              hotel={hotel}
              isFavorite={true}
              hasPriceAlert={hasPriceAlert}
              onToggleFavorite={onToggleFavorite}
              onSelectHotel={onSelectHotel}
              onOpenPriceAlert={onOpenPriceAlert}
            />
          );
        })}
      </div>"""

new_map = """      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {favoriteHotels.map((hotel) => {
            const hasPriceAlert = priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled);
            return (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HotelCard
                  hotel={hotel}
                  isFavorite={true}
                  hasPriceAlert={hasPriceAlert}
                  onToggleFavorite={onToggleFavorite}
                  onSelectHotel={onSelectHotel}
                  onOpenPriceAlert={onOpenPriceAlert}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>"""
content = content.replace(old_map, new_map)

with open("src/components/FavoritesView.tsx", "w") as f:
    f.write(content)
