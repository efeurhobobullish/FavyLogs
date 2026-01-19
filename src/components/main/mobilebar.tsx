import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { X, ShoppingBag, User, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

interface MobilebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop", isPage: true },
  { name: "About", path: "/about", sectionId: "about" },
  { name: "Contact", path: "/contact", sectionId: "contact" },
  { name: "Orders", path: "/orders", isPage: true, requiresAuth: true },
];

export default function Mobilebar({ isOpen, onClose }: MobilebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCartTotalQuantity } = useCart();
  
  const cartQuantity = getCartTotalQuantity();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navigationLinks[0]) => {
    // If it's a page link (like Shop), use normal navigation
    if (link.isPage) {
      onClose();
      return; // Let NavLink handle it
    }

    // For About and Contact sections
    if (link.sectionId) {
      e.preventDefault();
      onClose();
      
      if (location.pathname === "/") {
        // On home page, scroll to section
        setTimeout(() => {
          const element = document.getElementById(link.sectionId!);
          if (element) {
            const headerHeight = 70; // Header height
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 300); // Wait for menu to close
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
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-100 md:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-150 md:hidden shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between bg-white h-[70px] px-4 border-b border-line">
               <div className="invisible">
                
               </div>
                <button
                  onClick={onClose}
                  className="p-2 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <ul className="">
                  {navigationLinks.map((link) => {
                    // Only show Orders link if user is logged in
                    if (link.requiresAuth && !user) {
                      return null;
                    }
                    return (
                      <li key={link.path}>
                        <NavLink
                          to={link.path}
                          onClick={(e) => handleLinkClick(e, link)}
                          className={({ isActive }) =>
                            isActive ? "text-main font-space uppercase font-semibold block hover:bg-secondary py-4 px-4" : "text-muted font-space uppercase font-medium block hover:text-yellow-500 hover:bg-secondary py-4 px-4"
                          }
                        >
                          {link.name}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer Actions */}
              <div className="border-t border-line p-6 space-y-4">
                <Link
                  to="/cart"
                  className="w-full flex items-center justify-center gap-3 p-3 transition-colors duration-200 border border-line rounded-lg hover:border-line"
                  onClick={onClose}
                >
                  <ShoppingBag size={20} />
                  <span className="font-medium">Cart ({cartQuantity})</span>
                </Link>

                {!user && (<Link
                  to="/auth"
                  className="w-full flex items-center justify-center gap-3 p-3 transition-colors duration-200 border border-line rounded-lg hover:border-line"
                  onClick={onClose}
                >
                  <User size={20} />
                  <span className="font-medium">Account</span>
                </Link>)}
                {user &&(
                  <Link
                    to="/profile"
                    className="w-full flex items-center justify-center gap-3 p-3 transition-colors duration-200 border border-line rounded-lg hover:border-line"
                    onClick={onClose}
                  >
                    <UserRound size={20} />
                    <span className="font-medium">Profile</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
