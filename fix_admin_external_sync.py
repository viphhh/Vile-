with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

import re

# We will replace the mockHotel construction logic
new_hotel = """
        const mockHotel: Omit<Hotel, 'id'> = {
          name: `فندق ${city} سويتس (${source === 'booking' ? 'بوكينج' : source === 'airbnb' ? 'اير بي ان بي' : 'اكسبيديا'}) - ${Math.floor(Math.random() * 1000)}`,
          nameEn: `${city} Suites`,
          city: city,
          cityEn: city === 'الرياض' ? 'Riyadh' : city === 'جدة' ? 'Jeddah' : 'Makkah',
          region: 'المنطقة الوسطى',
          address: `شارع العليا، ${city}`,
          starRating: Math.floor(Math.random() * 3) + 3,
          reviewScore: Number((Math.random() * 2 + 7).toFixed(1)), // e.g. 7.0 - 9.0
          reviewCount: Math.floor(Math.random() * 1000) + 50,
          reviewText: 'ممتاز جداً',
          description: `هذا الفندق تم جلبه من ${source}. يقدم إقامة فاخرة مع أفضل وسائل الراحة.`,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          gallery: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          ],
          basePricePerNight: Math.floor(Math.random() * 1000) + 300,
          amenities: ['واي فاي مجاني', 'مسبح داخلي', 'نادي رياضي', 'روم سيرفيس 24 ساعة'],
          distanceToLandmark: '1 كم من المركز',
          landmarkName: 'مركز المدينة',
          roomTypes: [
            {
              id: 'room_1',
              name: 'غرفة ديلوكس مزدوجة',
              description: 'غرفة رائعة بإطلالة',
              pricePerNight: Math.floor(Math.random() * 1000) + 300,
              maxGuests: 2,
              bedType: 'سرير كينج',
              areaSqm: 35,
              perks: ['واي فاي', 'آلة قهوة'],
              image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
          ]
        };"""

content = re.sub(r"const mockHotel: Omit<Hotel, 'id'> = {.*?(?=onAddHotel\(mockHotel\);)", new_hotel + "\n        ", content, flags=re.DOTALL)

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)
