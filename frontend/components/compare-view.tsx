export function CompareView({ left, right }: { left: string; right: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <img src={left} alt="before" style={{ width: '100%', borderRadius: 16 }} />
      <img src={right} alt="after" style={{ width: '100%', borderRadius: 16 }} />
    </div>
  );
}