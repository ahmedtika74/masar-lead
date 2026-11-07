import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Lead Finder Egypt | CRM",
  description: "CRM مصغّر ومولّد عملاء محليين في مصر بدون موقع إلكتروني.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased`}>
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">{children}</div>
      </body>
    </html>
  );
}
