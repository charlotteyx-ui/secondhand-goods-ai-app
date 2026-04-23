'use client';

import { useEffect, useState } from 'react';
import { getJob } from '@/lib/api';
import type { JobDetail } from '@/lib/types';

export default function ResultPage({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJob(params.jobId)
      .then(setJob)
      .catch((err) => setError(err instanceof Error ? err.message : '读取失败'));
  }, [params.jobId]);

  if (error) {
    return <main style={{ padding: 32 }}>错误：{error}</main>;
  }

  if (!job) {
    return <main style={{ padding: 32 }}>加载中...</main>;
  }

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
      <h1>结果详情</h1>
      <p>状态：{job.status}</p>
      <img src={job.result_image_url} alt="result" style={{ width: '100%', borderRadius: 16 }} />
    </main>
  );
}