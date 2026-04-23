from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance


def paste_with_bounds(canvas: Image.Image, layer: Image.Image, x: int, y: int) -> None:
    canvas_w, canvas_h = canvas.size
    layer_w, layer_h = layer.size

    left = max(0, x)
    top = max(0, y)
    right = min(canvas_w, x + layer_w)
    bottom = min(canvas_h, y + layer_h)

    if right <= left or bottom <= top:
        return

    crop_left = left - x
    crop_top = top - y
    crop_right = crop_left + (right - left)
    crop_bottom = crop_top + (bottom - top)

    cropped = layer.crop((crop_left, crop_top, crop_right, crop_bottom))
    canvas.alpha_composite(cropped, (left, top))


def make_shadow(product: Image.Image) -> Image.Image:
    shadow = product.copy().convert('RGBA')
    alpha = shadow.getchannel('A')
    shadow.putalpha(alpha.point(lambda p: min(55, int(p * 0.28))))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    shadow = ImageEnhance.Brightness(shadow).enhance(0.25)
    shadow = shadow.resize(
        (max(1, int(shadow.width * 1.1)), max(1, int(shadow.height * 0.18)))
    )
    return shadow


def compose_scene(
    segmented_product_path: Path,
    room_path: Path,
    output_path: Path,
    x: float,
    y: float,
    display_width: float,
    stage_width: float,
    stage_height: float,
    ground_adjust: float = 0.0,
) -> None:
    if not segmented_product_path.exists():
        raise FileNotFoundError(f'segmented product not found: {segmented_product_path}')

    if not room_path.exists():
        raise FileNotFoundError(f'room image not found: {room_path}')

    room = Image.open(room_path).convert('RGBA')
    product = Image.open(segmented_product_path).convert('RGBA')

    if product.width <= 0 or product.height <= 0:
        raise ValueError('product image is empty')

    room_w, room_h = room.size

    if stage_width <= 0 or stage_height <= 0:
        raise ValueError('invalid stage size')

    scale_ratio = room_w / stage_width

    anchor_x = int(x * scale_ratio)
    anchor_y = int(y * scale_ratio)

    final_w = max(1, int(display_width * scale_ratio * 0.96))
    final_h = max(1, int(product.height * (final_w / product.width)))
    product = product.resize((final_w, final_h))

    ground_adjust_px = int(ground_adjust * scale_ratio)

    # 用图片底边作为统一基准，先保稳定
    product_left = anchor_x - product.width // 2
    product_top = anchor_y - product.height - ground_adjust_px

    shadow = make_shadow(product)
    shadow_x = anchor_x - shadow.width // 2
    shadow_y = anchor_y - int(shadow.height * 0.2)

    canvas = room.copy()

    paste_with_bounds(canvas, shadow, shadow_x, shadow_y)
    paste_with_bounds(canvas, product, product_left, product_top)

    canvas.convert('RGB').save(output_path, quality=95)