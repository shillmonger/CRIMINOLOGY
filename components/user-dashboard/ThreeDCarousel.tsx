"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type CarouselItem = {
  id: number;
  src: string;
  title: string;
  description: string;
  tag: string;
};

interface ThreeDCarouselProps {
  items: CarouselItem[];
  className?: string;
  setApi?: (api: CarouselApi) => void;
}

export function ThreeDCarousel({ items, className = "", setApi: setApiProp }: ThreeDCarouselProps) {
  const [api, setInternalApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (api && setApiProp) {
      setApiProp(api);
    }
  }, [api, setApiProp]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={`w-full py-5 flex flex-col items-center ${className}`}>
      <Carousel
        setApi={setInternalApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-6xl relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4 flex items-center">
          {items.map((item, index) => {
            const isActive = current === index;

            return (
              <CarouselItem
                key={item.id}
                className="pl-2 md:pl-4 basis-[80%] md:basis-[55%] lg:basis-[50%] transition-all duration-500 ease-in-out"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  animate={{
                    // Slightly smaller scale on mobile to prevent clipping with arrows
                    scale: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.98 : 1.05) : 0.85,
                    rotateY: isActive ? 0 : index < current ? 10 : -10,
                    opacity: isActive ? 1 : 0.4,
                    zIndex: isActive ? 40 : 10,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  // Reduced border radius: rounded-xl for mobile, rounded-[2rem] for desktop
                  className="relative group cursor-pointer aspect-video rounded-xl md:rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl bg-card"
                >
                  <ImageWithFallback
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                    fallbackSrc="https://i.postimg.cc/dVJYS5ws/fall-back.jpg"
                  />

                  {/* Smaller Tag Badge for Mobile */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 z-20">
                    <div className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                      {item.tag}
                    </div>
                  </div>

                  {/* Info Overlay - Adjusted for Mobile */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                      {/* Smaller title on mobile */}
                      <h3 className="text-white font-black text-lg md:text-3xl tracking-tight mb-0.5 md:mb-2 leading-tight">
                        {item.title}
                      </h3>
                      {/* Description smaller/hidden on small screens if too long */}
                      <p className="text-white/60 text-[10px] md:text-base max-w-md line-clamp-1 md:line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* CONTROLS: Responsive sizes */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1 md:px-4 pointer-events-none z-50">
          <CarouselPrevious 
            className="static pointer-events-auto h-8 w-8 md:h-14 md:w-14 rounded-full border border-border bg-background/40 backdrop-blur-xl text-foreground hover:bg-primary transition-all translate-x-1 md:translate-x-[-70px] cursor-pointer" 
          />
          <CarouselNext 
            className="static pointer-events-auto h-8 w-8 md:h-14 md:w-14 rounded-full border border-border bg-background/40 backdrop-blur-xl text-foreground hover:bg-primary transition-all -translate-x-1 md:translate-x-[70px] cursor-pointer" 
          />
        </div>
      </Carousel>

      {/* Pagination Indicators - Smaller on Mobile */}
      <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${
              current === i ? "w-6 md:w-10 bg-primary" : "w-1.5 md:w-2 bg-muted hover:bg-muted-foreground/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}