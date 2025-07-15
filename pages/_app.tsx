// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WSJF Calculator</title>
        <meta name="description" content="Weighted Shortest Job First Calculator for Military Software Development" />
        <link rel="icon" href="/favicon.ico" /> {/* You might want to add a custom favicon */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
