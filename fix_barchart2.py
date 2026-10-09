with open("src/components/AdminDashboard.tsx", "r") as f:
    content = f.read()

# fix recharts import
content = content.replace("  BarChart as BarChartIcon,", "  BarChart,")

# fix lucide-react import
content = content.replace("Users\n} from 'lucide-react';", "Users,\n  BarChart as BarChartIcon\n} from 'lucide-react';")

with open("src/components/AdminDashboard.tsx", "w") as f:
    f.write(content)
