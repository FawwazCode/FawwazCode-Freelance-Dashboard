"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChartPoint } from "@/types/dashboard";

export function RevenueChart({ data }: { data: ChartPoint[] }) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const linePoints = data
    .map((item, index) => {
      const x = 8 + (index / (data.length - 1)) * 84;
      const y = 76 - (item.revenue / maxRevenue) * 56;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <p className="text-sm text-zinc-500">Revenue analytics</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Monthly performance</h2>
        </div>
        <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-100">+22.5% YTD</Badge>
      </CardHeader>
      <CardContent>
        <div className="relative h-[286px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <svg className="relative h-full w-full" viewBox="0 0 100 88" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueLine" x1="0" x2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polygon
              points={`8,80 ${linePoints} 92,80`}
              fill="url(#revenueFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.polyline
              points={linePoints}
              fill="none"
              stroke="url(#revenueLine)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="relative -mt-8 grid grid-cols-8 text-center text-xs text-zinc-500">
            {data.map((item) => (
              <span key={item.label}>{item.label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
