"use client"

import { Inter } from "next/font/google";
import "./globals.css";

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <Provider store={store}>
        {children}
      </Provider>
    </body>
  </html>
  );
}
