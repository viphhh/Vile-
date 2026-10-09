import re

with open("src/components/MyBookingsView.tsx", "r") as f:
    content = f.read()

if "import { motion" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';")

with open("src/components/MyBookingsView.tsx", "w") as f:
    f.write(content)

with open("src/components/Navbar.tsx", "r") as f:
    nav_content = f.read()

nav_content = nav_content.replace("فنادق المملكة", "ڤيلوسيتي (Velocity)")
nav_content = nav_content.replace("السعودية 🇸🇦", "السعودية 🇸🇦")

with open("src/components/Navbar.tsx", "w") as f:
    f.write(nav_content)

with open("index.html", "r") as f:
    html_content = f.read()
html_content = html_content.replace("فنادق المملكة", "ڤيلوسيتي (Velocity)")
with open("index.html", "w") as f:
    f.write(html_content)

