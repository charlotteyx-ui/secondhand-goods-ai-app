'use client';

import { useCallback, useState } from 'react';
import { UploadCard } from '../components/upload-card';
import { StageEditor } from '../components/stage-editor';
import { composeJob, prepareJob } from '../lib/api';
import type { ComposeJobResponse, PrepareJobResponse } from '../lib/types';

export default function HomePage() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [prepareData, setPrepareData] = useState<PrepareJobResponse | null>(null);
  const [result, setResult] = useState<ComposeJobResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [placement, setPlacement] = useState({
    anchorX: 320,
    anchorY: 420,
    scale: 0.8,
    groundAdjust: 0,
    displayWidth: 320 * 0.8,
    stageWidth: 0,
    stageHeight: 0
  });

  const handlePrepare = async () => {
    if (!productImage || !roomImage) {
      setError('请先上传商品图和房间图');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await prepareJob(productImage, roomImage);
      setPrepareData(data);

      setPlacement({
        anchorX: 320,
        anchorY: 420,
        scale: 0.8,
        groundAdjust: 0,
        displayWidth: 320 * 0.8,
        stageWidth: 0,
        stageHeight: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '预处理失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCompose = async () => {
    if (!prepareData) return;

    setLoading(true);
    setError(null);

    try {
      const data = await composeJob({
        job_id: prepareData.job_id,
        x: placement.anchorX,
        y: placement.anchorY,
        display_width: placement.displayWidth,
        stage_width: placement.stageWidth,
        stage_height: placement.stageHeight,
        ground_adjust: placement.groundAdjust
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '合成失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePlacementChange = useCallback(
    (value: {
      anchorX: number;
      anchorY: number;
      scale: number;
      groundAdjust: number;
      displayWidth: number;
      stageWidth: number;
      stageHeight: number;
    }) => {
      setPlacement(value);
    },
    []
  );

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>二手家具放进我家 · V1.7</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 16 }}>
          自动接地点 + 手动上下微调，让预览和最终图更一致。
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 20
        }}
      >
        <UploadCard
          title="商品图"
          description="上传沙发、桌子等商品照片"
          onChange={setProductImage}
          file={productImage}
        />
        <UploadCard
          title="房间图"
          description="上传你的客厅或卧室照片"
          onChange={setRoomImage}
          file={roomImage}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={handlePrepare}
          disabled={loading}
          style={{
            border: 'none',
            background: '#111827',
            color: 'white',
            padding: '14px 18px',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 600
          }}
        >
          {loading ? '处理中...' : '第 1 步：预处理图片'}
        </button>

        {prepareData ? (
          <button
            onClick={handleCompose}
            disabled={loading}
            style={{
              border: 'none',
              background: '#2563eb',
              color: 'white',
              padding: '14px 18px',
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600
            }}
          >
            {loading ? '生成中...' : '第 2 步：生成最终结果'}
          </button>
        ) : null}

        {error ? <span style={{ color: '#dc2626' }}>{error}</span> : null}
      </div>

      {prepareData ? (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>抠图预览</div>
          <img
            src={prepareData.segmented_product_url}
            alt="segmented preview"
            style={{
              maxWidth: 280,
              border: '1px solid #ddd',
              background: '#f3f4f6',
              borderRadius: 12
            }}
          />
        </div>
      ) : null}

      {prepareData ? (
        <div style={{ marginBottom: 24 }}>
          <StageEditor
            roomImageUrl={prepareData.room_image_url}
            productImageUrl={prepareData.segmented_product_url}
            initialAnchorX={placement.anchorX}
            initialAnchorY={placement.anchorY}
            initialScale={placement.scale}
            initialGroundAdjust={placement.groundAdjust}
            onChange={handlePlacementChange}
          />
        </div>
      ) : null}

      {result ? (
        <section
          style={{
            marginTop: 28,
            padding: 20,
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
          }}
        >
          <h2 style={{ marginTop: 0 }}>最终结果</h2>
          <p>任务 ID：{result.job_id}</p>
          <img
            src={`${result.result_image_url}?t=${Date.now()}`}
            alt="生成结果"
            style={{ width: '100%', borderRadius: 16, marginTop: 12 }}
          />
        </section>
      ) : null}
    </main>
  );
}