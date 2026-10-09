with open("src/App.tsx", "r") as f:
    lines = f.readlines()

out = []
i = 0
while i < len(lines):
    line = lines[i]
    if "            </section>" in line and "Value Proposition Badges" in lines[i+2]:
        # This is where I need the two closing divs, BUT wait...
        # Let's just output the correct tags here
        pass
    out.append(line)
    i += 1
