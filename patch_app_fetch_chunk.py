import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_effect = """  // AI Auto-Categorization on mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Find hotels that don't have an aiCategory yet
      const uncategorized = hotels.filter(h => !h.aiCategory);
      if (uncategorized.length === 0) return;

      try {
        const res = await fetch('/api/ai/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotels: uncategorized.map(h => ({ id: h.id, name: h.name, description: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText })) })
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
  }, []); // Run once on mount"""

new_effect = """  // AI Auto-Categorization on mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Find hotels that don't have an aiCategory yet
      const uncategorized = hotels.filter(h => !h.aiCategory);
      if (uncategorized.length === 0) return;

      // Only send up to 5 hotels at a time to avoid timeout
      const batch = uncategorized.slice(0, 5);

      try {
        const res = await fetch('/api/ai/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotels: batch.map(h => ({ id: h.id, name: h.name, description: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText })) })
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        
        if (data.success && data.categories) {
          setHotels(prev => prev.map(h => ({
            ...h,
            aiCategory: data.categories[h.id] || h.aiCategory
          })));
        }
      } catch (error) {
        console.error("AI Categorization failed", error);
        
        // Fallback: assign locally if AI fails
        const localCategories = ['خيار العائلات', 'مثالي للأعمال', 'وجهة شهر العسل'];
        setHotels(prev => prev.map(h => {
            if (h.aiCategory) return h;
            // Simple logic for fallback
            let cat = localCategories[0];
            if (h.amenities.some(a => a.includes('واي فاي') || a.includes('أعمال'))) cat = localCategories[1];
            if (h.starRating >= 5 || h.amenities.some(a => a.includes('مسبح') || a.includes('سبا'))) cat = localCategories[2];
            return { ...h, aiCategory: cat };
        }));
      }
    };
    
    // Only run if there are actual hotels loaded to avoid empty calls
    if (hotels.length > 0) {
      fetchCategories();
    }
  }, [hotels.length]); // Re-run if hotels length changes but only process uncategorized"""

content = content.replace(old_effect, new_effect)

with open("src/App.tsx", "w") as f:
    f.write(content)
