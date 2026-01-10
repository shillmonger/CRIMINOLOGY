"use client";

import Header from "@/components/landing-page/Header";
import Nav from "@/components/landing-page/Nav";
import Footer from "@/components/landing-page/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { Check, ArrowRight, Lock, MessageSquare } from "lucide-react"; 

export default function SubscriptionPage() { 
    const accessPlans = [ 
        { 
            amount: 1, 
            type: "Quick Start", 
            fee: "$1", 
            duration: "2 Days",
            uploadLimit: "3 Contents",
            benefits: ["Admin-managed upload", "Video, Image, or PDF", "Content live for 48 hours", "Standard review speed"]
        }, 
        { 
            amount: 5, 
            type: "Starter Pass", 
            fee: "$5", 
            duration: "5 Days",
            uploadLimit: "10 Contents",
            popular: true,
            benefits: ["Admin-managed upload", "Live for 5 full days", "Social media link inclusion", "Priority admin review"]
        },
        { 
            amount: 12, 
            type: "Weekly Pro", 
            fee: "$12", 
            duration: "1 Week",
            uploadLimit: "25 Contents",
            benefits: ["Unlimited file types", "Live for 7 full days", "Featured in 'Latest' section", "24h Review turnaround"]
        },
        { 
            amount: 45, 
            type: "Monthly Growth", 
            fee: "$45", 
            duration: "1 Month",
            uploadLimit: "100 Contents",
            benefits: ["Bulk admin processing", "Live for 30 full days", "Dedicated category placement", "Direct chat with admin"]
        }, 
        { 
            amount: 75, 
            type: "Double Month", 
            fee: "$75", 
            duration: "2 Months",
            uploadLimit: "250 Contents",
            benefits: ["High-volume uploads", "Live for 60 full days", "Analytics report on views", "VIP review queue"]
        },
        { 
            amount: 100, 
            type: "Yearly Elite", 
            fee: "$100", 
            duration: "1 Year",
            uploadLimit: "Unlimited Contents",
            benefits: ["Full server priority", "Live for 365 days", "Custom branding on posts", "Instant admin processing"]
        },
        { 
            amount: 0, 
            type: "Institutional", 
            fee: "LOCKED", 
            duration: "Enterprise",
            locked: true,
            benefits: ["Multi-user dashboard", "API auto-upload", "White-label library", "24/7 Dedicated Support"]
        },
        { 
            amount: 0, 
            type: "Lifetime Partner", 
            fee: "LOCKED", 
            duration: "Permanent",
            locked: true,
            benefits: ["Never expires", "Unlimited everything", "Revenue share access", "Founder Badge"]
        },
        { 
            amount: 0, 
            type: "API Access", 
            fee: "LOCKED", 
            duration: "Developers",
            locked: true,
            benefits: ["Web-hook integration", "Custom storage bucket", "High-speed CDN", "Dev Support"]
        },
    ];

    const handleSelectPlan = (plan: string, amount: number, isLocked: boolean) => {
        if (isLocked) return;
        // Direct link to admin for upload service
        window.open('https://t.me/istancapital', '_blank');
    };

    return ( 
        <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300"> 
            <Header />

            {/* Hero Header */} 
            <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center mt-12"> 
                <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">
                    Promote Your Content
                </span>
                <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight"> 
                    Get Your Work <span className="text-primary">Featured</span>
                </h1> 
                <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"> 
                    Ready to showcase your research or media? Select a plan and message our admin to get your videos, images, or PDFs uploaded to our global library.
                </p> 
            </section> 

            {/* Plans Grid */} 
            <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-32 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {accessPlans.map((plan, i) => ( 
                        <Card 
                            key={i} 
                            className={`flex flex-col justify-between bg-card/50 backdrop-blur-sm rounded-3xl transition-all duration-500 overflow-hidden relative
                                ${plan.popular ? 'ring-4 ring-primary ring-offset-4 ring-offset-background shadow-2xl scale-105 z-10' : 'border border-border'}
                                ${plan.locked ? 'opacity-60 grayscale-[0.5]' : 'hover:border-primary/50 hover:shadow-xl group cursor-pointer'}
                            `}
                            onClick={() => handleSelectPlan(plan.type, plan.amount, !!plan.locked)}> 
                            
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-8 py-2 pt-8 rounded-full shadow-2xl border-2 border-background">
                                        POPULAR
                                    </div>
                                    <div className="absolute inset-0 bg-primary/50 blur-xl -z-10" />
                                </div>
                            )}

                            <CardHeader className="p-8 pb-4"> 
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{plan.type}</span>
                                    <span className="text-xl font-black text-muted-foreground">{plan.duration}</span>
                                </div>
                                <CardTitle className="text-5xl font-black tracking-tight italic uppercase"> 
                                    {plan.locked ? <Lock className="w-12 h-12 text-muted-foreground/30" /> : `$${plan.amount}`}
                                </CardTitle> 
                                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-tight">Upload Fee</p>
                            </CardHeader> 
                            
                            <CardContent className="space-y-6 p-8 flex-grow"> 
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border"> 
                                        <span className="text-sm font-medium text-muted-foreground">Volume</span> 
                                        <span className={`text-lg font-black ${plan.locked ? '' : 'text-primary'}`}>
                                            {plan.locked ? "---" : plan.uploadLimit}
                                        </span> 
                                    </div> 
                                </div>

                                <div className="space-y-4"> 
                                    <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"> 
                                        Service Details
                                    </p> 
                                    <ul className="space-y-3 text-sm"> 
                                        {plan.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-center gap-3"> 
                                                <div className={`p-1 rounded-full ${plan.locked ? 'bg-muted/50' : 'bg-primary/10'}`}>
                                                    <Check className={`w-3 h-3 ${plan.locked ? 'text-muted-foreground' : 'text-primary'}`} /> 
                                                </div>
                                                <span className="text-muted-foreground">{benefit}</span>
                                            </li> 
                                        ))}
                                    </ul> 
                                </div> 
                            </CardContent> 

                            <div className="p-8 pt-0"> 
                                <button 
                                    disabled={plan.locked}
                                    className={`w-full font-black uppercase py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-lg
                                        ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20' : ''}
                                        ${plan.locked 
                                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                                            : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/30'
                                        }
                                    `} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectPlan(plan.type, plan.amount, !!plan.locked);
                                    }}
                                > 
                                    {plan.locked ? "Coming Soon" : "Request Now"}
                                    {!plan.locked && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />}
                                </button> 
                            </div>  
                        </Card> 
                    ))} 
                </div>
            </section>
            
            <Nav />
            <Footer />
        </main> 
    ); 
}

