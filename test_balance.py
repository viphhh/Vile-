with open("src/App.tsx", "r") as f:
    text = f.read()

def balance(text):
    stack = []
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if "<div" in line and not "/>" in line.split("<div")[1].split(">")[0]:
            stack.append(("div", i))
        if "</div" in line:
            if stack and stack[-1][0] == "div":
                stack.pop()
            else:
                print(f"Unmatched </div at line {i+1}")
        
        if "<section" in line:
            stack.append(("section", i))
        if "</section" in line:
            if stack and stack[-1][0] == "section":
                stack.pop()
            else:
                print(f"Unmatched </section at line {i+1}, top of stack: {stack[-1] if stack else 'empty'}")

balance(text)
