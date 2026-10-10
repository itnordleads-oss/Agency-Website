"""Convert the approved production logo (black bg) to a transparent PNG lockup."""

from pathlib import Path

import numpy as np
from PIL import Image

src = Path(
    r"C:\Users\GHAZI COMPUTER\.cursor\projects\c-Users-GHAZI-COMPUTER-adealforge\assets"
    r"\c__Users_GHAZI_COMPUTER_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_"
    r"images_image-ca754f41-e3ab-46c4-b21a-01cdce1bbaeb.png"
)
out_dir = Path(r"C:\Users\GHAZI COMPUTER\adealforge\public\brand")
out_dir.mkdir(parents=True, exist_ok=True)
out_prod = out_dir / "adealforge-logo-production.png"
out_tight = out_dir / "adealforge-logo-transparent.png"

rgb = np.asarray(Image.open(src).convert("RGB"), dtype=np.float32)
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
mx = np.maximum(np.maximum(r, g), b)
mn = np.minimum(np.minimum(r, g), b)
chroma = mx - mn
blue_bias = np.maximum(0.0, b - r)
luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
# Preserve dark metallic-blue folds + white wordmark; remove pure black.
energy = np.maximum.reduce([mx, chroma * 1.75, blue_bias * 2.25, luma * 1.15])

floor, ceil = 3.5, 26.0
alpha = np.clip((energy - floor) / (ceil - floor), 0.0, 1.0)

bg = (mx < 10.0) & (chroma < 5.0) & (blue_bias < 5.0)
alpha = np.where(bg, 0.0, alpha)

safe = np.maximum(alpha, 1e-6)
rgb_out = np.clip(rgb / safe[..., None], 0, 255)
rgba = np.dstack([rgb_out, alpha * 255.0]).astype(np.uint8)

im = Image.fromarray(rgba, mode="RGBA")
alpha_u8 = rgba[..., 3]
ys, xs = np.where(alpha_u8 > 8)
pad = 8
y0, y1 = max(0, int(ys.min()) - pad), min(im.height, int(ys.max()) + pad + 1)
x0, x1 = max(0, int(xs.min()) - pad), min(im.width, int(xs.max()) + pad + 1)
cropped = im.crop((x0, y0, x1, y1))

arr = np.asarray(cropped).copy()
arr[arr[..., 3] < 4, 3] = 0
cropped = Image.fromarray(arr, mode="RGBA")
cropped.save(out_prod, format="PNG", optimize=True, compress_level=6)
cropped.save(out_tight, format="PNG", optimize=True, compress_level=6)
print("production", cropped.size, out_prod)
print("transparent", cropped.size, out_tight)
