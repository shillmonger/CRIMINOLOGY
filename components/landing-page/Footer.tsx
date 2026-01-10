"use client";

import Link from "next/link";
import {
  Youtube,
  Twitter,
  Send,
  MessageCircle,
  Instagram,
  Clapperboard,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    { name: "YouTube", icon: <Youtube size={24} />, href: "#" },
    { name: "X (Twitter)", icon: <Twitter size={24} />, href: "#" },
    { name: "Telegram", icon: <Send size={24} />, href: "#" },
    { name: "Instagram", icon: <Instagram size={24} />, href: "#" },
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground pb-15 pt-8 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        {/* Logo + Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl font-black uppercase  italic tracking-wider hover:text-primary transition-colors">
                CRIMINOLOGY
              </span>
            </Link>
            <p className="mt-5 leading-relaxed text-muted-foreground max-w-sm">
              This is a curated content platform with high-quality videos,
              images, and PDF documents. All content is uploaded, reviewed, and
              managed by the admin team only. Users can browse and view verified
              materials. No user uploads - just clean, reliable content.
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-4">
              Join the Community
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-3 bg-secondary/50 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Training - Updated to fit criminology theme */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            Education
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link
                href="#courses"
                className="hover:text-primary transition-colors"
              >
                Online Courses
              </Link>
            </li>
            <li>
              <Link
                href="#beginner"
                className="hover:text-primary transition-colors"
              >
                Beginner Guides
              </Link>
            </li>
            <li>
              <Link
                href="#advanced"
                className="hover:text-primary transition-colors"
              >
                Advanced Topics
              </Link>
            </li>
            <li>
              <Link
                href="#case-studies"
                className="hover:text-primary transition-colors"
              >
                Case Studies
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources - Updated to fit theme */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            Resources
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link
                href="#videos"
                className="hover:text-primary transition-colors"
              >
                Video Library
              </Link>
            </li>
            <li>
              <Link
                href="#images"
                className="hover:text-primary transition-colors"
              >
                Image Gallery
              </Link>
            </li>
            <li>
              <Link
                href="#pdfs"
                className="hover:text-primary transition-colors"
              >
                PDF Documents
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            Support
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-primary transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="/landing-page/founders"
                className="hover:text-primary transition-colors"
              >
                Our Founders
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="max-w-7xl mx-auto border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} CRIMINOLOGY — All rights reserved.</p>
          <div className="flex gap-4 text-[12px]">
            <Link href="#privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
        <p className="italic text-sm md:text-xs text-center md:text-right max-w-md opacity-60">
          The information on this site is not directed at residents of any
          country where such distribution or use would be contrary to local law
          or regulation.
        </p>
      </div>
    </footer>
  );
}
