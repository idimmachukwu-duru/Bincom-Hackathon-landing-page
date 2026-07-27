import React, { useState, useEffect } from "react";
import { ArrowRight, Info } from "lucide-react";
import { HackathonConfig } from "../types";

interface AboutProps {
  config: HackathonConfig;
  onUpdate?: (newConfig: HackathonConfig) => void;
}

export default function About({ config, onUpdate }: AboutProps) {
  const [flyerSrc, setFlyerSrc] = useState(config.flyerImageUrl || "/bincom_hackathon_flyer.jpg");

  useEffect(() => {
    setFlyerSrc(config.flyerImageUrl || "/bincom_hackathon_flyer.jpg");
  }, [config.flyerImageUrl]);

  const scrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="about" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          
          {/* Title section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-dark">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              About this Hackathon
            </h2>
          </div>

          {/* Description Text */}
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base max-w-3xl">
            <p>
              More than <strong className="text-slate-900 font-semibold">400+ Global participants</strong> will be contributing. No one is expected to work alone as individuals will work in groups with others. Do note that inviting your friends will help as well.
            </p>
            <p>
              This is a hybrid innovation-focused sprint where developers, designers, product managers, and AI specialists unite globally to develop actual, working software models powered by generative AI.
            </p>
          </div>

          {/* Register Action Button */}
          <div className="mt-8">
            <button
              onClick={scrollToRegister}
              className="bg-brand-primary text-slate-900 hover:bg-brand-banner font-display font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              Register
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Responsive HTML Flyer Image */}
          <div className="mt-12 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl max-w-3xl mx-auto">
            <img
              src={
                flyerSrc === "https://ibb.co/WWz0pLJg"
                  ? "https://i.ibb.co/TB01qs3m/HACKATHONFLYER.jpg"
                  : flyerSrc
              }
              alt="Bincom Hackathon Flyer"
              referrerPolicy="no-referrer"
              onError={() => {
                if (flyerSrc !== "/bincom_hackathon_flyer.jpg") {
                  setFlyerSrc("/bincom_hackathon_flyer.jpg");
                }
              }}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
