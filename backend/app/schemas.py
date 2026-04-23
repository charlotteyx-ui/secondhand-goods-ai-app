from pydantic import BaseModel


class StagePayload(BaseModel):
    job_id: str
    x: float
    y: float
    display_width: float
    stage_width: float
    stage_height: float
    ground_adjust: float = 0.0


class PrepareJobResponse(BaseModel):
    job_id: str
    room_image_url: str
    product_image_url: str
    segmented_product_url: str
    stage: dict


class ComposeJobResponse(BaseModel):
    job_id: str
    status: str
    result_image_url: str