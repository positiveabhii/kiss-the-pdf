"use client";

import { FileText, Monitor, Cpu, Download } from "lucide-react";
import { Reveal } from "./reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FLOW_STEPS = [
  { icon: FileText, label: "Your file" },
  { icon: Monitor, label: "Your browser" },
  { icon: Cpu, label: "Processing" },
  { icon: Download, label: "Your PDF" },
];

function FlowDiagram() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-stretch p-6 sm:p-8 rounded-2xl bg-white/4 border border-white/10 backdrop-blur-sm">
      {FLOW_STEPS.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === FLOW_STEPS.length - 1;

        return (
          <div key={step.label} className="relative flex flex-col items-center">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-(--kp-accent) text-white shadow-lg shadow-(--kp-accent)/25 ring-1 ring-white/10">
              <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <span className="mt-2.5 text-xs font-medium text-white/80 tracking-wide">{step.label}</span>

            {!isLast && (
              <div className="relative flex flex-col items-center my-3 h-12 w-px" aria-hidden="true">
                <div className="absolute inset-0 bg-white/15 w-px" />
                {!reducedMotion && (
                  <span
                    className="kp-flow-travel absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-(--kp-accent) shadow-[0_0_8px_rgb(194_65_12_/_0.6)]"
                    style={{ animationDelay: `${i * 600}ms` }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      <p className="text-[11px] text-white/35 mt-5 text-center leading-relaxed">
        No server upload required for supported tools
      </p>
    </div>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="py-20 sm:py-28 bg-(--kp-text) text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] kp-dot-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-(--kp-accent)/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal slideX blur>
            <p className="kp-label text-(--kp-accent) mb-4 opacity-80">Privacy first</p>
            <h2 className="kp-heading text-white mb-5">Your files. Your device.</h2>
            <p className="text-white/65 text-lg leading-relaxed mb-6 max-w-lg">
              KissPDF is designed around browser-based processing. For supported tools, your files
              can be processed locally without being uploaded to a KissPDF server.
            </p>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg">
              Processing capabilities vary by tool. Tools that run entirely in your browser handle
              files on your device. We do not require an account, and we do not store your
              documents on our servers for browser-based tools.
            </p>
          </Reveal>

          <Reveal delay={120} scale>
            <FlowDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
