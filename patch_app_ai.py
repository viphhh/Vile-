import re

with open("src/App.tsx", "r") as f:
    content = f.read()

ai_effect = """  // AI Auto-Categorization on mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Find hotels that don't have an aiCategory yet
      const uncategorized = hotels.filter(h => !h.aiCategory);
      if (uncategorized.length === 0) return;

      try {
        const res = await fetch('/api/ai/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotels: uncategorized })
        });
        const data = await res.json();
        
        if (data.success && data.categories) {
          setHotels(prev => prev.map(h => ({
            ...h,
            aiCategory: data.categories[h.id] || h.aiCategory
          })));
        }
      } catch (error) {
        console.error("AI Categorization failed", error);
      }
    };
    
    // Only run if there are actual hotels loaded to avoid empty calls
    if (hotels.length > 0) {
      fetchCategories();
    }
  }, []); // Run once on mount

  const favoriteHotelsList"""

content = content.replace("  const favoriteHotelsList", ai_effect)

with open("src/App.tsx", "w") as f:
    f.write(content)
