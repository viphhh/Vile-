with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.strip() == "</div>" and lines[i+1].strip() == "</div>" and lines[i+2].strip() == "</section>" and "Value Proposition Badges" in "".join(lines[i-15:i]):
        pass # Skip these extra divs? No, I will just write a completely new file replacing the whole block.
