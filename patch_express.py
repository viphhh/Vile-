import re

with open("server.ts", "r") as f:
    content = f.read()

content = content.replace("app.use(express.json());", "app.use(express.json({ limit: '10mb' }));")

with open("server.ts", "w") as f:
    f.write(content)
