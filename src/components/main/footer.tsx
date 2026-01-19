import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const navigationLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const quickLinks = [
  { name: "Shipping Info", path: "/shipping" },
  { name: "Returns", path: "/returns" },
  { name: "Size Guide", path: "/size-guide" },
  { name: "FAQs", path: "/faqs" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Refund Policy", path: "/refund" },
];

const socialLinks = [
  { icon: Facebook, name: "Facebook", url: "https://facebook.com/driphigh" },
  { icon: Instagram, name: "Instagram", url: "https://instagram.com/driphigh" },
  { icon: Twitter, name: "Twitter", url: "https://twitter.com/driphigh" },
  { icon: Youtube, name: "YouTube", url: "https://youtube.com/@driphigh" },
];

const contactInfo = {
  address: "28B Agip Road, Agip Car Park (in front of Agip Company), Port Harcourt, Rivers State, Nigeria",
  phone: "+234 903 174 0688",
  email: "info@driphigh.com",
  whatsapp: "+2349031740688",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const whatsappLink = `https://wa.me/${contactInfo.whatsapp.replace(/\s/g, "")}`;
  const phoneLink = `tel:${contactInfo.phone.replace(/\s/g, "")}`;
  const emailLink = `mailto:${contactInfo.email}`;

  return (
    <footer className="bg-[#000000] text-white">
      {/* Main Footer Content */}
      <div className="main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.jpeg"
                alt="Driphigh Logo"
                className="w-20 object-contain"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Streetwear that defines your identity. Quality clothing for those who move different.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#212121] hover:bg-[#313131] rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-space font-semibold uppercase text-sm tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-yellow-400 text-sm font-space uppercase transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-space font-semibold uppercase text-sm tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-yellow-400 text-sm font-space uppercase transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-space font-semibold uppercase text-sm tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-white/70 hover:text-yellow-400 text-sm transition-colors duration-300"
                >
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={phoneLink}
                  className="flex items-center gap-2 text-white/70 hover:text-yellow-400 text-sm transition-colors duration-300"
                >
                  <Phone size={16} />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={emailLink}
                  className="flex items-center gap-2 text-white/70 hover:text-yellow-400 text-sm transition-colors duration-300"
                >
                  <Mail size={16} />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-[#25D366] text-sm transition-colors duration-300"
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-white/60 text-xs md:text-sm font-space">
              <p>&copy; {currentYear} Driphigh. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/60 hover:text-yellow-400 text-xs md:text-sm font-space uppercase transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
