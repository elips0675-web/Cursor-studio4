
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'SwiftMatch - Найти свою идеальную пару',
  description: 'Современный опыт знакомств с искусственным интеллектом.',
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
        <LanguageProvider>
          <FirebaseClientProvider>
            <div className="mx-auto max-w-[480px] min-h-svh bg-white relative flex flex-col overflow-x-hidden shadow-2xl">
              {children}
            </div>
            <Toaster />
          </FirebaseClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
