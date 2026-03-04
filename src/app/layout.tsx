
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwiftMatch - Find Your Perfect Match',
  description: 'A modern, AI-powered dating experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <div className="mx-auto max-w-[480px] min-h-svh bg-white relative flex flex-col overflow-x-hidden shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
