import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Generative AI Explained',
  description: 'A beginner-friendly glossary and toolkit to learn core GenAI terms with interactive examples and simple explanations.',
  metadataBase: new URL('https://www.generativeaiexplained.com'),
  alternates: {
    canonical: 'https://www.generativeaiexplained.com',
  },
  openGraph: {
    title: 'Generative AI Explained',
    description: 'Simple definitions and interactive tools to learn foundational GenAI concepts.',
    url: 'https://www.generativeaiexplained.com',
    type: 'website',
    images: [
      {
        url: 'https://www.generativeaiexplained.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Generative AI Explained',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generative AI Explained',
    description: 'Simple definitions and interactive tools to learn foundational GenAI concepts.',
    images: ['https://www.generativeaiexplained.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y9KJTMZBX8"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y9KJTMZBX8');
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
