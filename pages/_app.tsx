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
        {/* The favicon.ico reference has been removed from here */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
