"use client";

import { Component, lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { getToolLoader } from "./registry";

/**
 * Mounts a tool's UI on the client only. Tools use browser APIs (canvas,
 * File, workers) at module scope, so they are never rendered on the server;
 * the tool page's SEO content stays server-rendered around this.
 */

const lazyCache = new Map<string, ComponentType>();

function getLazyTool(id: string): ComponentType | null {
  const loader = getToolLoader(id);
  if (!loader) return null;
  let C = lazyCache.get(id);
  if (!C) {
    C = lazy(loader);
    lazyCache.set(id, C);
  }
  return C;
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-16 text-slate-400">
      <Loader2 className="w-5 h-5 animate-spin" aria-label="Loading tool" />
    </div>
  );
}

class ToolErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 space-y-2">
          <p className="font-semibold">This tool failed to load.</p>
          <p className="text-xs">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs font-semibold underline"
          >
            Reload the page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ToolRenderer({ toolId }: { toolId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const Tool = getLazyTool(toolId);
  if (!Tool) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    );
  }
  if (!mounted) return <Loading />;
  return (
    <ToolErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Tool />
      </Suspense>
    </ToolErrorBoundary>
  );
}
