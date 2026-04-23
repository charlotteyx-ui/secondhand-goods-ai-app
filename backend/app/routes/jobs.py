from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, File, HTTPException, UploadFile
from app.config import PUBLIC_BASE_URL, TMP_DIR
from app.schemas import ComposeJobResponse, PrepareJobResponse, StagePayload
from app.services.compositor import compose_scene
from app.services.segment import segment_product
from app.services.storage import save_upload
from PIL import Image

router = APIRouter()
FAKE_DB: dict[str, dict] = {}


@router.post('/jobs/prepare', response_model=PrepareJobResponse)
async def prepare_job(
    product_image: UploadFile = File(...),
    room_image: UploadFile = File(...),
):
    job_id = uuid4().hex
    product_path = save_upload(product_image, f'product_{job_id}')
    room_path = save_upload(room_image, f'room_{job_id}')
    segmented_path = TMP_DIR / f'segmented_{job_id}.png'

    segment_product(product_path, segmented_path)

    if not segmented_path.exists():
        raise HTTPException(status_code=500, detail='segmented image not created')
    
    room = Image.open(room_path)
    room_w, room_h = room.size

    job = {
        'job_id': job_id,
        'product_path': str(product_path),
        'room_path': str(room_path),
        'segmented_path': str(segmented_path),
        'room_image_url': f'{PUBLIC_BASE_URL}/static/{room_path.name}',
        'product_image_url': f'{PUBLIC_BASE_URL}/static/{product_path.name}',
        'segmented_product_url': f'{PUBLIC_BASE_URL}/static/{segmented_path.name}',
        'result_image_url': ''
    }
    FAKE_DB[job_id] = job

    return PrepareJobResponse(
        job_id=job_id,
        room_image_url=job['room_image_url'],
        product_image_url=job['product_image_url'],
        segmented_product_url=job['segmented_product_url'],
        stage={
            'room_width': room_w,
            'room_height': room_h,
            'initial_x': int(room_w * 0.33),
            'initial_y': int(room_h * 0.48),
            'initial_scale': 0.8,
        },
    )


@router.post('/jobs/compose', response_model=ComposeJobResponse)
async def compose_job(payload: StagePayload):
    job = FAKE_DB.get(payload.job_id)
    if not job:
        raise HTTPException(status_code=404, detail='job not found')

    output_path = TMP_DIR / f"result_{payload.job_id}_{uuid4().hex}.jpg"

    try:
      compose_scene(
        segmented_product_path=Path(job['segmented_path']),
        room_path=Path(job['room_path']),
        output_path=output_path,
        x=payload.x,
        y=payload.y,
        display_width=payload.display_width,
        stage_width=payload.stage_width,
        stage_height=payload.stage_height,
        ground_adjust=payload.ground_adjust,
    )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f'compose failed: {type(e).__name__}: {e}')

    job['result_image_url'] = f'{PUBLIC_BASE_URL}/static/{output_path.name}'

    return ComposeJobResponse(
        job_id=payload.job_id,
        status='done',
        result_image_url=job['result_image_url'],
    )