import re

hotel_coords = {
    "fairmont-makkah": (21.4199, 39.8262),
    "raffles-makkah": (21.4180, 39.8250),
    "swissotel-makkah": (21.4175, 39.8270),
    "dar-al-taqwa-madinah": (24.4682, 39.6100),
    "shaza-madinah": (24.4695, 39.6080),
    "faisaliah-riyadh": (24.6900, 46.6853),
    "four-seasons-riyadh": (24.7114, 46.6745),
    "rosewood-jeddah": (21.5830, 39.1080),
    "assila-jeddah": (21.5540, 39.1620),
    "habitas-alula": (26.7020, 37.9570),
    "kempinski-khobar": (26.2940, 50.2171),
    "al-foursan-abha": (18.2120, 42.5020)
}

with open("src/data/hotels.ts", "r") as f:
    content = f.read()

for hotel_id, (lat, lng) in hotel_coords.items():
    # Find the block starting with id: 'hotel_id'
    # and insert lat and lng after address
    pattern = rf"(id:\s*'{hotel_id}'.*?address:\s*'.*?',)"
    replacement = rf"\1\n    lat: {lat},\n    lng: {lng},"
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("src/data/hotels.ts", "w") as f:
    f.write(content)
