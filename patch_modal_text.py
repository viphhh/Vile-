import re

with open("src/components/PriceAlertModal.tsx", "r") as f:
    content = f.read()

# Title
content = content.replace("تنبيه انخفاض السعر 🔔", "تنبيه انخفاض السعر وحالة الحجز 🔔")

# Button
content = content.replace("تفعيل مراقبة وتنبيه السعر", "تفعيل التنبيهات (السعر / حالة الحجز)")

with open("src/components/PriceAlertModal.tsx", "w") as f:
    f.write(content)
