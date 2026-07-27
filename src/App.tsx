import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import RegistrationForm from "./components/RegistrationForm";
import Locations from "./components/Locations";
import Timeline from "./components/Timeline";
import Carousel from "./components/Carousel";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { HackathonConfig } from "./types";
import { TIMELINE } from "./data";
import { Calendar } from "lucide-react";

// Hardcoded Static Configuration - easy to edit directly via chat in the future!
const HACKATHON_CONFIG: HackathonConfig = {
  name: "Bincom Hackathon September 2026",
  theme: "Hacking genAI",
  edition: "6.0",
  subtitle: "Building the next big thing with Generative AI in 24 hours or less",
  month: "September",
  year: "2026",
  startDate: "Friday 18, September 2026",
  startTime: "6pm WAT",
  endDate: "Saturday 19, September 2026",
  endTime: "7pm WAT",
  registrationUrl: "bincom.net/hackathon",
  physicalNoticeUrl: "http://bincomdevcenter.com/communityevents",
  flyerType: "html",
  flyerImageUrl: "https://i.ibb.co/TB01qs3m/HACKATHONFLYER.jpg",
  logoUrl: "/logo.png",
  virtualUrl: "https://bincom.net/virtual-hackathon",
  timeline: TIMELINE,
  
  // Custom Onboarding details corresponding to static templates
  whatsapp_link: "https://chat.whatsapp.com/BincomHackathon",
  slack_link: "https://bincom.net/bincomtechnetwork",
  kickoff_event_link: "https://bincom.net/hackathon",
  startDateFormatted: "Friday 18, September 2026",
  endDateFormatted: "Saturday 19, September 2026"
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-primary selection:text-slate-900 scroll-smooth">
      {/* Sticky Header Navigation */}
      <Header config={HACKATHON_CONFIG} />

      {/* Main Container */}
      <main className="flex-grow pb-16">
        
        {/* 1. Hero Block (Vibrant Banner + CTA) */}
        <Hero config={HACKATHON_CONFIG} />

        {/* 2. About section & Cyber Flyer Poster */}
        <About config={HACKATHON_CONFIG} />

        {/* 3. Interactive Hub Locations & Physical check-ins */}
        <Locations config={HACKATHON_CONFIG} />

        {/* Highlight Date Block - Recreating the Lime Calendar Box exactly from the video */}
        <section className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-8">
          <div className="bg-brand-banner rounded-3xl p-8 sm:p-12 border border-lime-300 shadow-md text-center relative overflow-hidden transition-all hover:scale-[1.01] duration-300">
            {/* Visual tech grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />
            
            <div className="w-16 h-16 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-900 mx-auto mb-4">
              <Calendar className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
              Date:
            </h3>
            
            <p className="font-display font-bold text-lg sm:text-2xl text-slate-900 mt-4 max-w-2xl mx-auto leading-relaxed">
              The hackathon will start with the kick off event on {HACKATHON_CONFIG.startDateFormatted || HACKATHON_CONFIG.startDate} at {HACKATHON_CONFIG.startTime}. Can't wait to see you there!
            </p>
          </div>
        </section>

        {/* 4. Connected Vertical Hackathon Timeline */}
        <Timeline config={HACKATHON_CONFIG} />

        {/* 5. Custom Guidelines Slideshow Carousel (10 high-fi slides) */}
        <Carousel config={HACKATHON_CONFIG} />

        {/* 6. Active Registration Form & Pass Ticket Generator */}
        <RegistrationForm config={HACKATHON_CONFIG} />

        {/* 8. Searchable FAQs accordion */}
        <FAQ config={HACKATHON_CONFIG} />

      </main>

      {/* Footer copyright block */}
      <Footer config={HACKATHON_CONFIG} />
    </div>
  );
}
