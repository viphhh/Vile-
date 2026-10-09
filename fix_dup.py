import re

with open("src/components/HotelCard.tsx", "r") as f:
    content = f.read()

content = content.replace('loading="lazy"\n          loading="lazy"', 'loading="lazy"')
content = content.replace('loading="lazy"          loading="lazy"', 'loading="lazy"')
# regex to fix multiple loading attrs
content = re.sub(r'loading="lazy"\s*loading="lazy"', 'loading="lazy"', content)

with open("src/components/HotelCard.tsx", "w") as f:
    f.write(content)
