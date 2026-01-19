import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const heroImages = [
  "/gallery/ga-1.jpeg",                                                                            
  "/gallery/ga-2.jpeg",
  "/gallery/ga-3.jpeg",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-70px)] py-20 w-full overflow-hidden">
      {/* Background Images with Fade Transition */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in relative">
          {/* Badge/Tag */}
          <div data-aos="fade-up" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-white/90">
              New Collection {new Date().getFullYear()}
            </span>
          </div>

          {/* Main Heading */}
          <h1 data-aos="fade-up" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase font-space leading-tight tracking-tight">
            <span className="block">Wear Your</span>
            <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              Identity
            </span>
          </h1>

          {/* Subheading */}
          <p data-aos="fade-up" className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Street-inspired fits designed for those who move different.
            <br className="hidden sm:block" /> {" "}
            <span className="text-white/90">Elevate your style, define your story.</span>
          </p>

          {/* CTA Buttons */}
          <div data-aos="zoom-in" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="group relative w-[200px] btn py-4 bg-white text-black font-space font-semibold uppercase tracking-wider text-sm hover:bg-white/90 transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Shop Now</span>
              <ArrowRight 
                size={18} 
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white to-white/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            
            <a
              href="#about"
              className="w-[200px] btn py-4 border-2 border-white/30 text-white font-space font-semibold uppercase tracking-wider text-sm hover:border-white/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Discover More
            </a>
          </div>
        </div>
      </div>

     
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl hidden lg:block" />
    </section>
  );
}
