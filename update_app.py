with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("import { HeroSearch } from './components/HeroSearch';", "import { HeroSearch } from './components/HeroSearch';\nimport { SidebarFilters } from './components/SidebarFilters';")

content = content.replace("""            {/* Hotel Results Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Controls & Sorting Header */}""", """            {/* Hotel Results Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4">
                  <SidebarFilters filters={filters} setFilters={setFilters} />
                </div>
                
                {/* Main Content */}
                <div className="w-full lg:w-3/4 space-y-6">
              
              {/* Controls & Sorting Header */}""")

content = content.replace("""                  ))}
                </div>
              )}
            </section>

            {/* Value Proposition Badges */}""", """                  ))}
                </div>
              )}
                </div>
              </div>
            </section>

            {/* Value Proposition Badges */}""")

with open("src/App.tsx", "w") as f:
    f.write(content)
