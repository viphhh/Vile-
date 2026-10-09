import re

with open("src/components/MyBookingsView.tsx", "r") as f:
    content = f.read()

# Add imports
if "motion/react" not in content:
    content = content.replace("import { CalendarRange", "import { motion, AnimatePresence } from 'motion/react';\nimport { CalendarRange")

with open("src/components/MyBookingsView.tsx", "w") as f:
    f.write(content)
