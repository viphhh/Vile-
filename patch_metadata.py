import json

with open("metadata.json", "r") as f:
    data = json.load(f)

data["name"] = "ڤيلوسيتي (Velocity)"
data["description"] = "منصة حجز الفنادق والمنتجعات الفاخرة مع مستشار حجز ذكي"

with open("metadata.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

