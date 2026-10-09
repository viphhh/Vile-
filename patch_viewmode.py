import re

with open("src/App.tsx", "r") as f:
    content = f.read()

pattern = "  const [activeTab, setActiveTab] = useState<'home' | 'cities' | 'ai' | 'bookings' | 'favorites' | 'dashboard'>('home');"
replacement = pattern + "\n  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');"

content = content.replace(pattern, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)
