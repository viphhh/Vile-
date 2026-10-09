import re

with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

# Replace handleApiSync
old_api = """  const handleApiSync = (platform: 'booking' | 'airbnb' | 'expedia') => {
    setSyncingApi(platform);
    setTimeout(() => {
      setSyncingApi(null);
      const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 hotels
      const fetchedItems = generateMockHotels(platform, count);
      fetchedItems.forEach(h => onAddHotel({ ...h, status: 'draft' }));
      setPublishSuccess(`تم جلب ${count} منتجات بنجاح من ${platform} كمسودات! يرجى المراجعة والتعديل من قسم (إدارة الفنادق).`);
      setTimeout(() => setPublishSuccess(null), 5000);
    }, 2500);
  };"""

new_api = """  const handleApiSync = async (platform: 'booking' | 'airbnb' | 'expedia') => {
    setSyncingApi(platform);
    try {
      const count = Math.floor(Math.random() * 5) + 3;
      const res = await fetch(`/api/external/sync?platform=${platform}&city=${city}&count=${count}`);
      const data = await res.json();
      
      if (data.success && data.hotels) {
        data.hotels.forEach((h: Hotel) => onAddHotel(h));
        setPublishSuccess(`تم جلب ${data.hotels.length} فنادق فعلياً من سيرفر الـ API لـ ${platform} كمسودات! يرجى مراجعتها من قسم إدارة الفنادق.`);
      } else {
        throw new Error('فشل جلب البيانات');
      }
    } catch (err) {
      console.error(err);
      setPublishSuccess('عفواً، حدث خطأ أثناء الاتصال بالـ API الخارجي.');
    } finally {
      setSyncingApi(null);
      setTimeout(() => setPublishSuccess(null), 6000);
    }
  };"""

content = content.replace(old_api, new_api)

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)
