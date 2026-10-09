with open("src/App.tsx", "r") as f:
    content = f.read()

import re

# Match the block from `                  ))} \n                </div> \n              )}` to `        {/* VIEW 2: DESTINATIONS */}`
# and replace it completely with the correct balanced structure.
start_str = "                  ))}                </div>              )}"
end_str = "        {/* VIEW 2: DESTINATIONS */}"

start_idx = content.find("                  ))}                </div>              )}")
if start_idx == -1:
    start_idx = content.find("                  ))}\n                </div>\n              )}")

# Since whitespace might be tricky, let's just do a regex replace
pattern = re.compile(r"                  \)\)\}.*?\{/\* VIEW 2: DESTINATIONS \*/\}", re.DOTALL)

replacement = """                  ))}
                </div>
              )}
                </div>
              </div>
            </section>

            {/* Value Proposition Badges */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center">
                <div className="space-y-1">
                  <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm">ضمان أفضل سعر</h4>
                  <p className="text-xs text-slate-400">أسعار تنافسية ومباشرة بدون عمولات خفية</p>
                </div>
                <div className="space-y-1">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm">تأكيد حجز فورى</h4>
                  <p className="text-xs text-slate-400">تصلك التذكرة والوصل فوراً برمز الحجز QR</p>
                </div>
                <div className="space-y-1">
                  <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm">مستشار حجز ذكي</h4>
                  <p className="text-xs text-slate-400">توصيات مخصصة بذكاء الاصطناعي لرحلتك</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: DESTINATIONS */}"""

new_content = re.sub(pattern, replacement, content)

with open("src/App.tsx", "w") as f:
    f.write(new_content)
