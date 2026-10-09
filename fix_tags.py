with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("""                </div>
              )}
            </section>

            {/* Value Proposition Badges */}""", """                </div>
              )}
                </div>
              </div>
            </section>

            {/* Value Proposition Badges */}""")

with open("src/App.tsx", "w") as f:
    f.write(content)
