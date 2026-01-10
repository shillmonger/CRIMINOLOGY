"use client";

import Header from "@/components/landing-page/Header";
import Nav from "@/components/landing-page/Nav";
import Footer from "@/components/landing-page/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Target, Lightbulb, Users, Rocket, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function FoundersPage() {
    const founders = [
        {
            name: "Simon Gabriel Kpoto",
            role: "Department President",
            image: "https://i.postimg.cc/gkM3L9Qm/Whats-App-Image-2026-01-10-at-9-18-14-PM.jpg",
            bio: "Leading organizational growth through innovative departmental management and a people-first leadership philosophy."
        },
        {
            name: "Asadu Benedict Pascal",
            role: "Special Assistant to the President",
            image: "https://i.postimg.cc/wvsw0xKc/Whats-App-Image-2026-01-10-at-9-18-14-PM-(1).jpg",
            bio: "Driving strategic initiatives and bridging the gap between vision and execution at the highest level of leadership."
        }
    ];

    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Header />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center mt-12">
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                    The Minds Behind The Vision
                </span>
                <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">
                    Meet Our <span className="text-primary">Founders</span>
                </h1>
                <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                    A partnership built on trust, innovation, and a relentless commitment to transforming the industry landscape.
                </p>
            </section>

            {/* Founders Display */}
            <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-24 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {founders.map((founder, i) => (
                        <div key={i} className="group relative">
                            <div className="relative h-[500px] w-full cursor-pointer overflow-hidden rounded-3xl border border-border transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/10">
                                <img 
                                    src={founder.image} 
                                    alt={founder.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">{founder.name}</h3>
                                    <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{founder.role}</p>
                                    <p className="text-muted-foreground text-sm line-clamp-2">{founder.bio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Content - Vision & Mission */}
            <section className="bg-secondary/20 py-24 border-y border-border">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <div className="p-3 bg-primary/10 w-fit rounded-2xl"><Lightbulb className="text-primary w-8 h-8" /></div>
                            <h2 className="text-3xl font-black uppercase">Founder’s Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We identified a critical gap in how digital resources are accessed and shared. Our vision was to create a decentralized library that empowers creators and researchers to bypass traditional gatekeepers.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-3 bg-primary/10 w-fit rounded-2xl"><Target className="text-primary w-8 h-8" /></div>
                            <h2 className="text-3xl font-black uppercase">Long-Term Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Within 5 years, we aim to be the primary repository for high-impact media and PDF research globally, helping millions of users find verified, community-driven content instantly.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-3 bg-primary/10 w-fit rounded-2xl"><ShieldCheck className="text-primary w-8 h-8" /></div>
                            <h2 className="text-3xl font-black uppercase">Guiding Principles</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We refuse to compromise on data integrity and speed. Every decision we make is rooted in transparency and the ethical handling of user information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Origin & Philosophy Grid */}
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* The Origin Moment */}
                    <Card className="bg-card/40 backdrop-blur-md border-border p-8 rounded-3xl">
                        <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">The Origin Moment</h4>
                        <p className="text-xl font-medium italic leading-relaxed">
                            "It started in a small room with a single server failure. That frustration turned into the blueprint for what we have built today—a system that never stops."
                        </p>
                    </Card>

                    {/* Leadership */}
                    <Card className="bg-card/40 backdrop-blur-md border-border p-8 rounded-3xl">
                        <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-xs">Leadership Philosophy</h4>
                        <p className="text-xl font-medium leading-relaxed">
                            We believe in "Innovation-First" leadership. We don't just manage people; we empower them to break the rules of what's possible.
                        </p>
                    </Card>
                </div>

                {/* Additional Details List */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-2">
                        <h5 className="font-black uppercase text-sm">Active Focus</h5>
                        <p className="text-muted-foreground text-sm">Currently scaling our global CDN and improving admin review response times.</p>
                    </div>
                    <div className="space-y-2">
                        <h5 className="font-black uppercase text-sm">User Commitment</h5>
                        <p className="text-muted-foreground text-sm">We promise 99.9% uptime and a platform that evolves based on your feedback.</p>
                    </div>
                    <div className="space-y-2">
                        <h5 className="font-black uppercase text-sm">Lessons Learned</h5>
                        <p className="text-muted-foreground text-sm">Speed is nothing without security. We learned that the hard way so you don't have to.</p>
                    </div>
                    <div className="space-y-2">
                        <h5 className="font-black uppercase text-sm">Impact So Far</h5>
                        <p className="text-muted-foreground text-sm">Over 10k+ files served and a growing community of 500+ active researchers.</p>
                    </div>
                </div>
            </section>

            {/* Direct Message Section */}
            <section className="max-w-5xl mx-auto px-6 lg:px-10 pb-32">
                <div className="bg-primary p-12 rounded-[3rem] text-primary-foreground text-center relative overflow-hidden">
                    <Quote className="absolute top-10 left-10 w-24 h-24 opacity-10" />
                    <h2 className="text-4xl font-black uppercase mb-6 relative z-10">Message to the Community</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8 relative z-10">
                        "Thank you for being part of this journey. We are building this for you, and we invite you to grow alongside us. The best is yet to come."
                    </p>
                    <div className="flex justify-center items-center gap-4">
                        <div className="h-[1px] w-12 bg-primary-foreground/50" />
                        <span className="font-bold tracking-widest uppercase text-sm">The Founders</span>
                        <div className="h-[1px] w-12 bg-primary-foreground/50" />
                    </div>
                </div>
            </section>

            <Nav />
            <Footer />
        </main>
    );
}