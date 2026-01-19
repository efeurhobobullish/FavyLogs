import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, UserRound } from "lucide-react";
import Mobilebar from "./mobilebar";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";

const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop", isPage: true },
  { name: "About", path: "/about", sectionId: "about" },
  { name: "Contact", path: "/contact", sectionId: "contact" },
  { name: "Orders", path: "/orders", isPage: true, requiresAuth: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartTotalQuantity } = useCart();
  const { user } = useAuth();

  const cartQuantity = getCartTotalQuantity();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navigationLinks[0]) => {
    // If it's a page link (like Shop), use normal navigation
    if (link.isPage) {
      return; // Let NavLink handle it
    }

    // For About and Contact sections
    if (link.sectionId) {
      e.preventDefault();
      
      if (location.pathname === "/") {
        // On home page, scroll to section
        const element = document.getElementById(link.sectionId);
        if (element) {
          const headerHeight = 70; // Header height
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else {
        // On other pages, navigate to home and then scroll
        navigate("/");
        // Wait for navigation and DOM update
        setTimeout(() => {
          const scrollToSection = () => {
            const element = document.getElementById(link.sectionId!);
            if (element) {
              const headerHeight = 70;
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - headerHeight;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            } else {
              // Retry if element not found yet
              setTimeout(scrollToSection, 50);
            }
          };
          scrollToSection();
        }, 100);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#000000] text-white backdrop-blur">
        <nav className="main h-[70px] flex items-center justify-between">
          
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <img
                src="/logo.jpeg"
                alt="Driphigh Logo"
                className="w-16 object-contain"
              />
            </Link>

            <div className="flex items-center gap-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 border-r-2 border-white/70 pr-8">
                  {navigationLinks.map((link) => {
                    // Only show Orders link if user is logged in
                    if (link.requiresAuth && !user) {
                      return null;
                    }
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={(e) => handleNavigation(e, link)}
                        className={({ isActive }) =>
                          isActive ? "text-white text-sm font-space uppercase font-semibold hover:text-yellow-400" : "text-white/50 text-sm font-space uppercase font-medium hover:text-yellow-400"
                        }
                      >
                        {link.name}
                      </NavLink>
                    );
                  })}
                </div>
                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    className="relative h-10 w-10 center transition-colors bg-[#212121] hover:bg-[#313131] rounded-full duration-200"
                    aria-label="Shopping cart"
                  >
                    <ShoppingBag size={20} />
                    {cartQuantity > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 text-black text-xs font-space font-semibold center">
                        {cartQuantity}
                      </span>
                    )}
                  </Link>
                  {/* User Icon */}
                 {!user && ( <Link
                    to="/auth"
                    className="center h-10 w-10 bg-[#212121] hover:bg-[#313131] rounded-full transition-colors duration-200"
                    aria-label="Account"
                  >
                    <UserRound size={20} />
                  </Link>)}

                  {user && (
                    <Link
                      to="/profile"
                      className="flex h-10 w-10 center bg-yellow-500 text-black font-space font-semibold text-sm uppercase rounded-full transition-colors duration-200"
                      aria-label="Profile"
                    >
                      {getUserInitials()}
                    </Link>
                  )}
                  {/* Mobile Menu Toggle */}
                  <div className="md:hidden">
                    <button
                      onClick={toggleMobileMenu}
                      className=" p-2 transition-colors duration-200"
                      aria-label="Toggle menu"
                      aria-expanded={isMobileMenuOpen}
                    >
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </div>
            </div>
          
        </nav>
      </header>

      {/* Mobile Menu */}
      <Mobilebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
