import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ExplainGenAI – Learn Generative AI Terms',
  description: 'Your guide to the most important terms in Generative AI—clear definitions, real examples, and interactive tools.',
  openGraph: {
    title: 'ExplainGenAI – Your Guide to Generative AI',
    description: 'A beginner-friendly glossary of essential Generative AI terms and tools.',
    url: 'https://www.explaingenai.com',
    type: 'website',
    images: [
      {
        url: 'https://www.explaingenai.com/explaingenai-og-image-final.jpg',
        width: 1200,
        height: 630,
        alt: 'ExplainGenAI - Your Guide to Generative AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExplainGenAI – Your Guide to Generative AI',
    description: 'Understand GenAI terms like LLM, RAG, Diffusion, and more.',
    images: ['https://www.explaingenai.com/explaingenai-og-image-final.jpg'],
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
