import re

with open("src/components/HotelCard.tsx", "r") as f:
    content = f.read()

# Add to props
if "onCompare?:" not in content:
    content = content.replace("  isFavorite: boolean;", "  isFavorite: boolean;\n  isCompareSelected?: boolean;\n  onCompare?: (hotel: Hotel) => void;")

# Destructure props
if "isCompareSelected" not in content:
    content = content.replace("  onOpenPriceAlert,", "  onOpenPriceAlert,\n  isCompareSelected,\n  onCompare,")

# Add Scale icon import
if "Scale" not in content:
    content = content.replace("import { Heart, Star, MapPin", "import { Heart, Star, MapPin, Scale")

# Add the compare button next to favorite button
old_buttons = """        {/* Action Overlay Buttons Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}"""

new_buttons = """        {/* Action Overlay Buttons Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Compare Button */}
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare(hotel);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isCompareSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-950/60 text-slate-300 hover:text-amber-400 hover:bg-slate-900/90'
              }`}
              title={isCompareSelected ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}"""

content = content.replace(old_buttons, new_buttons)

with open("src/components/HotelCard.tsx", "w") as f:
    f.write(content)

