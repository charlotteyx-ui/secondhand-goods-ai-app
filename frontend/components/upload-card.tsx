'use client';

type Props = {
  title: string;
  description: string;
  onChange: (file: File | null) => void;
  file: File | null;
};

export function UploadCard({ title, description, onChange, file }: Props) {
  return (
    <label
      style={{
        display: 'block',
        background: 'white',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        cursor: 'pointer'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
      <div style={{ color: '#6b7280', marginTop: 8 }}>{description}</div>
      <div
        style={{
          marginTop: 18,
          minHeight: 140,
          border: '1px dashed #cbd5e1',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc'
        }}
      >
        <span>{file ? file.name : '点击上传图片'}</span>
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}