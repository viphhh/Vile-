import re

with open("server.ts", "r") as f:
    content = f.read()

old_server_mock = """    const generated = Array.from({ length: count }).map((_, i) => ({
      id: generateId(),
      name: `فندق ${platform === 'booking' ? 'جراند' : platform === 'airbnb' ? 'بوتيك' : 'رويال'} ${city} ${i + 1}`,
      nameEn: `${platform === 'booking' ? 'Grand' : platform === 'airbnb' ? 'Boutique' : 'Royal'} Hotel ${i + 1}`,"""

new_server_mock = """    const generated = Array.from({ length: count }).map((_, i) => ({
      id: generateId(),
      name: `${platform === 'gathern' ? 'شاليه' : 'فندق'} ${platform === 'booking' ? 'جراند' : platform === 'airbnb' ? 'بوتيك' : platform === 'almatar' ? 'المطار الفاخر' : platform === 'mabeet' ? 'مبيت' : platform === 'gathern' ? 'أكواخ' : 'رويال'} ${city} ${i + 1}`,
      nameEn: `${platform === 'gathern' ? 'Chalet' : 'Hotel'} ${platform === 'booking' ? 'Grand' : platform === 'airbnb' ? 'Boutique' : 'Royal'} ${i + 1}`,"""

content = content.replace(old_server_mock, new_server_mock)

with open("server.ts", "w") as f:
    f.write(content)

