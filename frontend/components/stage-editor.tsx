'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  roomImageUrl: string;
  productImageUrl: string;
  initialAnchorX: number;
  initialAnchorY: number;
  initialScale: number;
  initialGroundAdjust: number;
  onChange: (value: {
    anchorX: number;
    anchorY: number;
    scale: number;
    groundAdjust: number;
    displayWidth: number;
    stageWidth: number;
    stageHeight: number;
  }) => void;
};

export function StageEditor({
  roomImageUrl,
  productImageUrl,
  initialAnchorX,
  initialAnchorY,
  initialScale,
  initialGroundAdjust,
  onChange
}: Props) {
  const BASE_WIDTH = 320;

  const [anchorX, setAnchorX] = useState(initialAnchorX);
  const [anchorY, setAnchorY] = useState(initialAnchorY);
  const [scale, setScale] = useState(initialScale);
  const [groundAdjust, setGroundAdjust] = useState(initialGroundAdjust);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const stageRef = useRef<HTMLDivElement | null>(null);

  const displayWidth = BASE_WIDTH * scale;
  const displayHeight = BASE_WIDTH * scale;

  const left = anchorX - displayWidth / 2;
  const top = anchorY - displayHeight - groundAdjust;

  useEffect(() => {
    const rect = stageRef.current?.getBoundingClientRect();

    onChange({
      anchorX,
      anchorY,
      scale,
      groundAdjust,
      displayWidth,
      stageWidth: rect?.width || 0,
      stageHeight: rect?.height || 0
    });
  }, [anchorX, anchorY, scale, groundAdjust, displayWidth, onChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    setDragging(true);
    setDragOffset({
      x: pointerX - anchorX,
      y: pointerY - anchorY
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    setAnchorX(pointerX - dragOffset.x);
    setAnchorY(pointerY - dragOffset.y);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: 12
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>摆放编辑器</div>
          <div style={{ color: '#6b7280', marginTop: 4 }}>
            拖动蓝点摆位置，再微调接地点上下偏移
          </div>
        </div>

        <div style={{ minWidth: 260 }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
            缩放
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ width: '100%' }}
          />

          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 12, marginBottom: 6 }}>
            接地点上下微调
          </div>
          <input
            type="range"
            min="-80"
            max="80"
            step="1"
            value={groundAdjust}
            onChange={(e) => setGroundAdjust(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          overflow: 'hidden',
          borderRadius: 18,
          border: '1px solid #e5e7eb',
          lineHeight: 0
        }}
      >
        <img
          src={roomImageUrl}
          alt="room"
          draggable={false}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />

        <div
          onPointerDown={handlePointerDown}
          style={{
            position: 'absolute',
            left,
            top,
            width: displayWidth,
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <img
            src={productImageUrl}
            alt="product"
            draggable={false}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: anchorX - 6,
            top: anchorY - 6,
            width: 12,
            height: 12,
            borderRadius: 999,
            background: '#2563eb',
            border: '2px solid white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            pointerEvents: 'none'
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 12,
          color: '#6b7280',
          fontSize: 13,
          flexWrap: 'wrap'
        }}
      >
        <span>anchorX: {Math.round(anchorX)}</span>
        <span>anchorY: {Math.round(anchorY)}</span>
        <span>groundAdjust: {Math.round(groundAdjust)}</span>
        <span>scale: {scale.toFixed(2)}</span>
      </div>
    </div>
  );
}