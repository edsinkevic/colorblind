import { Header } from "./components/Header";
import "./globals.css";
import styles from "./layout.module.css";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "FastMail",
  description: "Send your parcels fast and easy!",
};

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
