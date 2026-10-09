import os
import glob

files = glob.glob("src/components/*.tsx") + glob.glob("src/*.tsx")

for filename in files:
    with open(filename, "r") as f:
        content = f.read()
    
    if "<img" in content:
        # replace
        content = content.replace('<img\n', '<img loading="lazy"\n')
        content = content.replace('<img ', '<img loading="lazy" ')
        # fix double
        content = content.replace('loading="lazy" loading="lazy"', 'loading="lazy"')
        
        with open(filename, "w") as f:
            f.write(content)

