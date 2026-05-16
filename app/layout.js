import "./globals.css";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import DrawerAppBar from "./components/DrawerAppBar/DrawerAppBar";
import Footer from "./components/Footer/Footer";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL("https://www.rateyourprofessor.in/"),
  title: {
    default: "Rate Your Professor",
    template: "%s | Rate Your Professor",
  },
  description:
    "Welcome to RateYourProfessor, the platform where students have the power to share their valuable insights and experiences with professors anonymously, without the need for login or signup.",
  keywords: [
    "rate your professor",
    "professor reviews",
    "student feedback",
    "college ratings",
    "university reviews",
    "RateMyProfessor India",
    "anonymous professor reviews",
    "student professor ratings",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <DrawerAppBar />
        {children}
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
