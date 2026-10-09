import re

with open("src/components/MyBookingsView.tsx", "r") as f:
    content = f.read()

content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';")

with open("src/components/MyBookingsView.tsx", "w") as f:
    f.write(content)
