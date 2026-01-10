"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { handleNavigationWithScroll } from "@/lib/scroll-utils";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home"); // Track scroll position
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Helper to check page-level activity
  const isPageActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Intersection Observer to detect section on scroll
  useEffect(() => {
    setMounted(true);

    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["why-this-platform", "explore-library"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is in the middle of the screen
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });

      // If at the very top of the page, set active back to home
      if (window.scrollY < 100) {
        setActiveSection("home");
      }
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle the "Home" detection manually for top of page
    const handleScroll = () => {
      if (window.scrollY < 100) setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-16 md:h-17">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[20px] md:text-2xl font-black italic tracking-tighter text-foreground">
              CRIMINOLOGY
            </span>
          </Link>

          {/* DESKTOP NAVIGATION CAPSULE */}
          <nav className="hidden md:flex items-center bg-black/[0.05] dark:bg-white/[0.05] border border-border px-2 py-1.5 rounded-full">
            <Link
              href="/"
              className={`px-4 py-2 text-[14px] font-bold tracking-wide transition-all rounded-full hover:text-foreground ${
                pathname === "/" && activeSection === "home"
                  ? "text-foreground bg-white dark:bg-zinc-800 shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleNavigationWithScroll(pathname, "/", "why-this-platform", router, closeMobileMenu);
              }}
              className={`px-4 py-2 text-[14px] font-bold tracking-wide transition-all cursor-pointer rounded-full hover:text-foreground ${
                activeSection === "why-this-platform"
                  ? "text-foreground bg-white dark:bg-zinc-800 shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Why us
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleNavigationWithScroll(pathname, "/", "explore-library", router, closeMobileMenu);
              }}
              className={`px-4 py-2 text-[14px] font-bold tracking-wide transition-all rounded-full cursor-pointer hover:text-foreground ${
                activeSection === "explore-library"
                  ? "text-foreground bg-white dark:bg-zinc-800 shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Explore library
            </button>

            <Link
              href="/landing-page/subscriptions"
              className={`px-4 py-2 text-[14px] font-bold tracking-wide transition-all cursor-pointer rounded-full hover:text-foreground ${
                isPageActive("/landing-page/subscriptions")
                  ? "text-foreground bg-white dark:bg-zinc-800 shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Subscriptions
            </Link>
          </nav>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-3 ml-4">
            <Button asChild variant="secondary" className="px-6 py-6 text-[15px] font-semibold rounded-xl cursor-pointer">
              <Link href="/auth-page/login">Login</Link>
            </Button>
            <Button asChild className="px-6 py-6 text-[15px] font-semibold rounded-xl cursor-pointer">
              <Link href="/auth-page/signup">Sign Up</Link>
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden h-12 flex items-center justify-center">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (Backdrop + Sidebar) - Kept Same Logic */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 h-full w-[280px] bg-background border-l border-border shadow-xl z-50 rounded-tl-3xl rounded-bl-3xl transform transition-transform duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={closeMobileMenu} className="absolute top-6 right-6 rounded-lg p-2 text-foreground hover:bg-muted transition">
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col justify-between h-full px-8 pt-24 pb-8">
          <div className="flex flex-col gap-6 text-[17px] font-medium text-muted-foreground">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`hover:text-primary transition-colors ${
                pathname === "/" && activeSection === "home" ? "text-primary font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleNavigationWithScroll(pathname, "/", "explore-library", router, closeMobileMenu);
              }}
              className={`hover:text-primary transition-colors text-left w-full cursor-pointer ${
                activeSection === "explore-library" ? "text-primary font-semibold" : ""
              }`}
            >
              Explore library
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleNavigationWithScroll(pathname, "/", "why-this-platform", router, closeMobileMenu);
              }}
              className={`hover:text-primary transition-colors text-left w-full cursor-pointer ${
                activeSection === "why-this-platform" ? "text-primary font-semibold" : ""
              }`}
            >
              Why this Platform
            </button>
            <Link
              href="/landing-page/subscriptions"
              onClick={closeMobileMenu}
              className={`hover:text-primary transition-colors ${
                isPageActive("/landing-page/subscriptions") ? "text-primary font-semibold" : ""
              }`}
            >
              Our Subscriptions
            </Link>
          </div>
          {/* Auth buttons bottom mobile */}
          <div className="flex flex-col gap-3">
             <Button variant="outline" asChild className="py-6 px-6 text-[17px] font-semibold rounded-xl w-full">
              <Link href="/auth-page/login" onClick={closeMobileMenu}>Login</Link>
            </Button>
            <Button size="lg" asChild className="w-full py-6 text-[17px] font-semibold rounded-xl">
              <Link href="/auth-page/signup" onClick={closeMobileMenu}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </aside>
    </header>
  );
}