"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  Settings,
  LogOut,
  Lock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface User {
  role?: string;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get user data from session
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    // Fetch user data from session
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        console.log('Session data:', data); // Debug log
        if (data.user) {
          setUser(data.user);
          console.log('User role:', data.user.role); // Debug log
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUser();
    
    // Set up an interval to check for session updates (optional)
    const interval = setInterval(fetchUser, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, href: "/user-dashboard/dashboard", tooltip: "Dashboard", label: "Home" },
    { icon: ImageIcon, href: "/user-dashboard/image-content", tooltip: "Image Content", label: "Images" },
    { icon: Video, href: "/user-dashboard/video-content", tooltip: "Video Content", label: "Videos" },
    { icon: FileText, href: "/user-dashboard/pdf-content", tooltip: "PDF Contents", label: "Docs" },
    ...(user.role === 'admin' ? [{ icon: Lock, href: "/admin-dashboard/uploads", tooltip: "Admin Page", label: "Admin" }] : [])
  ];

  const iconVariants: Variants = {
    hover: { y: -6, scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.9 },
  };

  const handleLogout = () => {
    router.push("/auth-page/login");
  };

  return (
    <TooltipProvider>
      <aside className="hidden md:flex md:w-20 md:border-r md:border-border md:flex-col md:items-center md:py-8 md:bg-card/50 md:backdrop-blur-md md:sticky md:top-0 md:h-screen">
        <div className="mb-20">
          {/* Logo Placeholder */}
        </div>

        <nav className="flex flex-col gap-6 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`group p-3 rounded-[10px] cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorDesktop"
                          className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Link href="#">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              className="group p-3 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-2xl relative cursor-pointer"
            >
              <Sparkles className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-[8px] font-black px-1 rounded text-primary-foreground">
                PRO
              </span>
            </motion.div>
          </Link>
        </nav>

        <div className="flex flex-col gap-6 mt-auto pt-6 border-t border-border w-full items-center">
          <Link href="/user-dashboard/settings-page">
            <motion.div whileHover={{ rotate: 90 }}>
              <Settings className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
            </motion.div>
          </Link>
          
          {/* Trigger the confirmation modal */}
          <button onClick={() => setShowLogoutConfirm(true)}>
            <motion.div whileHover={{ x: [0, -2, 2, -2, 0] }}>
              <LogOut className="w-6 h-6 text-red-500 hover:opacity-70 transition-opacity cursor-pointer" />
            </motion.div>
          </button>
        </div>
      </aside>

      {/* Custom Stored Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md z-200 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-foreground" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">
                End Session?
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                Are you sure you want to exit the admin management suite?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-secondary text-foreground cursor-pointer font-bold text-xs uppercase tracking-widest hover:opacity-80 transition"
                >
                  Stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 rounded-xl bg-foreground text-background cursor-pointer font-bold text-xs uppercase tracking-widest hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}