import re

with open("src/components/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Replace Status Column
old_status = """                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          نشط ومتاح
                        </span>
                      </td>"""

new_status = """                      <td className="p-4">
                        {h.status === 'draft' ? (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> مسودة (للمراجعة)
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> منشور ونشط
                          </span>
                        )}
                      </td>"""

content = content.replace(old_status, new_status)

# Add Publish Action
old_actions = """                        <div className="flex items-center justify-end gap-2">
                          {/* Calendar button */}"""

new_actions = """                        <div className="flex items-center justify-end gap-2">
                          {h.status === 'draft' && (
                            <button
                              onClick={() => {
                                const hCopy = { ...h, status: 'published' as const };
                                if (onUpdateHotel) onUpdateHotel(hCopy);
                              }}
                              title="اعتماد ونشر الفندق"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">نشر الفندق</span>
                            </button>
                          )}
                          {/* Calendar button */}"""

content = content.replace(old_actions, new_actions)

with open("src/components/AdminDashboard.tsx", "w") as f:
    f.write(content)
