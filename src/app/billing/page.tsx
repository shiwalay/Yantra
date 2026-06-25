"use client";

import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  Lock,
  Globe,
  Zap,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState<"stripe" | "razorpay">("stripe");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleProcessPayment = async () => {
    if (paymentGateway === "razorpay") {
      setProcessing(true);
      try {
        // Dynamically load Razorpay script
        const loadScript = () => new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

        const scriptLoaded = await loadScript();
        if (!scriptLoaded) throw new Error("Failed to load Razorpay SDK");

        // Create order via our backend
        const response = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: isAnnual ? 2499 : 2999 })
        });
        
        if (!response.ok) throw new Error("Order creation failed");
        const data = await response.json();

        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_12345",
          amount: (isAnnual ? 2499 : 2999) * 100,
          currency: "INR",
          name: "AI Growth OS",
          description: "Premium SaaS Subscription",
          order_id: data.orderId,
          handler: function (response: any) {
            setProcessing(false);
            setPaymentSuccess(true);
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
          },
          theme: {
            color: "#8b5cf6",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          setProcessing(false);
          console.error("Payment failed:", response.error);
        });
        rzp.open();
      } catch (error) {
        console.error("Payment initialization error:", error);
        setProcessing(false);
      }
    } else {
      // Mock stripe
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
      }, 1800);
    }
  };

  const isAnnual = billingCycle === "annual";
  const displayPrice = isAnnual ? "₹2,499" : "₹2,999";
  const billedAnnually = "₹29,988";

  return (
    <div className="space-y-12 max-w-[1000px] mx-auto pb-20 pt-4 md:pt-10">
      
      {/* Premium Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest shadow-sm">
          <Sparkles size={12} className="animate-pulse" /> The Ultimate YouTube Growth OS
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-black text-foreground tracking-tight leading-tight">
          One Outcome. <span className="text-primary">One Price.</span>
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          We don't limit features. You get the complete AI operating system designed to turn your channel into a predictable revenue system.
        </p>
      </div>

      {/* Monthly / Annual Toggle */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <div className="relative flex items-center p-1.5 bg-muted/30 border border-border/40 rounded-full shadow-inner">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-card rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-border/50 ${
              billingCycle === "monthly" ? "left-1.5" : "left-[calc(50%+1.5px)]"
            }`}
          />
          
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`relative z-10 px-8 py-3 text-xs font-bold transition-colors w-40 ${
              billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`relative z-10 px-8 py-3 text-xs font-bold transition-colors w-40 ${
              billingCycle === "annual" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annually
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/15 text-success border border-success/30 text-[10px] font-bold uppercase tracking-widest"
        >
          <Sparkles size={10} /> Save up to 17%
        </motion.div>
      </div>

      {/* The Single Pricing Card */}
      <div className="max-w-4xl mx-auto mt-12 relative group">
        {/* Deep background glow */}
        <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[40px] blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative p-8 md:p-12 rounded-[32px] bg-card border border-primary/30 shadow-[0_20px_60px_hsl(var(--primary)/0.2)] overflow-hidden flex flex-col lg:flex-row gap-12">
          
          {/* Decorative radial gradient inside card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Column: Price & CTA */}
          <div className="flex-1 flex flex-col justify-center space-y-6 lg:border-r border-border/40 lg:pr-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Globe className="text-primary" size={24} /> AI Growth OS
              </h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                The entire operating system to Discover, Plan, Create, Optimize, and Grow.
              </p>
            </div>

            <div className="py-6 border-y border-border/30">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-foreground tracking-tighter">{displayPrice}</span>
                <span className="text-sm font-semibold text-muted-foreground">/ month</span>
              </div>
              <div className="min-h-[24px] mt-2">
                <AnimatePresence mode="wait">
                  {isAnnual && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-semibold text-success bg-success/10 inline-block px-3 py-1 rounded-md"
                    >
                      Billed {billedAnnually} yearly
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutModalOpen(true);
                setPaymentSuccess(false);
              }}
              className="w-full py-4 rounded-[16px] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_hsl(var(--primary)/0.4)] hover:-translate-y-1 active:scale-95"
            >
              Start Creating Now <ArrowRight size={18} />
            </button>
            
            <p className="text-center text-[11px] font-semibold text-muted-foreground">
              Cancel anytime. Secured by Stripe.
            </p>
          </div>

          {/* Right Column: Features */}
          <div className="flex-[1.2] relative z-10 space-y-8">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Everything Included:</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                  <span><strong className="text-foreground">AI Command Center:</strong> Daily personalized growth missions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                  <span><strong className="text-foreground">Unified Video Builder:</strong> Research to Script to SEO in one flow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                  <span><strong className="text-foreground">Unlimited Features:</strong> We never gate core functionality.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                  <span><strong className="text-foreground">AI Copilot Everywhere:</strong> Instant insights on every screen.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-[16px] bg-muted/30 border border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Zap size={14} className="text-primary" /> Fair Usage Limits
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Star size={12} className="text-muted-foreground" /> 500 AI Tasks per month (Scripts, Research, SEO)
                </li>
                <li className="flex items-center gap-2">
                  <Star size={12} className="text-muted-foreground" /> 3 Team Members
                </li>
                <li className="flex items-center gap-2">
                  <Star size={12} className="text-muted-foreground" /> 5 Connected YouTube Channels
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout Simulator Modal */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md p-8 rounded-[32px] bg-card border border-border/50 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground text-xs font-bold transition-colors"
              >
                Close
              </button>

              <div className="pb-4 border-b border-border/30">
                <span className="text-[10px] uppercase font-black text-primary flex items-center gap-1.5 tracking-wider"><Lock size={12} /> Secure Checkout Simulator</span>
                <h3 className="text-2xl font-bold text-foreground mt-2">AI Growth OS</h3>
                <p className="text-sm font-semibold text-muted-foreground mt-1">
                  {isAnnual ? billedAnnually : displayPrice} 
                  <span className="font-normal text-xs text-muted-foreground/70"> / {isAnnual ? "year" : "month"}</span>
                </p>
              </div>

              {!paymentSuccess ? (
                <div className="space-y-6 text-xs">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Select Payment Method</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                         onClick={() => setPaymentGateway("stripe")}
                         className={`p-4 rounded-[16px] border text-center font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                           paymentGateway === "stripe" 
                             ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/20" 
                             : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                         }`}
                      >
                        <CreditCard size={20} className={paymentGateway === "stripe" ? "text-primary" : ""} />
                        Stripe
                      </button>
                      <button
                         onClick={() => setPaymentGateway("razorpay")}
                         className={`p-4 rounded-[16px] border text-center font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                           paymentGateway === "razorpay" 
                             ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/20" 
                             : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                         }`}
                      >
                        <ShieldCheck size={20} className={paymentGateway === "razorpay" ? "text-primary" : ""} />
                        Razorpay
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="w-full py-4 rounded-[16px] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay {isAnnual ? billedAnnually : displayPrice} Securely
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-success/15 text-success border border-success/30 flex items-center justify-center mx-auto text-4xl animate-bounce shadow-[0_0_30px_hsl(var(--success)/0.3)]">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-foreground">Welcome to the OS</h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Payment successful. Your AI Capacity has been fully restored and your agency limits have been unlocked.
                    </p>
                  </div>
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="mt-4 w-full px-4 py-4 rounded-[16px] bg-muted hover:bg-muted/80 text-foreground text-sm font-bold transition-colors"
                  >
                    Start Your First Mission
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
