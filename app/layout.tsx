import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Workspace from "./Workspace";

export const metadata: Metadata = {
  title: "Job",
  description: "Job website",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body><Workspace>{children}</Workspace></body>
    </html>
  );
}
