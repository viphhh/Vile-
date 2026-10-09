import re

def add_lazy_to_img(filename):
    with open(filename, "r") as f:
        content = f.read()

    # Find <img ... /> and add loading="lazy" if not present
    # Better to just use regex to replace `<img ` with `<img loading="lazy" `
    # where it doesn't already have it.
    
    # Simple replacement:
    content = content.replace('<img\n', '<img loading="lazy"\n')
    content = content.replace('<img ', '<img loading="lazy" ')
    # fix double lazy
    content = content.replace('loading="lazy" loading="lazy"', 'loading="lazy"')
    
    with open(filename, "w") as f:
        f.write(content)

add_lazy_to_img("src/components/ExploreMap.tsx")
add_lazy_to_img("src/components/HotelDetailModal.tsx")
