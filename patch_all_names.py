import os

directory = 'src'
old_name = "فنادق المملكة"
new_name = "ڤيلوسيتي (Velocity)"

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_name in content:
                content = content.replace(old_name, new_name)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                    print(f"Updated {file_path}")
