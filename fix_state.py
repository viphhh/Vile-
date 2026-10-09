with open("src/components/AdminDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("const [activeMenu, setActiveMenu] = useState<MenuSection>(initialMenu || 'dashboard'\n  | 'external_sync');", "const [activeMenu, setActiveMenu] = useState<MenuSection>(initialMenu || 'dashboard');")

with open("src/components/AdminDashboard.tsx", "w") as f:
    f.write(content)
