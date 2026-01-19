import { Footer, Header } from "@/components/main";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
