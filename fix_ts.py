import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# fix duplicate Scale
content = content.replace("Scale, Scale", "Scale")

with open("src/App.tsx", "w") as f:
    f.write(content)

with open("src/components/AdminDashboard.tsx", "r") as f:
    content = f.read()

if "BarChartIcon" not in content[:1000]:
    content = content.replace("BarChart2,", "BarChart2, BarChart as BarChartIcon,")
    content = content.replace("BarChart,", "BarChart as BarChartIcon,")

with open("src/components/AdminDashboard.tsx", "w") as f:
    f.write(content)
