"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  LogOut,
  UploadCloud,
  Files,
  Wallet,
  X,
  Menu,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const basePath = "/admin-dashboard";

const sidebarItems = [
  { 
    name: "Upload", 
    icon: UploadCloud, // clearly represents uploads/files
    href: `${basePath}/uploads` 
  },
  { 
    name: "All Contents", 
    icon: Files, // clearly represents uploads/files
    href: `${basePath}/all-content` 
  },
  { 
    name: "All Payments", 
    icon: Wallet, // money/transactions
    href: `#` 
  },
  { 
    name: "User Management", 
    icon: Users, // users/admin
    href: `${basePath}/user-management` 
  },
  { 
    name: "Switch to User", 
    icon: GraduationCap, // switching roles/context
    href: `/user-dashboard/dashboard` 
  },
];


  const isActive = (href: string) =>
    pathname === href || (href !== basePath && pathname?.startsWith(href));

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/auth-page/login");
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 
        w-72 transform bg-background border-r border-border
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter italic text-foreground">
              Admin<span className="text-muted-foreground italic">Core</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Management Suite
            </p>
          </div>
          
          {/* Toggle Button: Swaps between Menu and X */}
          <button
            className="lg:hidden p-2 rounded-xl bg-secondary text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 animate-in fade-in zoom-in duration-300" />
            ) : (
              <Menu className="h-5 w-5 animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
          <nav className="px-4 py-8 space-y-2 overflow-y-auto">
            {sidebarItems.map(({ name, icon: Icon, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={name}
                  href={href}
                  className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-foreground text-background shadow-lg shadow-black/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all duration-200 rounded-xl group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-background border border-border rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center">
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
                className="flex-1 px-6 py-3 rounded-xl bg-secondary text-foreground font-bold text-xs uppercase tracking-widest hover:opacity-80 transition"
              >
                Stay
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}