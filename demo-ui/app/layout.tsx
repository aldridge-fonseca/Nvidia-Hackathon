import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CrisisVision - NVIDIA Emergency Response System',
  description: 'AI-powered emergency response orchestration system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
