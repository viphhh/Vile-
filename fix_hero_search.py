with open("src/components/HeroSearch.tsx", "r") as f:
    content = f.read()

# Remove the advanced filter button
content = content.replace("""              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`h-full min-h-[58px] px-4 rounded-2xl border font-bold flex items-center justify-center transition-all ${
                  showAdvancedFilters || filters.starRatings.length > 0 || filters.amenities.length > 0
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="تصفية متقدمة"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>""", "")

# Use regex or simple split to remove the Drawer
drawer_start = "          {/* Expanded Advanced Filters Drawer */}"

if drawer_start in content:
    idx = content.index(drawer_start)
    content = content[:idx] + "        </div>\n      </div>\n    </div>\n  );\n};\n"

with open("src/components/HeroSearch.tsx", "w") as f:
    f.write(content)
