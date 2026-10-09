import re
with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

content = content.replace("platform: 'booking' | 'airbnb' | 'expedia'", "platform: 'booking' | 'airbnb' | 'expedia' | 'almatar' | 'mabeet' | 'gathern'")

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)
