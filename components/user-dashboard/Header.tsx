"use client";

import { Search, Bell, Menu } from "lucide-react"; // Added Menu for mobile feel
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-20 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-60">
      
      {/* LEFT: Logo Section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic leading-none">
            {/* Shortened on mobile, full on desktop */}
            <span className="md:hidden">DB</span>
            <span className="hidden md:inline">Dashboard</span>
          </h2>
          <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
            System
          </p>
        </div>
      </div>

      {/* CENTER: Pinterest-style Search Bar */}
      {/* On mobile: It becomes an overlay when triggered or stays compact */}
      <div className={`flex-1 relative transition-all duration-300 ${isSearchOpen ? 'flex' : 'hidden md:flex'}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="SEARCH..."
          className="bg-secondary/40 border-none pl-11 w-full rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary h-11 text-[10px] font-bold tracking-widest uppercase"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* RIGHT: Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        
        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 hover:bg-secondary rounded-full md:hidden transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-border">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black uppercase tracking-tight leading-none">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-[9px] text-primary font-bold uppercase tracking-tighter mt-1">
              {session?.user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
          
          <Avatar className="h-9 w-9 md:h-11 md:w-11 border-2 border-primary/20 hover:border-primary transition-all rounded-xl p-0.5 cursor-pointer">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="rounded-lg"
            />
            <AvatarFallback className="rounded-lg">
              {session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}