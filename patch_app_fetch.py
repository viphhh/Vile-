import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_body = "body: JSON.stringify({ hotels: uncategorized })"
new_body = "body: JSON.stringify({ hotels: uncategorized.map(h => ({ id: h.id, name: h.name, description: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText })) })"

content = content.replace(old_body, new_body)

with open("src/App.tsx", "w") as f:
    f.write(content)
