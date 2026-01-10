"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Play,
  FileText,
  Settings,
} from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();

  // Reordered: HOME is at index 2 (the middle of 5 items)
  const navItems = [
    { icon: ImageIcon, href: "/user-dashboard/image-content", label: "PICTURE" },
    { icon: Play, href: "/user-dashboard/video-content", label: "VIDIOE" },
    { icon: LayoutDashboard, href: "/user-dashboard/dashboard", label: "HOME" },
    { icon: FileText, href: "/user-dashboard/pdf-content", label: "PDFS" },
    { icon: Settings, href: "/user-dashboard/settings-page", label: "SETTINGS" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 
        flex justify-around items-center 
        bg-background/95 backdrop-blur-xl
        py-3 pb-3 rounded-t-[2rem] 
        border-t border-border
        shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.3)] 
        md:hidden
      "
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);

        return (
          <Link
            key={href}
            href={href}
            className={`
              flex flex-col items-center transition-all duration-300
              ${active ? "text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`
                flex items-center justify-center 
                w-11 h-11 rounded-2xl mb-1 
                transition-all duration-300
                ${
                  active
                    ? "bg-foreground text-background shadow-lg shadow-black/20"
                    : "bg-secondary/50"
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
            </motion.div>

            <span 
              className={`text-[8px] font-black tracking-[0.1em] uppercase ${
                active ? "opacity-100" : "opacity-60"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}