import re

with open("src/components/HotelDetailModal.tsx", "r") as f:
    content = f.read()

# Fix imports
if "motion/react" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';")

content = content.replace("import { X, Star, MapPin", "import { X, Star, MapPin, ChevronLeft, ChevronRight, ZoomIn")

# State
state_injection = """  const [selectedRoom, setSelectedRoom] = useState<RoomType>(hotel.roomTypes[0]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel.gallery) {
      const currentIndex = hotel.gallery.indexOf(activeImage);
      const nextIndex = (currentIndex + 1) % hotel.gallery.length;
      setActiveImage(hotel.gallery[nextIndex]);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel.gallery) {
      const currentIndex = hotel.gallery.indexOf(activeImage);
      const prevIndex = (currentIndex - 1 + hotel.gallery.length) % hotel.gallery.length;
      setActiveImage(hotel.gallery[prevIndex]);
    }
  };"""

content = content.replace("  const [selectedRoom, setSelectedRoom] = useState<RoomType>(hotel.roomTypes[0]);\n  const [isShareOpen, setIsShareOpen] = useState(false);", state_injection)

# Main Image replace
old_main_image = """          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={activeImage}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span>{hotel.starRating} نجوم فاخرة</span>
              </div>
            </div>"""

new_main_image = """          <div className="space-y-3">
            <div 
              className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 cursor-zoom-in group"
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={activeImage}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-slate-900/90 backdrop-blur-md text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <ZoomIn className="w-5 h-5 text-amber-400" />
                  <span>تكبير الصورة</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-400 z-10 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>{hotel.starRating} نجوم فاخرة</span>
              </div>
            </div>"""

content = content.replace(old_main_image, new_main_image)

# Modal injection
old_end = """    </div>
  );
};"""

modal_code = """      {/* Lightbox / Image Zoom */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 bg-slate-900/50 hover:bg-rose-500/80 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {hotel.gallery && hotel.gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage}
                alt={hotel.name}
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            {hotel.gallery && hotel.gallery.length > 1 && (
              <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-white/10 z-50">
                {hotel.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(img); }}
                    className={`rounded-full transition-all ${
                      activeImage === img ? 'w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-500 hover:bg-slate-300'
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};"""

content = content.replace(old_end, modal_code)

with open("src/components/HotelDetailModal.tsx", "w") as f:
    f.write(content)
