import { useEffect, useRef, useState, useCallback } from "react";

const galleryImages = [
  "/gallery/ga-1.jpeg",
  "/gallery/ga-3.jpeg",
  "/gallery/ga-5.jpeg",
  "/gallery/ga.PNG",
  "/gallery/ga-7.JPEG",
  "/gallery/ga-1.jpeg",
  "/gallery/ga-4.jpeg",
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);

  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  const AUTO_SPEED = 0.4;

  // Duplicate images for infinite scroll
  const images = [...galleryImages, ...galleryImages, ...galleryImages];

  /* ----------------------------------
     Auto Scroll Loop (single loop)
  ----------------------------------- */
  const autoScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isHoveredRef.current && !isInteractingRef.current) {
      el.scrollLeft += AUTO_SPEED;
    }

    rafRef.current = requestAnimationFrame(autoScroll);
  }, []);

  /* ----------------------------------
     Infinite Scroll Logic
  ----------------------------------- */
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const third = el.scrollWidth / 3;

    if (el.scrollLeft < third * 0.5) {
      el.scrollLeft += third;
    } else if (el.scrollLeft > third * 2.5) {
      el.scrollLeft -= third;
    }
  };

  /* ----------------------------------
     Pause / Resume Helpers
  ----------------------------------- */
  const pauseAutoScroll = () => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const resumeAutoScroll = () => {
    resumeTimeoutRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 1200);
  };

  /* ----------------------------------
     Mouse Drag Handling
  ----------------------------------- */
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    pauseAutoScroll();
    hasMovedRef.current = false;

    startXRef.current = e.pageX;
    scrollStartRef.current = el.scrollLeft;

    el.style.cursor = "grabbing";

    const handleMove = (ev: MouseEvent) => {
      hasMovedRef.current = true;
      el.scrollLeft = scrollStartRef.current - (ev.pageX - startXRef.current);
    };

    const handleUp = () => {
      el.style.cursor = "grab";
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      resumeAutoScroll();
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  /* ----------------------------------
     Wheel / Trackpad
  ----------------------------------- */
  const handleWheel = () => {
    pauseAutoScroll();
    resumeAutoScroll();
  };

  /* ----------------------------------
     Init
  ----------------------------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollLeft = el.scrollWidth / 3;
    rafRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [autoScroll]);

  return (
    <section className="py-16 bg-background">
      {/* Header */}
      <div data-aos="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            Our Gallery
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Explore our latest collection and see the quality of our products.
          </p>
        </div>

      {/* Gallery */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          resumeAutoScroll();
        }}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]"
            onClick={() => {
              if (!hasMovedRef.current) {
                setSelectedImage(img);
              }
            }}
          >
            <div className="overflow-hidden rounded-lg bg-secondary">
              <img
                src={img}
                alt="Gallery item"
                draggable={false}
                loading="lazy"
                className="w-full h-[300px] sm:h-[360px] lg:h-[420px] object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hide scrollbar (webkit) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
