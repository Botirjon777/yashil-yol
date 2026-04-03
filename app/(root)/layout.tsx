import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import MobileNavbar from "@/src/components/layout/MobileNavbar";
import MobileFooter from "@/src/components/layout/MobileFooter";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MobileNavbar />
      <main className="grow pt-16 md:pt-0">{children}</main>
      <Footer />
      <MobileFooter />
    </>
  );
}
