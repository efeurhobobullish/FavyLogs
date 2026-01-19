import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center overflow-hidden w-full bg-[#000] h-20 mx-auto">
          <img src="/logo.jpeg" alt="Driphigh Logo" className="w-full h-full object-contain" />
        </Link>
        {children}
      </div>
    </div>
  );
}
