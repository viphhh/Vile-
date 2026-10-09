import re

with open("server.ts", "r") as f:
    content = f.read()

old_json = "JSON.stringify(hotels.map((h: any) => ({id: h.id, name: h.name, desc: h.description, amenities: h.amenities})))"
new_json = "JSON.stringify(hotels.map((h: any) => ({id: h.id, name: h.name, desc: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText})))"

content = content.replace(old_json, new_json)

# Update system prompt slightly
old_sys = "يجب عليك تحليل بيانات الفنادق المقدمة لك (الاسم، الوصف، الميزات) وتصنيف كل فندق إلى فئة واحدة فقط من الفئات التالية:"
new_sys = "يجب عليك تحليل بيانات الفنادق المقدمة لك (الاسم، الوصف، الميزات، وتقييمات العملاء reviewScore/reviewText) وتصنيف كل فندق إلى فئة واحدة فقط من الفئات التالية بناءً على تجارب الضيوف والمميزات:"

content = content.replace(old_sys, new_sys)

with open("server.ts", "w") as f:
    f.write(content)
