export function StatusPill({ status }: { status: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 10px',
        borderRadius: 999,
        background: '#eef2ff',
        color: '#3730a3',
        fontSize: 13,
        fontWeight: 600
      }}
    >
      {status}
    </span>
  );
}