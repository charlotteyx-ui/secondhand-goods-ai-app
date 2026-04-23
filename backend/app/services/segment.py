from pathlib import Path
from io import BytesIO
from PIL import Image
from rembg import remove


def segment_product(product_path: Path, output_path: Path) -> None:
    """
    V1.5 抠图：
    - 先尝试用 rembg
    - 如果失败，回退为原图 RGBA
    - 自动裁掉透明边
    """
    try:
        input_bytes = product_path.read_bytes()
        output_bytes = remove(input_bytes)

        image = Image.open(BytesIO(output_bytes)).convert('RGBA')

        bbox = image.getbbox()
        if bbox:
            image = image.crop(bbox)

        # 如果抠图后尺寸异常，认为失败，回退原图
        if image.width < 20 or image.height < 20:
            raise ValueError('segmentation result too small')

        image.save(output_path)

    except Exception as e:
        # 兜底：至少保证后续合成不会因为没有文件而失败
        fallback = Image.open(product_path).convert('RGBA')
        fallback.save(output_path)
        print(f'[segment_product] fallback used: {e}')