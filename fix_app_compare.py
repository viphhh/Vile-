with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("<Menu, Scale className=", "<Menu className=")
if "Scale" not in content[:1000]: # add to imports
    content = content.replace("Menu", "Menu, Scale", 1)

with open("src/App.tsx", "w") as f:
    f.write(content)
