
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { Poppins, Quicksand } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700', '800']
});

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
  weight: ['500', '600', '700']
});


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
      <body className={`${quicksand.variable} ${poppins.variable} font-body antialiased selection:bg-primary/20`}>
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
