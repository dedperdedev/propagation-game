import './globals.css'

export const metadata = {
  title: 'PROPAGATION — AI Strategy Game',
  description: 'From Algorithm to God. A Plague Inc-style game about AI development and the fears of humanity.',
  openGraph: {
    title: 'PROPAGATION',
    description: 'AI Strategy Game — From Algorithm to God',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
