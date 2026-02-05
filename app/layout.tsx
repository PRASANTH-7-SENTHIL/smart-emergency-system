import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppSidebar from '@/components/AppSidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Accident Prevention System',
  description: 'AI-Based Emergency Response System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
                {children}
              </main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
