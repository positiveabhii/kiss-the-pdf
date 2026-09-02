"use client";

import { ToolDefinition } from "@/types";
import { ToolCard } from "./tool-card";

interface ToolGridProps {
  title: string;
  tools: ToolDefinition[];
}

export function ToolGrid({ title, tools }: ToolGridProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
