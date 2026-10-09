import re

with open("src/components/Navbar.tsx", "r") as f:
    content = f.read()

# Add motion import
if "import { motion } from 'motion/react';" not in content and "motion/react" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion } from 'motion/react';")
elif "motion/react" not in content:
    content = content.replace("import React,", "import { motion } from 'motion/react';\nimport React,")

old_logo = """          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-300/30">
              <Building2 className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">فنادق المملكة</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  السعودية 🇸🇦
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">حجوزات الفنادق والمنتجعات الفاخرة</p>
            </div>
          </div>"""

new_logo = """          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-300/30 relative overflow-hidden"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 bg-white/30"
                style={{ transformOrigin: "0 0", skewX: -20 }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 2 }}
              />
              <Building2 className="w-6 h-6 text-slate-950 font-bold relative z-10" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["100% center", "-100% center"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  فنادق المملكة
                </motion.span>
                <motion.span 
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  السعودية 🇸🇦
                </motion.span>
              </div>
              <p className="text-xs text-slate-400 font-medium group-hover:text-amber-400 transition-colors">حجوزات الفنادق والمنتجعات الفاخرة</p>
            </div>
          </motion.div>"""

content = content.replace(old_logo, new_logo)

with open("src/components/Navbar.tsx", "w") as f:
    f.write(content)
