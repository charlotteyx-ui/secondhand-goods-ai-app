from PIL import Image, ImageFilter, ImageEnhance


def resize_with_ratio(image: Image.Image, target_width: int) -> Image.Image:
    width, height = image.size
    ratio = target_width / width
    return image.resize((max(1, int(width * ratio)), max(1, int(height * ratio))))


def make_shadow(image: Image.Image) -> Image.Image:
    shadow = image.copy().convert('RGBA')
    alpha = shadow.getchannel('A')
    shadow.putalpha(alpha.point(lambda p: min(100, int(p * 0.5))))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    shadow = ImageEnhance.Brightness(shadow).enhance(0.18)
    return shadow


def flatten_shadow(shadow: Image.Image, width_scale: float = 1.12, height_scale: float = 0.22) -> Image.Image:
    w, h = shadow.size
    return shadow.resize((max(1, int(w * width_scale)), max(1, int(h * height_scale))))