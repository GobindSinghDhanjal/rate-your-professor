import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import Navbar from "./components/components/Navbar/Navbar";
import Footer from "./components/components/Footer/Footer";
import { LoaderProvider } from "./components/LoaderContext/LoaderContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: {
    default: "RateYourProfessor — Asia's Largest Professor Rating Platform",
    template: "%s | RateYourProfessor",
  },
  description:
    "Discover honest and anonymous professor reviews from students across Asia and worldwide.",
  metadataBase: new URL("https://www.rateyourprofessor.in/"),
  keywords: [
    "rate your professor",
    "professor reviews",
    "student feedback",
    "college ratings",
    "university reviews",
    "RateMyProfessor Asia",
    "RateMyProfessor US",
    "RateMyProfessor Germany",
    "RateMyProfessor India",
    "anonymous professor reviews",
    "student professor ratings",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        <LoaderProvider>
          <div className="container">{children}</div>
        </LoaderProvider>
        <Footer />
        <GoogleAnalytics gaId="G-VB68FXNM9S" />
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8679343813839428"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
