import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '학지사 콘텐츠 검색',
  description: '학지사 도서 키워드 검색 (MVP)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
