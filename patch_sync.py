import re

with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

# Replace setStagedHotels in handleFetch
old_fetch = """      const count = Math.floor(Math.random() * 3) + 1;
      const fetchedItems = generateMockHotels(platform, count);
      setStagedHotels([...stagedHotels, ...fetchedItems]);
      if (importMode === 'url') setUrls('');"""

new_fetch = """      const count = Math.floor(Math.random() * 3) + 1;
      const fetchedItems = generateMockHotels(platform, count);
      fetchedItems.forEach(h => onAddHotel({ ...h, status: 'draft' }));
      if (importMode === 'url') setUrls('');
      setPublishSuccess(`تم استيراد ${count} فندق كمسودة. يرجى مراجعتها من قسم "إدارة الفنادق".`);
      setTimeout(() => setPublishSuccess(null), 4000);"""
content = content.replace(old_fetch, new_fetch)


# Replace setStagedHotels in handleApiSync
old_api = """      const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 hotels
      const fetchedItems = generateMockHotels(platform, count);
      setStagedHotels([...stagedHotels, ...fetchedItems]);
      setActiveTab('import'); // Switch back to import tab to show drafts
      setPublishSuccess(`تم جلب ${count} منتجات بنجاح من ${platform}! يرجى المراجعة والنشر.`);
      setTimeout(() => setPublishSuccess(null), 4000);"""

new_api = """      const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 hotels
      const fetchedItems = generateMockHotels(platform, count);
      fetchedItems.forEach(h => onAddHotel({ ...h, status: 'draft' }));
      setPublishSuccess(`تم جلب ${count} منتجات بنجاح من ${platform} كمسودات! يرجى المراجعة والتعديل من قسم (إدارة الفنادق).`);
      setTimeout(() => setPublishSuccess(null), 5000);"""
content = content.replace(old_api, new_api)

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)
