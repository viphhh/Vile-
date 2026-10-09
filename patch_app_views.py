import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the views with AnimatePresence
old_views = """        {activePageSlug && (
          <PageViewer 
            page={pages.find(p => p.slug === activePageSlug)} 
            onBack={() => setActivePageSlug(null)} 
          />
        )}
        
        {/* VIEW 1: HOME & SEARCH */}
        {!activePageSlug && activeTab === 'home' && (
          <div className="space-y-10">"""

new_views = """        <AnimatePresence mode="wait">
        {activePageSlug ? (
          <motion.div key="page-viewer" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
            <PageViewer 
              page={pages.find(p => p.slug === activePageSlug)} 
              onBack={() => setActivePageSlug(null)} 
            />
          </motion.div>
        ) : activeTab === 'home' ? (
          <motion.div key="home-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="space-y-10">"""
content = content.replace(old_views, new_views)

# Now find the end of view 1 and replace view 2 and view 3 with ternaries or just wrap the activeTab checks inside the AnimatePresence.
# Actually, since it's cleaner, let's just replace the blocks.

# End of VIEW 1 -> Start of VIEW 2
old_v2 = """        {/* VIEW 2: DESTINATIONS */}
        {activeTab === 'cities' && ("""
new_v2 = """        </motion.div>
        ) : activeTab === 'cities' ? (
          <motion.div key="cities-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>"""
content = content.replace(old_v2, new_v2)

# End of VIEW 2 -> Start of VIEW 3
old_v3 = """            }}
          />
        )}

        {/* VIEW 3: DASHBOARD */}
        {activeTab === 'dashboard' && ("""
new_v3 = """            }}
          />
          </motion.div>
        ) : activeTab === 'dashboard' ? (
          <motion.div key="dashboard-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>"""
content = content.replace(old_v3, new_v3)

# End of VIEW 3
old_v3_end = """              onSelectHotel={(h) => setSelectedHotel(h)}
            />
          )
        )}
      </main>"""
new_v3_end = """              onSelectHotel={(h) => setSelectedHotel(h)}
            />
          )
        )}
          </motion.div>
        ) : null}
        </AnimatePresence>
      </main>"""
content = content.replace(old_v3_end, new_v3_end)

# Oh wait, we need to handle the `{!activePageSlug && activeTab === 'home' && (` vs the `activePageSlug` logic.
# The `activePageSlug` logic might have just overridden everything else since we used a single ternary block. Let's review the new structure:
# {activePageSlug ? ( pageViewer ) : activeTab === 'home' ? ( homeView ) : activeTab === 'cities' ? ( citiesView ) : activeTab === 'dashboard' ? ( dashboardView ) : null}

with open("src/App.tsx", "w") as f:
    f.write(content)
