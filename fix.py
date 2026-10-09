with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix the duplicate div close from repair.py
content = content.replace("""                </div>
              )}
                </div>
              </div>
                </div>
              </div>
            </section>

            {/* Value Proposition Badges */}""", """                </div>
              )}
                </div>
              </div>
            </section>

            {/* Value Proposition Badges */}""")

with open("src/App.tsx", "w") as f:
    f.write(content)
