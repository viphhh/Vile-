import re

with open("src/components/Navbar.tsx", "r") as f:
    content = f.read()

# Import Rocket icon
if "Rocket" not in content:
    content = content.replace("import { Building2", "import { Building2, Rocket")

old_logo = """          <motion.div 
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
                  ڤيلوسيتي (Velocity)
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

new_logo = """          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-blue-300/30 relative overflow-hidden"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              {/* Dynamic Jet/Velocity Stream Background */}
              <motion.div 
                className="absolute inset-0 bg-white/20"
                style={{ transformOrigin: "0 0", skewX: -20 }}
                animate={{ x: ["-150%", "250%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <motion.div
                animate={{ y: [0, -2, 0], x: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              >
                <Rocket className="w-6 h-6 text-white font-bold relative z-10" />
              </motion.div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}
                >
                  Velocity
                </motion.span>
                <span className="text-lg font-bold text-white tracking-tight">ڤيلوسيتي</span>
                <motion.span 
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  سريع ومضمون ⚡
                </motion.span>
              </div>
              <p className="text-xs text-slate-400 font-medium group-hover:text-blue-400 transition-colors">بوابة الحجوزات الأسرع في المملكة</p>
            </div>
          </motion.div>"""

content = content.replace(old_logo, new_logo)

with open("src/components/Navbar.tsx", "w") as f:
    f.write(content)

