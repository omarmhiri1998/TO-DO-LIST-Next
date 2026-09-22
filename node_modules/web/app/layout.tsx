import type {
  Metadata
} from "next";

import {
  Geist,
  Geist_Mono
} from "next/font/google";

import "./globals.css";

import SessionRefresh
  from "../components/SessionRefresh";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin"
    ]
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin"
    ]
  });

export const metadata:
  Metadata = {
    title:
      "My Todo",

    description:
      "Organize your tasks and stay productive"
  };

export default function RootLayout({
  children
}: {
  children:
    React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
      `}
    >

      <body>

        <SessionRefresh />

        {children}

      </body>

    </html>
  );
}