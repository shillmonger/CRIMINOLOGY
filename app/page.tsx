"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing-page/Header";
import Nav from "@/components/landing-page/Nav";
import Footer from "@/components/landing-page/Footer";
import { Button } from "@/components/ui/button";

import {
  ShieldCheck,
  Play,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Lock,
  Shield,
  CheckCircle,
  FolderOpen,
  PlayCircle,
  BookOpen,
  Search,
  Eye,
  Download,
  BellRing,
} from "lucide-react";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeatureCard } from "@/components/landing-page/FeatureCard";

export default function HomePage() {
  // Handle scroll to section when page loads with a hash
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small timeout to ensure the page has rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    // Initial check
    const timer = setTimeout(() => {
      handleHashChange();
    }, 0);

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-32 md:pt-40 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
          {/* Left Content */}
          <div className="flex flex-col gap-6 items-center text-center sm:items-start sm:text-left">
            <span className="text-primary font-semibold tracking-widest uppercase text-sm">
              Curated Media Library
            </span>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-tight">
              Explore Verified <br /> Digital Content
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed">
              A centralized library of videos, images, and documents — all
              carefully uploaded and managed by our admin team to ensure
              quality, accuracy, and consistency.
            </p>

            <div className="mt-4 flex justify-center sm:justify-start">
              <Button
                asChild
                size="lg"
                className="font-bold py-7 px-6 rounded-xl text-[17px] shadow-lg active:scale-95"
              >
                <Link href="/auth-page/login" className="flex items-center gap-2">
                  Explore Our Library
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content – Library Preview */}
          <div className="relative flex justify-center items-center py-10">
            {/* Glow behind the main card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10" />

            <div className="relative w-full max-w-[600px] hidden md:flex gap-4 items-center justify-center">
              {/* Card 1 - Left side preview (Subtle Tilt) */}
              <div className="w-[180px] h-[220px] rounded-2xl overflow-hidden bg-background/50 backdrop-blur-md border border-white/10 shadow-lg group cursor-pointer -rotate-[5deg] translate-y-4 transition-all duration-500 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105">
                <img
                  src="https://i.postimg.cc/zDnG8GpQ/download-(1).jpg"
                  alt="Image Library"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Card 2 - Center Hero (Straight & Highlighted) */}
              <div className="w-[260px] h-[320px] rounded-3xl overflow-hidden bg-zinc-900 border-2 border-primary/30 shadow-2xl z-20 scale-105 ring-4 ring-primary/5 group cursor-pointer transition-all duration-500 hover:scale-110">
                <img
                  src="https://i.postimg.cc/5NhYpR7M/FILM.jpg"
                  alt="Video Library"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                />
                {/* Overlay label */}
                <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
                  <p className="text-[10px] font-black uppercase text-primary-foreground tracking-tighter">
                    Live
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Card 3 - Right side preview (Subtle Tilt) */}
              <div className="w-[180px] h-[220px] rounded-2xl overflow-hidden bg-background/50 backdrop-blur-md border border-white/10 shadow-lg group cursor-pointer rotate-[5deg] translate-y-4 transition-all duration-500 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105">
                <img
                  src="https://i.postimg.cc/j289tf1Q/download-(5).jpg"
                  alt="PDF Library"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-5 italic tracking-tighter">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Visit Platform",
                desc: "Access our secure, high-speed library from any device to start your criminology research or learning journey.",
                icon: <Search size={24} />,
                linkText: "Get Started",
                href: "/auth-page/signup",
              },
              {
                title: "Browse Content",
                desc: "Explore a curated feed of videos, images, and documents, all neatly categorized by our expert admin team.",
                icon: <Eye size={24} />,
                linkText: "Explore Now",
                href: "/auth-page/login",
              },
              {
                title: "View & Download",
                desc: "Interact with verified resources directly in your browser or download PDFs for offline study and reference.",
                icon: <Download size={24} />,
                linkText: "View Library",
                href: "/auth-page/login",
              },
              {
                title: "Stay Updated",
                desc: "Receive notifications whenever new verified materials are released to stay at the forefront of the field.",
                icon: <BellRing size={24} />,
                linkText: "Join Community",
                href: "#",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col gap-4 cursor-pointer bg-card border-border hover:border-primary/50"
              >
                {/* Icon Box */}
                <div className="mt-1 flex-shrink-0 w-13 h-13 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-[16px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline"
                >
                  {item.linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black uppercase mb-5 italic tracking-tighter">
            What We Offer
          </h2>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Left: Media Container (70% Width on Large Screens) */}
            <div className="relative aspect-video w-full lg:w-[60%] rounded-3xl overflow-hidden bg-card border border-border shadow-2xl group flex-shrink-0 cursor-pointer">
              {/* Placeholder or Featured Video Thumbnail */}
              <img
                src="https://i.postimg.cc/ZR8yyFFy/library.jpg"
                alt="Curated Digital Criminology Library"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  <Play className="ml-1 w-8 h-8 fill-current" />
                </div>
              </div>

              {/* Info Badge */}
              <div className="absolute bottom-6 left-6 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hidden md:block">
                <p className="text-white text-xs font-semibold uppercase tracking-widest">
                  All content is uploaded and managed by our admin team to
                  ensure quality and accuracy.
                </p>
              </div>
            </div>

            {/* Right: Content & Features (30% Width on Large Screens) */}
            <div className="flex flex-col gap-6 w-full lg:w-[40%]">
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  All content is uploaded and managed by our admin team to
                  ensure unmatched quality, accuracy, and educational value.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Verified Videos",
                    desc: "Curated video lectures and evidence.",
                    icon: <Play className="w-5 h-5" />,
                  },
                  {
                    title: "High-Quality Images",
                    desc: "Detailed photographic resources.",
                    icon: <ImageIcon className="w-5 h-5" />,
                  },
                  {
                    title: "PDFs & Documents",
                    desc: "Academic-grade research papers.",
                    icon: <FileText className="w-5 h-5" />,
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-5 group cursor-pointer"
                  >
                    <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-md font-bold leading-tight">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-start">
                <Link href="/auth-page/signup" className="w-full">
                  <Button
                    size="lg"
                    className="w-full lg:w-auto rounded-xl font-bold px-8 py-7 text-lg group cursor-pointer"
                  >
                    Start Browsing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Platform Section */}
      <section
        id="why-this-platform"
        className="max-w-7xl mx-auto px-4 lg:px-0 py-20 w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">
            Why This Platform
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg">
            A clean, admin-curated library of high-quality content — videos,
            images, and PDF documents, designed for seamless learning and
            research without unverified uploads.
          </p>
        </div>

        {/* Desktop / Tablet Grid (3 columns, 2 rows) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
          <FeatureCard
            title="No Clutter or Spam"
            description="Every piece of content is carefully reviewed and uploaded by our admin team, ensuring a distraction-free experience with zero spam."
            icon={<Shield className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="Verified Content Only"
            description="All videos, images, and PDFs are hand-selected and verified for accuracy, relevance, and quality before they appear on the platform."
            icon={<CheckCircle className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="Organized Media Library"
            description="Browse a well-structured collection categorized for easy discovery, so you can quickly find the exact resources you need."
            icon={<FolderOpen className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="Easy Access & Viewing"
            description="Stream videos, view images, and read PDFs directly in your browser with a smooth, intuitive interface optimized for all devices."
            icon={<PlayCircle className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="Secure and Reliable"
            description="Enjoy a safe, stable platform with consistent uptime and protected content you can trust for your studies and research."
            icon={<Lock className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="High-Quality Research"
            description="Access academic-grade documents and high-resolution visual evidence curated specifically for deep criminology studies."
            icon={<BookOpen className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {[
                {
                  title: "No Clutter or Spam",
                  desc: "Every piece of content is carefully reviewed and uploaded by our admin team, ensuring a distraction-free.",
                  icon: <Shield className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Verified Content Only",
                  desc: "All videos, images, and PDFs are hand-selected and verified for accuracy and quality before they appear.",
                  icon: <CheckCircle className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Organized Media Library",
                  desc: "Browse a well-structured collection categorized for easy discovery, so you can quickly find what you need.",
                  icon: <FolderOpen className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Easy Access & Viewing",
                  desc: "Stream videos, view images, and read PDFs directly in your browser with a smooth, intuitive interface.",
                  icon: <PlayCircle className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Secure and Reliable",
                  desc: "Enjoy a safe, stable platform with consistent uptime and protected content you can trust.",
                  icon: <Lock className="w-6 h-6 text-primary" />,
                },
                {
                  title: "High-Quality Research",
                  desc: "Access academic-grade documents and high-resolution visual evidence curated for deep studies.",
                  icon: <BookOpen className="w-6 h-6 text-primary" />,
                },
              ].map((item, i) => (
                <CarouselItem key={i}>
                  <FeatureCard
                    title={item.title}
                    description={item.desc}
                    icon={item.icon}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls BELOW cards */}
            <div className="mt-5 flex items-center justify-center gap-6">
              <CarouselPrevious className="static w-10 h-10 font-lg p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition translate-y-0" />
              <CarouselNext className="static w-10 h-10 p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Explore Library Section */}
      <section
        id="explore-library"
        className="max-w-7xl mx-auto px-4 py-20 w-full bg-background"
      >
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-3 block">
            Curated Resources • Expertly Managed
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground mb-3 leading-tight">
            Explore Our Digital Library
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            A comprehensive collection of verified criminology resources. Access
            high-quality video lectures, photographic evidence, and academic
            research papers.
          </p>
        </div>

        {/* Content Cards - 6 Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              type: "video",
              title: "Introduction to Forensic Psychology",
              desc: "A foundational lecture on the intersection of psychology and the justice system.",
              views: "1.4K",
              img: "https://i.postimg.cc/1z5v5Xpd/Screenshot-2026-01-07-125107.jpg",
            },
            {
              type: "pdf",
              title: "2024 Crime Statistics Report.pdf",
              desc: "Comprehensive annual breakdown of global crime trends and data analysis.",
              views: "2.1K",
              img: "https://i.postimg.cc/Z5DdpqkK/Screenshot-2026-01-07-125316.jpg",
            },
            {
              type: "image",
              title: "Crime Scene Reconstruction - Case #402",
              desc: "High-resolution visual mapping of evidence at a simulated investigation site.",
              views: "4.1K",
              img: "https://i.postimg.cc/Qxf9ZMd7/Screenshot-2026-01-07-125412.jpg",
            },
            {
              type: "video",
              title: "Case Study: Evolution of M Policing",
              desc: "An in-depth look at how technology has reshaped law enforcement agencies.",
              views: "9.9K",
              img: "https://i.postimg.cc/HnBxmSdC/Screenshot-2026-01-07-125503.jpg",
            },
            {
              type: "pdf",
              title: "Criminal Profiling Techniques.docx",
              desc: "Methodological guide on behavioral analysis and offender profiling.",
              views: "2.5K",
              img: "https://i.postimg.cc/DfBy8M3h/Screenshot-2026-01-07-125540.jpg",
            },
            {
              type: "image",
              title: "Digital Research Workspace",
              desc: "A modern laboratory and data analysis environment showcasing investigative workflows.",
              views: "1.2K",
              img: "https://i.postimg.cc/GmzZjZzr/download-(7).jpg",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Type-Specific Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-background/90 backdrop-blur-md text-primary rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transition-transform group-hover:scale-110">
                    {item.type === "video" && (
                      <Play className="fill-current w-6 h-6" />
                    )}
                    {item.type === "pdf" && <FileText className="w-6 h-6" />}
                    {item.type === "image" && <ImageIcon className="w-6 h-6" />}
                  </div>
                </div>

                {/* Label Badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  {item.type}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-foreground font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                      {item.views} Views
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="text-primary hover:underline text-xs font-bold uppercase tracking-tighter flex items-center gap-1"
                  >
                    View {item.type}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/auth-page/login">
            <Button
              size="lg"
              className="rounded-xl font-bold px-10 py-7 text-[17px] group cursor-pointer"
            >
              ACCESS FULL LIBRARY
            </Button>
          </Link>
        </div>
      </section>

      {/* Other Library Platforms */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-0">
          <div className="w-full py-10 overflow-hidden">
            <motion.div
              className="flex items-center gap-8 lg:gap-16 px-4 w-max"
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                x: {
                  duration: 20, // Slightly slower for better readability
                  repeat: Infinity,
                  repeatType: "loop", // Changed to loop for a smoother "infinite" feel
                  ease: "linear",
                },
              }}
            >
              {[
                "Pinterest",
                "Vimeo",
                "Scribd",
                "Pixabay",
                "Behance",
                "Internet Archive",
                "Pinterest",
                "Medium",
                "Pexels",
              ].map((tool, index) => (
                <div
                  key={index}
                  className="text-black/60 hover:text-black/90 dark:text-white/30 dark:hover:text-white/70 transition-all select-none cursor-pointer"
                >
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
                    {tool}
                  </span>
                </div>
              ))}

              {/* Duplicate for seamless infinite loop */}
              {[
                "Pinterest",
                "Vimeo",
                "Scribd",
                "Behance",
                "Pixabay",
                "Internet Archive",
                "Pinterest",
                "Medium",
                "Pexels",
              ].map((tool, index) => (
                <div
                  key={`dup-${index}`}
                  className="text-black/60 hover:text-black/90 dark:text-white/30 dark:hover:text-white/70 transition-all select-none cursor-pointer"
                >
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
                    {tool}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nav */}
      <Nav />

      {/* Footer scection */}
      <Footer />
    </main>
  );
}
