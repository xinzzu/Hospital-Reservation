import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediCare - Sistem Antrean Digital',
  description: 'Reservasi dokter online dengan sistem antrean digital. Buat janji dengan dokter spesialis dengan mudah.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}