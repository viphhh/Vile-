import re

with open("src/components/HotelCard.tsx", "r") as f:
    content = f.read()

# Add Bot icon to imports
if "Bot" not in content:
    content = content.replace("import { Heart, Star, MapPin, Scale", "import { Heart, Star, MapPin, Scale, Bot")

old_tag = """        {/* Top Featured Tag */}
        {hotel.featuredTag && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hotel.featuredTag}</span>
          </div>
        )}"""

new_tag = """        {/* Top Featured Tag */}
        {hotel.featuredTag && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hotel.featuredTag}</span>
          </div>
        )}
        {/* AI Category Tag */}
        {hotel.aiCategory && (
          <div className={`absolute ${hotel.featuredTag ? 'top-12' : 'top-3'} right-3 bg-indigo-600/90 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-indigo-400/50 animate-fade-in`}>
            <Bot className="w-3.5 h-3.5 text-indigo-200" />
            <span>{hotel.aiCategory}</span>
          </div>
        )}"""

content = content.replace(old_tag, new_tag)

with open("src/components/HotelCard.tsx", "w") as f:
    f.write(content)
