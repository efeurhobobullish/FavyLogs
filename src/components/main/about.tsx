import { Sparkles, Target, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Sparkles,
    title: "Quality Craftsmanship",
    description: "Every piece is meticulously designed and crafted with attention to detail and premium materials.",
  },
  {
    icon: Target,
    title: "Authentic Style",
    description: "Born from the streets, our designs reflect real culture and genuine self-expression.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We're more than a brand—we're a movement that celebrates individuality and unity.",
  },
  {
    icon: Award,
    title: "Sustainable Future",
    description: "Committed to ethical production and sustainable practices for a better tomorrow.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="main">
        {/* Section Header */}
        <div data-aos="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Our Story
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            More Than Clothing
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            We create streetwear that tells your story and defines your identity.
          </p>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          {/* Image Section */}
          <div
            data-aos="fade-up"
            className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-secondary group"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 scale-80"
              style={{
                backgroundImage: "url('/gallery/ga-2.jpeg')",
              }}
            />
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300" />
          </div>

          {/* Content Section */}
          <div data-aos="fade-up" className="space-y-6 md:space-y-8">
            {/* Brand Tagline */}
            <div>
              <h3 className="text-2xl md:text-4xl font-bold text-main uppercase font-space mb-4">
                Wear Your Identity
              </h3>
              <p className="text-base md:text-lg text-main leading-relaxed">
                Driphigh was born from a simple belief: what you wear should reflect who you are. 
                We're not just another streetwear brand—we're a movement dedicated to authentic 
                self-expression and quality craftsmanship.
              </p>
            </div>

            {/* Brand Story */}
            <div>
              <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
                Founded with a vision to bridge the gap between street culture and premium quality, 
                Driphigh creates pieces that speak to those who move different. Every design tells 
                a story, every garment is a statement, and every collection is a celebration of 
                individuality.
              </p>
              <p className="text-sm md:text-base text-muted leading-relaxed">
                From the streets to the runway, we've stayed true to our roots while pushing 
                boundaries and redefining what streetwear means in the modern world.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="pt-4 border-t border-line">
              <h4 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-3">
                Our Mission
              </h4>
              <p className="text-sm md:text-base text-main leading-relaxed">
                To empower individuals to express their unique identity through thoughtfully 
                designed, high-quality streetwear that stands the test of time.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-main text-main font-space font-semibold uppercase tracking-wider text-sm hover:bg-main hover:text-background transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group p-6 md:p-8 bg-secondary hover:bg-secondary/80 transition-all duration-300 border border-line hover:border-main/20"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-main text-background rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="md:w-7 md:h-7" />
                  </div>
                </div>
                <h4 data-aos="fade-up" data-aos-delay={index * 100} className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-3">
                  {value.title}
                </h4>
                <p data-aos="fade-up" data-aos-delay={index * 100} className="text-sm md:text-base text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

