import React from "react";
import "../styles/globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Melkam Psychotherapy",
  description: "Mental health care and therapy services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
