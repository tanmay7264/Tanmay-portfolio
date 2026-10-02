import type { Metadata } from 'next'
import StudentExchange from '@/components/StudentExchange'
import './exchange.css'

export const metadata: Metadata = {
  title: 'Germany, The Exchange & The SIP | Tanmay Narnaware',
  description: 'Tanmay Narnaware’s story of studying, working, researching, and learning in Germany during Summer 2026.',
}

export default function StudentExchangePage() {
  return <StudentExchange />
}
