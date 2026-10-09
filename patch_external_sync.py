import re

with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

# 1. Update apiConfigs state to include almatar, mabeet, gathern
old_api_configs = """  const [apiConfigs, setApiConfigs] = useState({
    booking: { url: 'https://api.booking.com/v1', key: '', isConnected: false },
    airbnb: { url: 'https://api.airbnb.com/v2', key: '', isConnected: false },
    expedia: { url: 'https://api.expedia.com/v3', key: '', isConnected: false }
  });"""

new_api_configs = """  const [apiConfigs, setApiConfigs] = useState({
    booking: { url: 'https://api.booking.com/v1', key: '', isConnected: false },
    airbnb: { url: 'https://api.airbnb.com/v2', key: '', isConnected: false },
    expedia: { url: 'https://api.expedia.com/v3', key: '', isConnected: false },
    almatar: { url: 'https://api.almatar.com/v1', key: '', isConnected: false },
    mabeet: { url: 'https://api.mabeet.com/v1', key: '', isConnected: false },
    gathern: { url: 'https://api.gathern.co/v1', key: '', isConnected: false }
  });"""
content = content.replace(old_api_configs, new_api_configs)

# 2. Update generateMockHotels
old_mock = """    const sourceName = platform === 'booking' ? 'بوكينج' : platform === 'airbnb' ? 'اير بي ان بي' : 'اكسبيديا';"""
new_mock = """    const sourceName = platform === 'booking' ? 'بوكينج' 
                     : platform === 'airbnb' ? 'اير بي ان بي' 
                     : platform === 'almatar' ? 'المطار'
                     : platform === 'mabeet' ? 'مبيت'
                     : platform === 'gathern' ? 'جاذر ان'
                     : 'اكسبيديا';"""
content = content.replace(old_mock, new_mock)

# 3. Update handleFetch URL logic
old_fetch_url = """        if (urls.includes('airbnb')) platform = 'airbnb';
        else if (urls.includes('expedia')) platform = 'expedia';
        else platform = 'booking';"""
new_fetch_url = """        if (urls.includes('airbnb')) platform = 'airbnb';
        else if (urls.includes('expedia')) platform = 'expedia';
        else if (urls.includes('almatar') || urls.includes('المطار')) platform = 'almatar';
        else if (urls.includes('mabeet') || urls.includes('مبيت')) platform = 'mabeet';
        else if (urls.includes('gathern') || urls.includes('جاذر ان')) platform = 'gathern';
        else platform = 'booking';"""
content = content.replace(old_fetch_url, new_fetch_url)

# 4. Update handleApiSync signature
old_handle_api = """const handleApiSync = async (platform: 'booking' | 'airbnb' | 'expedia') => {"""
new_handle_api = """const handleApiSync = async (platform: 'booking' | 'airbnb' | 'expedia' | 'almatar' | 'mabeet' | 'gathern') => {"""
content = content.replace(old_handle_api, new_handle_api)

# 5. Update URL Import UI text
old_url_text = """                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    روابط المنتجات / الفنادق (رابط واحد في كل سطر)
                  </label>"""
new_url_text = """                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    الاستيراد عبر الرابط أو بالجملة (روابط الفنادق - رابط واحد في كل سطر)
                  </label>"""
content = content.replace(old_url_text, new_url_text)

old_url_globe = """                  يدعم روابط: Booking.com, Airbnb, Expedia, Agoda"""
new_url_globe = """                  يدعم استيراد الروابط من: بوكينج، اير بي ان بي، اكسبيديا، المطار، مبيت، جاذر ان"""
content = content.replace(old_url_globe, new_url_globe)

# 6. Update Source Dropdown
old_select = """                    <option value="booking">Booking.com</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="expedia">Expedia</option>"""
new_select = """                    <option value="booking">Booking.com (بوكينج)</option>
                    <option value="airbnb">Airbnb (اير بي ان بي)</option>
                    <option value="expedia">Expedia (اكسبيديا)</option>
                    <option value="almatar">Almatar (المطار)</option>
                    <option value="mabeet">Mabeet (مبيت)</option>
                    <option value="gathern">Gathern (جاذر ان)</option>"""
content = content.replace(old_select, new_select)

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)

