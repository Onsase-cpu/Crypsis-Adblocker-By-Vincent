#!/usr/bin/env python3
"""Create a compact extension icon from Crypsis's generated source mark."""

from pathlib import Path
from PIL import Image

SOURCE = Path("/home/ubuntu/webdev-static-assets/crypsis-shield-mark.png")
TARGET = Path("/home/ubuntu/webdev-static-assets/crypsis-extension-icon.png")

with Image.open(SOURCE) as image:
    image = image.convert("RGBA")
    image.thumbnail((256, 256), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    offset = ((256 - image.width) // 2, (256 - image.height) // 2)
    canvas.alpha_composite(image, offset)
    canvas.save(TARGET, format="PNG", optimize=True)

print(f"Optimized extension icon: {TARGET}")
