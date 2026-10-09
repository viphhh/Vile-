with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "            </section>" in line and "Value Proposition Badges" in "".join(lines):
        if "Value Proposition Badges" in lines[lines.index(line) + 2]:
            new_lines.append("                </div>\n")
            new_lines.append("              </div>\n")
    new_lines.append(line)

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)
