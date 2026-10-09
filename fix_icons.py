import re

with open("src/components/HotelCard.tsx", "r") as f:
    content = f.read()

content = content.replace("Share2 } from 'lucide-react';", "Share2, Scale, Bot } from 'lucide-react';")

with open("src/components/HotelCard.tsx", "w") as f:
    f.write(content)
