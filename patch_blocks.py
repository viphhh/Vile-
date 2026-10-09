import re

with open("src/components/AdminExternalSync.tsx", "r") as f:
    content = f.read()

new_blocks = """
            {/* Almatar API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                  المطار (Almatar)
                </h3>
                {apiConfigs.almatar?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input type="url" value={apiConfigs.almatar?.url} onChange={(e) => handleUpdateApiConfig('almatar', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Enter API Key" value={apiConfigs.almatar?.key} onChange={(e) => handleUpdateApiConfig('almatar', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
                <button onClick={() => handleApiSync('almatar')} disabled={syncingApi === 'almatar' || !apiConfigs.almatar?.key} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'almatar' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.almatar?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'}`}>
                  {syncingApi === 'almatar' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'almatar' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
                </button>
              </div>
            </div>

            {/* Mabeet API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">B</div>
                  مبيت (Mabeet)
                </h3>
                {apiConfigs.mabeet?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input type="url" value={apiConfigs.mabeet?.url} onChange={(e) => handleUpdateApiConfig('mabeet', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Enter API Key" value={apiConfigs.mabeet?.key} onChange={(e) => handleUpdateApiConfig('mabeet', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>
                <button onClick={() => handleApiSync('mabeet')} disabled={syncingApi === 'mabeet' || !apiConfigs.mabeet?.key} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'mabeet' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.mabeet?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20'}`}>
                  {syncingApi === 'mabeet' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'mabeet' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
                </button>
              </div>
            </div>

            {/* Gathern API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs">G</div>
                  جاذر ان (Gathern)
                </h3>
                {apiConfigs.gathern?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Gathern API Endpoint</label>
                  <input type="url" value={apiConfigs.gathern?.url} onChange={(e) => handleUpdateApiConfig('gathern', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key / Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Gathern API Key" value={apiConfigs.gathern?.key} onChange={(e) => handleUpdateApiConfig('gathern', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-teal-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <button onClick={() => handleApiSync('gathern')} disabled={syncingApi === 'gathern' || !apiConfigs.gathern?.key} className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'gathern' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.gathern?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-teal-600/10 text-teal-400 border border-teal-500/20 hover:bg-teal-600/20'}`}>
                {syncingApi === 'gathern' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {syncingApi === 'gathern' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
              </button>
            </div>
"""

# Append before the final </div></div>)}</div>);};
content = content.replace("          </div>\n        </div>\n      )}\n\n    </div>\n  );\n};\n", new_blocks + "\n          </div>\n        </div>\n      )}\n\n    </div>\n  );\n};\n")

with open("src/components/AdminExternalSync.tsx", "w") as f:
    f.write(content)
