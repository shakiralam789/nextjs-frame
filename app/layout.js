import { Roboto } from "next/font/google";

import StoreProvider from "@/src/store/Provider";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

import "./globals.css";
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "My App",
  description: "Generated by shakir alam",
};

export const viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 2,
  minimumScale: 1,
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={roboto.className + " bg-body-color"}>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader
              color="#5E35CC"
              height={3}
              speed={500}
              showSpinner={false}
            />
            <ToastContainer style={{ marginTop: "100px" }} autoClose={3000} />
          </NextIntlClientProvider>
        </StoreProvider>
        {children}
      </body>
    </html>
  );
}
