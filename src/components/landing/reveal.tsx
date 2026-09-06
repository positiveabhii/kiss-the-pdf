"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
  scale?: boolean;
  slideX?: boolean;
  blur?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  scale = false,
  slideX = false,
  blur = false,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ once: true });
  const reducedMotion = useReducedMotion();
  const visible = reducedMotion || inView;

  return (
    <Tag
      ref={ref}
      className={cn(
        "kp-reveal",
        visible && "kp-reveal-visible",
        scale && "kp-reveal-scale",
        slideX && "kp-reveal-slide-x",
        blur && "kp-reveal-blur",
        className
      )}
      style={{ "--kp-reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

export function StaggerGrid({ children, className, staggerMs = 40 }: StaggerGridProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.05 });
  const reducedMotion = useReducedMotion();
  const visible = reducedMotion || inView;

  const items = React.Children.map(children, (child, i) => {
    if (!React.isValidElement<{ style?: React.CSSProperties; className?: string }>(child)) {
      return child;
    }
    const delay = Math.min(i, 11) * staggerMs;
    return React.cloneElement(child, {
      className: cn(child.props.className, "kp-stagger-item"),
      style: {
        ...child.props.style,
        "--kp-stagger-delay": visible ? `${delay}ms` : "0ms",
      } as React.CSSProperties,
    });
  });

  return (
    <div
      ref={ref}
      className={cn("kp-stagger-grid", visible && "kp-stagger-grid-visible", className)}
    >
      {items}
    </div>
  );
}

/** Sequential reveals within one observed container */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.08 });
  const reducedMotion = useReducedMotion();
  const visible = reducedMotion || inView;

  return (
    <div ref={ref} className={cn(visible && "kp-reveal-group-visible", className)}>
      {children}
    </div>
  );
}

export function RevealItem({
  children,
  className,
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <div
      className={cn("kp-reveal-group-item", className)}
      style={{ "--kp-group-index": index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function HeroReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(reducedMotion ? "" : "kp-hero-reveal", className)}
      style={{ "--kp-hero-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
