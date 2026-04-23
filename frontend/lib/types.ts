export type PrepareJobResponse = {
  job_id: string;
  room_image_url: string;
  product_image_url: string;
  segmented_product_url: string;
  stage: Record<string, unknown>;
};

export type ComposeJobResponse = {
  job_id: string;
  status: string;
  result_image_url: string;
};