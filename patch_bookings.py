import re

with open("src/components/MyBookingsView.tsx", "r") as f:
    content = f.read()

# Add imports
if "motion/react" not in content:
    content = content.replace("import { CalendarRange", "import { motion, AnimatePresence } from 'motion/react';\nimport { CalendarRange")

# Wrap mapping for bookings
old_bookings_map = """          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${
                  booking.status === 'cancelled'
                    ? 'border-rose-900/50 bg-slate-950/60 opacity-75'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >"""

new_bookings_map = """          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
            {bookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={booking.id}
                className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${
                  booking.status === 'cancelled'
                    ? 'border-rose-900/50 bg-slate-950/60 opacity-75'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >"""
content = content.replace(old_bookings_map, new_bookings_map)

# Close AnimatePresence for bookings
old_bookings_end = """              </div>
            ))}
          </div>"""

new_bookings_end = """              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>"""
content = content.replace(old_bookings_end, new_bookings_end)

# Also do it for inquiries
old_inq_map = """          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4"
              >"""

new_inq_map = """          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
            {inquiries.map((inquiry) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={inquiry.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4"
              >"""
content = content.replace(old_inq_map, new_inq_map)

old_inq_end = """              </div>
            ))}
          </div>"""
content = content.replace(old_inq_end, new_bookings_end) # reusing the closing structure

with open("src/components/MyBookingsView.tsx", "w") as f:
    f.write(content)
