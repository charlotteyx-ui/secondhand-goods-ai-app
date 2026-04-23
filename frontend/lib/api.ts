import type { ComposeJobResponse, PrepareJobResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function prepareJob(
  productImage: File,
  roomImage: File
): Promise<PrepareJobResponse> {
  const formData = new FormData();
  formData.append('product_image', productImage);
  formData.append('room_image', roomImage);

  const response = await fetch(`${API_BASE}/jobs/prepare`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`预处理失败: ${text}`);
  }

  return response.json();
}

export async function composeJob(payload: {
  job_id: string;
  x: number;
  y: number;
  display_width: number;
  stage_width: number;
  stage_height: number;
  ground_adjust: number;
}): Promise<ComposeJobResponse> {
  const response = await fetch(`${API_BASE}/jobs/compose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`合成失败: ${text}`);
  }

  return response.json();
}