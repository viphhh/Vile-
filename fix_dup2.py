import os
import glob
import re

files = glob.glob("src/components/*.tsx") + glob.glob("src/*.tsx")

for filename in files:
    with open(filename, "r") as f:
        content = f.read()
    
    # if it has `<img loading="lazy"` and then `loading="lazy"` later in the same tag, we should just use regex to remove one of them.
    # a simpler way: just replace all `loading="lazy"` with nothing, then add it back to `<img `
    content = content.replace('loading="lazy"', '')
    content = content.replace('<img\n', '<img loading="lazy"\n')
    content = content.replace('<img ', '<img loading="lazy" ')
    
    with open(filename, "w") as f:
        f.write(content)
