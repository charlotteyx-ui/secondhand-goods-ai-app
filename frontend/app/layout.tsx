import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Resell Vision V1',
  description: '二手家具放进我家预览'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, Arial, sans-serif',
          background: '#f6f7fb',
          color: '#1f2937'
        }}
      >
        {children}
      </body>
    </html>
  );
}