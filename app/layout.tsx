"use client"

import { Inter } from "next/font/google";
import "./globals.css";

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

// this is DEFAULT nextjs rootlayout which is created using create next app by default

// redux store and toastcontainer is added in the root layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <Provider store={store}>
      <ToastContainer />
        {children}
      </Provider>
    </body>
  </html>
  );
}
