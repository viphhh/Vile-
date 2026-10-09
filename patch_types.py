import re
with open("src/types.ts", "r") as f:
    content = f.read()
content = content.replace("  triggeredPrice?: number;\n}", "  triggeredPrice?: number;\n  receiveBookingAlerts?: boolean;\n}")
with open("src/types.ts", "w") as f:
    f.write(content)
