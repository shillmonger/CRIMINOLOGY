"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { toast } from "sonner";
import {
  Camera,
  User,
  Lock,
  Bell,
  Palette,
  Moon,
  Sun,
  Shield,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";

// Matches the exact import style and usage of your stored code
import Sidebar from "@/components/user-dashboard/Sidebar";
import Header from "@/components/user-dashboard/Header";
import Nav from "@/components/user-dashboard/Nav";

export default function UserSettingsPage() {
  // Matches Sidebar/Header state logic from your dashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme state
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // User state
  const [user, setUser] = useState<{ role?: string }>({});
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        toast.error('Failed to load user data');
      }
    };
    
    fetchUser();
  }, []);

  // Settings States
  const [darkMode, setDarkMode] = useState(false); // Initialize as false, will be set in useEffect
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    "https://github.com/shadcn.png"
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update darkMode state when theme changes and set mounted state
  useEffect(() => {
    setMounted(true);
    setDarkMode(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setDarkMode(newTheme === "dark");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      // Clear form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error('Failed to save settings');
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Matches the stored code usage: Sidebar needs sidebarOpen and setSidebarOpen */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Matches stored code usage: Header takes onSearch or setSidebarOpen */}
        <Header onSearch={() => {}} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Page Header - Black/White styling */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-foreground">
                Settings
              </h1>
              <p className="mt-2 text-muted-foreground font-medium uppercase text-xs tracking-widest">
                Account & Preferences Management
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Picture Card */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Profile Image
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border border-border bg-muted shadow-2xl">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profile-upload"
                        className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl cursor-pointer shadow-xl hover:scale-110 transition-transform border border-border"
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-tight">
                      JPG or PNG • Max 5MB
                    </p>
                  </div>
                </div>

                {/* Theme Toggle Card */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Theme Mode</p>
                      <p className="text-[11px] text-muted-foreground">
                        Switch visual style
                      </p>
                    </div>
                    {mounted ? (
                      <button
                        onClick={toggleTheme}
                        className={`relative w-14 h-8 rounded-full border border-border cursor-pointer transition-colors ${
                          darkMode ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        >
                          {darkMode ? (
                            <Moon className="w-3.5 h-3.5 text-black" />
                          ) : (
                            <Sun className="w-3.5 h-3.5 text-yellow-500" />
                          )}
                        </div>
                      </button>
                    ) : (
                      <div className="w-14 h-8 rounded-full bg-muted/50 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Main Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Password Reset Section */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Security
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">
                          Confirm New
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-8 py-3 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Notifications Section */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Notifications
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        state: notifications,
                        set: setNotifications,
                        label: "Library Updates",
                        desc: "New content arrivals",
                      },
                      {
                        state: emailNotifications,
                        set: setEmailNotifications,
                        label: "Email Alerts",
                        desc: "Security and account logs",
                      },
                      {
                        state: pushNotifications,
                        set: setPushNotifications,
                        label: "Push Notifications",
                        desc: "Real-time browser alerts",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => item.set(!item.state)}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border border-border ${
                            item.state ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                              item.state ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Actions Section */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Shield className="w-24 h-24" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest cursor-pointer mb-6 flex items-center gap-2 text-destructive">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {user.role === 'admin' && (
                      <Link href="/admin-dashboard/uploads" className="flex-1">
                        <div className="text-xs font-black uppercase cursor-pointer tracking-widest py-3 px-4 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2">
                          <Lock className="w-3.5 h-3.5" />
                          Admin Only
                        </div>
                      </Link>
                    )}
                    <button className="flex-1 text-xs font-black uppercase cursor-pointer tracking-widest py-3 px-4 rounded-xl bg-destructive text-white hover:opacity-90 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Matches stored code usage: Nav at the bottom */}
        <Nav />
      </div>
    </div>
  );
}
